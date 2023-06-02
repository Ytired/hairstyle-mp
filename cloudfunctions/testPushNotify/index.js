// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
	cloud.openapi.subscribeMessage.send({
		touser: 'oQDzL4qVaymxojwkCi0BBvuq-gn8',
		lang: 'zh_CN',
		// templateId: '84qfRZ1dwl4hXz7wtnITSBk_aM8rxPICHPvnYm3xQHE',
		// templateId: '1YgT4SMUWTNuEABQIL6v6lQnonFk8aQAkowqDoBNmpE',
		templateId: '4BytWbEViowlRY9BpTqLnFIkSBhV0soYq_6RycCEraw',
		// miniprogram_state: 'developer',
		// data: {
		// 	thing1: {
		// 		value: '测试'
		// 	},
		// 	thing3: {
		// 		value: '测试'
		// 	}
		// }
		// data: {
		// 	thing1: {
		// 		value: '测试'
		// 	},
		// 	thing2: {
		// 		value: '测试'
		// 	},
		// 	thing7: {
		// 		value: '测试'
		// 	},
		// 	name6: {
		// 		value: '测试'
		// 	},
		// }
		data: {
			thing4: {
				value: 'test',
			},
			thing3: {
				value: 'test',
			},
			name1: {
				value: 'test',
			},
			date2: {
				value: '2023-06-01 09:00:00',
			},
		},
	}).then(res => {
		console.log(res);
	})
}