<template>
  <div id="app">
		<!-- fix dyj 为了在设备类型详情页删除某个设备类型之后跳转回来能够正确刷新 -->
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
export default {
  name: 'App',
	methods: {
		
	},
	mounted() {
	}
}
</script>

<style lang="less">

</style>
