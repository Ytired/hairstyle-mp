// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const hairstyList = cloud.database().collection('hair_stylist')

// 云函数入口函数
exports.main = (event, context) => {
	const { id, data } = event;
	console.log(event);
	cloud.openapi.subscribeMessage.send(data).then(res => {
		console.log(res);
		if (res.errCode == 0) {
			const _ = cloud.database().command;
			hairstyList.doc(id).get({
				success: res => {
					if (res.data.pushCount && res.data.pushCount !== 0) {
						hairstyList.doc(id).update({
							data: {
								pushCount: _.inc(-1),
							}
						})
					}
				}
			})
		}
	})

	return {
		event
	}
}