import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const st = new Vuex.Store({
	state: {
		menu: "device", //主页当前菜单
		bread: null, //当前面包屑主题
		device_type_id: null,
		user: null,
		cur_max_event_queue_len:0
	},
	mutations: {
		setMenu(state, val) {
			state.bread = null;
			state.menu = val;
		},
		setBread(state, val) {
			state.bread = val;
		},
		setDeviceTypeId(state, val) {
			state.device_type_id = val;
		},
		setUser(state, val) {
			state.user = val;
		},
		setMaxEventQueueLen(state,len)
		{
			state.cur_max_event_queue_len = len
		}
	},
	actions: {

	},
	getters: {
		getMenu(state) {
			return state.menu;
		},
		getBread(state) {
			return state.bread;
		},
		getDeviceTypeId(state) {
			return state.device_type_id;
		},
		getUser(state) {
			let user = process.env.NODE_ENV === 'development' ? {
				"data_id": 1,
				"id": 1,
				"name": "admin",
				"timezone": "Asia/Shanghai",
				"language": "ENUS",
				"token": "fe7a83696b2a3d369edf28d8a9267721",
				"gender": 0,
				"account": "admin",
				"right_list": [{
					"right_update": 1,
					"resource_id": "1",
					"right_create": 1,
					"right_delete": 1,
					"right_read": 1
				}, {
					"right_update": 1,
					"resource_id": "2",
					"right_create": 1,
					"right_delete": 1,
					"right_read": 1
				}, {
					"right_update": 1,
					"resource_id": "3",
					"right_create": 1,
					"right_delete": 1,
					"right_read": 1
				}]
			} : state.user
			return user;
		},
		getMaxEventQueueLen(state)
		{
			return state.cur_max_event_queue_len;
		}
	}
})
window.st = st;
export default st;
