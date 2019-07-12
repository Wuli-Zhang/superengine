<template>
	<div class="save-setting">
		<Modal class="save-setting-modal" noFooter="true" width="400" title="储存配置" ref="modal" :modalVisible="modalVisible" @incrementOk="incrementOk" 
		@incrementCancel="incrementCancel">
			<Form class='se-form modal-body' ref="save_from" :model="formItem" :rules="formRules" :label-width="110">
				<RadioGroup v-model="formItem.vertical" vertical style="width: 100%;">
					<Row type="flex" justify="space-around" align="middle">
						<Col span=18>
							<Radio label="1">
								<span class="label">存储</span>
								<span>将实时数据持久化存储在平台中</span>
							</Radio>
						</Col>
						<Col span=18>
							<Radio label="2">
								<span class="label">不存储</span>
								<span>平台不存储实时数据</span>
							</Radio>
						</Col>
					</Row>
				</RadioGroup>
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
					save_id: "1"
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
					save_id: "1"
				}
			},
			create() {
				const params = {
					"save_id": this.formItem.save_id,
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
