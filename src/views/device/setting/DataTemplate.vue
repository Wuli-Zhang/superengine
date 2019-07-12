<template>
	<div class="data-template">
		<Modal class="data-template-modal" noFooter="true" width="843" title="数据模板" ref="modal" :modalVisible="modalVisible" @incrementOk="incrementOk" 
		@incrementCancel="incrementCancel">
			<Table :columns="data_columns" :data="data_data" height="240"></Table>
			<Row class="modal-foot">
				<Button class="se-btn" :disabled="loading" @click="incrementOk" type="primary" style="float: right;margin-left: 20px;">确定</Button>
				<Button class="se-btn" @click="incrementCancel" style="float: right;">取消</Button>
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
				data_columns: [
					{
					    title: '序号',
					    render: (h, params) => {
					    	return h('div', [
					    		h('span', {
					    			
					    		},params.index + 1),
					    	])
					    }
					},
					{
					    title: '源字段名',
					    render: (h, params) => {
					    	return h('div', [
					    		h('i-input', {
					    		    props: {
					    				value: "付婷婷"
					    			},
					    		    on: {
					    		        'on-change': () => {
					    		            
					    		        }
					    		    }
					    		})
					    	])
					    }
					},
					{
					    title: '别名',
					    render: (h, params) => {
					    	return h('div', [
					    		h('i-input', {
					    		    props: {
					    				value: "名称"
					    			},
					    		    on: {
					    		        'on-change': () => {
					    		            
					    		        }
					    		    }
					    		})
					    	])
					    }
					},
					{
					    title: '字段类型',
					    render: (h, params) => {
					    	return h('div', [
					    		h('i-select', {
					    		    props: {
					    				value: "1"
					    			},
					    		    on: {
					    		        'on-change': () => {
					    		            
					    		        }
					    		    }
					    		}, [
					    			h('Option', {
					    				props: {
					    					value: "1"
					    				}
					    			}, '字符型'),
					    			h('Option', {
					    				props: {
					    					value: "2"
					    				}
					    			}, '日期型')
					    		]),
					    	])
					    }
					},
					{
					    title: '字段类型',
					    render: (h, params) => {
					    	return h('div', [
					    		h('i-select', {
					    		    props: {
										value: "1"
									},
					    		    on: {
					    		        'on-change': () => {
					    		            
					    		        }
					    		    }
					    		}, [
									h('Option', {
										props: {
											value: "1"
										}
									}, '字符型'),
									h('Option', {
										props: {
											value: "2"
										}
									}, '日期型')
								]),
					    	])
					    }
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
								h('i', {
								    class: "iconfont icondelete",
								    attrs: {
								        title:'删除'
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
									class: "click",
								},'删除'),
							])
						}
					},
				],
				data_data: [
					{
						
					}
				]
			}
		},
		components: {
			Modal,
		},
		methods: {
			show() {
				this.modalVisible = true;
			},
			changeShow(type) {
				this.active_table = type;
			},
			initData() {
				this.current = 0;
				this.formItem = {
					name: "",
					agreement: "1",
					vertical: "1",
					data_id: "1"
				}
			},
			create() {
				const params = {
					"data_id": this.formItem.data_id,
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
