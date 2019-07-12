<template>
	<div class="device">
		<div class="device-head">
			<Form class='se-form' :model="searchForm" :label-width="100" inline>
				<FormItem label="设备类型分组" prop="type" style="width: 285px">
					<Select v-model="searchForm.type" clearable>
						<Option v-for="group in group_list" :key="group.data_id" :value="group.data_id">{{group.name}}</Option>
					</Select>
				</FormItem>
				<FormItem prop="key" label="关键字">
					<Input v-model="searchForm.key" icon="ios-search" placeholder="请输入搜索内容" 
					style="width: 200px"  @on-change="getDeviceList" />
				</FormItem>
				<Button class="add-btn se-btn" @click="addDeviceType">添加设备类型</Button>
				<!-- <Button class="add-btn se-btn" @click="$refs.create_advance_warning.show();">添加预告警信息</Button> -->
			</Form>
		</div>
		<div class="device-body">
				<div class="device-type" v-for="group in group_list" v-if="!searchForm.type || group.data_id === searchForm.type" :key="group.data_id">
					<Collapse :value="group.data_id.toString()" simple>
					<Panel :name="group.data_id.toString()">
						<BreadcrumbItem class="click device-type">
							{{group.name}}
							<!-- <Icon type="md-arrow-dropdown" /> -->
						</BreadcrumbItem>
						<Divider />
						<Row slot="content" type="flex" justify="start" :gutter="24">
							<Col v-if="type.group_id === group.data_id" v-for="type in type_list" :key="type.data_id" class="device-list click" :md=6 :lg=6 :xl=6 :xxl=4>
								<div class="device" @click="getDevice(type.data_id,type.name)">
									<div class="device-name">
										<i class="iconfont">&#xe64d;</i>
										<span>{{type.name}}&nbsp;({{type.data_id}})</span>
										<!-- <Poptip trigger="hover" content="content">
											<i class="iconfont">&#xe65b;</i>
											<div class="api" slot="content">
												这里是提示内容
											</div>
										</Poptip> -->
									</div>
									<Divider />
									<Row type="flex" justify="space-around">
										<Col class="device-attr" span=7>
											<p>数据模板</p>
											<span>DQQT</span>
										</Col>
										<Col class="device-attr" span=7>
											<p>设备数量</p>
											<span class="num">{{type.device_count}}</span>
										</Col>
										<!-- <Col class="device-attr" span=7>
											<p>事件数量</p>
											<span class="thing">3211</span>
										</Col> -->
									</Row>
								</div>
							</Col>
						</Row>
					</Panel>
					</Collapse>
				</div>
		</div>
		<create-update-device-type @onsuccess = "getGroupList" ref="crete_device_type"></create-update-device-type>
		<!-- <create-advance-warning  ref="create_advance_warning"></create-advance-warning> -->
	</div>
</template>

<script>
	import {  queryDeviceGroup, queryDeviceType } from '@/api/data';
	import { globalBus } from '@/api/globalBus';
	import CreateUpdateDeviceType from './CreateUpdateDeviceType.vue';
	// import CreateAdvanceWarning from '../warning/CreateAdvanceWarning.vue';
	export default {
		data() {
			return {
				searchForm: {
					type: null,
					key: null
				},
				group_list: [],
				type_list: [],
			}
		},
		components: {
			CreateUpdateDeviceType,
			// CreateAdvanceWarning
		},
		mounted() {
			this.getGroupList();
		},
		watch: {
			activecollapse(val) {
			}
		},
		computed: {
			activecollapse: {
				get(val) {
					return []
				},
				set() {
					
				}
			}
		},
		methods: {
			initData() {
				
			},
			addDeviceType() {
				this.$refs.crete_device_type.show();
			},
			getDevice(id,name) {//获取选择的设备的详细信息
				this.$store.commit("setBread",name );
				this.$store.commit("setDeviceTypeId", id)
				
				this.$router.push({
					name: "device_detail",
					params: {
						id: id
					}
				})
			},
			getGroupList() {//获取设备组列表
				const _this = this;
				const params = {
					type: this.searchForm.type
				}
				queryDeviceGroup(params).then((res) => {
					_this.group_list = res.item_list;
					window.ss = this.activecollapse;
					res.item_list.map(item => {
						_this.activecollapse.push(item.data_id.toString())
					})
					_this.getDeviceList();
				}).catch((error) => {
				})
			},
			getDeviceList() {//获取设备类型列表
				const _this = this;
				const params = {
					key: this.searchForm.key
				}
				queryDeviceType(params).then((res) => {
					_this.type_list = res.item_list;
				}).catch((error) => {
					
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	@import url("./device.less");
</style>
