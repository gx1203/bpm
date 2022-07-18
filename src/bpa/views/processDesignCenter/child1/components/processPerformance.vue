<template>
  <div class="w100">
    <el-row class="margin-b15">
      <el-col :span="6" :offset="18" class="clear-fix">
        <el-button class="float-r margin-l10" v-if="existTabField('batchDelete', 'refer')"   :disabled="seltargetlist.length == 0" @click="deltargetMore">
          {{existTabField('batchDelete', '', true)}}</el-button>
        <el-button class="float-r" v-if="existTabField('add', 'refer')" @click="addKpiIndicators('add')" type="primary" >{{existTabField('add', '', true)}}</el-button>
      </el-col>
    </el-row>
    <!-- 流程绩效 -->
    <el-table :data="processVallist" class="main_tab" stripe @selection-change="handletargetChange" v-loading="loading">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column v-if="existTabField('number', 'refer')" :label="existTabField('number', '', true)" type="index"
        width="50"></el-table-column>
      <el-table-column v-if="existTabField('kpiName', 'refer')" prop="name" show-overflow-tooltip
        :label="existTabField('kpiName', '', true)"></el-table-column>
      <el-table-column v-if="existTabField('description', 'refer')" prop="description" show-overflow-tooltip
        :label="existTabField('description', '', true)"></el-table-column>
      <!--<el-table-column v-if="existTabField('target', 'refer')" prop="target" show-overflow-tooltip-->
      <!--  :label="existTabField('target', '', true)"></el-table-column>-->
      <el-table-column v-if="existTabField('remarks', 'refer')" prop="remark" show-overflow-tooltip :label="existTabField('remarks', '', true)"></el-table-column>
      <el-table-column prop="exname" show-overflow-tooltip :label="$t('KPIValues')"></el-table-column>
      <el-table-column prop="pvalue1" show-overflow-tooltip :label="$t('plannedValue1')"></el-table-column>
      <el-table-column prop="pvalue2" show-overflow-tooltip :label="$t('plannedValue2')"></el-table-column>
      <el-table-column prop="threshold" show-overflow-tooltip :label="$t('Threshold')"></el-table-column>
      <el-table-column width="120" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top" v-if="existTabField('add', 'refer')">
            <el-button class="no-border" type="text" icon="el-icon-edit" @click="addKpiIndicators('edit', scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top" v-if="existTabField('batchDelete', 'refer')">
            <el-button class="no-border" icon="el-icon-delete" type="text" @click="deltargetOne(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleProcessChange" :current-page="processpages.pageNum" background
      layout="prev, pager, next, jumper, total" :total="processpages.total"></el-pagination>

    <!-- 流程绩效 -->
    <add-kpi-indicators v-model="isprocessVisible" :modelid="modelid" :showtabfiled="showtabfiled" :editItem="editItem" @confirm="getValuelist(1)" />
