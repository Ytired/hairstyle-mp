// components/user-info-popup/user-info-popup.js
import userInfoStore from "../../store/userInfo";
import Notify from "@vant/weapp/notify/notify";
import userInfo_coll from "../../db/userInfo_coll";
console.log(userInfoStore);

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    popupVisible: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    confirmLoading: false,
    nickName: "",
    phoneNumber: "",
    avatarUrl: "",
    id: "",
  },
  observers: {
    nickName(newVal, oldVal) {
      userInfoStore.setState("nickName", newVal);
    },
  },
  lifetimes: {
    attached() {
      userInfoStore.onStates(
        ["nickName", "phoneNumber", "avatarUrl", "id"],
        this.getUserInfoHandler.bind(this)
      );
    },
    detached() {
      userInfoStore.offStates(
        ["nickName", "phoneNumber", "avatarUrl", "id"],
        this.getUserInfoHandler
      );
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择头像
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail;
      const timeStamp = new Date().getTime();
      const openid = userInfoStore.state.openid;
      const extension = avatarUrl.split(".").pop();
      wx.cloud.uploadFile({
        cloudPath: `images/avatar/${timeStamp}_${openid}.${extension}`, // 上传至云端的路径
        filePath: avatarUrl, // 小程序临时文件路径
        success: (res) => {
          // 返回文件 ID
          userInfoStore.setState("avatarUrl", res.fileID);
          // do something
        },
        fail: console.error,
      });
    },
    //获取手机号
    onGetPhoneNumber({ detail }) {
      if (!detail.cloudID) {
        wx.showToast({
          title: "用户未授权",
          icon: "error",
        });
        return;
      }

      wx.cloud
        .callFunction({
          name: "getPhone",
          data: { weRunData: wx.cloud.CloudID(detail.cloudID) },
        })
        .then((res) => {
          const phoneNumber = res.result.weRunData.data.phoneNumber;
          userInfoStore.setState("phoneNumber", phoneNumber);
          console.log(phoneNumber);
        })
        .catch((err) => {
          Notify({ type: "danger", message: "授权失败" });
        });
    },
    onClosePopup() {
      this.triggerEvent("close");
    },
    // 保存个人信息
    async onSaveProfile() {
      if (
        !userInfoStore.state.phoneNumber ||
        userInfoStore.state.nickName == "微信用户"
      ) {
        if (!userInfoStore.state.phoneNumber) {
          wx.showToast({
            title: "请填写手机号",
            icon: "error",
          });
        }
        if (userInfoStore.state.nickName == "微信用户") {
          wx.showToast({
            title: "请填写姓名",
            icon: "error",
          });
        }

        return;
      }
      this.setData({
        confirmLoading: true,
      });

      const avatarUrl = this.data.avatarUrl;
      const nickName = this.data.nickName;
      const phoneNumber = this.data.phoneNumber;
      console.log(this.data.id);
      userInfo_coll.doc(this.data.id).update({
        data: {
          avatarUrl,
          nickName,
          phoneNumber,
        },
        success: (res) => {
          console.log(res);
          setTimeout(() => {
            if (res.errMsg === "document.update:ok") {
              wx.showToast({
                title: "更新成功",
              });
            } else {
              wx.showToast({
                title: "更新失败",
              });
            }

            this.setData({
              confirmLoading: false,
            });
            this.triggerEvent("close");
          }, 600);
        },
      });
    },
    getUserInfoHandler({ nickName, phoneNumber, avatarUrl, id }) {
      if (nickName) {
        this.setData({ nickName });
      }

      if (phoneNumber) {
        this.setData({ phoneNumber });
      }

      if (avatarUrl) {
        this.setData({ avatarUrl });
      }

      if (id) {
        this.setData({
          id,
        });
      }
    },
  },
});
