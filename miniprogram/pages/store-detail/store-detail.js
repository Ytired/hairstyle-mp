// pages/store-detail/store-detail.js
import { throttle } from "underscore";
import shopInfoStore from '../../store/shopInfo'
import userInfoStore from '../../store/userInfo'
const db = wx.cloud.database()
const shop = db.collection('shop')
const hairstyList = db.collection('hair_stylist')
const projectList = db.collection('project_list')
const { globalData } = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
		id: '',
    backTop: 40,
    navHeight: 70,
		isFixed: false,

		shopData: {},
		hairstylist: [],
		projectList: [],
		
	},
	openPhone() {
		wx.makePhoneCall({
			phoneNumber: this.data.shopData.phoneNumber
		})
	},
	openMap() {
		const address = this.data.shopData.address + this.data.shopData.detailAddress;
		const shopName = this.data.shopData.shopName
		const longitude = parseFloat(this.data.shopData.longitude)
		const latitude = parseFloat(this.data.shopData.latitude)
		if (!longitude || !latitude) {
			wx.showToast({
				title: '请填写经纬度'
			})

			return
		}
		console.log(longitude);
		wx.openLocation({
			latitude,
			longitude,
			name: shopName,
			address
		})
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		const id = options.id;
		if (id) this.initShopInfo(id)
    const backTop = globalData.menuButtonTop;
    const navHeight = globalData.menuButtonHeight + backTop;
    this.setData({ backTop, navHeight, id });
	},
	async initShopInfo(id) {
		shopInfoStore.setState('shopID', id)
		shop.doc(id).get({
			success: (res) => {
				console.log(res);
				this.setData({
					shopData: res.data
				})
			}
		})

		hairstyList.where({
			shopID: id
		}).get({
			success: (res) => {
				this.setData({
					hairstylist: res.data
				})
			}
		})

		projectList.where({
			shopID: id
		}).get({
			success: (res) => {
				this.setData({
					projectList: res.data
				})
			}
		})
	},

  onTabClick() {},
  handleScroll: throttle(
    function (e) {
      const { isFixed } = e.detail;
      if (this.data.isFixed === isFixed) return;
      this.setData({ isFixed });
    },
    50,
    { leading: false, trailing: true }
  ),
  onPageBack() {
    wx.navigateBack();
  },
  onTabChange(e) {
    const { detail } = e;
		const id = `#${detail.name}`;
		const query = wx.createSelectorQuery()
    query.select(id).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      wx.pageScrollTo({
        scrollTop: (res[0].top + res[1].scrollTop) - (this.data.navHeight + 44),
        duration: 400,
      });
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
