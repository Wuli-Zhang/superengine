<style lang="less">
@import "./regist.less";
</style>

<template>
  <div class = "regist-parent">
    <div style="" class="regist-wrapper">
      
      <div class="header">注册</div>
      <Form class="se-form" :model="formValidate" ref="reg_form" :rules="ruleValidate">
        <FormItem class="regist-form-item" label="账号" prop="account">
          <Input  v-model="formValidate.account" placeholder="请输入账号名称">
            <Icon custom="iconfont iconyonghu1" slot="prefix" />
          </Input>
        </FormItem>
        <FormItem class="regist-form-item" label="昵称" prop="name">
          <Input  v-model="formValidate.name" placeholder="请输入昵称">
           <Icon custom="iconfont iconnicheng" slot="prefix" />
           </Input>
        </FormItem>
        <FormItem class="regist-form-item" label="手机号" prop="cellphone">
          <Input type="tel" prefix="ios-call" v-model="formValidate.cellphone" placeholder="请输入手机号">
            <Icon custom="iconfont iconiconfontshouji" slot="prefix" />
          </Input>
        </FormItem>
        <FormItem class="regist-form-item" label="邮箱" prop="email">
          <Input type="email" prefix="ios-at" v-model="formValidate.email" placeholder="请输入邮箱">
           <Icon custom="iconfont iconyouxiang" slot="prefix" />
          </Input>
        </FormItem>
        <FormItem class="regist-form-item" label="性别" prop="gender">
          <RadioGroup v-model="formValidate.gender">
            <Radio label="0">男</Radio>
            <Radio label="1">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem class="regist-form-item" label="语言" prop="language">
          <Select v-model="formValidate.language">
            <Option value="ZHCN">简体中文(zh-CN)</Option>
            <Option value="ENUS">美式英语(en-US)</Option>
          </Select>
        </FormItem>

        <FormItem class="regist-form-item" label="密码" prop="password">
          <Input
            type="password"
            prefix="md-unlock"
            v-model="formValidate.password"
            placeholder="请输入密码"
          >
          </Input>
        </FormItem>
        <FormItem class="regist-form-item" label="确认密码" prop="password_check">
          <Input
            type="password"
            prefix="md-unlock"
            v-model="formValidate.password_check"
            placeholder="再次输入密码"
          >

          </Input>
        </FormItem>
        <FormItem>
          <Checkbox v-model="formValidate.agree">同意</Checkbox>
          <a style="color:#68F7F5" @click="agree_show = true">[用户协议]</a>
        </FormItem>

        <!-- <Button class="regist-btn" @click="regist">注册</Button> -->
        <Button class="login-btn" @click = "$emit('back')">登录</Button>
        <Button class="regist-btn" @click="regist">注册</Button>
      </Form>
      <Modal v-model="agree_show" title="用户协议">
        <div class="Agreement">
          <h1 style="margin-bottom: 20px;">用户服务协议</h1>
          <div class="agr-1 agr-div">
            <h3>一、特别提示</h3>
            <p>在此特别提醒您（用户）在注册成为超擎慧眼用户之前，请认真阅读本《用户服务协议》（以下简称“协议”），确保您充分理解本协议中各条款。请您审慎阅读并选择接受或不接受本协议。除非您接受本协议所有条款，否则您无权注册、登录或使用本协议所涉服务。您的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。</p>
            <p>本协议约定超擎与用户之间关于“超擎慧眼”服务（以下简称“服务”）的权利义务。“用户”是指注册、登录、使用本服务的个人。本协议可由超擎随时更新，更新后的协议条款一旦公布即代替原来的协议条款，恕不再另行通知，用户可在本网页中查阅最新版协议条款。在修改协议条款后，如果用户不接受修改后的条款，请立即停止使用超擎慧眼提供的服务，用户继续使用超擎慧眼提供的服务将被视为接受修改后的协议。</p>
          </div>
          <div class="agr-2 agr-div">
            <h3>二、账号注册</h3>
            <p>1、用户在使用本服务前需要注册一个“超擎慧眼”账号。“超擎慧眼”账号应当使用手机号码绑定注册，请用户使用尚未与“超擎慧眼”账号绑定的手机号码，以及未被超擎慧眼根据本协议封禁的手机号码注册“超擎慧眼”账号。超擎慧眼可以根据用户需求或产品需要对账号注册和绑定的方式进行变更，而无须事先通知用户。</p>
            <p>2、如果注册申请者有被超擎慧眼封禁的先例或涉嫌虚假注册及滥用他人名义注册，及其他不能得到许可的理由， 超擎慧眼将拒绝其注册申请。</p>
            <p>3、在用户注册及使用本服务时，超擎慧眼需要搜集能识别用户身份的个人信息以便超擎慧眼可以在必要时联系用户，或为用户提供更好的使用体验。超擎慧眼搜集的信息包括但不限于用户的姓名、邮箱、手机号；超擎慧眼同意对这些信息的使用将受限于第三条用户个人隐私信息保护的约束。</p>
          </div>
          <div class="agr-3 agr-div">
            <h3>三、账户安全</h3>
            <p>1、用户一旦注册成功，成为超擎慧眼的用户，将得到一个用户名和密码，并有权利使用自己的用户名及密码随时登陆超擎慧眼。</p>
            <p>2、用户对用户名和密码的安全负全部责任，同时对以其用户名进行的所有活动和事件负全责。</p>
            <p>3、用户不得以任何形式擅自转让或授权他人使用自己的超擎慧眼用户名。</p>
            <p>4、如果用户泄漏了密码，有可能导致不利的法律后果，因此不管任何原因导致用户的密码安全受到威胁，应该立即和超擎客服人员取得联系，否则后果自负。</p>
          </div>
          <div class="agr-4 agr-div">
            <h3>四、用户声明与保证</h3>
            <p>1、用户承诺其为具有完全民事行为能力的民事主体，且具有达成交易履行其义务的能力。</p>
            <p>2、用户有义务在注册时提供自己的真实资料，并保证诸如手机号码、姓名、所在地区等内容的有效性及安全性，保证超擎慧眼工作人员可以通过上述联系方式与用户取得联系。同时，用户也有义务在相关资料实际变更时及时更新有关注册资料。</p>
            <p>3、用户通过使用超擎慧眼的过程中所制作、上载、复制、发布、传播的任何内容，包括但不限于账号头像、名称、用户说明等注册信息及认证资料，或文字、语音、图片、视频、图文等发送、回复和相关链接页面，以及其他使用账号或本服务所产生的内容，不得违反国家相关法律制度，包含但不限于如下原则：</p>
            <p>（1）反对宪法所确定的基本原则的；</p>
            <p>（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
            <p>（3）损害国家荣誉和利益的；</p>
            <p>（4）煽动民族仇恨、民族歧视，破坏民族团结的；</p>
            <p>（5）破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
            <p>（6）散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
            <p>（7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
            <p>（8）侮辱或者诽谤他人，侵害他人合法权益的；</p>
            <p>（9）含有法律、行政法规禁止的其他内容的。</p>
            <p>4、用户不得利用“超擎慧眼”账号或本服务制作、上载、复制、发布、传播下干扰“超擎慧眼”正常运营，以及侵犯其他用户或第三方合法权益的内容：</p>
            <p>（1）含有任何性或性暗示的；</p>
            <p>（2）含有辱骂、恐吓、威胁内容的；</p>
            <p>（3）含有骚扰、垃圾广告、恶意信息、诱骗信息的；</p>
            <p>（4）涉及他人隐私、个人信息或资料的；</p>
            <p>（5）侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；</p>
            <p>（6）含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息。</p>
          </div>
          <div class="agr-5 agr-div">
            <h3>五、服务内容</h3>
            <p>1、超擎慧眼具体服务内容由超擎根据实际情况提供，包括但不限于：</p>
            <p>（1）数据接入、组织、管理、发布、浏览、展示、应用、分享服务等；</p>
            <p>（2）在线咨询服务；</p>
            <p>（3）服务商收入结算和用户支付费用：具体金额以超擎慧眼产生的统计数据为准。</p>
            <p>2、超擎有权维护或删除用户发布/传播的涉嫌违法或违反社会主义精神文明，或者被超擎认为不妥当的内容（包括但不限于文字、语音、图片、视频、图文等）。</p>
          </div>
          <div class="agr-6 agr-div">
            <h3>六、服务的终止</h3>
            <p>1、在下列情况下，超擎有权终止向用户提供服务：</p>
            <p>（1）在用户违反本服务协议相关规定时，超擎有权终止向该用户提供服务。如该用户再一次直接或间接或以他人名义注册为用户的，一经发现，超擎有权直接单方面终止向该用户提供服务；</p>
            <p>（2）如超擎通过用户提供的信息与用户联系时，发现用户在注册时填写的联系方式已不存在或无法接通，超擎以其它联系方式通知用户更改，而用户在三个工作日内仍未能提供新的联系方式，超擎有权终止向该用户提供服务；</p>
            <p>（3）用户不得通过程序或人工方式进行刷量或作弊，若发现用户有作弊行为，超擎慧眼将立即终止服务；</p>
            <p>（4）一旦超擎发现用户提供的数据或信息中含有虚假内容，超擎有权随时终止向该用户提供服务；</p>
            <p>（5）本服务条款终止或更新时，用户明示不愿接受新的服务条款；</p>
            <p>（6）其它超擎认为需终止服务的情况。</p>
            <p>2、服务终止后，超擎慧眼没有义务为用户保留原账号中或与之相关的任何信息，或转发任何未曾阅读或发送的信息给用户或第三方。</p>
          </div>
          <div class="agr-7 agr-div">
            <h3>七、服务的变更、中断</h3>
            <p>1、鉴于网络服务的特殊性，用户需同意超擎慧眼会变更、中断部分或全部的网络服务，并删除（不再保存）用户在使用过程中提交的任何资料，而无需通知用户，也无需对任何用户或任何第三方承担任何责任。</p>
          </div>
          <div class="agr-8 agr-div">
            <h3>八、服务条款修改</h3>
            <p>1、超擎有权随时修改本服务条款的任何内容，一旦本服务条款的任何内容发生变动，超擎将会通过适当方式向用户提示修改内容。</p>
            <p>2、如果不同意超擎对本服务条款所做的修改，用户有权停止使用网络服务。</p>
            <p>3、如果用户继续使用网络服务，则视为用户接受超擎对本服务条款所做的修改。</p>
          </div>
          <div class="agr-9 agr-div">
            <h3>九、免责与赔偿声明</h3>
            <p>1、若超擎慧眼需要定期或不定期地对提供网络服务的平台进行检测或者更新，如因此类情况而造成网络服务在合理时间内的中断，超擎无需为此承担任何责任。</p>
            <p>已经明示其服务提供方式发生变更并提醒用户应当注意事项，用户未按要求操作所产生的一切后果由用户自行承担。</p>
            <p>2、用户明确同意其使用超擎慧眼所存在的风险将完全由其自己承担，因其使用超擎慧眼而产生的一切后果也由其自己承担。</p>
            <p>3、用户同意保障和维护超擎及其他用户的利益，由于用户在使用超擎慧眼有违法、不真实、不正当、侵犯第三方合法权益的行为，或用户违反本协议项下的任何条款而给超擎及任何其他第三方造成损失，用户同意承担由此造成的损害赔偿责任。</p>
          </div>
          <div class="agr-10 agr-div">
            <h3>十、隐私声明</h3>
            <p>1、适用范围：</p>
            <p>（1）在用户注册超擎慧眼账户时，根据要求提供的个人注册信息；</p>
            <p>（2）在用户使用超擎慧眼，或访问其相关网页时，超擎慧眼自动接收并记录的用户浏览器上的服务器数值，包括但不限于IP地址等数据及用户要求取用的网页记录。</p>
            <p>2、信息使用：</p>
            <p>（1）超擎不会向任何人出售或出借用户的个人信息，除非事先得到用户的许可。</p>
            <p>（2）超擎亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播用户的个人信息。任何用户如从事上述活动，一经发现，超擎有权立即终止与该用户的服务协议，查封其账号。</p>
            <p>（3）为达到服务用户的目的，超擎可能通过使用用户的个人信息，向用户提供服务，包括但不限于向用户发出产品和服务信息，或者与超擎合作伙伴共享信息以便他们向用户发送有关其产品和服务的信息。</p>
            <p>3、信息披露：用户的个人信息将在下述情况下部分或全部被披露：</p>
            <p>（1）经用户同意，向第三方披露；</p>
            <p>（2）根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；</p>
            <p>（3）如果用户出现违反中国有关法律或者网站政策的情况，需要向第三方披露；</p>
            <p>（4）为提供用户所要求的产品和服务，而必须和第三方分享用户的个人信息；</p>
            <p>（5）其它超擎根据法律或者网站政策认为合适的披露；</p>
          </div>
          <div class="agr-11 agr-div">
            <h3>十一、其他</h3>
            <p>1、超擎郑重提醒用户注意本协议中免除超擎责任和限制用户权利的条款，请用户仔细阅读，自主考虑风险。未成年人应在法定监护人的陪同下阅读本协议。</p>
            <p>2、本协议的效力、解释及纠纷的解决，适用于中华人民共和国法律。若用户和超擎之间发生任何纠纷或争议，首先应友好协商解决，协商不成的，用户同意将纠纷或争议提交超擎住所地有管辖权的人民法院管辖。</p>
            <p>3、本协议的任何条款无论因何种原因无效或不具可执行性，其余条款仍有效，对双方具有约束力。</p>
            <p>4、本协议最终解释权归苏州超擎图形软件科技发展有限公司（简称“超擎”）所有，并且保留一切解释和修改的权力。</p>
            <p>5、本协议从2018年04月13日起适用。</p>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { setCookie, getCookie, delCookie } from "@/libs/util";
