import {data_type} from './data_type'
import Ajax from './data'
export const get_list = [
	data_type.plugin,//配置
	data_type.dict,//字联表
	data_type.config,//应用服务器信息
	data_type.captcha,//验证码
]

export const get_by_id_list = [
	data_type.device,//设备
	data_type.device_type,//设备类别
	data_type.device_label,//设备标签
	data_type.device_type_group,//设备类别组
	data_type.plugin,//配置
	data_type.device_access_key,
	data_type.service_access_key,//
	data_type.device_type_history,//总体统计信息
	data_type.device_type_statistics,//分时状态信息
	data_type.device_type_status,//最终状态信息
	data_type.dict,//字联表
	data_type.config,//应用服务器信息
	data_type.captcha,//验证码
	data_type.user,//用户
	data_type.resource,//资源
	data_type.mission,//任务
]