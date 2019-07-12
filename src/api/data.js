import axios from '@/libs/api.request'
import store from '../store.js'
import data_type from './data_type'
import {data_ex} from './data_ex'
import { get_list, get_by_id_list } from './get_list'
import { query_list } from './query_list'

//获取用户token
function getToken() {
	if (process.env.NODE_ENV === 'development') {
		return "79fb054e94d0284966a416a852a6924a";
	}
	if (store.state && store.state.user && store.state.user.token) {
		return store.state.user.token;
	}
}

//获取用户access_key
function getAccessKey() {
	return "";
}

export const Ajax = {
	Login: (params) => {
		return axios.request({
			url: 'ssl_login',
			data: JSON.stringify(params),
			method: 'post'
		})
	},
}

get_list.map(item => {
	Ajax["get" + item[0]] = () => {
		return axios.request({
			url: item[1] + '?token=' + getToken(),
			method: 'get'
		})
	}
})

get_by_id_list.map(item => {
	Ajax["get" + item[0]] = (id,params) => {
		if(!id) return new Promise((resove,reject)=>{reject()});
		let url = "";
		for (let i in params) {
			if(params[i]!=undefined) {
				url = url + "&" + i + "=" + params[i];
			}
		}
		return axios.request({
			url: item[1] + '/' + id + '?token=' + getToken() + url,
			method: 'get'
		})
	}
	if(item.indexOf(data_ex.get_ex) > 0) {
		Ajax["get" + item[0] + "Ex"] = (id,params) => {
			if(!id) return new Promise((resove,reject)=>{reject()});
			let url = "";
			for (let i in params) {
				if(params[i]) {
					url = url + "&" + i + "=" + params[i];
				}
			}
			return axios.request({
				url: item[1] + '/' + id + '?token=' + getToken() + "op=" + data_ex.get_ex + url,
				method: 'get'
			})
		}
	}
})

query_list.map(item => {
	Ajax["query" + item[0]] = (params) => {
		let url = "";
		for (let i in params) {
			if(params[i]!=undefined) {
				url = url + "&" + i + "=" + params[i];
			}
		}
		return axios.request({
			url: item[1] +'?token=' + getToken() + url,
			method: 'get'
		})
	}
	if(item.indexOf(data_ex.query_ex) > 0) {
		Ajax["query" + item[0] + "Ex"] = (params) => {
			let url = "";
			for (let i in params) {
				if(params[i]!=undefined) {
					url = url + "&" + i + "=" + params[i];
				}
			}
			return axios.request({
				url: item[1] + '?token=' + getToken() + "op=" + data_ex.query_ex + url,
				method: 'get'
			})
		}
	}
})

window.Ajax = Ajax;

//登录
export const Login = (params) => {
	return axios.request({
		url: 'ssl_login',
		data: JSON.stringify(params),
		method: 'post'
	})
}
//--注册
export const Regist = msg_data => {
	return axios.request({
		url: 'user' + '?token=' + '79fb054e94d0284966a416a852a6924a',
		method: 'post',
		data: JSON.stringify(msg_data),
	})
}

//创建设备
export const createDevice = (params) => {
	return axios.request({
		url: 'device?token=' + getToken(),
		data: JSON.stringify(params),
		method: 'post'
	})
}

//编辑设备
export const updateDevice = (id, params) => {
	return axios.request({
		url: 'device/' + id + '?token=' + getToken(),
		data: JSON.stringify(params),
		method: 'post'
	})
}

//删除设备类型
export const deleteDevice = (id) => {
	return axios.request({
		url: `device/${id}?token=${getToken()}&method=delete`,
		method: 'post'
	})
}

//获取设备信息
export const getDevice = (id) => {
	return axios.request({
		url: 'device/' + id + '?token=' + getToken(),
		method: 'get'
	})
}

//查询设备列表
export const queryDevice = (params) => {
	let url = "";
	for (let i in params) {
		if(params[i]) {
			url = url + "&" + i + "=" + params[i];
		}
	}
	return axios.request({
		url: 'device?token=' + getToken() + url,
		method: 'get'
	})
}

