<template>
  <el-dialog :title="title" id="purchaseProcess" :visible.sync="dialogVisible"  top="10vh">
    <el-form :model="item" :rules="rules" ref="item" label-width="140px">
      <el-row class="form">
        <el-col :span="12" class="form-item">
          <el-form-item label="使用部门：">
            <el-input clearable :disabled="true" v-model="item.USERDEPARTMENT" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item">
          <el-form-item label="使用处室：" prop="SERVICEROOM">
            <el-input clearable :disabled="isNoStart" v-model="item.SERVICEROOM" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item">
          <el-form-item label="资产名称：" prop="STDNAME">
            <el-input clearable  v-model="item.STDNAME" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item">
          <el-form-item label="申报事项：" prop="DECLARATIONMATTERS">
            <el-select clearable :disabled="isNoStart" filterable v-model="item.DECLARATIONMATTERS" style="width: 100%">
              <el-option
                v-for="(option, index1) in declarationsList"
                :key="index1"
                :label="option.text"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item">
          <el-form-item label="资产编码：" prop="ASSETCODING" isrequired>
            <el-input clearable :disabled="isNoStart" v-model="item.ASSETCODING"  @input="$refs.item.validateField(['ASSETCODING'])" :class="[item.DECLARATIONMATTERS==='更新'?'isrequired':item.DECLARATIONMATTERS==='更新（已购）'?'isrequired':'']" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item">
          <el-form-item label="出厂编码：" prop="EXITCODING">
            <el-input clearable :disabled="isNoStart" v-model="item.EXITCODING"  @input="$refs.item.validateField(['EXITCODING'])" :class="[item.DECLARATIONMATTERS==='新增'?'isrequired':item.DECLARATIONMATTERS==='新增（已购）'?'isrequired':'']"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="form-item">
          <el-form-item label="启用时间：" prop="ENABLATIONTIME">
            <el-date-picker
              :disabled="isNoStart"
              v-model="item.ENABLATIONTIME"
              format='yyyy-MM-dd'
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form">
        <el-col :span="12" class="form-item">
          <el-form-item label="原配置数量：">
            <el-input clearable :disabled="isNoStart" v-model.number="item.NUMBEROFCONFIGURATIONS"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item">
          <el-form-item label="申报数量：" prop="QUANTITYDECLARATIONS">
            <el-input clearable :disabled="isNoStart" v-model.number="item.QUANTITYDECLARATIONS"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item">
          <el-form-item label="申购单价：" prop="PURCHASEUNITPRICE">
            <el-input clearable :disabled="isNoStart" @focus="textFocus('PURCHASEUNITPRICE')" @blur="doubleFilter('PURCHASEUNITPRICE')" @input="doubleValue('PURCHASEUNITPRICE')" v-model="item.PURCHASEUNITPRICE" min="0"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item">
          <el-form-item label="申报金额：">
            <el-input clearable disabled v-model="item.AMOUNTDECLARED" min="0"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="form-item">
          <el-form-item label="申报品牌及型号：" prop="BRAND">
            <el-input clearable :disabled="isNoStart" v-model="item.BRAND" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="form" >
        <el-col :span="12" class="form-item">
          <el-form-item label="管理人：" prop="ADMINISTRATORS">
            <el-input clearable :disabled="isNoStart" v-model="item.ADMINISTRATORS" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item">
          <el-form-item label="使用人：">
            <el-input clearable :disabled="isNoStart" v-model="item.USERSBY" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item">
          <el-form-item label="采购主管部门：" prop="PROCUREMENTAUTHORITY">
            <el-select clearable :disabled="isNoStart" filterable v-model="item.PROCUREMENTAUTHORITY" style="width: 100%">
              <el-option
                v-for="(option, index1) in purchasingList"
                :key="index1"
                :label="option.text"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="form-item">
          <el-form-item label="申报理由：" prop="REASONSFORDECLARATION">
            <el-input clearable :disabled="isNoStart" v-model="item.REASONSFORDECLARATION" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
       <el-row class="form" v-if="node.processNodeName!=='Start' && node.processNodeName !=='资产汇总'">
        <el-col :span="12" class="form-item" v-if="node.processNodeName!=='Start' && node.processNodeName!=='资产汇总'">
          <el-form-item label="初审意见：">
            <el-input clearable :disabled="node.processNodeName!=='Start' && node.processNodeName !=='资产汇总'" v-model="item.PREOPTION" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item" v-if="node.processNodeName ==='会审' || node.processNodeName ==='财务部门审核'|| node.processNodeName ==='财务领导审核'|| node.processNodeName ==='集团公司分管领导审核'|| node.processNodeName ==='归档'|| node.processNodeName ==='End'">
          <el-form-item label="审批意见：">
            <el-select clearable filterable :disabled="node.processNodeName !=='会审'"  v-model="item.APPROVALOPTION" style="width: 100%">
              <el-option
                v-for="(option, index1) in approvalOpinionList"
                :key="index1"
                :label="option.text"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item" v-if="node.processNodeName ==='会审' || node.processNodeName ==='财务部门审核'|| node.processNodeName ==='财务领导审核'|| node.processNodeName ==='集团公司分管领导审核'|| node.processNodeName ==='归档'|| node.processNodeName ==='End'">
          <el-form-item label="审批单价：">
            <el-input clearable :disabled="node.processNodeName !=='会审'"  @focus="textFocus('APPROVALPRICE')" @blur="doubleFilter('APPROVALPRICE')" @input="doubleValue('APPROVALPRICE')" v-model="item.APPROVALPRICE" min="0"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item" v-if="node.processNodeName ==='会审' || node.processNodeName ==='财务部门审核'|| node.processNodeName ==='财务领导审核'|| node.processNodeName ==='集团公司分管领导审核'|| node.processNodeName ==='归档'|| node.processNodeName ==='End'">
          <el-form-item label="审批数量：">
            <el-input clearable :disabled="node.processNodeName !=='会审'" v-model.number="item.APPROVALCOUNT"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="form-item" v-if="node.processNodeName ==='会审' || node.processNodeName ==='财务部门审核'|| node.processNodeName ==='财务领导审核'|| node.processNodeName ==='集团公司分管领导审核'|| node.processNodeName ==='归档'|| node.processNodeName ==='End'">
          <el-form-item label="预算限额：" >
            <el-input clearable :disabled="true" v-model="item.BUDGET" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getDictionaryOption } from '@/bpm/api/process/processModeling/classificationModel'
