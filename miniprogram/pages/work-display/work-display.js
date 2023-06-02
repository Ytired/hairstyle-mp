import userInfoStore from "../../store/userInfo";

// pages/work-display/work-display.js
const { globalData } = getApp();
const db = wx.cloud.database();
const hairstyList = db.collection("hair_stylist");
const worksList = db.collection("works_list");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    backTop: 40,
    navHeight: 70,
    userInfo: {},
    imgList: [],
		isPush: false,
		total: 0
  },
  onPageBack() {
    wx.navigateBack();
  },
  onImageTap() {
		if (!this.data.isPush) return;
		const _this = this
    wx.requestSubscribeMessage({
			tmplIds: ["4BytWbEViowlRY9BpTqLnFIkSBhV0soYq_6RycCEraw"],
      complete: async (res) => {
        if (res["4BytWbEViowlRY9BpTqLnFIkSBhV0soYq_6RycCEraw"] === "accept") {
          const _ = db.command;
          hairstyList.doc(this.data.id).update({
            data: {
              pushCount: _.inc(1),
						},
						success: res => {
							console.log(1111);
							hairstyList.doc(this.data.id).get({
								success: userData => {
									console.log(userData);
									_this.setData({ total: userData.data.pushCount })
								}
							});
						}
          });
        }
      },
    });
  },
  onPreview({ currentTarget }) {
    const index = currentTarget.dataset.index;
    const url = this.data.imgList[index].url;
    const urls = this.data.imgList.map((img) => img.url);
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls, // 需要预览的图片http链接列表
    });
    console.log(index);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id;
    if (id) {
      const backTop = globalData.menuButtonTop;
      const navHeight = globalData.menuButtonHeight + backTop;
      this.setData({ backTop, navHeight, id });
      this.initData(id);
    }
  },
  async initData(id) {
    const userData = await hairstyList.doc(id).get();
    const imgList = await worksList.where({ id: id }).get();
    let isPush = userData.data.account == userInfoStore.state.phoneNumber;
    this.setData({
      userInfo: userData.data,
			imgList: imgList.data,
			total: userData.data.pushCount,
      isPush,
    });

    if (isPush) {
      await hairstyList.doc(id).update({
        data: {
          openid: userInfoStore.state.openid,
        },
      });
    }
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
