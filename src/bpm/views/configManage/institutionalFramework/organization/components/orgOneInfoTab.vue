<template>
  <div class="tab-content">
    <!--  功能切换区  -->
    <div style="float: right;padding: 10px" v-if="showEdit">
      <el-button type="primary" v-show="isEditModel" @click="actionClick"
        >保存</el-button
      >
      <el-button :type="isEditModel ? '' : 'primary'" @click="cancel"
        >{{ isEditModel ? '取消' : '编辑' }}
      </el-button>
    </div>
    <el-form
      ref="companyForm"
      :model="companyForm"
      :rules="companyRules"
      label-width="120px"
      style="clear: right"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <!-- 名称-->
          <el-form-item :label="$t('orgName') + '：'" prop="name">
            <el-input
              clearable
              v-model="companyForm.name"
              :disabled="!isEditModel"
            />
          </el-form-item>
          <!-- 状态-->
          <el-form-item :label="$t('state') + '：'" prop="subtype">
            <el-select
              clearable
              v-model="companyForm.subtype"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
              :disabled="!isEditModel"
            >
              <el-option
                v-for="item in subtypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 生效日期-->
          <el-form-item :label="$t('effectiveDate') + '：'">
            <el-date-picker
              type="datetime"
              :picker-options="pickerOptions0"
              v-model="companyForm.effectivedate"
              :disabled="!isEditModel"
              style="width: 100%;"
            />
          </el-form-item>
          <!-- 简称-->
          <el-form-item
            :label="$t('orgSimpleName') + '：'"
            prop="shortname"
          >
            <el-input
              clearable
              v-model="companyForm.shortname"
              :disabled="!isEditModel"
            />
          </el-form-item>

          <!-- 上级组织-->
          <el-form-item :label="$t('parentOrganization') + '：'" prop="pname">
            <el-input v-model="companyForm.pname" disabled>
<!--              <el-button-->
<!--                slot="append"-->
<!--                @click="showParentOrg"-->
<!--                disabled-->
<!--                >{{ $t('placeholderText.select') }}-->
<!--              </el-button>-->
            </el-input>
          </el-form-item>
          <!--    排序      -->
         <!-- <el-form-item :label="$t('sort') + '：'">
            <el-input
              type="number"
              onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
              v-model="companyForm.rank"
              :disabled="!isEditModel"
            />
          </el-form-item> -->

          <!-- 主要业务-->
          <!--  <el-form-item :label="$t('mainBusiness') + '：'">
            <el-input
              clearable
              v-model="companyForm.bussscope"
              :disabled="!isEditModel"
            />
          </el-form-item> -->

        </el-col>
        <el-col :span="12">
          <!-- 组织类型-->
          <el-form-item :label="$t('organizationType') + '：'" prop="hrtype">
            <el-select
              disabled
              clearable
              v-model="companyForm.hrtype"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
            >
              <el-option
                v-for="item in hrtypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 编码-->
          <el-form-item :label="$t('orgCode') + '：'" prop="code">
            <el-input
              clearable
              v-model="companyForm.code"
              :disabled="!isEditModel"
            />
          </el-form-item>

          <!-- 失效日期-->
          <el-form-item :label="$t('expirationDate') + '：'">
            <el-date-picker
              type="datetime"
              :picker-options="pickerOptions1"
              v-model="companyForm.expiredate"
              :disabled="!isEditModel"
              style="width: 100%;"
            />
          </el-form-item>
          <!-- 责任人-->
          <!--<el-form-item :label="$t('personInCharge') + '：'">
            <el-input
              clearable
              v-model="personincharge.name"
              :disabled="!isEditModel"
              @focus="showResponsiblePerson"
            />
          </el-form-item>-->
          <!-- 公司代码-->
          <!--<el-form-item :label="$t('companyCode') + '：'" prop="companycode">
            <el-input
              clearable
              v-model="companyForm.companycode"
              :disabled="!isEditModel"
            />
          </el-form-item>-->
          <!-- 审批组织分类-->
          <!--<el-form-item
            :label="$t('approvalOrganizationClassification') + '：'"
            prop="approvalorgdesc"
          >
            <el-select
              clearable
              v-model="companyForm.approvalorgdesc"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
              :disabled="!isEditModel"
            >
              <el-option
                v-for="item in approvalorgdescList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->

          <!-- 上级组织编码-->
          <el-form-item
            :label="$t('parentOrganizationCode') + '：'"
            prop="pcode"
          >
            <el-input clearable v-model="companyForm.pcode" disabled />
          </el-form-item>

          <!-- 控股类型-->
         <!-- <el-form-item :label="$t('holdingType') + '：'">
            <el-select
              clearable
              v-model="companyForm.comtype"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
              :disabled="!isEditModel"
            >
              <el-option
                v-for="item in comtypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <!-- 板块-->
        <!--  <el-form-item :label="$t('plate') + '：'">
            <el-input
              clearable
              v-model="companyForm.costcenter"
              :disabled="!isEditModel"
            />
          </el-form-item> -->

        </el-col>
      </el-row>
    </el-form>

    <bas-organieation
      v-model="orgShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :multiple="multiple"
      :title="orgTitle"
      @fnCallBack="fnBasOrgCallBack"
    />
  </div>
