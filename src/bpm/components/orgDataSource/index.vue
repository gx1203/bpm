<template>
  <el-dialog :title="itemData.fieldShowName + '-' + $t('organizationalDataSourceConfig')" :visible.sync="dialogVisible" v-loading="loading" top="15vh" width="700px" @close="closeDialog" append-to-body>
    <el-form :model="formData" ref="formData" label-width="65px">
      <p class="red margin-b10">{{$t('hintText.notConfigDefaultAllCompanies')}}</p>
      <el-row>
        <el-col :span="12">
          <el-form-item label="组织范围">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="1">{{$t('applicantOrganization')}}</el-checkbox>
              <el-checkbox label="2">{{$t('customCompany')}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="itemData.inputType === 'selectPeopleSingle' || itemData.inputType === 'selectPeopleMore'">
          <el-form-item label="默认值">
            <el-radio-group v-model="formData.defaultUser">
              <el-radio label="0">无</el-radio>
              <el-radio label="1">申请人</el-radio>
              <el-radio label="2">申请人直属上级</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="checkList.includes('2')">
        <el-col :span="24">
          <el-form-item :label="$t('selectOrganizational')">
            <el-input v-model="formData.orgName" type="textarea" placeholder="" @focus="selectOrg"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('remarks')">
            <el-input v-model="formData.remarks" type="textarea" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </span>
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
  </el-dialog>
</template>
<script>
import {
  saveSelectOrg,
  getNodeOrgs
} from "@/bpm/api/process/processModeling/classificationModel";
import Vue from 'vue'
import BasComponent from "bas-component";
Vue.use(BasComponent);
import "bas-component/lib/BasComponent.css";
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      dialogVisible: this.value,
      loading: false,
      formData: {
        orgName: '',
        orgs: '',
        orgType: '',
        selectType: '',
        defaultUser: '0',
        remarks: ''
      },
      checkList: [],
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ["0", "1", "2"],
      orgtitle: this.$t('selectOrganizational')
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.getData()
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    closeDialog () {
      setTimeout(() => {
        this.formData = {
          orgName: '',
          orgs: '',
          orgType: '',
          selectType: '',
          defaultUser: '0',
          remarks: ''
        }
        this.selectedElement = {}
        this.checkList = []
      }, 1000)
    },
    selectOrg() {
      this.selectedElement = {};
      this.$nextTick(() => {
        let formData = JSON.parse(JSON.stringify(this.formData))
        if (formData.orgs) {
          this.$set(this.selectedElement, 'id', formData.orgs)
          // this.$set(this.selectedElement, 'id', '1376031852199968,1378213550882850')
          // this.$set(this.selectedElement, 'name', 'hhhhhhhhhhhhh&新增维度1')
          this.$set(this.selectedElement, 'name', formData.orgName.split(",").join("&"))
          // this.$set(this.selectedElement, 'idType', '1376031852199968-0;1378213550882850-0')
          this.$set(this.selectedElement, 'idType', formData.orgType)
        }
        this.organieationShow = true
      })
    },
    fnBasOrganieationCallBack(data) {
      this.$set(this.formData, "orgName", data.name.split("&").join(","));
      this.$set(this.formData, "orgs", data.id);
      this.$set(this.formData, "orgType", data.idType);
      this.organieationShow = false;
    },
    getData () {
      this.loading = true
      getNodeOrgs(this.itemData.id).then(rt => {
        this.loading = false
        if (rt.status === '200' && rt.data) {
          this.formData = rt.data
          this.checkList = this.formData.selectType.split(',')
          this.$forceUpdate()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    submit() {
      let formData = JSON.parse(JSON.stringify(this.formData))
      if (!this.checkList.includes('2')) {
        formData = {}
      }
      if (this.checkList.includes('2') && !this.formData.orgName) {
        this.$message({
          message: this.$t('placeholderText.pleaseSelectOrganization'),
          type: 'error'
        })
        return
      }
      this.loading = true
      saveSelectOrg({
        ...formData,
        id: this.itemData.id,
        selectType: this.checkList.join(),
        remarks: this.formData.remarks,
        defaultUser: this.formData.defaultUser
      }).then(rt => {
        this.loading = false
        if (rt.status === '200') {
          this.$message({
            message: this.$t('hintText.saveSuccessfully'),
            type: 'success'
          })
          this.$emit("confirm");
          this.dialogVisible = false;
        }
      }).catch(() => {
        this.loading = false
      })
    },
    cancel() {
      this.dialogVisible = false;
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
</style>
