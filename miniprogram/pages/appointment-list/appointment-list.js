// pages/appointment-list/appointment-list.js
import userInfoStore from "../../store/userInfo";
import shopInfoStore from "../../store/shopInfo";
const db = wx.cloud.database();
const appointment = db.collection("appointment");
import dayjs from 'dayjs'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },
  onCancel(e) {
    const index = e.currentTarget.dataset.index;
    const newList = [...this.data.list];
    const data = newList[index];
    wx.showModal({
      title: "提示",
      content: "是否取消预约",
      success: (res) => {
        if (res.confirm) {
          appointment.doc(data._id).update({
            data: {
              status: 1,
            },
            success: (res) => {
              wx.showToast({
                title: "取消成功",
                icon: "success",
              });
              newList[index].status = 1;
              this.setData({
                list: newList,
              });
            },
          });
        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    wx.cloud.callFunction({
      name: "getAllData",
      data: {
        tableName: "appointment",
        data: {
          userInfo: {
            _id: userInfoStore.state.id,
          },
        },
      },
      success: (res) => {
				const data = res.result.data

				for (const item of data) {
					item.appointmentTime = dayjs(item.appointmentTime).format('YYYY-MM-DD HH:mm:ss')
				}
        this.setData({
          list: data,
        });
        console.log(res);
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
