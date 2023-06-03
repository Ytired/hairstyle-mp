import { HYEventStore } from 'hy-event-store';

const serviceStore = new HYEventStore({
	state: {
		sIndex: -1,
		hIndex: -1,
	},
})

export default serviceStore