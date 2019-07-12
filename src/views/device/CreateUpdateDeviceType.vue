<template>
  <div class="create-device-type">
    <Modal
      class="device-type-modal"
      noFooter="true"
      width="760"
      :title="modal_title"
      ref="modal"
      :modalVisible="modalVisible"
      @incrementOk="incrementOk"
      @incrementCancel="incrementCancel"
    >
      <div class="modal-body">
        <Steps class="create-steps" :current="current">
          <Step content="添加设备类型信息"></Step>
          <Step content="设置数据模板"></Step>
          <Step content="配置数据预处理信息"></Step>
        </Steps>
        <Form
          class="se-form"
          ref="type_from"
          :model="formItem"
          :rules="formRules"
          :label-width="110"
        >
          <Row class="modal-row" v-show="current === 0" type="flex" justify="center" align="middle">
            <Col span="16">
              <FormItem prop="name" label="设备类型名称" style="width: 100%">
                <Input v-model="formItem.name" placeholder="请输入设备类型名称"/>
              </FormItem>
            </Col>
            <Col span="16">
              <FormItem prop="code" label="设备类型编码" style="width: 100%">
                <Input v-model="formItem.code" placeholder="请输入唯一设备类型编码"/>
              </FormItem>
            </Col>
            <!-- <Col span="16">
              <FormItem label="设备介入协议" prop="agreement" style="width: 100%">
                <Select v-model="formItem.agreement">
                  <Option value="1">分组1</Option>
                  <Option value="2">分组2</Option>
                  <Option value="3">分组3</Option>
                </Select>
              </FormItem>
            </Col>-->
            <Col span="16">
              <FormItem label="设备类型分组" prop="group_id" style="width: 100%">
                <Select v-model="formItem.group_id" style="width: 250px;">
                  <Option
                    :key="group.data_id"
                    v-for="group in group_list"
                    :value="group.data_id"
                  >{{group.name}}</Option>
                </Select>
                <Button @click="addGroup" class="se-btn add-group" style="float: right;">添加分组</Button>
              </FormItem>
            </Col>
          </Row>
          <Row class="modal-row" v-show="current === 1" type="flex" justify="center" align="middle">
            <div class="create-header myflex">
              <div>
                <Upload
                  ref="uploader"
                  :before-upload="handleUpload"
                  action="//jsonplaceholder.typicode.com/posts/"
                >
                  <i-button>打开json文件</i-button>
                </Upload>
              </div>
              <div></div>
              <div>json路径</div>
              <div>字段类型</div>
              <div>字段名称</div>
              <div>统计类型</div>
              <div v-if="data_templates.length>8" style="width:15px"></div>
            </div>
            <div class="create-container myflex">
              <div
                :style="{'height':`${data_templates.length ? Math.max(data_templates.length * 40,220) : 220}px`}"
                class="json-editor-parent"
              >
                <div ref="json_editor" class="json-editor"></div>
              </div>
              <div
                style="max-height:305px;"
                :style="{'height':`${data_templates.length ? Math.max(data_templates.length * 40,220) : 220}px`}"
              >
                <div
                  class="process-btn"
                  :class="{'active':validJson(loaded_json)}"
                  @click="processDataTemplates"
                >
                  <Icon custom="iconfont icontriangle-right"></Icon>
                </div>
              </div>
              <div class="data-item-wrapper">
                <div :key="index" class="data-item" v-for="(item,index) in data_templates">
                  <div>{{ item.json_root}}</div>
                  <div>{{ item.data_type}}</div>
                  <div>
                    <Input v-model="item.show_name" placeholder="请输入别名"/>
                  </div>
                  <div>
                    <Select v-model="item.aggs_usage">
                      <Option value="field">普通字段</Option>
                      <Option v-if="item.data_type!='datetime'" value="field_attr">分类字段</Option>
                      <Option v-if="item.data_type!='datetime'" value="field_count">分类计数</Option>
                      <Option v-if="item.data_type=='number'" value="field_sum">分类求和</Option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </Row>
          <Row
            class="modal-row plugin-config"
            v-show="current === 2"
            type="flex"
            justify="center"
            align="middle"
          >
            <Divider/>
            <div class="plugin-wrapper">
              <div class="tree-wrapper">
                <Tree :data="plugin_data_tree"></Tree>
              </div>
              <div class="option-wrapper">
                <div v-if="active_node" class="basic_setting">
                  <Form class="basic-form" :label-width="140">
                    <FormItem prop="name" label="预处理名称">
                      <Input v-model="active_node.title" placeholder="请定义处理名称"/>
                    </FormItem>
                  </Form>
                </div>

                <Preprocess
                  :data_templates="data_templates"
                  :plugin_data="active_node.plugin_data"
                  v-if="active_node && active_node.plugin_type == 'Preprocess'"
                ></Preprocess>
                <div class="none-show" v-if="!active_node">
                  <Icon custom="iconfont iconwucopyx"></Icon>
                  <div>暂无预处理字段。请添加</div>
                </div>
              </div>
            </div>
          </Row>
        </Form>
      </div>
      <Row class="modal-foot">
        <Button
          class="se-btn"
          :disabled="loading"
          @click="next"
          type="primary"
          style="float: right;margin-left: 10px;"
        >{{okText}}</Button>
        <Button class="se-btn" @click="back" style="float: right;">{{cancelText}}</Button>
      </Row>
    </Modal>
    <Modal
      class="device-group-modal"
      noFooter="true"
      width="500"
      title="添加设备组"
      ref="modal"
      :modalVisible="groupVisible"
      @incrementOk="addGroupOk"
      @incrementCancel="addGroupCancel"
    >
      <Form
        class="se-form"
        ref="group_from"
        :model="groupFormItem"
        :rules="formRules"
        :label-width="110"
      >
        <Row class="modal-row" type="flex" justify="center" align="middle">
          <Col span="20">
            <FormItem prop="name" label="组名称" style="width: 300px">
              <Input v-model="groupFormItem.name" placeholder="请输入组名称"/>
            </FormItem>
          </Col>
        </Row>
        <Row class="modal-foot">
          <Button
            class="se-btn"
            :disabled="loading"
            @click="addGroupOk"
            type="primary"
            style="float: right;margin-left: 20px;"
          >确定</Button>
          <Button class="se-btn" @click="addGroupCancel" style="float: right;">取消</Button>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {
  Ajax,
  createDeviceType,
  updateDeviceType,
  // queryDeviceGroup,
  createDeviceGroup
} from "@/api/data";
import Modal from "../../components/BaseModal.vue";