<!--    <el-dialog :title="existTabField('addIndicators', '', true)" :visible.sync="isprocessVisible"-->
<!--      :append-to-body="true">-->
<!--      <el-form label-width="110px" label-position="right" ref="processRef" :model="targetform" :rules="targetrules">-->
<!--        <el-form-item v-if="existTabField('targetNameDialog', 'refer')" :label="existTabField('targetNameDialog')"-->
<!--          prop="name">-->
<!--          <el-input v-model="targetform.name"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item v-if="existTabField('descDialog', 'refer')" :label="existTabField('descDialog')" prop="desc">-->
<!--          <el-input type="textarea" v-model="targetform.desc" rows="4" resize="none"></el-input>-->
<!--        </el-form-item>-->
<!--        &lt;!&ndash;<el-form-item v-if="existTabField('kpiValue', 'refer')" :label="existTabField('kpiValue')" prop="target">&ndash;&gt;-->
<!--        &lt;!&ndash;  <el-input type="number" v-model="targetform.target"></el-input>&ndash;&gt;-->
<!--        &lt;!&ndash;</el-form-item>&ndash;&gt;-->
<!--        <el-form-item v-if="existTabField('comments', 'refer')" :label="existTabField('comments')" prop="remarks">-->
<!--          <el-input type="textarea" rows="4" v-model="targetform.remarks" resize="none"></el-input>-->
<!--        </el-form-item>-->
<!--        <div class="setExpress-wrapper">-->
<!--          <el-form-item class="set-item" label="KPI值" prop="exname">-->
<!--            <el-input disabled type="text" rows="4" v-model="targetform.exname" resize="none"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-button class="setExpress" type="primary" @click="openSetDialog">设定公式</el-button>-->
<!--        </div>-->
<!--        <el-form-item label="计划值1" prop="pvalue1">-->
<!--          <el-input type="text" v-model="targetform.pvalue1"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="计划值2" prop="pvalue2">-->
<!--          <el-input type="text" v-model="targetform.pvalue2"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="阀值(MinMax)" prop="threshold">-->
<!--          <el-input type="text" v-model="targetform.threshold"></el-input>-->
<!--        </el-form-item>-->
<!--        <div class="form-group">-->
<!--          <label class="control-label bg-transparent">图例</label>-->
<!--          <div class="col-sm-10">-->
<!--            <p class="targetSign bg-lightGreen">计划值1 < KPI值</p>-->
<!--            <p class="targetSign bg-yellow">计划值2 < KPI值 ≤ 计划值1</p>-->
<!--            <p class="targetSign bg-red">阈值 < KPI值 ≤ 计划值2</p>-->
<!--            <p class="targetSign bg-lightGray">KPI值 ≤ 阈值</p>-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-form>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button @click="isprocessVisible = false">{{$t("cancel")}}</el-button>-->
<!--        <el-button type="primary" @click="confirmProcess">{{$t("confirm")}}</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->
    <!-- 设置指标公式 -->
    <!-- <el-dialog title="设定公式" :visible.sync="setexpressFlag"
               :append-to-body="true">
      <div class="modalDialogSetting dialog-content">
        <div class="dialog_body tabsContent">
          <div class="dialog_wrapper clearfix">
            <div class="left">
              <div class="organization active common">公式</div>
              <div class="usually common">子节点</div>
            </div>
            <div class="w500px float-l">
              <div class="showExpression">
                <form class="form-horizontal">
                  <div class="form-group targetCode">
                    <label class="col-sm-2 control-label remove-padding-r remove-padding-l bg-transparent">计算符</label>
                    <div class="col-sm-10 calculator">
                      <button type="button" class="btn btn-primary btn-sm">+</button>
                      <button type="button" class="btn btn-primary btn-sm">-</button>
                      <button type="button" class="btn btn-primary btn-sm">*</button>
                      <button type="button" class="btn btn-primary btn-sm">/</button>
                      <button type="button" class="btn btn-primary btn-sm">()</button>
                      <br/>
                      <button type="button" class="btn btn-primary btn-sm">sum()</button>
                      <button type="button" class="btn btn-primary btn-sm">avg()</button>
                      <button type="button" class="btn btn-primary btn-sm">max()</button>
                      <button type="button" class="btn btn-primary btn-sm">min()</button>
                      <button type="button" class="btn btn-primary btn-sm">count()</button>
                    </div>
                  </div>
                  <div class="form-group targetName">
                    <label class="col-sm-2 control-label remove-padding-r remove-padding-l bg-transparent required">业务字段</label>
                    <div class="col-sm-4">
                      <select class="form-control busineField">
                      </select>
                    </div>
                    <label class="col-sm-2 control-label remove-padding-r remove-padding-l bg-transparent required">流程字段</label>
                    <div class="col-sm-4">
                      <select class="form-control processField">
                      </select>
                    </div>
                  </div>
                  <div class="form-group expression">
                    <label class="col-sm-2 control-label remove-padding-r remove-padding-l bg-transparent">订单交付及时率=</label>
                    <div class="col-sm-10">
                      <textarea class="form-control" rows="3" resize="none"></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div class="showExpression">
              </div>
            </div>

          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary">确定</el-button>
        <el-button type="primary">重制</el-button>
        <el-button @click="setexpressFlag = false">取消</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import {
  getprocessValue,
  saveTarget,
  delTarget
} from '@/bpa/api/processDesignCenter'

