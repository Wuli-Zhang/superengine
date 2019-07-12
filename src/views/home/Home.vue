<template>
	<div class="home layout">
		<Layout>
			<Sider ref="side1" width=230 hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
				<div class="se-logo">
					<img src="../../assets/logo.png" />
					<span>物联网云平台</span>
				</div>
				<Menu :active-name="ac_menu" theme="light" width="auto" :class="menuitemClasses" @on-select="routerTo">
					<MenuItem name="device" title="设备类型">
						<i class="iconfont">&#xe601;</i>
						<span>设备类型</span>
					</MenuItem>
					<MenuItem name="thing" title="事件中心">
						<i class="iconfont">&#xe6b1;</i>
						<span>事件中心</span>
					</MenuItem>
					<MenuItem name="user" title="用户管理">
						<i class="iconfont">&#xe606;</i>
						<span>用户管理</span>
					</MenuItem>
					<MenuItem name="about" title="关于">
						<i class="iconfont">&#xe66d;</i>
						<span>关于</span>
					</MenuItem>
				</Menu>
				<img :src="isCollapsed ? './static/images/se-row.png' : './static/images/se-col.png'" class="se-meau-col" @click="collapsedSider" />
				<!-- <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon> -->
			</Sider>
			<Layout>
				<Header :style="{padding: 0}" class="layout-header-bar">
					<div class="nav-bre" v-if="bread">
						<Breadcrumb separator=">">
							<BreadcrumbItem><span class="click" @click="routerTo('device')">设备类型</span></BreadcrumbItem>
							<BreadcrumbItem>{{bread}}</BreadcrumbItem>
						</Breadcrumb>
					</div>
					<Message></Message>
					<user/>
					<!-- <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon> -->
				</Header>
				<vue-scroll>
					<Content :style="{margin: '20px 30px', minHeight: '260px', position: 'relative'}">
						<keep-alive>
							<router-view/>
						</keep-alive>
					</Content>
				</vue-scroll>
			</Layout>
		</Layout>
	</div>
</template>

<script>
	// @ is an alias to /src
	import User from './user';
	import Message from './Message';
	import {mapGetters} from 'vuex';
	
	
	export default {
		name: 'home',
		data() {
			return {
				isCollapsed: false,
				curMaxMessageNum:0
			}
		},
		mounted() {
		},
		components: {
			User,
			Message
		},
		computed: {
// 			rotateIcon() {
// 				return [
// 					'menu-icon se-meau-col',
// 					this.isCollapsed ? 'rotate-icon' : ''
// 				];
// 			},
			bread: {
				get() {
					return this.getBread();
				},
				set(newVal, oldVal) {
					this.$store.commit("setBread", newVal)
				}
			},
			
			ac_menu: {
				get() {
					return this.getMenu();
				},
				set(newVal, oldVal) {
					this.$store.commit("setMenu", newVal)
				}
			},
			menuitemClasses() {
				return [
					'menu-item',
					this.isCollapsed ? 'collapsed-menu' : ''
				]
			}
		},
		methods: {
			...mapGetters(["getMenu","getBread"]),
			collapsedSider() {
				this.$refs.side1.toggleCollapse();
			},
			routerTo(router) {
				this.$store.commit("setMenu", router)
				this.$router.push({
				  name: router
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	@import url("./home.less");
</style>
