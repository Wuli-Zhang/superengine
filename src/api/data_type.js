	import { data_ex } from './data_ex'
export const data_type = {
	//["方法名"，"接口地址"，--EX]
	device: ["Device","device"],//设备
	device_type: ["DeviceType","device_type",data_ex.select_ex,data_ex.get_ex],//设备类别
	device_label: ["DeviceLabel","device_label"],//设备标签
	device_type_group: ["DeviceTypeGroup","device_type_group"],//设备类别组
	plugin: ["Plugin","plugin"],//配置
	device_access_key: ["DeviceAccessKey","device_access_key"],
	service_access_key: ["ServiceAccessKey","service_access_key"],//
	device_type_history: ["DeviceTypeHistory","device_type_history"],//总体统计信息
	device_type_statistics: ["DeviceTypeStatistics","device_type_statistics"],//分时状态信息
	device_type_status: ["DeviceTypeStatus","device_type_status"],//最终状态信息
	dict: ["Dict","dict"],//字联表
	login: ["Login","login"],//登录
	config: ["Config","config"],//应用服务器信息
	ssl_login: ["SslLogin","ssl_login"],//登录注销
	captcha: ["Captcha","captcha"],//验证码
	user: ["User","user"],//用户
	resource: ["Resource","resource"],//资源
	mission: ["Mission","mission"],//任务
}