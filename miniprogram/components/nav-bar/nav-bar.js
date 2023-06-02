// components/nav-bar/nav-bar.js
const { globalData } = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		
	},
	options: {
		multipleSlots: true
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		statusBarHeight: globalData.statusBarHeight,
		menuButtonHeight: globalData.menuButtonHeight
	},

	/**
	 * 组件的方法列表
	 */
	methods: {

	}
})
