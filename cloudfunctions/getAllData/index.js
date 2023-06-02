// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
	const { tableName, data } = event
	console.log(tableName);
  // 先取出集合记录总数
  const countResult = await db.collection(tableName).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
		let promise = null
		if (data) {
			promise = db.collection(tableName).skip(i * MAX_LIMIT).limit(MAX_LIMIT).where(data).get()
		} else {
			promise = db.collection(tableName).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
		}
    tasks.push(promise)
  }
  // 等待所有
  const datas = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
	})

	return datas
}