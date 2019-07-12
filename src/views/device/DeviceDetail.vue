<template>
  <div class="device-detil">
    <div class="det-head">
      <div class="type-name">
        <i class="iconfont">&#xe64d;</i>
        <span>{{device_type.name}}</span>
        <i @click="editDeviceType" style="cursor:pointer" class="iconfont">&#xe617;</i>
        <i @click="removeDeviceType" style="cursor:pointer" class="iconfont">&#xe629;</i>
        <Divider/>
        <Row type="flex" justify="space-around">
          <Col class="device-attr" span="11">
            <p>数据模板</p>
            <span>DQQT</span>
          </Col>
          <Divider type="vertical" style="height:4.9em"/>
          <Col class="device-attr" span="11">
            <p>设备总数</p>
            <span class="num">{{device_type.device_count}}</span>
          </Col>
        </Row>
      </div>
      <div class="type-chart">
        <Row type="flex" justify="space-between" align="middle">
          <Col span="10">
            <div class="se-chart" id="device-type-num-chart"></div>
          </Col>
          <Divider type="vertical" style="height: 150px;"/>
          <Col class="device-attr" span="10">
            <div class="se-chart" id="device-type-things-chart"></div>
          </Col>
          <Col class="btns" span="3">
            <Button @click="showModal('event')">事件配置</Button>
            <Button @click="showModal('safe')">安全配置</Button>
            <Button @click="showModal('save')">存储配置</Button>
          </Col>
        </Row>
      </div>
    </div>
    <div class="det-body">
      <BreadcrumbItem class="det-list-drop">
        设备列表
        <Icon type="md-arrow-dropdown"/>
      </BreadcrumbItem>
      <Divider/>
      <Form class="se-form" :model="formItem" :label-width="0" inline>
        <FormItem prop="key">
          <Input
            v-model="formItem.key"
            icon="ios-search"
            placeholder="请输入搜索内容"
            style="width: 200px"
          />
        </FormItem>
        <Button @click="queryDevice(0)" class="search-btn se-btn" type="primary">搜索</Button>
        <FormItem prop="type" style="width: 200px">
          <Select v-model="formItem.type">
            <Option value="1">列表视图</Option>
            <Option value="2">地图展示</Option>
          </Select>
        </FormItem>
        <Tag
          :key="index"
          :checked="item.checked"
          @on-change="common_label[index].checked = !common_label[index].checked;queryDevice(0)"
          v-for="(item,index) in common_label"
          style="float: right;"
          checkable
          color="primary"
        >{{item.name}}</Tag>
        <!-- <Tag style="float: right;" checkable color="blue">标签一</Tag>
				<Tag style="float: right;" checkable color="primary">标签二</Tag>
				<Tag style="float: right;" checkable :checked="false" color="primary">标签三</Tag>
        <Tag style="float: right;" checkable color="primary">标签四</Tag>-->
      </Form>
      <Table
        border
        @on-select="onTableSelect"
        @on-select-all="onTableSelect"
        @on-select-all-cancel="curSelectedDeviceRow=[]"
        ref="selection"
        :columns="columns"
        :data="table_data"
        height="440"
      ></Table>
    </div>
    <div class="det-foot">
      <Button @click="addDevice">添加设备</Button>
      <Button @click="importDevice">批量导入</Button>
      <Button>批量导出</Button>
      <Button @click="deleteDevive">删除</Button>
      <Page :current="curPageNum" @on-change="onDevicesPageChange" :total="n_total_device"/>
    </div>
    <Event ref="event" :device_type_id="device_type_id"></Event>
    <Save ref="save"></Save>
    <Safe ref="safe"></Safe>
    <DataTemplate ref="data_template"></DataTemplate>
    <details-device ref="details_device" />
    <create-update-device
      @onsuccess="getDeviceInfo"
      :device_type_id="device_type_id"
      ref="add_device"
    ></create-update-device>
    <create-update-device-type @onsuccess="getDeviceInfo" ref="update_device_type"></create-update-device-type>

    <upload-device @onsuccess="getDeviceInfo" :device_type_id="device_type_id" ref="upload_device"></upload-device>
  </div>
</template>

