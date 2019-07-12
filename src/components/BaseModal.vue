<template>
    <Modal ref="modal" v-model="showModal" :width="width"
        :title="title" :transfer="transfer"
        :ok-text = '_okText'
        :cancel-text = '_cancelText'
        @on-ok="ok"  
        @on-cancel="cancel"
        :loading="load"
        :mask-closable = "maskClosable" 
        :class-name="_className">

        <p slot="header" ref="modalhead" class="se-modal-header">
            <i v-if="icon" ref="icon" class="iconfont se-icon orange" style="font-weight: 400;margin-right: 5px;font-size: 20px;"></i>
            {{title}}
        </p>
        <slot></slot>
        <div v-if = "noFooter" slot="footer"></div>
    </Modal>
</template>
<script>
export default {
    props: ['loading','modalVisible', 'title', 'icon', "width","height", 'okText', 'cancelText', 'noFooter', 'className', 'transfer'],
    data() {
        return {
            load: true,
            maskClosable: false,
        }
    },
    computed: {
        _okText() {
            return this.okText || '确定';
        },
        _cancelText() {
            return this.cancelText || '取消';
        },
		_loading: {
			get() {
				return this.loading || this.load;
			},
			set(value) {
				return value;
			}
		},
//         _loading() {
//         	return this.loading || this.load;
//         },
        _className() {
			return " " + this.className + " vertical-center-modal" || "vertical-center-modal"
//      	return " " + this.className;
        },
        showModal: {
            get() {
                return this.modalVisible;
            },
            set() {
                
            }
        }
    },
    mounted() {
		if(this.icon) {
			this.$refs.icon.innerHTML = this.icon;
		}
        this.$nextTick(() => {
            if(this.noFooter) {
                const topNode = this.$refs.modalhead.parentNode.parentNode;
                if(topNode) {
                    const node = topNode.querySelector(".ivu-modal-footer");
                    node.style.height = '0px';
                    node.style.display = 'none'
                }
            }
        });
    },
    methods: {
        ok() {
            this.$emit("incrementOk");  
            const _this = this;
            if(_this.loading) {
            	// _this._loading = false;
	            
            } else {
            	setTimeout(() => {
            		_this.load = false;
					_this.$nextTick(() => {
                        _this.load = true;
                    });
            	},100)
            }
        },
		setLoading() {
			//iviwe模态框想要控制点击确定不关闭，loading方法
			const _this = this;
			setTimeout(() => {
				_this.load = false;
				_this.$nextTick(() => {
					_this.load = true;
				});
			},100)
		},
        cancel() {
            this.$emit("incrementCancel");
        },
        setIcon(icon) {
            this.$refs.icon.innerHTML = icon;
        }
    }

}
</script>
<style lang="less" scoped>

.se-modal-header {
 //   color:@base_color;
    // padding: 10px 10px;
    // box-sizing: content-box;
    // width: calc(~"100% - 20px");
}

</style>

