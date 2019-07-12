<template>
  <div class="plugin-inner">
    <Form
      class="plugin-form"
      ref="plugin_from"
      :model="formItem"
      :rules="formRules"
      :label-width="140"
     
    >
      <FormItem prop="type" label="请选择预处理算例" >
        <Select v-model="formItem.type">
          <Option value="1">不同时间点的数值相减</Option>
         
        </Select>
      </FormItem>
      <p class="param-setting">参数设置</p>
       <FormItem prop="value_path" label="处理字段" >
        <Select v-model="formItem.value_path">
           <Option v-for = "item in data_templates" :key="item.json_root" :value="item.json_root">{{item.show_name}}</Option>
        </Select>
      </FormItem>
       <FormItem prop="time_path" label="时间字段" >
       <Select v-model="formItem.time_path">
           <Option v-for = "item in data_templates_date" :key="item.time_path" :value="item.json_root">{{item.show_name}}</Option>
        </Select>
      </FormItem>
      <FormItem prop="prefix" label="新生成字段前缀" >
        <Input v-model="formItem.prefix" placeholder="请输入生成数据字段的前缀"/>
      </FormItem>
    </Form>
  </div>
</template>

<script>
// import Modal from "@/components/BaseModal.vue";
// import { Ajax, createDevice,updateDevice } from "@/api/data";
export default {
  data() {
    return {
      formItem: {},
      formRules: {},
      data_templates_date:[]
    };
  },
  props: ["plugin_data","data_templates"],
  components: {
    // Modal
  },
  mounted() {
    this.data_templates_date = this.data_templates.filter(dd=>{
      return dd.data_type == 'datetime';
    })

    this.formItem = this.plugin_data;

    $.extend(
      true,
      this.formItem,
      {
        type: "1",
        value_path: "",
        time_path: "",
        prefix: ""
      },
      $.extend({}, this.plugin_data)
    );
  },
  methods: {}
};
</script>

<style lang="less" scoped>
@import url("./Preprocess.less");
</style>