<script>
// const echarts = require('echarts');
import {
  Ajax,
  createDevice,
  deleteDevice,
  queryDeviceTypeStatistics,
  queryDeviceTypeEventStatistics
} from "@/api/data.js";
import { mapGetters } from "vuex";
import { globalBus } from "@/api/globalBus";
import { deleteDeviceType } from "@/api/data";
import Save from "./setting/Save";
import Safe from "./setting/Safe";
import Event from "./setting/Event";
import DataTemplate from "./setting/DataTemplate";
import DetailsDevice from "./DetailsDevice";
import CreateUpdateDevice from "./CreateUpdateDevice";
import CreateUpdateDeviceType from "./CreateUpdateDeviceType.vue";
// import CreateAdvanceWarning from "../warning/CreateAdvanceWarning.vue";
import UploadDevice from "./UploadDevice.vue";
import { FormatDate, GetHoursAgoDateStr } from "@/libs/date_util";
export default {
  data() {
    return {
      formItem: {
        key: "",
        type: "1"
      },
      device_type: {
        name: "",
        create_time: ""
        // plugin_config:{}
      },
      thingChart: null,
      numChart: null,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          key: "name",
          tooltip: true
        },
        {
          title: "设备号",
          key: "code",
          tooltip: true
        },
        {
          title: "标签",
          key: "label",
          tooltip: true
        },
        {
          title: "经度",
          key: "lon",
          tooltip: true
        },
        {
          title: "纬度",
          key: "lat",
          tooltip: true
        },
        {
          title: "创建时间",
          key: "create_time",
          tooltip: true
        },
        {
          title: "操作",
          width: 200,
          align: "center",
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
                    class: "ivu-icon ivu-icon-ios-settings",
                    attrs: {
                      title: "详情"
                    },
                    style: {
                      marginRight: "5px",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.DetailsDevice(params)
                      }
                    }
                  },
                  ""
                ),
                h(
                  "span",
                  {
                    class: "click",
                    on:{
                      click:()=>{
                        this.DetailsDevice(params)
                      }
                    }
                  },
                  "详情"
                ),

                h("div", {
                  class: "ivu-divider ivu-divider-vertical ivu-divider-default"
                }),
                h(
                  "i",
                  {
                    class: "iconfont iconedit",
                    attrs: {
                      title: "修改"
                    },
                    style: {
                      marginRight: "5px",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.EditDevice(params);
                      }
                    }
                  },
                  ""
                ),
                h(
                  "span",
                  {
                    class: "click",
                    on: {
                      click: () => {
                        this.EditDevice(params);
                      }
                    }
                  },
                  "修改"
                )
              ]
            );
          }
        }
      ],
      //--设备表格
      table_data: [],
      n_total_device: 100, //-设备总数
      curPageNum: 1, //--设备当前页码
      curSelectedDeviceRow: [], //--当前选中的设备行
      common_label: [], //--常用标签
      device_type_data: null
    };
  },
  computed: {
    device_type_id: {
      get(val) {
        return this.$route.params.id;
      },
      set(val) {
        return val;
      }
    }
  },
  components: {
    Save,
    Safe,
    Event,
    DataTemplate,
    DetailsDevice,
    CreateUpdateDevice,
    CreateUpdateDeviceType,
    UploadDevice
  },
  beforeUpdate() {
    if (!this.$route.params.id) {
      this.$Message.info("没有获取设备类型ID信息！");
      this.$router.push({
        name: "device"
      });
    }
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.$Message.info("没有获取设备类型ID信息！");
      this.$router.push({
        name: "device"
      });
    }
    const _this = this;
    if (this.device_type_id) {
      _this.interval = setInterval(() => {
        _this.getDeviceInfo();
      }, 30000);
    }

    this.getDeviceInfo();
  },
  watch: {
    device_type_id(val) {
      //--fix dyj 由于跟组件路由加了key 此处已经不会触发
      if (val) {
        this.getDeviceInfo();
      }
    }
  },
  methods: {
    ...mapGetters(["getDeviceTypeId"]),
    onTableSelect(selection, row) {
      this.curSelectedDeviceRow = selection;
      // this.
    },

    editDeviceType() {
      this.$refs.update_device_type.show(this.device_type_id);
    },
    removeDeviceType() {
      const self = this;
      this.$Modal.confirm({
        title: "删除设备类型",
        content: `确定删除该设备类型？`,
        onOk: function() {
          deleteDeviceType(self.device_type_id)
            .then(d => {
              debugger;
              if (d) {
                this.$Message.info("删除设备类型成功！");
                self.$router.push({
                  name: "device"
                });
              } else {
                this.$Message.error(
                  "无法删除设备类型。请先删除设备类型下的设备。"
                );
              }
            })
            .catch(e => {
              this.$Message.error(
                "无法删除设备类型。请先删除设备类型下的设备。"
              );
            });
        }
      });
    },
    showModal(type) {
      this.$refs[type].show();
    },
    DetailsDevice(data){
      this.$refs.details_device.show(data)
    },
    EditDevice(data) {
      debugger;
      this.$refs.add_device.show(data.row.data_id);
    },
    addDevice() {
      this.$refs.add_device.show();
    },
    importDevice() {
      this.$refs.upload_device.show();
    },
    deleteDevive() {
      if (!this.curSelectedDeviceRow.length) {
        this.$Message.info("请先选择至少一个设备");
        return;
      }
      const namelist = this.curSelectedDeviceRow
        .map(d => {
          return d.name;
        })
        .join("、");
      const self = this;
      this.$Modal.confirm({
        title: "删除设备",
        content: `确定要删除  ${namelist} ？\n `,
        onOk: function() {
          const promiseArr = [];
          self.curSelectedDeviceRow.map(r => {
            promiseArr.push(deleteDevice(r.data_id));
          });
          Promise.all(promiseArr).then(d => {
            if (
              d.every(dd => {
                return dd;
              })
            ) {
              self.$Message.info("删除设备成功！");
              self.queryDevice(0);
            }
          });
        }
      });
    },
    getDeviceInfo() {
      let id = this.device_type_id;
      const _this = this;
      this.queryDevice(0);
      this.queryDeviceLabel();
      if (this.thingChart) {
        this.thingChart.setOption({
          series: [
            {
              data: []
            }
          ]
        });
      }
      Ajax.getDeviceType(id)
        .then(res => {
          _this.device_type.name = res.name;
          _this.device_type.create_time = res.data_update_time.substring(0, 10);
          _this.device_type.device_count = res.device_count;
          // _this.device_type.plugin_config = res.plugin_config;
          _this.initCharts();
        })
        .catch(error => {
          _this.$Message.error("获取设备信息失败");
        });
    },
    queryDevice(start) {
      let id = this.device_type_id;
      const _this = this;

      var labels = this.common_label
        .filter(d => {
          return d.checked == true;
        })
        .map(s => {
          return s.name;
        })
        .join(" ");
      var key = labels ? this.formItem.key + " " + labels : this.formItem.key;
      const params = {
        type_id: id,
        start,
        key: key,
        row: 10
      };
      Ajax.queryDevice(params)
        .then(res => {
          _this.n_total_device = res.total_count;
          _this.table_data = res.item_list.length
            ? res.item_list.map((dd, index) => {
                return {
                  data_id: dd.data_id,
                  num: index + start * 10 + 1,
                  name: dd.name,
                  code: dd.code,
                  label: dd.label_list,
                  create_time: dd.data_update_time,
                  lat: dd.loc_y,
                  lon: dd.loc_x
                };
              })
            : [];
        })
        .catch(error => {
          _this.$Message.error("获取设备列表失败");
        });
    },

    queryDeviceLabel() {
      const params = {
        start: 0,
        row: 5
      };
      Ajax.queryDeviceLabel(params).then(res => {
        this.common_label = res.item_list.length
          ? res.item_list.map(d => {
              d.checked = false;
              return d;
            })
          : [];
      });
    },

    aggDatasByTime() {
      var current_h = GetHoursAgoDateStr(new Date(), 0, "yyyy-MM-dd hh");
      var days_ago_h = GetHoursAgoDateStr(new Date(), 24, "yyyy-MM-dd hh");

      var query = [
        {
          $match: {
            tm: {
              $gt: days_ago_h + ":00",
              $lt: current_h + ":00"
            }
          }
        },
        {
          $group: {
            _id: {
              $concat: [
                {
                  $substr: ["$tm", 0, 13]
                }
              ]
            },
            count: {
              $sum: "$count"
            }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
      ];
      return new Promise((resove, reject) => {
        queryDeviceTypeStatistics(this.device_type_id, query)
          .then(d => {
            var label = [];
            var values = [];
            var arr_rets = d.item_list.length ? d.item_list : [];
            arr_rets.map(dd => {
              label.push(`${dd._id.split(" ")[1]}:00`);
              values.push(dd.count);
            });

            resove({
              label,
              values
            });
          })
          .catch(e => {
            reject();
          });
      });
    },
    aggEventsByTime() {
      var current_h = GetHoursAgoDateStr(new Date(), 0, "yyyy-MM-dd hh");
      var days_ago_h = GetHoursAgoDateStr(new Date(), 24, "yyyy-MM-dd hh");
      var query = [
        {
          $match: {
            tm: {
              $gt: days_ago_h + ":00",
              $lt: current_h + ":00"
            }
          }
        },
        {
          $group: {
            _id: {
              $concat: [
                {
                  $substr: ["$tm", 0, 13]
                }
              ]
            },
            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
      ];
      return new Promise((resove, reject) => {
        queryDeviceTypeEventStatistics(this.device_type_id, query)
          .then(d => {
            var label = [];
            var values = [];
            var arr_rets = d.item_list.length ? d.item_list : [];
            arr_rets.map(dd => {
              label.push(`${dd._id.split(" ")[1]}:00`);
              values.push(dd.count);
            });
            resove({
              label,
              values
            });
          })
          .catch(e => {
            reject();
          });
      });
    },
    initCharts(options) {
      if (!this.thingChart) {
        this.thingChart = echarts.init(
          document.getElementById("device-type-things-chart")
        );
        this.numChart = echarts.init(
          document.getElementById("device-type-num-chart")
        );
      }
      this.thingChart.clear();
      this.numChart.clear();
      window.thingChart = this.thingChart;
      const getOpt = (title, icon, label, data) => {
        return {
          title: {
            text: [`{b|}{a|${title}}`],
            x: "left",
            left: 30,
            top: 5,
            textStyle: {
              rich: {
                a: {
                  class: `iconfont`,
                  color: "#5C6B8E",
                  lineHeight: 14,
                  fontSize: 14,
                  padding: [0, 0, 0, 5]
                },
                b: {
                  backgroundColor: {
                    image: `./static/images/${icon}.png`
                  },
                  height: 18,
                  width: 14
                }
              }
            }
          },
          tooltip: {},
          xAxis: {
            data: label,
            nameTextStyle: {
              color: "#CCCCCC"
            },
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            }
          },
          axisLabel: {
            color: "#ccc"
          },
          axisTick: {
            lineStyle: {
              color: "#ccc"
            }
          },
          yAxis: {
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            },
            axisLabel: {
              formatter: function(value, index) {
                return title == "接收数据量" ? value / 10000 + "万" : value;
              }
            }
          },
          grid: {
            top: 40,
            bottom: 40,
            left: 50,
            right: 0
            // height: 200
          },
          series: [
            {
              type: "line",
              data: data,
              symbolSize: 6,
              itemStyle: {
                normal: {
                  color: "#44AAF6",
                  lineStyle: {
                    color: "#70C1B3"
                  }
                }
              }
            }
          ]
        };
      };
      this.aggDatasByTime()
        .then(d => {
          this.numChart.setOption(
            getOpt("接收数据量", "rack-devices", d.label, d.values)
          );
        })
        .catch(e => {
          this.$Message.error("统计设备类型数量失败！");
        });
      this.aggEventsByTime()
        .then(d => {
          this.thingChart.setOption(
            getOpt("监测事件数", "baojing", d.label, d.values)
          );
        })
        .catch(e => {
          this.$Message.error("统计设备类型事件失败！");
        });
    },
    onDevicesPageChange(page) {
      this.queryDevice((page - 1) * 10);
    }
  }
};
</script>

<style lang="less" scoped="scoped">
@import url("./devicedetail");
</style>
