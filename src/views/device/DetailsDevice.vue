<template>
    <div class="details-device">
        <Modal class="details-device-modal" :modalVisible="modalVisible" :title='modal_title' :noFooter="true" :width="584" @incrementOk="incrementOk" @incrementCancel='incrementCancel'>
            <vue-scroll>
                <Form class='device_form' :model="formItem" :label-width="80" label-position='right'>
                    <Row>
                        <Col span='4'>
                        <p style="padding: 10px 0 12px 10px;font-size:14px;font-family:'SourceHanSansCN-Regular';color:#0F243B;cursor:default;">基本信息</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span='12'>
                        <FormItem label="设备名称:">
                            <Input v-model="formItem.name" disabled></Input>
                        </FormItem>
                        <Row>
                            <Col span=12>
                            <FormItem label="经度:">
                                <Input v-model="formItem.lon" disabled></Input>
                            </FormItem>
                            </Col>
                            <Col span=12>
                            <FormItem label="纬度:">
                                <Input v-model="formItem.lat" disabled></Input>
                            </FormItem>
                            </Col>
                        </Row>
                        </Col>
                        <Col span='12'>
                        <FormItem label="设备码:">
                            <Input v-model="formItem.code" disabled></Input>
                        </FormItem>
                        <FormItem label="设备描述:">
                            <Input v-model="formItem.input" type="textarea" :autosize="{minRows: 2,maxRows: 5}" disabled></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span='4'>
                        <Icon style='padding: 10px 0 12px 10px;font-size:16px;color:#44AAF6;float:left;' type="ios-arrow-dropright" />
                        <p style="float:left;padding: 10px 0 12px 1px;font-size:14px;font-family:'SourceHanSansCN-Regular';color:#44AAF6;line-height:16px;cursor:default;">更多信息</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span='4'>
                        <Icon style='padding: 10px 0 12px 10px;font-size:16px;color:#0F243B;float:left;' type="ios-arrow-down" />
                        <p style="float:left;padding: 10px 0 12px 1px;font-size:14px;font-family:'SourceHanSansCN-Regular';color:#0F243B;line-height:16px;cursor:default;">详细信息</p>
                        </Col>
                    </Row>
                    <Row class='xiangxixinxi'>
                        <Col span=12>
                        <template v-for='(details_device_item ,key) in formItem.device_arr1'>
                            <FormItem :label="key">
                                <Input v-model="formItem.device_arr1[key]"></Input>
                            </FormItem>
                        </template>
                        </Col>
                        <Col span='12'>
                        <template v-for='(details_device_item ,key) in formItem.device_arr2'>
                            <FormItem :label="key">
                                <Input v-model="formItem.device_arr2[key]"></Input>
                            </FormItem>
                        </template>
                        </Col>
                    </Row>
                </Form>
            </vue-scroll>
            <Row>
                <Button class="se-btn" :disabled="false" @click="incrementOk" type="primary" style="float: right;margin-left: 20px;">确定</Button>
                <Button class="se-btn" @click="incrementCancel" style="float: right;" type="primary" ghost>取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import Modal from '@/components/BaseModal.vue'
import { Fetch, commonFetcdh } from '@/libs/fetch'
export default {
    data() {
        return {
            modalVisible: false,
            modal_title: '设备详情',
            devicecode: '',
            device_id: '',
            formItem: {
                code: '',
                label_list: '',
                lat: '',
                lon: '',
                name: '',
                device_arr1: {},
                device_arr2: {}
            }
        }
    },
    props: [],
    components: { Modal },
    methods: {
        show(data) {
            if (data) {
                this.formItem.name = data.row.name
                this.formItem.code = data.row.code
                this.formItem.lat = data.row.lat
                this.formItem.lon = data.row.lon
                this.device_id = data.row.data_id
                this.devicecode = data.row.code.split("_")[1]
                
                const opt = {
                    url: `http://192.168.1.187:3000/api/sjc_dj?_where=(JH,eq,${this.devicecode})`,
                    method: 'get'
                }
                Fetch(opt, (respon) => {
                    let data = respon[0]
                    Object.keys(data).forEach((item, index) => {
                        index % 2 == 0 ? this.formItem.device_arr1[item] = data[item] : this.formItem.device_arr2[item] = data[item]
                    })
                    this.modalVisible = !this.modalVisible
                })

            }
        },
        incrementOk() {
            let postData = {
                ...this.formItem.device_arr1,
                ...this.formItem.device_arr2
            }
            this.modalVisible = !this.modalVisible
        },
        incrementCancel() {
            this.modalVisible = !this.modalVisible
        }
    }
};
</script>
<style lang="less" scoped>
@import url("./DetailsDevice.less");
</style>