import fileOperation from '@/bpa/mixins/fileDownView'
import addKpiIndicators from '@/bpa/components/kpiIndicators/addKpiIndicators.vue'
const filetypes = [
  {
    label: '流程输出文件',
    id: '7A88687D266A3D7CE053BF1A13ACD2C3'
  },
  {
    label: '其他流程相关文件',
    id: '7A88EC3856C446EBE053BF1A13ACC390'
  },
  {
    label: '输入',
    id: '7B4DBBED904B1C5DE053BF1A13AC64F1'
  },
  {
    label: '输出',
    id: '7B4DBBED904E1C5DE053BF1A13AC64F1'
  },
  {
    label: 'QMS',
    id: '7B000C586A5D3A31E053BF1A13AC8D0A'
  },
  {
    label: 'EMS',
    id: '7B000D65C18D3A0DE053BF1A13AC5F6B'
  },
  {
    label: 'OHSAS',
    id: '7B000C586A603A31E053BF1A13AC8D0A'
  },
  {
    label: 'EnMs',
    id: '7B3D9B5F12664172E053BF1A13AC131E'
  },
  {
    label: '业务规则',
    id: '7BC636EDF11967C0E0530701A8C06A7D'
  },
  {
    label: '流程输入文件',
    id: '6CCAFE3781CA4875E053BF1A13AC0E97'
  }
]

