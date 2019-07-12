<style lang="less">
	@import './login.less';
</style>

<template>
	<div class="login">
		<p class="title">超擎时空 · 流数据 (物联网) 平台</p>
		<p class="depiction">—— 在时间长河中探寻万物互联的奥秘</p>
		<div v-if = "!regist_show" class="login-con">
			<Tabs type="card" >
				<TabPane name="login" label="登录">
					<Form class='se-form' :rules="rules" :model="formValidate" :label-width="0" ref="form">
						<FormItem prop="name">
							<Input prefix="ios-contact" @keyup.enter.native="login()" v-model="formValidate.name" placeholder="用户名">
								<Icon custom="iconfont iconyonghu1" slot="prefix" />
							</Input>
						</FormItem>
						<FormItem prop="password">
							<Input type="password" @keyup.enter.native="login()" prefix="ios-contact" v-model="formValidate.password" placeholder="密码">
								<Icon type="md-unlock" slot="prefix" />
							</Input>
						</FormItem>
						<!-- <FormItem prefix="ios-contact" prop="code">
							<Input v-model="formValidate.code" placeholder="验证码" class="code-input">
								<Icon type="ios-contact" slot="prefix" />
							</Input>
							<img @click="getCaptcha" :src="img_src" class="code-img" title="点击刷新" />
						</FormItem> -->
						<FormItem prop="remember_psd">
							<Checkbox v-model="formValidate.remember_psd">记住密码</Checkbox>
							<a href = "javascript:void(0);" style="font-size: 15px;float: right;color:white" @click="reset">清空</a>
						</FormItem>
						<Button class="regist-btn" @click = "regist_show = true;">注册</Button>
						<Button class="login-btn" @click="login">登录</Button>
					</Form>
				</TabPane>
				
			</Tabs>
		</div>
		<regist @back="regist_show=false" v-if = "regist_show"></regist>
	</div>
</template>

<script>
	import {
		mapActions
	} from 'vuex'
	import { setCookie, getCookie, delCookie } from '@/libs/util';
	import { setLocalStore, getLocalStore, removeLocalStore,clear} from '@/libs/local';
	import config from '@/config';
	import { Login } from '@/api/data';
	import {hex_md5} from '@/libs/md5'
	import Regist from './Regist.vue';
	export default {
		data() {
			const _this = this;
			const rules = {
				nameValidator: (rule, value, callback)=> {
					const reg = /^[a-z0-9A-Z]{2,20}$/;
					if(!_this.formValidate.name) {
						callback(new Error('账号不能为空'));
					} else if(!reg.test(value)) {
						callback(new Error('账号格式错误！(2-20位数字/字母/非特殊字符)'));
					} else {
						callback();
					}
				}
			}
			return {
				formValidate: {
					name: "",
					password: "",
					cpode: "",
					remember_psd: false,
					uid: null
				},
				rules: {
					name: [
						{validator: rules.nameValidator, trigger: 'blur'},
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur'},
						{ required: true, message: '密码长度错误！(6-20位字符)', trigger: 'blur',min: 6,max: 20}
					]
				},
				img_src: "",
				regist_show:false
			}
		},
		mounted() {
			if(getCookie("user_name") && getCookie("user_password")) {
				this.formValidate.name = getCookie("user_name");
				this.formValidate.password = getCookie("user_password");
				this.formValidate.remember_psd = true;
			}
			this.getCaptcha();
		},
		components: {
			Regist
		},
		methods: {
			...mapActions([
				
			]),
			reset() {
				this.$refs.form.resetFields();
			},
			login() {
				const params = {
                    user_name: this.formValidate.name,
                    // verify_code: this.uid,
                    password: hex_md5(
						this.formValidate.name.toLowerCase() + '_' 
						+ hex_md5(this.formValidate.password)
// 						 + '_' + 
// 						this.formValidate.cpode.toLowerCase()
					)
                };
				const _this = this;
				this.$refs['form'].validate((valid)=> {
					if(valid) {
						Login(params).then((res) => {
							_this.$store.commit("setUser",res);
							if(_this.formValidate.remember_psd) {
								setCookie("user_name", _this.formValidate.name);
								setCookie("user_password", this.formValidate.password)
							} else {
								delCookie("user_name");
								delCookie("user_password");
							}
							setLocalStore('user',JSON.stringify(res))
							setLocalStore('token',res.token)
							_this.$Message.success("登录成功，即将跳转至首页");
							setTimeout(() => {
								_this.$router.push({
									name: "device"
								})
							},1000)
						})
						.catch((error) => {
							this.$Message.error('登录失败！请检查输入。')
						})
					} else {
						this.$Message.error("表单格式错误，请检查所有输入项！")
					}
				})
			},
			guid(isShort) {
				var s = (isShort ? 'yxxxxxxyxx' : 'xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function (c) {
					var r = Math.random() * 16 | 0;
					var v = c === 'x' ? r : r & 0x3 | 0x8;
					return v.toString(16);
				});
				return s.toLowerCase();
			},
			getCaptcha() {
				const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
				this.uid = this.guid();
                const paramsStr = '?uid=' + this.uid;
                const uri = baseUrl + "captcha" + paramsStr;
                this.img_src = uri;
			}
		}
	}
</script>

<style>

</style>
