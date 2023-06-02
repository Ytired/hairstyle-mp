import serviceStore from '../../store/service'
import shopInfoStore from '../../store/shopInfo'
import userInfoStore from '../../store/userInfo'

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		showButton: {
			type: Boolean,
			value: true
		},
		active: {
			type: Boolean,
			value: false
		},
		projectList: {
			type: Array,
			value: () => []
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		show: false,
		currentIndex: -1,
		hairstylist: [],
		popupVisible: false
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onItemClick(e) {
			if (!this.properties.active) return
			const { currentTarget } = e;
			const id = currentTarget.dataset.id
			serviceStore.setState('sIndex', currentTarget.dataset.index)
			shopInfoStore.setState('pID', id)
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

			if (!this.properties.active) {
				const id = e.currentTarget.dataset.id
				shopInfoStore.dispatch('changeHairstylist', id)
				shopInfoStore.setState('pID', id)
			}
			this.setData({
				show: true
			})
		},
		onPopupClose() {
			this.setData({
				show: false
			})
		},
		onChangeIndex: function(currentIndex) {
			this.setData({
				currentIndex
			})
		},
		onChangeProjectList(list) {
			console.log(11111, list);
			this.setData({
				hairstylist: list
			})
		}
	},
	lifetimes: {
		attached() {
			if (this.properties.active) {
				serviceStore.onState('sIndex', this.onChangeIndex.bind(this))
				shopInfoStore.onState('projectList', this.onChangeProjectList.bind(this))
			} else {
			}
		},
		detached() {
			if (this.properties.active) {
				serviceStore.offState('sIndex', this.onChangeIndex)
			}
		}
	}
})
