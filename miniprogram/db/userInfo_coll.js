const db = wx.cloud.database()

const userInfo_coll = db.collection('user_info')

export default userInfo_coll