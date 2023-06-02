import { HYEventStore } from 'hy-event-store';
const db = wx.cloud.database()
const connHairProject = db.collection('conn_hair_project')
const hairstyList = db.collection('hair_stylist')
const projectList = db.collection('project_list')
const shopInfoStore = new HYEventStore({
	state: {
		projectList: [],
		hairstylist: [],
		shopID: '',
		pID: '',
		hID: ''
	},
	actions: {
		async changeProjectList(ctx, id) {
			const data = await connHairProject.where({ hID: id }).get()
			const res = await this.actions.getDataById(data.data, 'pID')
			console.log(res);
			ctx.projectList = res
		},
		async changeHairstylist(ctx, id) {
			console.log('pID', id);
			const data = await connHairProject.where({ pID: id }).get()
			const res = await this.actions.getDataById(data.data, 'hID')
			ctx.hairstylist = res
			console.log(res);
		},
		async getDataById(data, field) {
			let tasks = []
			if (field === 'hID') {
				tasks = data.map(item => hairstyList.doc(item[field]).get())
			} else if (field === 'pID') {
				tasks = data.map(item => projectList.doc(item[field]).get())
			} else {
				return []
			}

			return (await Promise.all(tasks)).map(item => item.data)
		}
	}
})

export default shopInfoStore 