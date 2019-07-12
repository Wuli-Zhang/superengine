<template>
  <Modal
    class="upload-device-modal"
    
    title="批量上传设备"
    ref="modal"
    v-model="modalVisible"
     @on-ok="incrementOk"
    @on-cancel="incrementCancel"
  >
    <Upload :before-upload="handleUpload" action="//jsonplaceholder.typicode.com/posts/">
      <Button  icon="ios-cloud-upload-outline">请选择文件</Button>
	  <div v-if= "!!file">{{file.name}}</div>
    </Upload>
  </Modal>
</template>

<script>
import {uploadDevices} from "@/api/data";
export default {
  data() {
    return {
	  file:null,
	  modalVisible:false
    };
  },
  props:['device_type_id'],
  methods: {
    handleUpload(file) {
      let fileType = true;
      if (file.name.indexOf("csv") === -1) {
        fileType = false;
      }
      if (!file.name || !fileType) {
        this.$Message.error("请上传csv后缀的文件格式。");
        return false;
      }
      this.file = file;
      return false;
	},
	show()
	{
		this.modalVisible = true;
		this.initData();
	},
	initData()
	{
		
	},
	incrementCancel()
	{
		this.modalVisible = false;
	},
	incrementOk() {
      if (!this.file) {
        this.$Message.error("请选择csv文件进行上传！");
        // this.$refs.base_moadl.setLoading();
        return false;
      }
      const seis = this.$store.state.seis;
      const fileUrl = new FormData();
      const _this = this;
      //_this.update_loading = true;
	  fileUrl.append("data", this.file);

	  uploadDevices(this.device_type_id,fileUrl).then(res=>{
		  
		  if(res.every(dd=>{
			  return typeof dd == 'number';
		  }))
		  {
			  this.$Message.info(`成功上传（更新）了${res.length}个设备！`)
		  }

		  var errors = res.filter(dd=>{
			  return typeof dd == 'object' && dd.message;
		  }).map(dd=>{
			  return `<p>${dd.message}</p>`;
		  })
		  const self = this;
		  this.$Modal.info({
			  title:"上传结果分析",
			  content:`<p>成功上传（更新）了${res.length - errors.length}条数据。</p><p>失败了${errors.length}条数据。原因是:</p>${errors.join('')}`,
			  onOk:()=>
			  {
				  self.$emit('onsuccess')
			  }
		  })

	  }).catch(e=>{
		  this.$Message.error(e.message);
	  })
    //   $.ajax({
    //     type: "post",
    //     url: this.uploadUrl,
    //     data: fileUrl,
    //     processData: false,
    //     contentType: false,
    //     success: function(data) {
    //       //_this.update_loading = false;
    //       if (!data || !data.status || data.status !== "$SUCCESS") {
    //         _this.$Message.error(
    //           _this.se_lan.INDEX.SERVICE.message.json_type_err
    //         );
    //         return;
    //       }
    //       _this.$Message.success(
    //         _this.se_lan.INDEX.SERVICE.message.upload_data_suc
    //       );
    //       _this.firstGet();
    //       _this.$refs.base_moadl.setLoading();
    //       _this.uploadCancel();
    //     },
    //     error: function() {
    //       //_this.update_loading = false;
    //       _this.$refs.base_moadl.setLoading();
    //       _this.$Message.error(
    //         _this.se_lan.INDEX.SERVICE.message.upload_data_err
    //       );
    //     }
    //   });
    },
  }
};
</script>
