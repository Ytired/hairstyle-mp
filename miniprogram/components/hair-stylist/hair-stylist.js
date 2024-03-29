import shopInfoStore from '../../store/shopInfo'
import userInfoStore from '../../store/userInfo'

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		hairstylist: {
			type: Array,
			value: () => []
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		show: false,
		popupVisible: false
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onShowWorks({ currentTarget }) {
			const id = currentTarget.dataset.id
			wx.navigateTo({
				url: `../../pages/work-display/work-display?id=${id}`
			})
		},
		onClosePopup() {
			this.setData({
				popupVisible: false
			})
		},
		onItemTap(e) {
			if (!userInfoStore.state.phoneNumber || userInfoStore.state.nickName == '微信用户') {
				this.setData({
					popupVisible: true
				})
				if (!userInfoStore.state.phoneNumber) {
					wx.showToast({
						title: '请填写手机号',
						icon: 'error'
					})
				}
				if (userInfoStore.state.nickName == '微信用户') {
					wx.showToast({
						title: '请填写姓名',
						icon: 'error'
					})
				}

				return
			}

			const info = e.currentTarget.dataset.info
			shopInfoStore.setState('hID', info._id)
			const dates = info.dates || []
			shopInfoStore.setState('dates', sortDatesByDateStr(dates))
			shopInfoStore.setState('times', info.times || [])
			shopInfoStore.dispatch('changeProjectList', info._id)
			this.setData({
				show: true
			})
		},
		onPopupClose() {
			this.setData({
				show: false
			})
		}
	}
})

function sortDatesByDateStr(dates) {
	if (!dates.length) return []
  return dates.sort((a, b) => new Date(a.dateTimeStr) - new Date(b.dateTimeStr));
}