const db = wx.cloud.database();
const appointment = db.collection("appointment");
const shop = db.collection("shop");
const hairstyList = db.collection("hair_stylist");
const userList = db.collection("user_info");
const projectList = db.collection("project_list");
const pTimePush = db.collection("p_time_push");
const pActivePush = db.collection("p_activity_push");
import serviceStore from "../../store/service";
import { config } from "../../config/calendar";
import shopInfoStore from "../../store/shopInfo";
import userInfoStore from "../../store/userInfo";
import { strToTimeStamp } from "../../utils/date";
import dayjs from "dayjs";

// 引入插件安装器
import plugin from "../calendar/plugins/index";
// 禁用/启用可选状态
import selectable from "../calendar/plugins/selectable";

plugin.use(selectable);

function joinStr(obj) {
  return `${obj.year}-${padZero(obj.month)}-${padZero(obj.date)}`;
}

function padZero(num) {
  return num > 9 ? num : `0${num}`;
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showPopup: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    btnActive: false,
    showCalender: false,
    calendarConfig: config,
    hairstylist: [],
    timeItemIndex: -1,
		dateTimeStr: '',
    currentTime: "",
		currentDate: "",
		timeList: [
    ],
		dates: [],
		times: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async onAppointment() {
      const currentDate = this.data.currentDate;
      const currentTime = this.data.currentTime;
      if (!currentDate) return;
      if (!currentTime) {
        return wx.showToast({
          title: "请选择时间段",
          icon: "error",
        });
      }
      const id1 = "f6_GXCUD2y3PgkE-GCUtZ5wyhN6N43naPBt0oqgqtLQ";
      const id2 = "84qfRZ1dwl4hXz7wtnITSBk_aM8rxPICHPvnYm3xQHE";
      wx.requestSubscribeMessage({
        tmplIds: [id1, id2],
        complete: async (res) => {
					wx.showLoading({
						title: '请稍等...',
					})
					console.log(res);
					console.log(shopInfoStore.state.pID);
					console.log(shopInfoStore.state.hID);
					console.log(userInfoStore.state.id);
          const appointmentTime = `${currentDate} ${currentTime}`;
          const timeStamp = strToTimeStamp(appointmentTime);
          const shopInfo = await shop.doc(shopInfoStore.state.shopID).get();
          const userInfo = await userList.doc(userInfoStore.state.id).get();
          const pInfo = await projectList.doc(shopInfoStore.state.pID).get();
          const hInfo = await hairstyList.doc(shopInfoStore.state.hID).get();

          const data = await appointment.add({
            data: {
              appointmentTime: timeStamp,
              createTime: db.serverDate(),
              status: 0,
              shopInfo: shopInfo.data,
              userInfo: userInfo.data,
              pInfo: pInfo.data,
              hInfo: hInfo.data,
            },
          });
          if (data.errMsg === "collection.add:ok") {
						wx.hideLoading()
            this.setData({
							showCalender: false,
							timeItemIndex: -1,
            });
            this.triggerEvent("close");
            wx.showToast({
              title: "预约成功",
              icon: "success",
            });
            this.subscribe({
              res,
              data,
              userInfo,
              shopInfo,
              hInfo,
              pInfo,
              appointmentTime,
						});
						console.log(hInfo.data);

            if (hInfo.data.openid) {
              wx.cloud.callFunction({
                name: "pushNotify",
                data: {
                  id: hInfo.data._id,
                  data: {
                    touser: hInfo.data.openid,
                    lang: "zh_CN",
                    templateId: "4BytWbEViowlRY9BpTqLnFIkSBhV0soYq_6RycCEraw",
                    data: {
                      thing4: {
                        value: shopInfo.data.shopName,
                      },
                      thing3: {
                        value: pInfo.data.projectName,
                      },
                      name1: {
                        value: userInfo.data.nickName,
                      },
                      date2: {
                        value: dayjs(timeStamp).format("YYYY-MM-DD HH:mm:ss"),
                      },
                    },
                  },
                },
              });
            }
          } else {
						wx.hideLoading()
            wx.showToast({
              title: "预约失败",
              icon: "error",
            });
					}
        },
      });
    },
    subscribe({
      res,
      data,
      userInfo,
      shopInfo,
      hInfo,
      pInfo,
      appointmentTime,
    }) {
      if (res["f6_GXCUD2y3PgkE-GCUtZ5wyhN6N43naPBt0oqgqtLQ"] === "accept") {
        pTimePush.add({
          data: {
            pushed: false,
            openid: userInfo.data._openid,
            time: dayjs(appointmentTime).format("YYYY-MM-DD HH:mm:ss"),
            shopName: shopInfo.data.shopName,
            hairstylistName: hInfo.data.hairstylistName,
            projectName: pInfo.data.projectName,
            appointmentID: data._id,
          },
        });
      }
      if (res["84qfRZ1dwl4hXz7wtnITSBk_aM8rxPICHPvnYm3xQHE"] === "accept") {
        pActivePush.add({
          data: {
            openid: userInfo.data._openid,
          },
        });
      }
    },
    onTimeTap(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
				timeItemIndex: index,
				currentTime: this.data.timeList[index]
      });
    },
    afterCalendarRender(e) {
      const calendar = this.selectComponent("#calendar").calendar;
      const selectedDay = calendar
        .getSelectedDates({
          lunar: false,
        })
        .pop();
			this.data.currentDate = joinStr(selectedDay);
			this.calendar = calendar;
			this.calendar.enableDates(this.data.dates)
			
			const date = this.data.dates[0]
			if (!date) return
			if (this.data.currentDate !== date.dateTimeStr) return
			const timeList = this.data.times.find(item => item[date.dateTimeStr])[date.dateTimeStr]
			this.setData({
				timeList: timeList.filter(Boolean)
			})
    },
    takeoverTap(e) {
			this.calendar.jump(e.detail);
      const selectedDay = e.detail
			this.data.currentDate = joinStr(selectedDay);
			if (!this.data.dates.length) return
			const date = this.data.dates.find(item => item.dateTimeStr === this.data.currentDate)
			console.log(date);
			if (!date) return
			const timeList = this.data.times.find(item => item[date.dateTimeStr])[date.dateTimeStr]
			this.setData({
				currentTime: '',
				timeItemIndex: -1,
				timeList: timeList.filter(Boolean)
			})
      console.log("takeoverTap",e.detail); // => { year: 2019, month: 12, date: 3, ...}
    },
    onBackToSelect() {
      this.setData({
        showCalender: false,
      });
      console.log("返回");
    },
    onBtnTap() {
      if (this.data.btnActive) {
        this.setData({
          showCalender: true,
				});
        console.log("下一步");
      }
    },
    onPopupClose() {
      this.setData({
        showCalender: false,
        timeItemIndex: -1,
      });
      serviceStore.setState("sIndex", -1);
      this.triggerEvent("close");
    },
    onIndexChange(index) {
      this.setData({
        btnActive: index > -1,
      });
		},
		onDatesAndTimesChange({ dates, times }) {
			if (dates) {
				this.setData({
					dates
				})
			}
			if (times) {
				this.setData({
					times,
					timeList: []
				})
			}
		}
  },
  lifetimes: {
    attached() {
			serviceStore.onState("sIndex", this.onIndexChange.bind(this));
			shopInfoStore.onStates(["dates", "times"], this.onDatesAndTimesChange.bind(this))
    },
    detached() {
			serviceStore.offState("sIndex", this.onIndexChange);
			shopInfoStore.offStates(["dates", "times"], this.onDatesAndTimesChange.bind(this))
    },
  },
});