//创建设备类型
export const createDeviceType = (params) => {

	//--服务器需要sn
	params.plugin_config.map((d,i)=>{d.sn = i+1});

	return axios.request({
		url: 'device_type?token=' + getToken(),
		data: JSON.stringify(params),
		method: 'post'
	})
}

//删除设备类型
export const deleteDeviceType = (device_type_id) => {
	return axios.request({
		url: `device_type/${device_type_id}?token=${getToken()}&method=delete`,
		method: 'post'
	})
}

//编辑设备类型
export const updateDeviceType = (id, params) => {

	//--服务器需要sn
	params.plugin_config.map((d,i)=>{d.sn = i+1});

	return axios.request({
		url: 'device_type/' + id + '?token=' + getToken(),
		data: JSON.stringify(params),
		method: 'post'
	})
}



//查询设备类型列表
export const queryDeviceType = (params) => {
	let url = "";
	for (let i in params) {
		if(params[i]) {
			url = url + "&" + i + "=" + params[i];
		}
	}
	return axios.request({
		url: 'device_type?token=' + getToken() + url,
		method: 'get'
	})
}

//创建设备组
export const createDeviceGroup = (params) => {
	return axios.request({
		url: 'device_type_group?token=' + getToken(),
		data: JSON.stringify(params),
		method: 'post'
	})
}

//编辑设备组
export const updateDeviceGroup = (id, params) => {
	return axios.request({
		url: 'device_type_group/' + id + '?op=update_ex&token=' + getToken(),
		data: JSON.stringify(params),
		method: 'post'
	})
}

//查询设备组列表
export const queryDeviceGroup = (params) => {
	let url = "";
	for (let i in params) {
		if(params[i]) {
			url = url + "&" + i + "=" + params[i];
		}
	}
	return axios.request({
		url: 'device_type_group?token=' + getToken() + url,
		method: 'get'
	})
}

//创建用户
export const createUser = (params) => {
	return axios.request({
		url: 'user?token=' + getToken(),
		data: JSON.stringify(params),
		method: 'post'
	})
}

//获取用户
export const getUser = (id) => {
	return axios.request({
		url: 'user/' + id + '?token=' + getToken(),
		method: 'get'
	})
}


//编辑用户
export const updateUser = (id, params) => {
	return axios.request({
		url: 'user/' + id + '?token=' + getToken(),
		data: JSON.stringify(params),
		method: 'post'
	})
}

//查询用户列表
export const queryUser = (params) => {
	let url = "";
	for (let i in params) {
		if(params[i]) {
			url = url + "&" + i + "=" + params[i];
		}
	}
	return axios.request({
		url: 'user?token=' + getToken() + url,
		method: 'get'
	})
}

//获取字典表
export const getDict = () => {
	return axios.request({
		url: 'dict?token=' + getToken(),
		method: 'get'
	})
}

//获取服务器公共配置
export const getConfig = () => {
	return axios.request({
		url: 'config?token=' + getToken(),
		method: 'get'
	})
}

export const uploadDevices = (type_id,formdata) => {
	return axios.request({
		url: `device?&op=upload_csv&type_id=${type_id}&token=${getToken()}`,
		data: formdata,
		method: 'post'
	})
}
export const queryEvents = (query_params,start,row) => {
	return axios.request({
		url: `query/event_history?start=${start}&row=${row}&token=${getToken()}`,
		data: JSON.stringify(query_params),
		method: 'post'
	})
}
export const queryEventsCount = (query_params) => {
	return axios.request({
		url: `query/event_history?op=count&token=${getToken()}`,
		data: JSON.stringify(query_params),
		method: 'post'
	})
}
export const queryEventStatistics = (query_params) => {
	return axios.request({
		url: `query/event_statistics?op=aggregate&token=${getToken()}`,
		data: JSON.stringify(query_params),
		method: 'post'
	})
}
export const queryDeviceTypeStatistics = (device_type,query_params) => {
	return axios.request({
		url: `query/device_type_statistics/${device_type}?op=aggregate&token=${getToken()}`,
		data: JSON.stringify(query_params),
		method: 'post'
	})
}
export const queryDeviceTypeEventStatistics = (device_type,query_params) => {
	return axios.request({
		url: `query/device_type_event_statistics/${device_type}?op=aggregate&token=${getToken()}`,
		data: JSON.stringify(query_params),
		method: 'post'
	})
}