import Preprocess from "../plugins/Preprocess.vue";
import { debug, debuglog } from "util";
import { getRandomId } from "@/libs/util";
import { transferDeviceTypeConfigObject2Arr } from "@/libs/device";
export default {
  data() {
    const renderNode = function(isParent) {
      var fn_ret = (h, { root, node, data }) => {
        return h(
          "span",
          {
            style: {
              display: "inline-block",
              width: "100%"
            }
          },
          [
            h("span", [
              h(
                "span",
                {
                  attrs: {
                    title: data.title
                  },
                  class: `my-tree-node ${isParent ? "parent" : "child"} ${
                    this.active_node
                      ? this.active_node.data_id == data.data_id
                        ? "active"
                        : ""
                      : ""
                  }`,
                  on: {
                    click: () => {
                      if (!isParent) this.onTreeNodeClick(root, node, data);
                    }
                  }
                },
                data.title
              )
            ]),
            h(
              "span",
              {
                style: {
                  display: "inline-block",
                  float: "right",
                  marginRight: "32px"
                }
              },
              [
                h("Icon", {
                  props: {
                    custom: `iconfont ${isParent ? "icontianjia" : "iconyichu"}`
                  },
                  style: {
                    color: isParent ? "#44AAF6" : "#D23636",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      isParent
                        ? this.appendPluginInstance(data)
                        : this.deletePluginInstance(data);
                    }
                  }
                })
              ]
            )
          ]
        );
      };
      fn_ret.bind(this);
      return fn_ret;
    };

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
        group_id: "1",
        code: getRandomId(12)
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
        ],
        code: [
          {
            required: true,
            message: "编码不能为空",

            trigger: "blur"
          }
        ]
      },
      group_list: [],
      groupFormItem: {
        name: ""
      },
      data_templates: [],
      loaded_json: null,
      plugin_data_tree: [
        {
          title: "数据预处理",
          expand: true,
          data_id: "1001",
          plugin_type: "Preprocess",
          render: renderNode.call(this, true),
          children: []
        }
      ],
      active_node: null,
      fn_renderNode: renderNode,
       device_type_data:null
    };
  },
  computed: {
    modal_title: function() {
      return this.mode == "create" ? "创建设备类型" : "更新设备类型";
    }
  },
  beforeDestroy(){
    this.editor.destroy()
  },
  components: {
    Modal,
    Preprocess
  },
  mounted() {
    let options = {
      mode: "code",
      // modes: ["code", "form", "text", "tree", "view"], // allowed modes
      onError: function(err) {},
      onModeChange: function(newMode, oldMode) {}
    };
    // window.xxx = this;

    this.editor = new JSONEditor(this.$refs.json_editor, options, {});
  },
  methods: {
    show(group_type_id) {
      this.initData();
      this.mode = group_type_id != undefined ? "update" : "create";
      this.group_type_id = group_type_id;
      if (this.mode == "update") {
        Ajax.getDeviceType(this.group_type_id).then(d => {
          this.device_type_data = d;
          this.formItem.name = d.name;
          this.formItem.group_id = d.group_id;
          this.formItem.code = d.code;
          this.data_templates = transferDeviceTypeConfigObject2Arr(
            d.config
          ).map(d => {
            return {
              json_root: d.path,
              show_name: d.name,
              aggs_usage: d.aggs_usage,
              data_type: d.type
            };
          });
          //--预处理
          if (d.plugin_config[0].plugin_id == 5) {
            var p_preprocess = d.plugin_config[0];

            p_preprocess.process.map(pd => {
              this.plugin_data_tree[0].children.push({
                title: pd.name,
                plugin_type: "Preprocess",
                plugin_data: {
                  prefix: pd.prefix,
                  time_path: pd.time_path,
                  type: pd.type.toString(),
                  value_path: pd.value_path
                },
                parent_id: "1001",
                data_id: getRandomId(),
                render: this.fn_renderNode(false)
              });
            }, this);
          }

          debugger;
        });
      }
      // this.current = 2;
      this.modalVisible = true;
      this.getGroupList();
    },
    onTreeNodeClick(root, node, data) {
      this.active_node = null;
      this.$nextTick(() => {
        this.active_node = node.node;
      });
    },
    appendPluginInstance(data) {
      // debugger;
      data.children.push({
        title: `新处理`,
        plugin_type: data.plugin_type,
        plugin_data: { name: "" },
        parent_id: data.data_id,
        data_id: getRandomId(),
        render: this.fn_renderNode(false)
      });
    },
    deletePluginInstance(data) {
      for (var i = 0; i < this.plugin_data_tree.length; i++) {
        var el = this.plugin_data_tree[i];

        if (el.data_id == data.parent_id) {
          for (var j = 0; j < el.children.length; j++) {
            var ch = el.children[j];
            if (ch.data_id == data.data_id) {
              el.children.splice(j, 1);
              break;
            }
          }

          break;
        }
      }

      debugger;
    },
    handleUpload(file) {
      let fileType = true;
      if (file.name.indexOf("json") === -1) {
        fileType = false;
      }
      if (!file.name || !fileType) {
        this.$Message.error("请上传json格式的文件。");
        return false;
      }
      const reader = new FileReader();
      const self = this;
      reader.readAsText(file, "UTF-8");
      reader.onload = function(theFile) {
        var json_data = JSON.parse(theFile.currentTarget.result);
        if (json_data && self.validJson(json_data)) {
          self.loaded_json = json_data;
          self.editor.set(json_data);
        } else {
          self.$Message.error("JSON文件不符合格式！");
        }
      };
    },
    validJson(json) {
      if (!json) return false;

      if ($.isArray(json)) {
        return false;
      }
      return true;
    },
    checkDate(str) {
      var reg = /^\d{4}\-\d{2}\-\d{2} \d{2}\:\d{2}\:\d{2}/;
      return reg.test(str);
    },
    loopjson(json_da, attrs, parent) {
      for (var sKey in json_da) {
        var v = json_da[sKey];
        var v_type = typeof v;
        if (v_type == "string" || v_type == "number") {
          attrs.push({
            sKey: `${parent}${sKey}`,
            value: json_da[sKey],
            type:
              v_type == "string"
                ? this.checkDate(v)
                  ? "datetime"
                  : "string"
                : "number",
            show_name: sKey
          });
        } else if (!$.isArray(v)) {
          if ($.isEmptyObject(v)) continue;
          this.loopjson(v, attrs, `${parent}${sKey}.`);
        } else if ($.isArray(v)) {
          if (!v.length) continue;
          else {
            var ele = v[0];
            var ele_type = typeof ele;
            v.map((vv, index) => {
              if (ele_type == "string" || ele_type == "number") {
                attrs.push({
                  sKey: `${parent}${sKey}[${index}]`,
                  value: vv,
                  show_name: `${sKey}${index}`,
                  type:
                    ele_type == "string"
                      ? this.checkDate(vv)
                        ? "datetime"
                        : "string"
                      : "number"
                });
              } else {
                this.loopjson(vv, attrs, `${parent}${sKey}[${index}].`);
              }
            });
          }
        } else debugger;
      }
    },
    processDataTemplates() {
      if (!this.validJson(this.loaded_json)) return;
      var datas = [];
      this.loopjson(this.loaded_json, datas, "$.da.");
      debugger;
      this.data_templates = datas.map(dd => {
        return {
          json_root: dd.sKey,
          show_name: dd.show_name,
          data_type: dd.type,
          aggs_usage: "field"
        };
      });
    },
    //获取设备组列表
    getGroupList() {
      const _this = this;
      Ajax.queryDeviceTypeGroup()
        .then(res => {
          _this.group_list = res.item_list;
          _this.formItem.group_id = res.item_list[0].data_id;
        })
        .catch(error => {});
    },
    initData() {
      this.current = 0;
      this.okText = "下一步";
      this.cancelText = "取消";
      this.formItem = {
        name: "",
        group_id: "1",
        code: getRandomId(12)
      };
      this.$refs.uploader.clearFiles();
      this.loaded_json = null;
      this.data_templates = [];
      this.active_node = null;
      this.plugin_data_tree[0].children.splice(
        0,
        this.plugin_data_tree[0].children.length
      );
    },
    checkTemplates() {
      var check = /^[a-zA-Z_$]([-_a-zA-Z0-9]{1,20})$/;
      var result = true;
      this.data_templates.map((d, i) => {
        if (!check.test(d.show_name)) {
          this.$Message.error(`第${i}个变量别名不符合变量命名规则！`);
          result = false;
        }
      });

      var all_fields = [];
      var type_use_fields = this.data_templates.filter(dd => {
        if (
          all_fields.some(d => {
            return d == dd.show_name;
          })
        ) {
          this.$Message.error(`变量别名存在重复！请检查。`);
          result = false;
        } else all_fields.push(dd.show_name);
        return dd.aggs_usage == "field_attr";
      });

      if (type_use_fields.length > 2) {
        this.$Message.error(`用于分类的字段数不能超过2个！`);
        result = false;
      }

      return result;
    },
    next() {
      const self = this;
      if (this.current === 0) {
        this.$refs["type_from"].validate(valid => {
          if (valid) {
            self.current++;

            self.cancelText = "上一步";
            self.editor.set(self.loaded_json);
          } else {
            self.$Message.error("请核对输入信息！");
            return;
          }
        });
        return;
      }
      if (this.current === 1) {
        if (!this.data_templates.length) {
          this.$Message.error("请设置数据模板！");
          return;
        }

        if (!this.checkTemplates()) return;
        self.current++;
        self.okText = "创建";
        return;
      } else {
        this.createOrUpdate();
      }
    },
    back() {
      if (this.current === 1) {
        this.current--;
        this.okText = "下一步";
        this.cancelText = "取消";
        return;
      } else if (this.current === 2) {
        this.current--;
        this.okText = "下一步";
        this.cancelText = "上一步";
        return;
      }
      this.incrementCancel();
    },
    createOrUpdate() {
      var getConfigField = field_type => {
        return this.data_templates
          .filter(d => {
            return d.aggs_usage == field_type;
          })
          .map(d => {
            return {
              path: d.json_root,
              name: d.show_name,
              type: d.data_type
            };
          });
      };
      var config = {
        field_attr: getConfigField.call(this, "field_attr"),
        field_count: getConfigField.call(this, "field_count"),
        field_sum: getConfigField.call(this, "field_sum"),
        field: getConfigField.call(this, "field")
      };
      var plugin_config;
      if (this.mode == "create") {
        plugin_config = [
          {
            name: "History",
            plugin_id: 0
          },
          {
            name: "Statistics",
            plugin_id: 1
          },
          {
            name: "Status",
            plugin_id: 2
          }
        ];
      }else{
        plugin_config = this.device_type_data.plugin_config;
        plugin_config.shift();
      }

      var process_arr = this.plugin_data_tree[0].children.map((d, i) => {
        return {
          name: d.title,
          type: Number(d.plugin_data.type),
          value_path: d.plugin_data.value_path,
          time_path: d.plugin_data.time_path,
          prefix: d.plugin_data.prefix
        };
      });
      //--至少有一个预处理过程才会创建插件
      if (process_arr.length) {
        plugin_config.unshift({
          name: "Preprocess",
          plugin_id: 5,
          process: process_arr
        });
      }

      const params = {
        group_id: this.formItem.group_id,
        name: this.formItem.name,
        code: this.formItem.code,
        plugin_config: plugin_config,
        config: config
      };
      const _this = this;
      if (this.mode == "create") {
        createDeviceType(params)
          .then(res => {
            _this.$Message.success("创建设备类型成功");
            _this.incrementCancel();
            _this.$emit("onsuccess");
          })
          .catch(error => {
            _this.$Message.error("创建设备类型失败");
          });
      } else {
        updateDeviceType(this.group_type_id, params)
          .then(res => {
            _this.$Message.success("更新设备类型成功");
            _this.$emit("onsuccess");
            _this.incrementCancel();
          })
          .catch(error => {
            _this.$Message.error("更新设备类型失败");
          });
      }
    },
    incrementOk() {
      this.current = 0;
      this.modalVisible = false;
    },
    incrementCancel() {
      this.modalVisible = false;
    },
    addGroup() {
      this.groupVisible = true;
    },
    addGroupCancel() {
      this.groupFormItem.name = "";
      this.groupVisible = false;
    },
    addGroupOk() {
      const _this = this;
      this.$refs["group_from"].validate(valid => {
        if (valid) {
          createDeviceGroup({
            name: _this.groupFormItem.name
          })
            .then(res => {
              _this.$Message.success("创建组成功！");
              _this.addGroupCancel();
              _this.getGroupList();
            })
            .catch(error => {
              _this.$Message.error("创建组失败！");
            });
        } else {
          _this.$Message.error("请核对输入信息！");
          return;
        }
      });
    }
  }
};
</script>

<style lang="less" >
@import url("./CreateUpdateDeviceType.less");
</style>