let ASSETCODING = [
  { required: true, message: '请输入资产编码', trigger: [ 'blur', 'change'] },
  { max: 200, message: '资产编码长度不超过200字符', trigger: [ 'blur', 'change'] }
]
let EXITCODING = [
  { required: true, message: '请输入出场编码', trigger: [ 'blur', 'change'] },
  { max: 200, message: '出场编码长度不超过200字符', trigger: [ 'blur', 'change'] }
]
export default {
  data () {
    return {
      dialogVisible: this.value,
      purchasingList: [],
      approvalOpinionList: [],
      declarationsList: [],
      rules: {
          // SERVICEROOM: [
        //   { required: true, message: '请输入使用处室', trigger: 'blur' },
        //   { max: 200, message: '使用处室长度不超过200字符', trigger: 'blur' }
        // ],
        // STDNAME: [
        //   { required: true, message: '请输入资产名称', trigger: 'blur' },
        //   { max: 200, message: '资产名称长度不超过200字符', trigger: 'blur' }
        // ],
        // DECLARATIONMATTERS: [
        //   { required: true, message: '请选择申报事项', trigger: 'blur' }
        // ],
        // ENABLATIONTIME: [
        //   { required: true, message: '请输入启用时间', trigger: 'blur' },
        // ],
        // QUANTITYDECLARATIONS: [
        //   { required: true, message: '请输入申报数量', trigger: 'blur' },
        //   { max: 200, message: '申报数量长度不超过200字符', trigger: 'blur' }
        // ],
        // PURCHASEUNITPRICE: [
        //   { required: true, message: '请输入申购单价', trigger: 'blur' },
        //   { max: 200, message: '申购单价长度不超过200字符', trigger: 'blur' }
        // ],
        // BRAND: [
        //   { required: true, message: '请输入申报品牌及型号', trigger: 'blur' },
        //   { max: 2000, message: '申报品牌及型号长度不超过2000字符', trigger: 'blur' }
        // ],
        // ADMINISTRATORS: [
        //   { required: true, message: '请输入管理人', trigger: 'blur' },
        //   { max: 200, message: '管理人度不超过200字符', trigger: 'blur' }
        // ],
        // PROCUREMENTAUTHORITY: [
        //   { required: true, message: '请输入采购主管部门', trigger: 'blur' }
        // ],
        // REASONSFORDECLARATION: [
        //   { required: true, message: '请输入申报理由', trigger: 'blur' },
        //   { max: 2000, message: '申报理由长度不超过2000字符', trigger: 'blur' }
        // ]
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isNoStart: {
      type: Boolean,
      default: false
    },
    node: {
      type: Object,
      default: () => ({})
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: false
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        // if(!this.item.PROCUREMENTAUTHORITY){
        //   this.item.PROCUREMENTAUTHORITY = '信息中心'
        // }
        this.getData()
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    },
    // 'item.DECLARATIONMATTERS': {
    //   handler (newName, oldName) {
    //     if (newName !== '新增' && newName !== '新增（已购）') {
    //       Object.assign(this.rules, {
    //         ASSETCODING
    //       })
    //       setTimeout(() => {
    //         this.$refs.item.validateField(['ASSETCODING'])
    //         this.$refs.item.clearValidate(['EXITCODING'])
    //       }, 0)
    //     } else {
    //       Object.assign(this.rules, {
    //         EXITCODING
    //       })
    //       setTimeout(() => {
    //         this.$refs.item.validateField(['EXITCODING'])
    //         this.$refs.item.clearValidate(['ASSETCODING'])
    //       }, 0)
    //     }
    //   }
    // },

    'item.PURCHASEUNITPRICE': {
      handler (newName, oldName) {
        this.item.AMOUNTDECLARED = this.$options.filters.formatNumber(this.$options.filters.delcommafy(this.item.PURCHASEUNITPRICE) * this.item.QUANTITYDECLARATIONS, 2, 1)
      }
    },
    'item.QUANTITYDECLARATIONS': {
      handler (newName, oldName) {
        this.item.AMOUNTDECLARED =  this.$options.filters.formatNumber(this.$options.filters.delcommafy(this.item.PURCHASEUNITPRICE) * this.item.QUANTITYDECLARATIONS, 2, 1)
      }
    },
    'item.APPROVALCOUNT': {
      handler (newName, oldName) {
        this.item.BUDGET = this.$options.filters.formatNumber(this.$options.filters.delcommafy(this.item.APPROVALPRICE) * this.item.APPROVALCOUNT, 2, 1)
      }
    },
    'item.APPROVALPRICE': {
      handler (newName, oldName) {
        this.item.BUDGET =  this.$options.filters.formatNumber(this.$options.filters.delcommafy(this.item.APPROVALPRICE) * this.item.APPROVALCOUNT, 2, 1)
      }
    }
  },
  methods: {
    submit (formName) {
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
          this.dialogVisible = false
          this.$emit('confirm', this.item)
      //   }
      // })
    },
    textFocus(name){
      if (/^\d+(.\d+)?$/.test(this.item[name].replace(/,/g, ""))) {
        this.item[name] = this.item[name].replace(/,/g, '')
      }

    },
    doubleValue (name) {
      this.item[name] = this.item[name].replace(/[^0-9.]/g, '')
    },
    doubleFilter(name){
      if (this.item[name] && this.item[name].indexOf(",") === -1) {
        this.item[name] = this.$options.filters.formatNumber(this.item[name], 2, 1)
      }
    },
    getData () {
      getDictionaryOption({
        dictionaryen: '申报事项'
      }).then(rt => {
          if (rt.status === '200') {
            this.declarationsList = rt.data
            return getDictionaryOption({
              dictionaryen: '采购主管部门'
            })
          }
        })
        .then(rt => {
          if (rt.status === '200') {
            this.purchasingList = rt.data
            return getDictionaryOption({dictionaryen: '审批意见'})
          }
        }).then(rt => {
          if (rt.status === '200') {
            this.approvalOpinionList = rt.data
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    cancel () {
      this.dialogVisible = false
    }
  }
}
</script>
<style type="text/scss" lang="scss">
#purchaseProcess {
  .el-input__inner {
    // border: none;
    border-bottom: 1px solid $dc1;
  }
}
</style>
<style type="text/scss" lang="scss" scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 15px;
  border-bottom: 1px solid $dc1;
  .isrequired::before{
    content: '*';
    position:absolute;
    left: -85px;
    color:red;
  }
  .form-item {
    // margin-bottom: 24px;
    .form-item-head {
      min-width: 140px;
      padding-right: 15px;
      display: table-cell;
      vertical-align: middle;
      text-align: right;

      span {
        line-height: 28px;
      }
    }
    .form-item-value {
      width: 100%;
      display: table-cell;
      vertical-align: middle;
      padding-right: 15px;
      position: relative;
      .checkText {
        position: absolute;
        bottom: -18px;
      }
    }
    .form-item-value.err {
      /deep/ .flow-item input.el-input__inner {
        border-bottom: 1px solid red;
      }
    }
  }
}
</style>
