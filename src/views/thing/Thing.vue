<template>
  <div class="thing">
    <div class="thing-body">
      <div class="thing-type">
        <BreadcrumbItem class="click thing-type">
          报警信息列表
          <Icon type="md-arrow-dropdown"/>
        </BreadcrumbItem>
        <Divider/>
        <Form :model="searchForm" :label-width="80" inline>
          <FormItem label="设备类型" prop="device_type" style="width: 230px">
            <Select @on-change="onSearchFormChange" v-model="searchForm.device_type">
              <Option
                v-for="item in device_types"
                :key="item.data_id"
                :value="item.data_id"
              >{{item.name}}</Option>
              <Option :value="0">不选</Option>
            </Select>
          </FormItem>
          <FormItem label="事件类型" prop="type" style="width: 230px">
            <Select @on-change="onSearchFormChange" v-model="searchForm.type">
              <Option :value="1">通知</Option>
              <Option :value="2">告警</Option>
              <Option :value="3">紧急</Option>
              <Option :value="0">无</Option>
            </Select>
          </FormItem>
          <FormItem label="快速检索" prop="time_select" style="width: 230px">
            <Select @on-change="onSearchFormChange" v-model="searchForm.time_select">
              <Option :value="1">最近1小时</Option>
              <Option :value="24">最近1天</Option>
              <Option :value="24*6">最近1周</Option>
              <Option :value="0">无</Option>
            </Select>
          </FormItem>
          <FormItem label="时间范围" prop="time_zoom" style="width: 230px">
            <DatePicker
              @on-change="onSearchFormChange"
              v-model="searchForm.time_zoom"
              type="daterange"
              placement="bottom-end"
              placeholder="请选择时间范围"
              style="width: 150px"
            ></DatePicker>
          </FormItem>

          <!-- <span class="sort-span" style>
            排序：&nbsp;
            时间
            <Divider type="vertical"/>紧张程度
          </span>-->
          <FormItem prop="key" label="关键字">
            <Input
              @on-change="onSearchFormChange"
              v-model="searchForm.key"
              icon="ios-search"
              placeholder="请输入搜索内容"
              style="width: 150px"
            />
          </FormItem>
        </Form>
        <Table border ref="selection" :columns="columns" :data="table_data" height="440"></Table>
        <div class="det-foot">
          <Page :total="totalEvents" @on-change="onPageChange"/>
        </div>
        <BreadcrumbItem class="click thing-type">
          统计分析
          <Icon type="md-arrow-dropdown"/>
        </BreadcrumbItem>
        <Divider/>
        <Row class="chart-row" type="flex" justify="space-between" align="middle">
          <Col span="12">
            <div id="things-chart1" class="things-chart"></div>
          </Col>
          <Col span="12">
            <div id="things-chart2" class="things-chart"></div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryDeviceGroup,
  queryDeviceType,
  queryEvents,
  queryEventsCount,
  queryEventStatistics
} from "@/api/data";
import {GetHoursAgoDateStr,FormatDate} from '@/libs/date_util'
export default {
  data() {
    return {
      searchForm: {
        type: null,
        time_zoom: [],
        device_type: null,
        time_select: 1,
        key: ""
      },
      totalEvents: 0,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          width: 80,
          title: "序号",
          key: "num"
        },
        {
          title: "设备号",
          key: "dv",
          width: 80
        },
        {
          title: "设备类型",
          key: "dt",
          width: 100
        },
        {
          width: 180,
          title: "事件时间",
          key: "tm"
        },
        {
          title: "消息类型",
          width: 100,
          key: "type"
        },
        {
          title: "事件详情",
          key: "message",
          tooltip: true,
          align:"center"
        },
        {
          title: "操作",
          width: 80,
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
                    class: "iconfont iconedit",
                    attrs: {
                      title: "查看"
                    },
                    style: {
                      marginRight: "5px",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {}
                    }
                  },
                  ""
                ),
                h(
                  "span",
                  {
                    style: {
                      // marginRight: "5px",
                      cursor: "pointer"
                    }
                  },
                  "查看"
                )
              ]
            );
          }
        }
      ],
      query_params: {},
      device_types: [],
      origin_data: []
    };
  },
  computed: {
    table_data() {
      if (!this.origin_data || !this.origin_data.length) return [];
      return this.origin_data.map((dp, index) => {
        return {
          num: index,
          dv: dp.da.msg.dv,
          dt: dp.da.msg.dt,
          tm: dp.tm,
          type: this.getMsgType(dp.da.check.type),
          message: dp.da.check.message
        };
      }, this);
    }
  },
  components: {},
  mounted() {
    // this.initCharts("things-chart1");
    // this.initCharts("things-chart2");
    // this.initCharts("things-chart3");
    // window.aaaa = this;
    queryDeviceType({})
      .then(res => {
        this.device_types = res.item_list;
      })
      .catch(error => {});

    this.queryEvents(0);
    //--图表初始化容器宽度计算错误。故如此
    this.$nextTick(d => {
      this.initCharts();
    });
  },
  methods: {
    onSearchFormChange() {
      this.queryEvents(0);
      this.initCharts();
    },
    onPageChange(page) {
      this.queryEvents((page - 1) * 10);
    },
    getTotalCount() {
      return queryEventsCount(this.getMogoDBQueryBody());
    },
    getMsgType(type) {
      return type == 1 ? "通知" : type == 2 ? "告警" : "紧急";
    },
    getMogoDBQueryBody() {
      var cur_date_str = FormatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      var query = {
        tm: {
          $lte: cur_date_str
        }
      };

      if (this.searchForm.key) {
        query["da.check.name"] = {
          $eq: this.searchForm.key
        };
      }
      if (this.searchForm.device_type) {
        query["da.msg.dt"] = {
          $eq: this.searchForm.device_type
        };
      }
      if (this.searchForm.type) {
        query["da.check.type"] = {
          $eq: this.searchForm.type
        };
      }
      if (
        this.searchForm.time_zoom.every(d => {
          return d != "";
        })
      ) {
        query["tm"] = {
          $gte: FormatDate(
            this.searchForm.time_zoom[0],
            "yyyy-MM-dd hh:mm:ss"
          ),
          $lte: FormatDate(
            this.searchForm.time_zoom[1],
            "yyyy-MM-dd hh:mm:ss"
          )
        };
      } else if (this.searchForm.time_select) {
        query["tm"] = {
          $gte: GetHoursAgoDateStr(new Date(),this.searchForm.time_select,"yyyy-MM-dd hh:mm:ss"),
          $lte: FormatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
        };
      }
      return query;
    },
    queryEvents(start) {
      const self = this;
      queryEvents(this.getMogoDBQueryBody(), start, 10)
        .then(res => {
          this.origin_data = res.item_list;
        })
        .catch(e => {
          self.$Message.error("查询事件失败！");
        });
      this.getTotalCount()
        .then(d => {
          this.totalEvents = d;
        })
        .catch(e => {
          self.$Message.error("查询事件数量失败。");
        });
    },
    initCharts() {
      if (!this.chart_1) {
        this.chart_1 = echarts.init(document.getElementById("things-chart1"));
      }
      if (!this.chart_2) {
        this.chart_2 = echarts.init(document.getElementById("things-chart2"));
      }
      const self = this;
      this.aggreteByMessageType().then(d => {
        var labels = [];
        var values_obj = [];
        var data_items = d.item_list.length ? d.item_list : [];
        self.getChartData(data_items, values_obj, labels);
        self.initTypeAggChat(labels, values_obj);
      });
      this.aggreteByDate().then(d => {
        var labels = [];
        var values = [];
        var data_items = d.item_list.length ? d.item_list : [];
        data_items.map(dd=>{

          labels.push(`${dd._id.substr(5,10)}0`);
          values.push(dd.count);
        })
        this.initNumsAggChat(labels,values);
      });
    },
    initTypeAggChat(label, values_obj) {
      const myChart = this.chart_1;

      var series = [];

      values_obj.map(val => {
        if (val.key == "1") {
          series.push({
            name: "通知",
            type: "bar",
            barWidth: 8,
            barCategoryGap: 20,
            data: val.value,
            itemStyle: {
              normal: {
                color: "#70C1B3",
                barBorderRadius: [15, 15, 0, 0]
              }
            }
          });
        }

        if (val.key == "2") {
          series.push({
            name: "告警",
            type: "bar",
            barWidth: 8,
            barCategoryGap: 20,
            data: val.value,
            itemStyle: {
              normal: {
                color: "#247BA0",
                barBorderRadius: [15, 15, 0, 0]
              }
            }
          });
        }

        if (val.key == "3") {
          series.push({
            name: "紧急",
            type: "bar",
            barWidth: 8,
            barCategoryGap: 20,
            data: val.value,
            itemStyle: {
              normal: {
                color: "#EB547C",
                barBorderRadius: [15, 15, 0, 0]
              }
            }
          });
        }
      });
      if(!series.length)
      {
         myChart.clear();
        //  this.chart_1 = echarts.init(document.getElementById("things-chart1"));
        //  myChart = this.chart_1;
         series.push({
            name: "通知",
            type: "bar",
            barWidth: 8,
            barCategoryGap: 20,
            data: [0],
            itemStyle: {
              normal: {
                color: "#70C1B3",
                barBorderRadius: [15, 15, 0, 0]
              }
            }
          });
      }

      // 绘制图表
      myChart.setOption({
        title: {
          text: [`{b|}{a|报警类型}`],
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
                  image: `./static/images/baojing.png`
                },
                height: 18,
                width: 14
              }
            }
          }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["通知", "告警", "紧急"]
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            nameTextStyle: {
              color: "#CCCCCC"
            },
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            },
            data: label
          }
        ],
        yAxis: [
          {
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            }
          }
        ],
        series: series
      });
    },
    initNumsAggChat(labels, values) {
      const getOpt = (label, data) => {
        return {
          title: {
            text: [`{b|}{a|事件数}`],
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
                    image: `./static/images/baojing.png`
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
            }
          },
          grid: {
            // top: 40,
            // bottom: 40,
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
      this.chart_2.setOption(getOpt(labels,values));
    },
    getChartData(aggs, values_obj, labels) {
      var all_time_key = [];
      var all_sub_key = [];
      aggs.reverse().map(m => {
        var datas = m._id.split("_");
        var time_key = datas[0];
        var value_ley = datas[1];
        if (
          all_sub_key.every(kk => {
            return kk != value_ley;
          })
        ) {
          all_sub_key.push(value_ley);
        }
        var index = 0;
        if (
          all_time_key.every((d, i) => {
            index = i;
            return d.time_key != time_key;
          })
        ) {
          var obj = {
            time_key: time_key,
            keys: [
              {
                sKey: value_ley,
                count: m.count
              }
            ]
          };
          all_time_key.push(obj);
          labels.push(`${time_key.split(" ")[1]}0`);
        } else {
          var index2 = 0;
          if (
            all_time_key[index].keys.every((d3, i2) => {
              index2 = i2;
              return d3.sKey != value_ley;
            })
          ) {
            all_time_key[index].keys.push({
              sKey: value_ley,
              count: m.count
            });
          } else {
            var old_count = all_time_key[index].keys[index2].count;
            all_time_key[index].keys[index2] = old_count + m.count;
          }
        }
      });

      all_sub_key.map(ask => {
        values_obj.push({
          key: ask,
          value: all_time_key.map(tk => {
            var index = 0;
            if (
              tk.keys.some((d, i) => {
                index = i;
                return d.sKey == ask;
              })
            ) {
              return tk.keys[index].count;
            } else return 0;
          })
        });
      });
    },
    getMatchTime()
    {
      var current;
      var minuts_ago;
      if (
        this.searchForm.time_zoom.every(d => {
          return d != "";
        })
      ) {
        minuts_ago = FormatDate(
          this.searchForm.time_zoom[0],
          "yyyy-MM-dd hh:mm:ss"
        );
        current = FormatDate(
          this.searchForm.time_zoom[1],
          "yyyy-MM-dd hh:mm:ss"
        );
      } else {
        current =FormatDate(new Date(), "yyyy-MM-dd hh:mm");
        if (!this.searchForm.time_select) {
          minuts_ago = "";
        } else {
          minuts_ago = GetHoursAgoDateStr(
            new Date(),
            this.searchForm.time_select,
            "yyyy-MM-dd hh:mm"
          );
        }
      }
      var match = {
        tm: {
          $lt: current
        }
      };
      if (minuts_ago) {
        match.tm.$gt = minuts_ago;
      }

      return match;
    },
    aggreteByMessageType() {      

      var query = [
        {
          $match: this.getMatchTime()
        },
        {
          $group: {
            _id: {
              $concat: [
                {
                  $substr: ["$tm", 0, 15]
                },
                "_",
                {
                  $toString: "$attr_list.event_type"
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
            _id: -1
          }
        }
      ];
      return queryEventStatistics(query, 10);
    },
    aggreteByDate() {
      var query = [
        {
          $match: this.getMatchTime()
        },
        {
          $group: {
            _id: {
              $concat: [
                {
                  $substr: ["$tm", 0, 15]
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
            _id: -1
          }
        }
      ];
      return queryEventStatistics(query, 10);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./thing.less");
</style>
