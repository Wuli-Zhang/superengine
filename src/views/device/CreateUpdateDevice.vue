<template>
	<div class="add-device">
		<Modal class="add-device-modal" noFooter="true" width="843" :title="modal_title" ref="modal" :modalVisible="modalVisible" @incrementOk="incrementOk" 
		@incrementCancel="incrementCancel">
			<Row class="modal-body">
				<Col span=13>
					<Form class='se-form ' ref="add_device_from" :model="formItem" :rules="formRules" :label-width="110">
						<FormItem prop="name" label="设备名称" >
							<Input v-model="formItem.name" placeholder="请输入设备名称"></Input>
						</FormItem>
						<FormItem prop="code" label="设备码">
							<Input v-model="formItem.code" placeholder="请输入设备码"></Input>
						</FormItem>
						<FormItem prop="label_list" label="设备标签">
							<Input v-model="formItem.input" placeholder="输入标签名并添加" style="width: 200px;"></Input>
							<Button class="se-btn" style="margin-left: 17px;" size="small" @click="handleAdd">添加标签</Button>
							<Tag v-for="(item,index) in formItem.label_list" :key="index" :name="item" closable @on-close="handleClose2">{{item}}</Tag>
						</FormItem>
						<FormItem prop="desc" label="设备描述">
							<Input type="textarea" :autosize="{minRows: 3,maxRows: 5}" v-model="formItem.desc" placeholder="请输入设备描述"></Input>
						</FormItem>
					</Form>
				</Col>
				<Col span=10 offset=1>
					<div id="add-device-map"></div>
					<p style="color: #0F243B;font-size: 16px;margin: 20px 0;">设备位置</p>
					<Form class='se-form' ref="from" :model="formItem" :rules="formRules" :label-width="60">
						<Row type="flex" justify="start">
							<Col span=12>
								<FormItem prop="lon"  label="经度">
									<InputNumber :min="-90" :max="90" :step="0.0001" @on-change = "onLatLonChange" v-model="formItem.lon" placeholder="请输入经度"></InputNumber>
								</FormItem>
							</Col>
							<Col span=12>
								<FormItem  prop="lat"  label="纬度">
									<InputNumber :min="-180" :max="180" :step="0.0001" @on-change = "onLatLonChange" v-model="formItem.lat" placeholder="请输入纬度"></InputNumber>
								</FormItem>
							</Col>
						</Row>
					</Form>
				</Col>
			</Row>
			
			<Row class="modal-foot">
				<Button class="se-btn" :disabled="loading" @click="incrementOk" type="primary" style="float: right;margin-left: 20px;">确定</Button>
				<Button class="se-btn" @click="incrementCancel" style="float: right;">取消</Button>
			</Row>
		</Modal>
	</div>
</template>

<script>
import Modal from "@/components/BaseModal.vue";
import { Ajax, createDevice,updateDevice } from "@/api/data";
export default {
  data() {
    return {
      modalVisible: false,
      loading: false,
      // count: [0, 1, 2],
      formItem: {
        name: "",
        code: "",
        input: "",
        label_list: [],
        desc: "",
        lat: 12.222,
        lon: 123.121233
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
      map: null,
      mode:"create",
      modal_title:"添加设备"
    };
  },
  props: ["device_type_id"],
  components: {
    Modal
  },
  mounted() {},
  methods: {
    show(deviceId) {
      this.mode = deviceId != undefined ? "update" : "create";
      this.modal_title = this.mode == 'update' ? "更新设备" :"添加设备"
      this.device_id = deviceId;
      this.modalVisible = true;

      if (this.mode == "update") {
        Ajax.getDevice(this.device_id).then(d => {
          this.formItem.name = d.name;
          this.formItem.code = d.code;
          this.formItem.label_list = d.label_list.split("|");
          this.initMap();
        });
        return;
      }

      this.$nextTick(() => {
        this.initMap();
      });
    },
    onLatLonChange()
    {
      this.marker.setLatLng([this.formItem.lat,this.formItem.lon]);
      this.map.setView([this.formItem.lat,this.formItem.lon]);
    },
    initMap() {
      if (!this.map) {
        this.map = L.map("add-device-map", {
          center: [31, 121],
          zoom: 1,
          crs: L.CRS.EPSG4326,
          attributionControl: false
        }).setView([this.formItem.lat,this.formItem.lon]);
        const layer = L.SeieLayer.wmts("http://t0.tianditu.gov.cn/vec_c/wmts", {
          layer: "vec",
          tilematrixSet: "c",
          format: "tiles",
          tk: "2e877828cc2071eef8b0d84d3684db81"
        }).addTo(this.map);

       
        this.marker =  L.marker([this.formItem.lat, this.formItem.lon]).addTo(this.map);
      
        this.map.on('click',(e)=>{
          this.formItem.lat = e.latlng.lat;
          this.formItem.lon = e.latlng.lng;
          this.marker.setLatLng(e.latlng);
        })
        // window.map = this.map;
        this.map._onResize();
      }
      else{
        // this.map
      }
    },
    handleAdd() {
      var slabel = this.formItem.input;

      if (slabel.length > 21 || slabel.length < 3) {
        this.$Message.error("标签长度在4-20位之间");
        return;
      }

      if (slabel.indexOf("|") != -1) {
        this.$Message.error("标签不能包含特殊字符");
        return;
      }

      this.formItem.label_list.push(slabel);
    },
    handleClose2(event, name) {
      const index = this.formItem.label_list.indexOf(name);
      this.formItem.label_list.splice(index, 1);
    },
    incrementOk() {
      const self = this;
      this.$refs.add_device_from.validate(valid => {
        if (valid) {
          var { code, name, label_list} = this.formItem;
          var postData = {
            code,
            name,
            label_list:label_list.join("|"),
            type_id: this.device_type_id,
            loc_x:this.formItem.lon,
            loc_y:this.formItem.lat
          };

          if (this.mode == "create") {
            createDevice(postData)
              .then(d => {
                self.$Message.success("创建设备成功！");
                self.incrementCancel();
                self.$emit("onsuccess");
              })
              .catch(e => {
                self.$Message.error("创建设备失败!");
              });
          } else {
            updateDevice(this.device_id,postData).then(d=>{
                self.$Message.success("更新设备成功！");
                self.incrementCancel();
                self.$emit("onsuccess");
            }).catch(e=>{
                 self.$Message.error("更新设备失败!");
            })

          }
        } else {
          self.$Message.error("请核对输入信息！");
          return;
        }
      });

      this.modalVisible = false;
    },
    incrementCancel() {
      this.modalVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./CreateUpdateDevice.less");
</style>