import config from "@/config";
import { Regist } from "@/api/data";
import { hex_md5 } from "@/libs/md5";
import { debug } from "util";
export default {
  data() {
    const pwdCheckValidate = (rule, value, callback, source, options) => {
      if (this.formValidate.password != value) {
        callback(new Error("新密码和确认密码应相同"));
      } else {
        callback();
      }
    };

    return {
      formValidate: {
        account: "",
        name: "",
        cellphone: "",
        email: "",
        language: "ZHCN",
        timezoom: "Asia/Shanghai",
        password: "",
        password_check: "",
        gender: "0",
        agree: true
      },
      agree_show: false,
      img_src: "",
      ruleValidate: {
        //--表单验证规则
        account: [
          { required: true, message: "账号不能为空", trigger: "blur" },
          {
            validator(rule, value, callback, source, options) {
              var errors = [];
              const n = /^[a-z0-9]+$/;
              if (n.test(value) && value.length < 21 && value.length > 1) {
              } else {
                errors.push("用户名为2-20位数字或小写字母");
              }
              callback(errors);
            }
          }
        ],
        name: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
        cellphone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            validator(rule, value, callback, source, options) {
              var errors = [];

              if (!/^1[34578]\d{9}$/.test(value))
                errors.push("请输入正确的手机号");

              callback(errors);
            }
          }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            validator(rule, value, callback, source, options) {
              var errors = [];
              if (!/^(\w){6,20}$/.test(value)) {
                errors.push("密码为6-20个字母或数字");
              }
              callback(errors);
            }
          }
        ],
        password_check: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { validator: pwdCheckValidate }
        ]
      }
    };
  },
  mounted() {},
  components: {},
  methods: {
    ...mapActions([]),
    regist() {
      this.$refs.reg_form.validate(valid => {
        if (valid) {

          if(!this.formValidate.agree)
          {
             this.$Message.info("请同意用户协议");
             return;
          }

          const {
            name,
            account,
            cellphone,
            gender,
            password,
            email
          } = this.formValidate;

          var post_data = {
            name,
            account,
            cellphone,
            gender,
            password,
            email
          };

          Regist(post_data)
            .then(d => {
              this.$Message.info("注册成功！");
              this.reset();
              this.$emit("back");
            })
            .catch(e => {
              this.$Message.error(`注册失败！原因是\n ${e.message}`);
            });
        } else {
          this.$Message.error("请输入正确的信息");
        }
      });
    },
    reset() {
      this.$refs.reg_form.resetFields();
    },
    
    guid(isShort) {
      var s = (isShort
        ? "yxxxxxxyxx"
        : "xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx"
      ).replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0;
        var v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      return s.toLowerCase();
    },
    getCaptcha() {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro;
      this.uid = this.guid();
      const paramsStr = "?uid=" + this.uid;
      const uri = baseUrl + "captcha" + paramsStr;
      this.img_src = uri;
    }
  }
};
</script>

<style>
</style>
