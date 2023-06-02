// app.js
import userInfoStore from "./store/userInfo";

App({
  globalData: {
    statusBarHeight: 20,
    menuButtonHeight: 32,
    menuButtonTop: 40,
  },
  onLaunch: async function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      // 初始化云开发
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: "dev-9gn7qb2y336ba8a5",
        traceUser: true,
      });

      // 获取用户凭证信息
      const res = await wx.cloud.callFunction({
        name: "login",
      });
			console.log(res);
      const openid = res.result.openid;

      //获取用户信息
      const db = wx.cloud.database();
			const userInfo_doc = await db.collection("user_info").get();
		
			if (userInfo_doc.data.length) {
				for (let index = 0; index < userInfo_doc.data.length; index++) {
					if (index === userInfo_doc.data.length - 1 && userInfo_doc.data[index]._openid != openid) {
						db.collection("user_info").add({
							data: {
								create_time: new Date().getTime(),
								openid
							}
						}).then(res => {
							userInfoStore.setState('id', res._id)
							userInfoStore.setState('openid', openid)
							console.log(res);
						})
						break
					}
	
					if (userInfo_doc.data[index]._openid === openid) {
						// 存入全局状态管理
						userInfoStore.dispatch("changeUserInfoAction", {openid, ...userInfo_doc.data[index]});
						console.log(userInfo_doc.data[index]);
						break;
					}
				}
			} else {
				db.collection("user_info").add({
					data: {
						create_time: new Date().getTime()
					}
				}).then(res => {
					console.log(res);
				})
			}

      console.log("登录信息:", res);
    }

    const button = wx.getMenuButtonBoundingClientRect();
    this.globalData.menuButtonHeight = button.height;
    this.globalData.menuButtonTop = button.top;

    wx.getSystemInfo({
      success: (res) => {
        this.globalData.statusBarHeight = res.statusBarHeight;
      },
    });
  },
});
