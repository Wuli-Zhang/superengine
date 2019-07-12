<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <span class="user-name">HI:{{user.name}}</span>
      <!-- <Badge :dot="!!messageUnreadCount"> -->
      <!-- <Avatar :src="userAvatar"/> -->
      <img src="../../assets/se-col.png">
      <!-- </Badge> -->
      <Icon type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">
          消息中心
          <Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import "./user.less";
import { mapActions, mapGetters } from "vuex";
import { setCookie, getCookie, delCookie } from "@/libs/util";
import {
  setLocalStore,
  getLocalStore,
  removeLocalStore,
  clear
} from "@/libs/local";
export default {
  name: "User",
  props: {
    userAvatar: {
      type: String,
      default: ""
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    user: {
      get() {
        return this.getUser();
      },
      set(val) {}
    }
  },
  methods: {
    ...mapActions([]),
    ...mapGetters(["getUser"]),
    logout() {
      const self = this;
      this.$Modal.confirm({
        title: "退出登录",
        content: "确认退出登录？",
        onOk: function() {
          self.$store.commit("setUser", null);
          delCookie("user_name");
          delCookie("user_password");
          removeLocalStore("user");
          removeLocalStore("token");
          self.$router.push({
            name: "login"
          });
        }
      });
    },
    message() {},
    handleClick(name) {
      switch (name) {
        case "logout":
          this.logout();
          break;
        case "message":
          this.message();
          break;
      }
    }
  }
};
</script>
