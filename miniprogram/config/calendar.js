export const config = {
	theme: 'elegant',
	takeoverTap: true, // 是否完全接管日期点击事件（日期不会选中)
	firstDayOfWeek: 'Mon',
	defaultDay: new Date(),
	autoChoosedWhenJump: true, // 设置默认日期及跳转到指定日期后是否需要自动选中
	disableMode: {  // 禁用某一天之前/之后的所有日期
		type: 'before',  // [‘before’, 'after']
		date: false, // 无该属性或该属性值为假，则默认为当天
	},
}

