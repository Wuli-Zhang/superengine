<template>
  <div v-if="msg_show && latest_msg.message" class="err-info">
    <i class="iconfont" style="color: #FF1F1F;">&#xe64b;</i>
    <span style="color: #FF1F1F;font-weight: 600;float:left">{{latest_msg.type}}：</span>
    <div >{{latest_msg.message}}</div>
    <span>
      <a style="color: #44AAF6;">点击查看</a>
    </span>
  </div>
</template>

<script>
import config from "@/config";
import { mapGetters } from "vuex";
import { queryEvents, queryEventsCount } from "@/api/data";
import {FormatDate} from '@/libs/date_util'
export default {
  name: "home",
  data() {
    return {
      cur_max_message_num: 0,
      latest_msg: {},
      msg_show: true
    };
  },
  mounted() {
    this.beginLisitenEvent();
  },
  beforeDestroy()
  {
	  clearInterval(this.interval_);
  },
  components: {},
 
  methods: {
     ...mapGetters(["getMaxEventQueueLen"]),
    queryEventCount() {
      var cur_date_str = FormatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      var query = {
        tm: {
          $lte: cur_date_str
        }
      };
      const self = this;
      return new Promise((resove, reject) => {
        queryEventsCount(query)
          .then(d => {
            resove(d);
          })
          .catch(e => {
            reject();
          });
      });
    },
    queryLatestMsg() {
      var cur_date_str = FormatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      var query = {
        tm: {
          $lte: cur_date_str
        }
      };
      const self = this;
      return new Promise((resove, reject) => {
        queryEvents(query, 0, 1)
          .then(d => {
            resove(d.item_list.length ? d.item_list[0] : {});
          })
          .catch(e => {
            reject();
          });
      });
    },
    getMsgType(type) {
      return type == 1 ? "通知" : type == 2 ? "告警" : "紧急";
    },
    beginLisitenEvent() {
	  const self = this;
	  
      this.interval_ = setInterval(() => {
        self
          .queryEventCount()
          .then(count => {
            if (count != self.getMaxEventQueueLen()) {
              self
                .queryLatestMsg()
                .then(msg => {
                  self.latest_msg = {
                    dv: msg.da.msg.dv,
                    dt: msg.da.msg.dt,
                    tm: msg.tm,
                    type: self.getMsgType(msg.da.check.type),
                    message: msg.da.check.message
                  };
                  self.msg_show = true;
                  self.$store.commit('setMaxEventQueueLen',count);
                  setTimeout(() => {
                    self.msg_show = false;
                  }, 5000);
                })
                .catch(e => {
                  self.$Message.error("获取最新消息失败！");
                });
            }
          })
          .catch(e => {
            self.$Message.error("获取消息数量失败！");
          });
      }, config.event_listen_interval * 1000);
    },
    showErrorMsg() {}
  }
};
</script>
<style lang="less" scoped>
@import url("./Message.less");
</style>
