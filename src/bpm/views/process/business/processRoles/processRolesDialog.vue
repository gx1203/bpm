<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" label-width="auto" class="content">
      <el-form-item :label="$t('approvalRole') + '：'" required>
        <el-input clearable v-model="item.people" />
      </el-form-item>
      <!-- <el-form-item :label="$t('organization') + '：'" required>
        <el-input clearable type="textarea" v-model="item.organization" @focus="orgizationFocus" />
        <div class="admin-div">
          <div>
            <p v-for="(v, index) in adminList" :key="index">{{v.cnname}}</p>
          </div>
          <el-button title="选择" type="primary" @click="adminHandle">选择</el-button>
          <el-button title="清空" @click="emptyHandle">清空</el-button>
        </div>
      </el-form-item> -->
      <el-form-item :label="$t('specificPerson') + '：'" required>
        <el-input clearable type="textarea" v-model="item.rolesuser" @focus="adminHandle" />
        <!-- <div class="admin-div">
          <div>
            <p v-for="(v, index) in adminList" :key="index">{{v.cnname}}</p>
          </div>
          <el-button title="选择" type="primary" @click="adminHandle">选择</el-button>
          <el-button title="清空" @click="emptyHandle">清空</el-button>
        </div>-->
      </el-form-item>
      <el-form-item :label="$t('remarks') + '：'" >
        <el-input clearable type="textarea" v-model="item.remark"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
    <choose-process-dialog
      :isMore="true"
      :itemList="item.processList"
      v-model="processVisible"
      @confirm="handleProcess"
    />
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="orgtitle"
      :multiple="basOrganieationMultiple"
      @fnCallBack="fnBasOrganieationCallBack"/>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import chooseProcessDialog from "@/bpm/components/chooseProcess";
import {
  getProcessRolesById,
  saveProcessRoles
} from '@/bpm/api/process/business/process_roles'
import { getOrgTree } from "@/bpm/api/app";
import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'
export default {
  components: {
    chooseProcessDialog,
  },
  data () {
    return {
      organieationShow:false,
      selectedElement: {},
      showElement:[],
      selectElement: ["9"],
      orgtitle:'',
      basOrganieationMultiple:true,
      basOrganieationType:'',
      dialogVisible: this.value,
      processVisible: false,
      item: {}
      // rules: {
      //   people: [
      //     { required: true, message: "请输入审批角色", trigger: "blur" }
      //   ],
      //   organization: [
      //     { required: true, message: "请选择组织", trigger: ["blur",'change',"input"] }
      //   ],
      //   remark: [
      //     { required: true, message: "请输入适用审批流", trigger: "blur" }
      //   ],
      //   rolesuser: [
      //     { required: true, message: "请选择具体人", trigger: ["blur",'change',"input"] }
      //   ]
      // },
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    itemId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: false
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      this.item = {}
      if (val && this.itemId) {
        this.getData()
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    chooseProcess() {
      this.processVisible = true;
    },
    handleProcess(data) {
      this.item.remark = data.map(item => item.processnamecn).join(",");
      this.item.processList = data.map(item => {
        return {
          processName: item.processnamecn,
          id: item.id
        };
      });
    },
    getData () {
      getProcessRolesById(this.itemId)
        .then(rt => {
          this.item = rt.data
        })
        .catch(() => {})
    },
    isVerify () {
      if (!this.item.people) {
        this.$message.error(this.$t('placeholderText.pleaseEnter') + this.$t('approvalRole'))
        return false
      }  
      // else if (!this.item.organization) {
      //   this.$message.error(this.$t('placeholderText.pleaseSelect') + this.$t('organization'))
      //   return false
      // } 
      else if (!this.item.rolesuser) {
        this.$message.error(this.$t('placeholderText.pleaseSelect') + this.$t('specificPerson'))
        return false
      }
      return true
    },
    submit (formName) {
      if (!this.isVerify()) return
      saveProcessRoles(this.item)
        .then(rt => {
          if (rt.status === '200') {
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: 'success'
            })
            this.dialogVisible = false
            this.$emit('confirm', true)
          } else {
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: 'error'
            })
          }
        })
        .catch(() => {
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        })
    },
    emptyHandle () {
      this.adminList = []
      this.$forceUpdate()
    },
    adminHandle () {
      this.basOrganieationType = 'user'
      this.selectElement = ["9"]
      this.basOrganieationMultiple = true
      this.selectedElement = {};
      if (this.item.rolesuserId) {
        let list = this.item.rolesuser.split(",").join("&");
        let idType = []
        this.item.rolesuserId.split(",").forEach((item, i) => {
          idType.push(`${item}-9`)
        });
        this.selectedElement = {
          id: this.item.rolesuserId.split(","),
          name: list,
          idType: idType.join(";"),
        }
      }
      this.organieationShow = true;
    },
    cancel () {
      this.dialogVisible = false
    },
    fnBasOrganieationCallBack(data) {
      if(this.basOrganieationType === 'org'){
        this.item.organization = data.name
        this.item.organizationid = data.id
      }else{
        this.item.rolesuser = data.name.split("&").join(',')
        this.item.rolesuserId = data.id
      }
      this.organieationShow = false;
    },
    orgizationFocus() {
      this.basOrganieationType = 'org'
      this.selectElement = ["0","1","2","3","4","5"]
      this.basOrganieationMultiple = false
      this.selectedElement = {};
      if (this.item.organizationid) {
        this.getOrgTree(this.item.organizationid);
      }else{
        this.organieationShow = true;
      }
    },
    getOrgTree(ids) {
      getOrgTree({
        logic: "and",
        filters: [{ key: "id", opt: "IN", type: "S", value: ids }],
        pageNum: 1,
        pageSize: 10000,
      })
        .then(rt => {
          if (rt.status === "200") {
            this.selectedElement = {
              id: rt.data.list.map(item=>item.id).join(','),
              name: rt.data.list.map(item=>item.name).join('&'),
              idType: rt.data.list.map(item=>{return `${item.id}-${item.type}`}).join(';'),
            };
            this.organieationShow = true;
          }
        })
        .catch(er => {
        });
    },
  },
  mounted () {
  }
}
</script>
<style lang="scss">
.admin-div {
  button {
    margin-left: 15px;
  }
}
</style>

<style lang="scss" scoped>
.admin-div {
  display: flex;
  overflow: hidden;
  align-items: center;
  div {
    width: calc(100% - 180px);
    border: 1px solid $dc1;
    border-radius: 3px;
    width: 100%;
    height: 140px;
    overflow: auto;
    padding: 5px;
    button {
      margin-left: 15px;
    }
    p {
      height: 28px;
      line-height: 28px;
      &:hover {
        background-color: $bc2;
      }
    }
  }
}
</style>

<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
  padding: 0 10px;
}
</style>
