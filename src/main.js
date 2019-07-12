import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
import vuescroll from 'vuescroll';

import '@/assets/fonts/iconfont/iconfont.js';
import '@/assets/fonts/iconfont/iconfont.css';


require("./style/main.less")

Vue.config.productionTip = false
Vue.use(iView)


Vue.use(vuescroll, {
	ops: {
		bar: {
			background: '#B4B7BE',
		},
		mode: "native",
		disable: true,
		scrollPanel: {
			scrollingX: false,
	    }
	},
});
window.Vue = Vue;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
