import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home/Home.vue'
import iView from 'iview'

Vue.use(Router)
const router = new Router({
  mode: 'hash',
  // base: 'http://127.0.0.1:8002/stream_data/app2/dist/',
  routes: [
    {
		path: '/',
		name: 'home',
		component: Home,
		children: [
			{
			  path: '/device',
			  name: 'device',
			  // route level code-splitting
			  // this generates a separate chunk (about.[hash].js) for this route
			  // which is lazy-loaded when the route is visited.
			  component: () => import(/* webpackChunkName: "about" */ './views/device/Device.vue')
			},
			{
			  path: '/device_detail',
			  name: 'device_detail',
			  // route level code-splitting
			  // this generates a separate chunk (about.[hash].js) for this route
			  // which is lazy-loaded when the route is visited.
			  component: () => import(/* webpackChunkName: "about" */ './views/device/DeviceDetail.vue')
			},
			{
			  path: '/thing',
			  name: 'thing',
			  // route level code-splitting
			  // this generates a separate chunk (about.[hash].js) for this route
			  // which is lazy-loaded when the route is visited.
			  component: () => import(/* webpackChunkName: "about" */ './views/thing/Thing.vue')
			},
			{
			  path: '/user',
			  name: 'user',
			  // route level code-splitting
			  // this generates a separate chunk (about.[hash].js) for this route
			  // which is lazy-loaded when the route is visited.
			  component: () => import(/* webpackChunkName: "about" */ './views/user/User.vue')
			},
			{
			  path: '/about',
			  name: 'about',
			  // route level code-splitting
			  // this generates a separate chunk (about.[hash].js) for this route
			  // which is lazy-loaded when the route is visited.
			  component: () => import(/* webpackChunkName: "about" */ './views/about/About.vue')
			},
		]
	},
	{
	  path: '/login',
	  name: 'login',
	  component: () => import(/* webpackChunkName: "about" */ './views/login/Login.vue')
	},
	{
	  path: '/regist',
	  name: 'regist',
	  component: () => import(/* webpackChunkName: "about" */ './views/login/Regist.vue')
	}]
})
router.beforeEach((to, from, next) => {
	iView.LoadingBar.start()

	const token = localStorage.getItem("token");
	if(to.name !== "login" && !token) {
		next({name: "login"})
	} else if((to.name === "login" || to.name === "home") && token) {
		next({name: "device"})
	} else {
		next()
	}
})

router.afterEach(to => {
//   setTitle(to, router.app)
  iView.LoadingBar.finish()
//   window.scrollTo(0, 0)
})

export default router;