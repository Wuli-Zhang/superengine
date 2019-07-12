export default {
    baseUrl: {
        dev: 'https://192.168.1.187:443/sest/v1/api/',
        pro: 'https://192.168.1.187:443/sest/v1/api/'
    },
    homeName: 'home',
    event_listen_interval: 60,//--每60s检测消息队列，获取最新告警信息
    plugin: {
        'error-store': {
            showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
            developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
        }
    }
}