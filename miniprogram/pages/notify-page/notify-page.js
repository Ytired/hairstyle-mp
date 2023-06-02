// pages/notify-page/notify-page.js
const db = wx.cloud.database();
const activeList = db.collection("activity_list");
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: '',
		content: '',
		imgList: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const id = options.id;
		if (!id) return
		console.log(id);
		activeList.doc(id).get({
			success: res => {
				console.log(res);
				this.setData({
					...res.data
				})
			}
		})
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
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})