</template>

<script>
import { getDictionaryOption } from '@/bpm/api/process/processModeling/classificationModel'
import { queryOrgDetailInfo } from '@/bpm/api/configManage/institutionalFramework/organization'
import {
  orgSave,
  queryOrgSuperior
} from '@/bpm/api/configManage/institutionalFramework/org_info'

export default {
  name: 'orgCompanyInfoTab',
  props: {
    selectedId: {
      type: String,
      default: ''
    },
    showEdit: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    selectedId(val) {
      this.isEditModel = false
      this.getCompanyData()
    }
  },
  data() {
    return {
      orgShow: false,
      multiple: false,
      orgTitle: '组织选择',
      showElement: [],
      selectedElement: {},
      selectElement: ['0', '1', '2'],
      isEditModel: false,
      companyForm: {
        name: '',
        enname: '',
        code: '',
        phone: '',
        hrtype: '',
        pname: '',
        rank: '',
        expiredate: '',
        bussscope: '',
        subtype: '',
        shortname: '',
        companycode: '',
        approvalorgdesc: '',
        pcode: '',
        effectivedate: '',
        comtype: '',
        costcenter: ''
      },
      companyRules: {
        name: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseEnterCompanyName'),
            trigger: 'blur'
          }
        ],
        enname: [
          {
            required: false,
            message: this.$t('placeholderText.pleaseEnterCompanyName'),
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: false,
            message: this.$t('placeholderText.pleaseEnterCompanyName'),
            trigger: 'blur'
          }
        ],
        shortname: [
          {
            required: false,
            message: this.$t('placeholderText.pleaseEnterCompanyAbbreviation'),
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: false,
            message: this.$t('placeholderText.pleaseEnterCompanyCoding'),
            trigger: 'blur'
          }
        ],
        companycode: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseEnterCompanyCode'),
            trigger: 'blur'
          }
        ],
        hrtype: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseEnterOrganizationType'),
            trigger: 'blur'
          }
        ],
        approvalorgdesc: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseEnterApprovalorgdesc'),
            trigger: 'blur'
          }
        ],
        pname: [
          {
            required: false,
            message: this.$t('placeholderText.pleaseEnterpName'),
            trigger: 'blur'
          }
        ],
        pcode: [
          {
            required: false,
            message: this.$t('placeholderText.pleaseEnterpCode'),
            trigger: 'blur'
          }
        ],
        subtype: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseEnterStatus'),
            trigger: 'blur'
          }
        ]
      },
      hrtypeList: [],
      comtypeList: [],
      subtypeList: [],
      approvalorgdescList: [],
      personincharge: {
        name: ''
      },
      pickerOptions0: {
        disabledDate: time => {
          if (this.companyForm.expiredate) {
            return (
              time.getTime() >
                new Date(this.companyForm.expiredate).getTime() - 86400000 ||
              time.getTime() < Date.now() - 86400000
            )
          } else {
            return time.getTime() < Date.now() - 86400000
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.companyForm.effectivedate) {
            return (
              time.getTime() <
              new Date(this.companyForm.effectivedate).getTime()
            )
          } else {
            return time.getTime() < Date.now() - 86400000
          }
        }
      }
    }
  },
  mounted() {
    this.getCompanyData()
    this.getEditSelectData()
  },
  methods: {
    // 取消
    cancel() {
      this.isEditModel = !this.isEditModel
    },
    showResponsiblePerson() {
      this.selectElement = ['9']
      this.orgTitle = '责任人'
      this.orgShow = true
    },
    showParentOrg() {
      this.selectElement = ['0', '1', '2']
      this.orgTitle = '组织选择'
      this.orgShow = true
    },
    actionClick() {
      if (this.isEditModel) {
        //这里进行网络请求，请求成功后，将编辑状态变成false
        this.saveEditDataReq()
      }
    },
    fnBasOrgCallBack(data) {
      console.log(data)
      if (this.orgTitle === '组织选择') {
        this.$set(this.companyForm, 'pname', data.name)
        this.$set(this.companyForm, 'pid', data.id)
        this.$set(this.companyForm, 'pcode', data.id)
        this.$set(this.companyForm, 'attribute2', data.idType)
      } else {
        this.companyForm.relDtos = []
        this.$set(this.personincharge, 'name', data.name.split('&').join(','))
        this.$set(this.personincharge, 'pid', data.id)
        this.$set(this.personincharge, 'pcode', data.id)
        this.$set(this.personincharge, 'attribute2', data.idType)
        this.$set(this.personincharge, 'mainPost', true)
        this.$set(this.personincharge, 'memberId', data.id)
        this.companyForm.relDtos.push(this.personincharge)
      }
      this.orgShow = false
    },
    /*获取选择框情况下，下拉内容*/
    getEditSelectData() {
      let selectListReq = [
        getDictionaryOption({ dictionaryen: '组织类型' }),
        getDictionaryOption({ dictionaryen: '公司管理-状态' }),
        getDictionaryOption({ dictionaryen: '公司管理-审批组织分类' }),
        getDictionaryOption({ dictionaryen: '公司管理-控股类型' })
      ]
      Promise.all(selectListReq).then(res => {
        this.hrtypeList = res[0].data
        this.subtypeList = res[1].data
        this.approvalorgdescList = res[2].data
        this.comtypeList = res[3].data
      })
    },
    /*根据ID获取责任人*/
    getResponsiblePerson() {
      queryOrgSuperior(this.companyForm.id).then(res => {
        if (res.data.length > 0) {
          this.companyForm.relDtos = []
          this.$set(this.personincharge, 'name', res.data[0].name)
          this.$set(this.personincharge, 'memberId', res.data[0].memberId)
          this.companyForm.relDtos.push(this.personincharge)
        } else {
          this.personincharge = { name: '' }
        }
      })
    },
    /*获取主数据*/
    getCompanyData() {
      if (!this.selectedId || this.selectedId === '14246') {
        return
      }
      this.$refs.companyForm.resetFields()
      queryOrgDetailInfo(this.selectedId).then(res => {
        console.log(res)
        // this.companyForm = Object.assign({}, res.data)
        // this.$set(this.companyForm, 'pname', res.data.treeNamePath)
        this.companyForm = JSON.parse(JSON.stringify(res.data))
        this.getResponsiblePerson()
      })
    },
    /*保存编辑的数据*/
    saveEditDataReq() {
      this.$refs.companyForm.validate(valid => {
        if (valid) {
          this.companyForm.comtype = '1'
          this.companyForm.isdelete = 'N'
          orgSave(this.companyForm)
            .then(res => {
              if (res.status === '200') {
                this.$message.success(this.$t('hintText.editedSuccess'))
              }
              this.isEditModel = false
            })
            .catch(err => {
              this.isEditModel = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-content {
  /deep/ .el-form-item__label {
    padding: 0;
  }
}
</style>
