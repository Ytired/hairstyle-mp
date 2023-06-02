// components/store-item/store-item.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		shopData: {
			value: () => ({}),
			type: Object
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onItemTap({ currentTarget }) {
			const id = this.properties.shopData._id
			wx.navigateTo({
				url: `../../pages/store-detail/store-detail?id=${id}`,
			})
		}
	}
})
