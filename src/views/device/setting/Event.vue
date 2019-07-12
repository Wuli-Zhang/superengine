<template>
  <div class="event-setting">
    <Modal
      class="event-setting-modal"
      noFooter="true"
      width="543"
      title="事件配置"
      ref="modal"
      :modalVisible="modalVisible"
      @incrementOk="incrementOk"
      @incrementCancel="incrementCancel"
    >
      <div class="header">
        <Input icon="ios-search" style="width: 150px" placeholder="请输入关键字"/>
        <Button type="primary" style="margin-left:10px;">搜索</Button>
        <Button @click="showCreateUpdate" type="primary" style="float: right;">添加事件</Button>
      </div>
      <div style="margin-top: 10px;">
        <Table :columns="event_columns" :data="event_data" height="240"></Table>
      </div>
      <div class="footer">
        <Page
          @on-change="onPageChange"
          :page-size="5"
          :current="current_page"
          :total="total_num"
          class="page"
        ></Page>
      </div>
    </Modal>
    <!-- <add-license-code ref="add_license_code"></add-license-code> -->
    <create-advance-warning
      @onsuccess="onCreateOrUpdateSuccess"
      :device_type_id="device_type_id"
      ref="create_advance_warning"
    ></create-advance-warning>
  </div>
</template>

<script>
import Modal from "@/components/BaseModal.vue";
import AddLicenseCode from "./AddLicenseCode";
import CreateAdvanceWarning from "../../warning/CreateAdvanceWarning.vue";
import { Ajax, updateDeviceType } from "@/api/data.js";
export default {
  data() {
    return {
      modalVisible: false,
      loading: false,
      current: 0,
      current_page: 1,
      total_num: 0,
      device_type_data: null,
      event_columns: [
        {
          title: "事件名称",
          key: "name"
        },
        {
          title: "事件模型",
          key: "model"
        },
        {
          title: "监测字段",
          key: "path"
        },
        {
          title: "操作",
          width: 100,
          render: (h, params) => {
            return h(
              "div",
              {
                class: "handle",
                style: {
                  color: "#44AAF6"
                }
              },
              [
                h(
                  "i",
                  {
                    class: "iconfont iconxiangqing",
                    attrs: {
                      title: "详情"
                    },
                    style: {
                      marginRight: "5px",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
						  this.$refs.create_advance_warning.show(params.row.sn,true);
					  }
                    }
                  },
                  ""
                ),
                h(
                  "i",
                  {
                    class: "iconfont iconedit",
                    attrs: {
                      title: "编辑"
                    },
                    style: {
                      marginRight: "5px",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.$refs.create_advance_warning.show(params.row.sn);
                      }
                    }
                  },
                  ""
                ),
                h(
                  "i",
                  {
                    class: "iconfont icondelete",
                    attrs: {
                      title: "删除"
                    },
                    style: {
                      marginRight: "5px",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.deletePlugins(params.row);
                      }
                    }
                  },
                  ""
                )
              ]
            );
          }
        }
      ]
    };
  },
  computed: {
    event_data() {
      return !this.device_type_data
        ? []
        : this.device_type_data.plugin_config
            .filter(d => {
              return d.plugin_id == 4;
            })
            .filter((d2, index) => {
              return (
                index >= (this.current_page - 1) * 5 &&
                index < this.current_page * 5
              );
            }, this)
            .map(dd => {
              return {
                name: dd.show_name,
                model: "定值越界", //--目前只有定制越界
                path: dd.path,
                sn: dd.sn
              };
            });
    }
  },
  components: {
    Modal,
    CreateAdvanceWarning
  },
  props: ["device_type_id"],
  methods: {
    show() {
      this.modalVisible = true;
      this.queryEventPlugins();
    },
    onPageChange(pageNum) {
      this.current_page = pageNum;
    },
    deletePlugins(row) {
      this.$Modal.confirm({
        title: "删除事件配置",
        content: "确定删除该配置？删除后不可恢复。",
        onOk: () => {
          this.device_type_data.plugin_config.splice(row.sn - 1, 1);
          updateDeviceType(this.device_type_id, this.device_type_data)
            .then(d => {
              this.$Message.info("删除事件配置成功！");
            })
            .catch(e => {
              this.$Message.error("删除事件配置失败！");
            });
        }
      });
    },
    showCreateUpdate() {
      this.$refs.create_advance_warning.show();
    },
    initData() {
      this.current = 0;
      this.formItem = {
        name: "",
        agreement: "1",
        vertical: "1",
        safe_id: "1"
      };
    },
    onCreateOrUpdateSuccess() {
      this.queryEventPlugins();
    },
    queryEventPlugins() {
      const self = this;
      Ajax.getDeviceType(this.device_type_id).then(d => {
        self.device_type_data = d;
        self.total_num = d.plugin_config.filter(d => {
          return d.plugin_id == 4;
        }).length;
      });
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

<style lang="less" >
@import url("./Event.less");
</style>
