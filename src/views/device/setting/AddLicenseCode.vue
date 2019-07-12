<template>
	<div class="add-license">
		<Modal class="add-license-modal" noFooter="true" width="718" title="储存配置" ref="modal" :modalVisible="modalVisible" @incrementOk="incrementOk" 
		@incrementCancel="incrementCancel">
			<Form class='se-form modal-body' ref="license_from" :model="formItem" :rules="formRules" :label-width="110">
				<Row type="flex" justify="space-around" align="middle">
					<Col span=18>
						<FormItem label="名称">
							<Input v-model="formItem.input" placeholder="Enter something..."></Input>
						</FormItem>
					</Col>
					<Col span=18>
						<FormItem label="接入许可码">
							<Input v-model="formItem.input" placeholder="Enter something..."></Input>
						</FormItem>
					</Col>
					<Col span=18>
						<FormItem label="说明">
							<Input type="textarea" :autosize="{minRows: 3,maxRows: 5}" v-model="formItem.input" placeholder="Enter something..."></Input>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<Row class="modal-foot">
				<Col span="18" offset="4">
					<Button class="se-btn" :disabled="loading" @click="incrementOk" type="primary" style="float: right;margin-left: 20px;">确定</Button>
					<Button class="se-btn" @click="incrementCancel" style="float: right;">取消</Button>
				</Col>
			</Row>
		</Modal>
	</div>
</template>

<script>
	import Modal from '@/components/BaseModal.vue';
	export default {
		data() {
			return {
				modalVisible: false,
				loading: false,
				formItem: {
					name: "",
					agreement: "1",
					vertical: "1",
					license_id: "1"
				},
				formRules: {
					
				}
			}
		},
		components: {
			Modal
		},
		methods: {
			show() {
				this.modalVisible = true;
			},
			initData() {
				this.current = 0;
				this.formItem = {
					name: "",
					agreement: "1",
					vertical: "1",
					license_id: "1"
				}
			},
			create() {
				const params = {
					"license_id": this.formItem.license_id,
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
