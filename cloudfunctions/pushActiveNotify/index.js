// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境
const db = cloud.database();
const MAX_LIMIT = 100;

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext();
	const { id } = event
	console.log(id);
	const notifyData =  await db.collection('activity_list').doc(id).get()
	const data = await getAll();
	const uniqueArr = uniqueBy(data.data, 'openid');
	console.log(uniqueArr);
  const errors = [];
  for (const item of uniqueArr) {
    try {
      // 发送订阅消息
      const res = await cloud.openapi.subscribeMessage.send({
        touser: item.openid,
        page: `pages/notify-page/notify-page?id=${id}`,
        lang: "zh_CN",
        templateId: "84qfRZ1dwl4hXz7wtnITSBk_aM8rxPICHPvnYm3xQHE",
        data: {
          thing1: {
            value: notifyData.data.title,
          },
          thing3: {
            value: notifyData.data.content,
          }
        },
      });
    } catch (error) {
      errors.push(error);
    }
	}
	
	return errors
};

async function getAll() {
  // 先取出集合记录总数
  const countResult = await db.collection("p_activity_push").count();
  const total = countResult.total;
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100);
  // 承载所有读操作的 promise 的数组
	const tasks = [];
  for (let i = 0; i < batchTimes; i++) {
    const promise = db
			.collection("p_activity_push")
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get();
    tasks.push(promise);
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    };
  });
}

function uniqueBy(arr, key) {
  const seen = new Set();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) {
      return false;
    } else {
      seen.add(val);
      return true;
    }
  });
}