export default {
  name: 'processPerformance',
  components:{
    addKpiIndicators
  },
  data () {
    return {
      // 流程绩效
      isprocessVisible: false,
      processVallist: [],
      processpages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      loading: false,
      targetform: {
        name: '',
        desc: '',
        target: '',
        exname: '', // 指标显示值
        pvalue1: '', // 目标值1
        pvalue2: '', // 目标值2
        threshold: '', // 阀值
        kpiformulaid: '' // 指标公式ID
      },
      targetrules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        desc: [{ required: true, message: ' ', trigger: 'blur' }],
        // target: [{ required: true, message: ' ', trigger: 'blur' }],
        exname: [{ required: true, message: ' ', trigger: 'blur' }],
        pvalue1: [{ required: true, message: ' ', trigger: 'blur' }],
        pvalue2: [{ required: true, message: ' ', trigger: 'blur' }],
        threshold: [{ required: true, message: ' ', trigger: 'blur' }],
      },
      seltargetlist: [],
      editItem: {}
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    download () {
      return this.host + '/attach/download/'
    },
    viewfile () {
      return this.host + '/document/print/'
    },
    userid () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    username () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    }
  },
  props: {
    showtabfiled: {
      type: Array,
      default: () => []
    },
    modelid: {
      type: String,
      default: ''
    }
  },
  mixins: [fileOperation],
  watch: {
    showtabfiled (val) {
      console.log(val)
      this.getValuelist(1)
    }
  },
  methods: {
    addKpiIndicators (type, item) {
      this.editItem = {}
      this.isprocessVisible = true
      if (type === 'edit') {
        this.editItem = Object.assign({}, item);
      }
    },
    // 判断条件
    existTabField (pname, type, bool) {
      let obj = {}
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      let lang = localStorage.getItem("language")
      if (type == 'refer') {
        return !!obj.pname
      } else if (type == 'necessary') {
        return obj.necessary == '1'
      } else {
        return obj.pname && lang === 'cn' ? obj.name + (!bool ? ':' : '') : obj.pname && lang === 'en' ? obj.enname + (!bool ? ':' : '') : obj.enname + (!bool ? ":" : "")
      }
    },
    // 获取流程绩效
    getValuelist (pageNum) {
      this.loading = true
      getprocessValue({
        filters: [{ key: 'listid', value: this.modelid }],
        orderby: 'createon',
        pageNum: !pageNum ? 1 : pageNum,
        pageSize: 10,
        sort: 'desc'
      }).then(res => {
        this.loading = false
        this.processVallist = res.list
        this.processpages.total = res.total
      }).catch(() => {
        this.loading = false
      })
    },
    handleProcessChange (val) {
      this.processpages.pageNum = val
      this.getValuelist(val)
    },
    confirmProcess () {
      let self = this
      this.$refs.processRef.validate(async valid => {
        if (valid) {
          let res = await saveTarget({
            description: this.targetform.desc,
            listid: this.modelid,
            name: this.targetform.name,
            remark: this.targetform.remarks,
            target: this.targetform.target
          })
          console.log(res)
          if (res) {
            self.isprocessVisible = false
            this.$message({
              message: this.existTabField('addedSuccessfully', '', true),
              type: 'success'
            })
            this.getValuelist(1)
          }
        } else {
          this.$message({
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty'),
            type: 'warning'
          })
        }
      })
    },
    resetprocess () {
      this.targetform = {
        name: '',
        desc: '',
        target: '',
        remarks: ''
      }
    },
    handletargetChange (val) {
      this.seltargetlist = val
    },
    deltarget (data) {
      this.$confirm(this.existTabField('areYouSureDeleteTheSelectedPerformance', '', true), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(async () => {
          let res = await delTarget(data)
          this.getValuelist(this.processpages.pageNum)
          this.$message({
            type: 'success',
            message: this.$t('hintText.successfullyDelete')
          })
        })
        .catch(() => { })
    },
    deltargetMore () {
      let arr = this.seltargetlist.map(item => {
        return item.id
      })
      this.deltarget(arr.join(','))
    },
    deltargetOne (item) {
      this.deltarget(item.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group{
  display: flex;

}
.control-label{
  padding-right: 12px;
  flex: 0 0 110px;
  text-align: right;
  box-sizing: border-box;
}
/*流程绩效的图例*/
.targetSign{
  width: 318px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
}
.bg-lightGreen{
  background-color: rgba(208, 225, 125, 1);
}
.bg-yellow{
  background-color: rgba(255, 255, 0, 1);
}
.bg-red{
  background-color: rgba(255, 0, 0, 1);
}
.bg-lightGray{
  background-color: rgba(204, 204, 204, 1);
}
.setExpress-wrapper{
  display: flex;
}
.set-item{
  flex: 1;
  margin-right: 10px;
}
.setExpress{
  height: 30px;
  width: 70px;
}
.btn-primary {
  color: #fff;
  background-color: #337ab7;
  border-color: #2e6da4;
}
.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 3px;
}
.btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
}
.dialog_body{
  font-size: 14px;
  color: #606266;
  padding: 0 25px;
}
.dialog_wrapper{
  padding-top: 10px;
  border-top: 1px solid #cfcfcf;
  width: 580px;
}
.dialog_wrapper .left{
  width: 40px;
  float: left;
}
.dialog_wrapper .left .organization,
.dialog_wrapper .left .station,
.dialog_wrapper .left .dept,
.dialog_wrapper .left .usually,
.dialog_wrapper .left .persons{
  font-size: 16px;
  width: 30px;
  height: auto;
  padding: 10px 0;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  text-align: center;
  margin-bottom: 5px;
  border-radius: 4px;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  cursor: pointer;
  cursor: -ms-pointer;
}
.clearfix {
  *zoom: 1;
}

.clearfix:after {
  content: "\200B";
  display: block;
  height: 0;
  clear: both;
}
.dialog_wrapper .left .organization.active,
.dialog_wrapper .left .station.active,
.dialog_wrapper .left .dept.active,
.dialog_wrapper .left .usually.active,
.dialog_wrapper .left .persons.active{
  color: #fff;
  background-color: #337ab7;
  border-color: #337AB7;
}

.dialog_wrapper .center{
  width: 180px;
  height: 300px;
  padding: 5px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border: 1px solid #cfcfcf;
  float: left;
  margin-right: 10px;
}
.dialog_wrapper .another_center {
  width: 220px;
}
.dialog_wrapper .center .form-control{
  height: 28px;
}
.dialog_wrapper .center .input-group-addon{
  font-size: 12px;
}
.dialog_wrapper .center .treeContent{
  height: 252px;
  margin-top: 10px;
  overflow: auto;
}
.dialog_wrapper .center .centerContent{
  display: none;
}
.dialog_wrapper .center .centerContent.block{
  display: block;
}
.dialog_wrapper .center .centerContent p{
  margin: 0;
  line-height: 23px;
}
.dialog_wrapper .center .centerContent p:hover{
  color: #3c7ab7;
}
.dialog_wrapper .center .centerContent p.active{
  color: #3c7ab7;
}
.dialog_wrapper .center .form-group{
  margin-bottom: 5px;
}
.dialog_wrapper .center .form-group label{
  line-height: 28px;
  margin: 0;
}

.dialog_wrapper .right{
  width: 350px;
  height: 300px;
  border: 1px solid #cfcfcf;
  float: left;
  position: relative;
}
.modalDialogProcess .right{
  width: 300px;
  height: 300px;
  border: 1px solid #cfcfcf;
  float: left;
  position: relative;
}
.dialog_wrapper .right .tableShow{
  padding-bottom: 45px;
}
.dialog_footer{
  padding: 10px 20px 20px;
}
/deep/.el-button:hover, .el-button:focus{
      background-color: #2d42af !important;
     color: #fff !important;
  }

</style>
