// pages/profile/profile.js
import userInfoStore from '../../store/userInfo'
Page({
  /**
   * 页面的初始数据
   */
  data: {
		nickName: "",
		phoneNumber: '',
    avatarUrl: "",
    isLogin: false,
    popupVisible: false,
    confirmLoading: false,
  },
  async onGetUserInfo() {
    this.setData({ popupVisible: true });
  },
  onClosePopup() {
    this.setData({
      popupVisible: false,
    });
	},
	getUserInfoHandler({ nickName, phoneNumber, avatarUrl }) {
		if (nickName) {
			this.setData({ nickName })
		}

		if (phoneNumber) {
			this.setData({ phoneNumber })
		}

		if (avatarUrl) {
			this.setData({ avatarUrl })
		}
	},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		userInfoStore.onStates(["nickName", "phoneNumber", "avatarUrl"], this.getUserInfoHandler.bind(this))
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
  onUnload() {
		userInfoStore.offStates(["nickName", "phoneNumber", "avatarUrl"], this.getUserInfoHandler)
	},

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
