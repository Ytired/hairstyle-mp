const cloud = require("wx-server-sdk");
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  // 不加此参数就默认为第一个创建的云环境
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 云函数入口函数
exports.main = async (event, context) => {
  const pTimePush = cloud.database().collection("p_time_push");
  try {
    // --- 步骤1 ---
    // 从云开发数据库中查询等待发送的消息列表
    let msgArr = await pTimePush
      // 查询条件
      .where({
        pushed: false,
      })
      .get();

    console.log(msgArr.data);
    msgArr = msgArr.data.filter((msg) => isHalfHourApart(msg.time));
    console.log(msgArr);
    let arr = [];
    let errors = [];
    // --- 步骤2 ---
    for (const msgData of msgArr) {
      try {
        // 发送订阅消息
        const res = await cloud.openapi.subscribeMessage.send({
          touser: msgData.openid,
          page: `pages/appointment-list/appointment-list?id=${msgData.appointmentID}`,
          lang: "zh_CN",
          templateId: "f6_GXCUD2y3PgkE-GCUtZ5wyhN6N43naPBt0oqgqtLQ",
          // miniprogram_state: 'developer',
          data: {
            time2: {
              value: msgData.time,
            },
            thing7: {
              value: msgData.projectName,
            },
            thing8: {
              value: msgData.shopName,
            },
            thing18: {
              value: msgData.hairstylistName,
            },
          },
        });

        arr.push(res);
        // --- 步骤3 ---
        // 发送成功后将pushed数据状态重置
        pTimePush.doc(msgData._id).update({
          data: {
            pushed: true,
          },
        });
      } catch (error) {
        errors.push(error);
      }
    }
    // --- 步骤4 ---
    return {
      arr,
      msgArr,
      errors,
    };
  } catch (e) {
    return e;
  }
};

// 将太长的文本截短
function isHalfHourApart(targetTime) {
  // 将传入的时间字符串转为 Date 对象
  const targetDate = new Date(targetTime);
  console.log(Date.now());
  // 计算传入时间与当前时间的时间差，单位为毫秒
  const timeDiff = targetDate.getTime() - Date.now();
  // 将时间差转为分钟
  const minutesDiff = Math.floor(timeDiff / 1000 / 60);
  // 计算传入时间与当前时间的小时差
  const hoursDiff = Math.floor(timeDiff / 1000 / 60 / 60);
  // 判断时间差是否小于等于半个小时，并且传入时间与当前时间的小时差不超过1小时
  return Math.abs(minutesDiff) <= 60 && Math.abs(hoursDiff) <= 1;
}
