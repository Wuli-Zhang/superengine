<template>
  <div>
    <Modal
      class = "create-update-event-modal" 
      :class = "{'disabled':mode == 'preview'}"
      noFooter="true"
      width="541"
      :title="modal_title"
      ref="modal"
      :modalVisible="modalVisible"
      @incrementOk="incrementOk"
      @incrementCancel="incrementCancel"
    >
      <div class="modal-body">
        <Steps class="create-steps" :current="current">
          <Step content="第一步"></Step>
          <Step content="第二步"></Step>
          <Step content="第三步"></Step>
        </Steps>
        <Form
          class="se-form"
          ref="type_from"
          :model="formItem"
          :rules="formRules"
          :label-width="110"
        >
          <Row class="modal-row" v-show="current === 0" type="flex" justify="center" align="middle">
            <Col span="13">
              <FormItem prop="name" label="事件名称" style="width: 100%">
                <Input style="width:" v-model="formItem.name" placeholder="请输入事件名称"/>
              </FormItem>
            </Col>
            <Col span="13">
              <FormItem label="事件模型" prop="model" style="width: 100%">
                <Select v-model="formItem.model">
                  <Option :value="1">定值越界</Option>
                </Select>
                <Poptip trigger="hover" content="content" style="margin: 0 5px;">
                  <i class="iconfont click handle">&#xe65b;</i>
                  <div class="api" slot="content">这里是提示内容</div>
                </Poptip>
              </FormItem>
            </Col>
            <Col span="13">
              <FormItem label="备注" prop="desc" style="width: 100%">
                <Input
                  v-model="formItem.desc"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 5}"
                  placeholder="请输入备注内容"
                />
              </FormItem>
            </Col>
          </Row>
          <Row class="modal-row" v-show="current === 1" type="flex" justify="center" align="middle">
            <Col span="13">
              <FormItem label="监测字段" prop="monitor_field" style="width: 100%">
                <Select v-model="formItem.monitor_field">
                  <!-- <Option value="1">默认字段</Option>
                  <Option value="2">xxxx</Option>
                  <Option value="3">xxxxx</Option>-->
                  <Option
                    v-for="item in number_fields"
                    :key="item.path"
                    :value="item.path"
                  >{{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="13">
              <table class="condition-table">
                <tr>
                  <td @click="onAddCondition">
                    <Icon custom="iconfont iconxinjian"></Icon>添加条件
                  </td>
                  <td>判定方式</td>
                  <td>阈值范围</td>
                  <td>消息类型</td>
                </tr>
                <tr
                  :key="index"
                  v-for="(item,index) in formItem.condition"
                  v-on:mouseenter="processTrMouseEnter(index)"
                  v-on:mouseleave="processTrMouseLeave"
                >
                  <td>触发条件</td>
                  <td>
                    <Select @on-change="onConditionChange(index)" v-model="item.check_type">
                      <Option value="1">大于</Option>
                      <Option value="2">大于等于</Option>
                      <Option value="3">小于</Option>
                      <Option value="4">小于等于</Option>
                      <Option value="5">等于</Option>
                      <Option value="6">不等于</Option>
                      <Option value="7">区间内</Option>
                      <Option value="8">区间外</Option>
                    </Select>
                  </td>
                  <td>
                    <InputNumber
                      style="width:173px"
                      v-show="!isIntervalType(item.check_type)"
                      v-model="item.values[0]"
                      placeholder="请输入数值"
                    ></InputNumber>

                    <InputNumber
                      v-show="isIntervalType(item.check_type)"
                      v-model="item.values[0]"
                      placeholder="最小值"
                    ></InputNumber>
                    <span class="value-splitor" v-show="isIntervalType(item.check_type)">-</span>
                    <InputNumber
                      v-show="isIntervalType(item.check_type)"
                      v-model="item.values[1]"
                      placeholder="最大值"
                    ></InputNumber>
                  </td>
                  <td>
                    <Select v-model="item.type">
                      <Option value="1">通知</Option>
                      <Option value="2">告警</Option>
                      <Option value="3">紧急</Option>
                    </Select>
                  </td>
                  <td>
                    <Icon
                      :class="{'active':index == activeHoverLine}"
                      class="remove-icon"
                      @click="formItem.condition.splice(index,1)"
                      v-show="index!=0"
                      custom="iconfont iconyichu"
                    ></Icon>
                  </td>
                </tr>
              </table>
            </Col>
          </Row>
          <Row class="modal-row" v-show="current === 2" type="flex" justify="center" align="middle">
            <Col span="13">
              <!-- <FormItem label="消息类型" prop="msg_type" style="width: 100%">
                <Select v-model="formItem.msg_type">
                  <Option value="1">默认字段</Option>
                  <Option value="2">xxxx</Option>
                  <Option value="3">xxxxx</Option>
                </Select>
              </FormItem>-->
              <div>预告警信息发送方式</div>
              <div class="contact-wrapper">
                <Poptip trigger="hover" content="content" style="margin: 0 5px;">
                  <i class="iconfont click handle">&#xe65b;</i>
                  <div class="api" slot="content">这里是提示内容</div>
                </Poptip>
                <Checkbox v-model="formItem.send_email.agree">邮箱</Checkbox>
                <!-- <FormItem class = "angry-form-item" prop="name"  style="width: 100%"> -->
                <Input style="width:" v-model="formItem.send_email.value" placeholder="请输入邮箱"/>
                <a style="margin-left:20px;">设置</a>
              </div>
              <div class="contact-wrapper">
                <Poptip trigger="hover" content="content" style="margin: 0 5px;">
                  <i class="iconfont click handle">&#xe65b;</i>
                  <div class="api" slot="content">这里是提示内容</div>
                </Poptip>
                <Checkbox v-model="formItem.send_tel.agree">手机</Checkbox>
                <!-- <FormItem class = "angry-form-item" prop="name"  style="width: 100%"> -->
                <Input style="width:" v-model="formItem.send_tel.value" placeholder="请输入手机号"/>
              </div>
              <div style="padding-left:130px">
                <Poptip trigger="hover" content="content" style="margin: 0 5px;">
                  <i class="iconfont click alert">&#xe66d;</i>
                  <div class="api" slot="content">这里是提示内容</div>
                </Poptip>
                <span>多个邮箱或号码用“；”分号隔开</span>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <Row class="modal-foot">
        <Button
          class="se-btn"
          :disabled="loading"
          @click="next"
          type="primary"
          style="float: right;margin-left: 20px;"
        >{{okText}}</Button>
        <Button class="se-btn" @click="back" style="float: right;">{{cancelText}}</Button>
      </Row>
    </Modal>
  </div>
</template>

<script>
import {
  getDeviceType,
  createDeviceType,
  updateDeviceType,
  queryDeviceGroup,
  createDeviceGroup
} from "@/api/data";
import Modal from "../../components/BaseModal.vue";
import { transferDeviceTypeConfigObject2Arr } from "@/libs/device";

export default {
  data() {
    return {
      mode: "create",
      modalVisible: false,
      groupVisible: false,
      okText: "下一步",
      cancelText: "取消",
      loading: false,
      current: 0,
      formItem: {
        name: "",
        model: 1,
        desc: "",
        monitor_field: null,
        /**
         *  1 大于
            2	大等于
            3	小于
            4	小等于
            5	等于
            6	不等于
            7	区间内
            8	区间外
         */
        condition: [
          {
            check_type: "1",
            values: [0],
            type: "1"
          }
        ],
        // msg_type: 1,
        send_email: {
          agree: false,
          value: ""
        },
        send_tel: {
          agree: false,
          value: ""
        }
      },
      formRules: {
        name: [
          {
            required: true,
            message: "名称长度为2-20",
            min: 2,
            max: 20,
            trigger: "blur"
          }
        ]
      },
      group_list: [],
      groupFormItem: {
        name: ""
      },
      activeHoverLine: null,
      device_type_data: null
    };
  },
  computed: {
    modal_title: function() {
      return this.mode == "create" ? "创建事件" : this.mode =="preview" ? "查看事件" : "更新事件";
    },
    number_fields: function() {
      var ret = this.device_type_data
        ? transferDeviceTypeConfigObject2Arr(
            this.device_type_data.config
          ).filter(d => {
            return d.type == "number";
          })
        : [];
      return ret;
    }
  },
  components: {
    Modal
  },
  props: ["device_type_id"],
  mounted() {
    window.testpush = this;
  },
  methods: {
    show(sn,is_preview) {
      this.mode = is_preview ? 'preview' : sn != undefined ? "update" : "create";
      this.warnning_sn = sn;
      this.getDeviceTypeData();

      this.modalVisible = true;
    },
    isIntervalType(check_type) {
      return check_type == "7" || check_type == "8";
    },
    getDeviceTypeData() {
      Ajax.getDeviceType(this.device_type_id)
        .then(res => {
          this.device_type_data = res;
          if (this.mode == "update" || this.mode == "preview") {
            var needUpdatePlugin = this.device_type_data.plugin_config.filter(
              d => {
                return d.sn == this.warnning_sn;
              }
            )[0];
            this.formItem.name = needUpdatePlugin.show_name;
            this.formItem.model = 1;
            this.formItem.monitor_field = needUpdatePlugin.path;
            this.formItem.condition = needUpdatePlugin.check_field.map(f => {
              return {
                check_type: f.check_type.toString(),
                values: [f.min, f.max || 0],
                type: f.type.toString()
              };
            });
            var emails = "";
            var cellphones = "";
            needUpdatePlugin.push_list.map(p => {
              if (p.type == "Email") {
                emails += p.id;
                emails += ";";
              } else if (p.type == "Cellphone") {
                cellphones += p.id;
                cellphones += ";";
              }
            });
            if (emails) {
              this.formItem.send_email = {
                agree: true,
                value: emails.substr(0, emails.length - 1)
              };
            }
            if (cellphones) {
              this.formItem.send_tel = {
                agree: true,
                value: cellphones.substr(0, cellphones.length - 1)
              };
            }
          }
        })
        .catch(error => {
          _this.$Message.error("获取设备信息失败");
        });
    },
    initData() {
      this.current = 0;
      this.okText = "下一步";
      this.formItem = {
        name: "",
        model: 1,
        desc: "",
        monitor_field: null,
        condition: [
          {
            check_type: "1",
            values: [0],
            type: "1"
          }
        ],
        // msg_type: 1,
        send_email: {
          agree: false,
          value: ""
        },
        send_tel: {
          agree: false,
          value: ""
        }
      };
    },
    processTrMouseEnter(index) {
      this.activeHoverLine = index;
    },
    processTrMouseLeave() {
      this.activeHoverLine = null;
    },
    onAddCondition() {
      this.formItem.condition.push({
        check_type: "1",
        values: [0],
        type: "1"
      });
    },
    onConditionChange(index) {
      var is_in_section = this.isIntervalType(
        this.formItem.condition[index].check_type
      );

      if (is_in_section) {
        this.formItem.condition[index].values.push(0);
      } else {
        this.formItem.condition[index].values.pop();
      }
    },
    next() {
      this.$refs["type_from"].validate(valid => {
        if (valid) {
          if (this.current === 1) {
            if (!this.checkCondition()) {
              return;
            }
            this.current++;
            this.okText = this.mode == "create" ? "创建" : this.mode == "preview" ? "退出" : "更新";
            this.cancelText = "上一步";
          } else if (this.current === 2) {
            if (!this.checkContact()) {
              return;
            }
            if(this.mode == 'preview')
            {
              this.incrementCancel();
              return ;
            }
            this.createOrUpdate();
          } else {
            this.current++;
            return;
          }
        } else {
          this.$Message.error("请核对输入信息！");
          return;
        }
      });
    },
    checkCondition() {
      var right = true;

      if (!this.formItem.monitor_field) {
        right = false;
        this.$Message.error("请选择监控字段！");
      }

      this.formItem.condition.map((cc, index) => {
        if (this.isIntervalType(cc.check_type) && cc.values[0] > cc.values[1]) {
          right = false;
          this.$Message.error(`第${index + 1}个条件，最大值不能小于最小值！`);
        }
      });

      return right;
    },
    checkContact() {
      function checkEmail(str) {
        var emails = str.split("；");
        if (emails.length == 1) {
          emails = str.split(";");
        }

        var right = true;
        for (var i = 0; i < emails.length; i++) {
          var reg = new RegExp(
            /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g
          );
          if (!reg.test(emails[i])) {
            right = false;
            this.$Message.error(`第${i + 1}个邮箱格式有误，请检查！`);
          }
        }
        return right;
      }
      function checkCellPhone(str) {
        var cellphones = str.split("；");
        if (cellphones.length == 1) {
          cellphones = str.split(";");
        }

        var right = true;
        for (var i = 0; i < cellphones.length; i++) {
          if (!/^1[3456789]\d{9}$/.test(cellphones[i])) {
            right = false;
            this.$Message.error(`第${i + 1}个手机号格式有误，请检查！`);
          }
        }
        return right;
      }
      if (!this.formItem.send_email.agree && !this.formItem.send_tel.agree) {
        this.$Message.error("邮箱和手机至少留一个");
        return false;
      }
      if (this.formItem.send_email.agree) {
        return checkEmail.call(this, this.formItem.send_email.value);
      }
      if (this.formItem.send_tel.agree) {
        return checkCellPhone.call(this, this.formItem.send_tel.value);
      }
      return true;
    },
    getWarnMsg(obj) {
      switch (obj.check_type) {
        case "1":
          return `${
            obj.type == "1" ? "通知" : obj.type == "2" ? "告警" : "紧急"
          }消息： 设备类型：[#[device_type_name]#]([#[device_type_id]#])，设备：[#[device_name]#]([#[device_id]#])，字段：${
            obj.monitor_field
          }--阈值大于${obj.min}，当前的值为[#[value]#]。`;
        case "2":
          return `${
            obj.type == "1" ? "通知" : obj.type == "2" ? "告警" : "紧急"
          }消息： 设备类型：[#[device_type_name]#]([#[device_type_id]#])，设备：[#[device_name]#]([#[device_id]#])，字段：${
            obj.monitor_field
          }--阈值大于等于${obj.min}，当前的值为[#[value]#]。`;
        case "3":
          return `${
            obj.type == "1" ? "通知" : obj.type == "2" ? "告警" : "紧急"
          }消息： 设备类型：[#[device_type_name]#]([#[device_type_id]#])，设备：[#[device_name]#]([#[device_id]#])，字段：${
            obj.monitor_field
          }--阈值小于${obj.min}，当前的值为[#[value]#]。`;
        case "4":
          return `${
            obj.type == "1" ? "通知" : obj.type == "2" ? "告警" : "紧急"
          }消息： 设备类型：[#[device_type_name]#]([#[device_type_id]#])，设备：[#[device_name]#]([#[device_id]#])，字段：${
            obj.monitor_field
          }--阈值小于等于${obj.min}，当前的值为[#[value]#]。`;
        case "5":
          return `${
            obj.type == "1" ? "通知" : obj.type == "2" ? "告警" : "紧急"
          }消息： 设备类型：[#[device_type_name]#]([#[device_type_id]#])，设备：[#[device_name]#]([#[device_id]#])，字段：${
            obj.monitor_field
          }--阈值等于${obj.min}，当前的值为[#[value]#]。`;
        case "6":
          return `${
            obj.type == "1" ? "通知" : obj.type == "2" ? "告警" : "紧急"
          }消息： 设备类型：[#[device_type_name]#]([#[device_type_id]#])，设备：[#[device_name]#]([#[device_id]#])，字段：${
            obj.monitor_field
          }--值不等于${obj.min}，当前的值为[#[value]#]。`;
        case "7":
          return `${
            obj.type == "1" ? "通知" : obj.type == "2" ? "告警" : "紧急"
          }消息： 设备类型：[#[device_type_name]#]([#[device_type_id]#])，设备：[#[device_name]#]([#[device_id]#])，字段：${
            obj.monitor_field
          }--本应该在${obj.min}~${obj.max}之间，当前的值为[#[value]#]。`;
        case "8":
          return `${
            obj.type == "1" ? "通知" : obj.type == "2" ? "告警" : "紧急"
          }消息： 设备类型：[#[device_type_name]#]([#[device_type_id]#])，设备：[#[device_name]#]([#[device_id]#])，字段：${
            obj.monitor_field
          }--本应该在${obj.min}~${obj.max}之外，当前的值为[#[value]#]。`;
      }
      return "";
    },
    createOrUpdate() {
      const params = {};
      const _this = this;

      var { monitor_field, name, send_email, send_tel } = this.formItem;
      var push_list = [];
      if (send_email.agree) {
        var emails = send_email.value.split("；");
        if (emails.length == 1) {
          emails = send_email.value.split(";");
        }
        emails.map(c => {
          push_list.push({
            type: "Email",
            id: c
          });
        });
      }
      if (send_tel.agree) {
        var cellphones = send_tel.value.split("；");
        if (cellphones.length == 1) {
          cellphones = send_tel.value.split(";");
        }
        cellphones.map(c => {
          push_list.push({
            type: "Cellphone",
            id: c
          });
        });
      }

      var param = {
        name: "ScopeCheck",
        plugin_id: 4,
        event_interval: 600,
        path: monitor_field,
        show_name: name,
        check_field: this.formItem.condition.map((d, i) => {
          return {
            sn: i + 1,
            level: 1,
            check_type: Number(d.check_type),
            type: Number(d.type),
            min: d.values[0],
            max: d.values[1],
            subject: `对于字段--${monitor_field}--的告警事件`,
            message: this.getWarnMsg({
              monitor_field,
              min: d.values[0],
              max: d.values[1],
              type: d.type,
              check_type: d.check_type
            })
          };
        }, this),
        push_list: push_list
      };

      if (this.mode == "create") {
        this.device_type_data.plugin_config.push(param);
      }else{
        debugger;
        this.device_type_data.plugin_config[this.warnning_sn-1] = param;
      }

      updateDeviceType(this.device_type_id, this.device_type_data)
        .then(d => {
          this.$Message.info("添加事件成功！");
          this.$emit("onsuccess");
          this.incrementCancel();
        })
        .catch(e => {
          this.$Message.error("添加事件失败！");
        });
    },
    back() {
      this.current--;
      if (this.current === 0) {
        this.okText = "下一步";
        this.cancelText = "取消";
      } else if (this.current === -1) {
        this.incrementCancel();
      } else {
        this.cancelText = "上一步";
        this.okText = "下一步";
        return;
      }
    },
    incrementOk() {
      this.current = 0;
      this.modalVisible = false;
    },
    incrementCancel() {
      this.initData();
      this.modalVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./CreateAdvanceWarning.less");
</style>
