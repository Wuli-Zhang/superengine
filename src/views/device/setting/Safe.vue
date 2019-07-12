<template>
	<div class="safe-setting">
		<Modal class="safe-setting-modal" noFooter="true" width="843" title="安全配置" ref="modal" :modalVisible="modalVisible" @incrementOk="incrementOk" 
		@incrementCancel="incrementCancel">
			<Breadcrumb style="line-height: 40px;margin-bottom: 20px;">
				<BreadcrumbItem>
					<span :class="active_table === 'device' ? 'click active': 'click'" 
					@click="changeShow('device')" style="font-size: 16px;">
						设备介入许可码
					</span>
					<Poptip trigger="hover" content="content" style="margin: 0 5px;">
						<i class="iconfont click handle">&#xe65b;</i>
						<div class="api" slot="content">
							这里是提示内容
						</div>
					</Poptip>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<span :class="active_table === 'data' ? 'click active': 'click'" 
					@click="changeShow('data')" style="font-size: 16px;">
						数据服务访问许可码
					</span>
				</BreadcrumbItem>
				<Button @click="AddLicenseCode" class="se-btn" type="primary" style="float: right;">添加许可码</Button>
			</Breadcrumb>
			<div v-if="active_table === 'device'" style="margin-top: 10px;">
				<Table :columns="device_columns" :data="device_data" height="240"></Table>
			</div>
			<div v-if="active_table === 'data'">
				<div style="margin-bottom: 10px;font-size: 14px;">
					数据服务接口：
					<Input id="service-code" class="hide-input" readonly value="XXXXXXXXXXXX" style="width: 100px;" /></Input>
					<span class="click handle" @click="copyServiceCode" style="margin-left: 10px;">
						<i class="iconfont">&#xe613;</i>&nbsp;复制
					</span>
				</div>
				<Table border :columns="data_columns" :data="data_data" height="240"></Table>
			</div>
		</Modal>
		<add-license-code ref="add_license_code"></add-license-code>
	</div>
</template>

<script>
	import Modal from '@/components/BaseModal.vue';
	import AddLicenseCode from './AddLicenseCode';
	export default {
		data() {
			return {
				modalVisible: false,
				loading: false,
				active_table: "device",
				device_columns: [
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '许可码',
                        key: 'age',
						render: (h, params) => {
							const _this = this;
							return h('div', [
								h('i-input', 
									{
										class: "hide-input",
										props: {
											readonly: true,
											value: params.row.age,
										},
										on: {
											'on-focus': (e,q,w) => {
												e.target.select(); // 选择对象
												document.execCommand("Copy"); // 执行浏览器复制命令
												_this.$Message.success("已复制好，可贴粘。");
												return;
											}
										}
									}
								)
							])
						}
                    },
                    {
                        title: '说明',
                        key: 'address'
                    },
					{
					    title: '创建时间',
					    key: 'date'
					},
					{
					    title: '操作',
						width: 200,
					    render: (h, params) => {
							return h('div', {
								class: "handle",
								style: {
									color: '#44AAF6'
								}
							}, [
								h('i-switch', {
									props: {
										type: 'Info',
										size: 'small',
										value: false
									},
								    style: {
								        marginRight: '5px',
								    },
								    on: {
								        'on-change': (val) => {
								        }
								    }
								}, ''),
								h('span', {
									
								},'使用'),
								h('div', {
									class: "ivu-divider ivu-divider-vertical ivu-divider-default"
								}),
								h('i', {
								    class: "iconfont icondelete",
								    attrs: {
								        title:'事件'
								    },
								    style: {
								        marginRight: '5px',
								        cursor: "pointer",
								    },
								    on: {
								        click: () => {
								            
								        }
								    }
								}, ''),
								h('span', {
									
								},'删除'),
							])
						}
					}
                ],
				device_data: [
					{name:"XX",age: "XXXXXXXXXX"}
				],
				data_columns: [
					
				],
				data_data: [
					
				]
			}
		},
		components: {
			Modal,
			AddLicenseCode
		},
		methods: {
			show() {
				this.modalVisible = true;
			},
			AddLicenseCode() {
				this.$refs.add_license_code.show();
			},
			changeShow(type) {
				this.active_table = type;
			},
			copyServiceCode() {//复制数据服务接口码
				const target = document.getElementById("service-code").children[1];
				target.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				this.$Message.success("已复制好，可贴粘。");
				return;
			},
			initData() {
				this.current = 0;
				this.formItem = {
					name: "",
					agreement: "1",
					vertical: "1",
					safe_id: "1"
				}
			},
			create() {
				const params = {
					"safe_id": this.formItem.safe_id,
					"name": this.formItem.name,
					"code": "devtest",
					"plugin_config": {},
					"config": {}
				}
				const _this = this;
				createDeviceType(params).then((res) => {
					_this.$Message.success("创建设备类型成功");
					_this.incrementCancel();
				})
				.catch((error) => {
					_this.$Message.error("创建设备类型失败");
				})
			},
			incrementOk() {
				this.current = 0;
				this.modalVisible = false;
			},
			incrementCancel() {
				this.initData();
				this.modalVisible = false;
			},
		}
	}
</script>

<style lang="less" scoped>
	.label {
		font-size: 16px;
		color: #0F243B;
		margin: 0 10px;
	}
</style>
