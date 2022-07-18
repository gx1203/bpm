<template>
  <el-dialog id="staffManageInfo" :title="title" :visible.sync="dialogVisible">
    <el-form :model="item" ref="item" label-width="auto" class="content">
      <div class="card1">
        <div class="header">
          <span class="title">{{$t('basicInformation')}}</span>
        </div>
        <div class="card-info">
          <el-row align="left">
            <el-col :span="12">
              <el-form-item :label="$t('workNumber') + '：'">{{item.empid}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别：">{{item.sex ==='1'?'男':'女'}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('chineseName') + '：'">{{item.cnname}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('englishName') + '：'">{{item.enname}}</el-form-item>
            </el-col>
  <el-col :span="12">
              <el-form-item label="部门：">{{item.deptName}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item l:label="$t('post') + '：'">{{item.defaultposname}}</el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="card1">
        <div class="header">
          <span class="title">联系方式</span>
        </div>
        <div class="card-info">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('phone') + '：'">{{item.phone}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机短号1：">{{item.phone1_s}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话2：">{{item.phone2}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机短号2：">{{item.phone2_s}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="家庭电话：">{{item.homemobile}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="办公室电话：">{{item.officephone}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="移动电话：">{{item.mobilephone}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="固定电话2：">{{item.tel2}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分机号码：">{{item.extension}}</el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="card1">
        <div class="header">
          <span class="title">用户地址</span>
        </div>
        <div class="card-info">
          <el-row>
            <el-col :span="12">
              <el-form-item label="家庭住址：">{{item.homeaddress}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="户口地址：">{{item.hukoaddress}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="其他地址：">{{item.oth2address}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="永久地址：">{{item.permaddress}}</el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
         <div class="card1">
        <div class="header">
          <span class="title">用户邮箱</span>
        </div>
        <div class="card-info">
          <el-row>
            <el-col :span="12">
              <el-form-item label="个人邮箱：">{{item.homeemail}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('mail') + '：'">{{item.email}}</el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
       <div class="card1">
        <div class="header">
          <span class="title">组织架构</span>
        </div>
        <div class="card-info">
          <el-row>  
            <p v-for="(val,index) in item.positionName" :key='index'>{{val}}</p>
          </el-row>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">返 回</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getUserDetails } from '@/bpm/api/configManage/institutionalFramework/post_manage'

export default {
  data () {
    return {
      dialogVisible: this.value,
      item: {}
    }
  },
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.getUserDet()
      }
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    getUserDet () {
      getUserDetails(this.detail.id).then(rt => {
        if (rt.status === '200') {
          this.item = rt.data
        }
      })
    },
    cancel () {
      this.dialogVisible = false
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
.content {
  height: 50vh;
  margin: 0 auto;
  overflow: auto;
}
</style>
<style lang="scss">
#staffManageInfo {
  .card1 {
    padding: 0 5px 15px 15px;
    background: white;
    overflow: hidden;
    transition-duration: 0.5s;
    box-sizing: border-box;
    height: auto;
    .header {
      margin-right: 10px;
      border-bottom: 1px solid $dc1;
      margin-bottom: 10px;
      display: flex;
      .title {
        height: 35px;
        line-height: 35px;
        color: $tc1;
        font-weight: bold;
      }
      .space {
        flex-grow: 1;
      }
    }
    .card-info {
      .el-form-item__label {
        font-size: 12px;
        // font-weight: bold;
        color: $tc1;
      }
      .el-form-item--mini.el-form-item {
        margin-bottom: 0px;
      }
    }
  }
}
</style>
