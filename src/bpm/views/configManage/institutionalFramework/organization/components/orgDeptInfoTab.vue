<template>
  <div class="tab-content">
    <!--  功能切换区  -->
    <div style="float: right;padding: 10px" v-if="showEdit">
      <el-button type="primary" v-show="isEditModel" @click="actionClick"
        >保存</el-button
      >
      <el-button
        :type="isEditModel ? '' : 'primary'"
        @click="isEditModel = !isEditModel"
        >{{ isEditModel ? '取消' : '编辑' }}
      </el-button>
    </div>
    <el-form
      ref="deptForm"
      :model="deptForm"
      :rules="deptRules"
      label-width="120px"
      style="clear: right"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <!-- 部门名称-->
          <el-form-item :label="$t('departmentName') + '：'" prop="name">
            <el-input
              clearable
              v-model="deptForm.name"
              :disabled="!isEditModel"
            />
          </el-form-item>
          <!--          上级组织-->
          <el-form-item :label="$t('parentOrganization') + '：'" prop="pname">
            <el-input v-model="deptForm.pname" :disabled="!isEditModel">
              <el-button
                slot="append"
                @click="showParentOrg"
                :disabled="!isEditModel"
                >{{ $t('placeholderText.select') }}
              </el-button>
            </el-input>
          </el-form-item>
          <!--          组织类型-->
          <el-form-item :label="$t('organizationType') + '：'" prop="hrtype">
            <el-select
              disabled
              clearable
              v-model="deptForm.hrtype"
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
          <!--          生效日期-->
          <el-form-item :label="$t('effectiveDate') + '：'">
            <el-date-picker
              type="datetime"
              :picker-options="pickerOptions0"
              v-model="deptForm.effectivedate"
              :disabled="!isEditModel"
              style="width: 100%;"
            />
          </el-form-item>
          <!--          状态-->
          <el-form-item :label="$t('state') + '：'" prop="subtype">
            <el-select
              clearable
              v-model="deptForm.subtype"
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
        </el-col>
        <el-col :span="12">
          <!--          部门编码-->
          <el-form-item :label="$t('departmentCode') + '：'" prop="code">
            <el-input
              clearable
              v-model="deptForm.code"
              :disabled="!isEditModel"
            />
          </el-form-item>
          <!--          上级组织编码-->
          <el-form-item
            :label="$t('parentOrganizationCode') + '：'"
            prop="pcode"
          >
            <el-input clearable v-model="deptForm.pcode" disabled />
          </el-form-item>
          <!--    排序      -->
          <el-form-item :label="$t('sort') + '：'">
            <el-input
              type="number"
              onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
              v-model="deptForm.rank"
              :disabled="!isEditModel"
            />
          </el-form-item>
          <!--          失效日期-->
          <el-form-item :label="$t('expirationDate') + '：'">
            <el-date-picker
              type="datetime"
              :picker-options="pickerOptions1"
              v-model="deptForm.expiredate"
              :disabled="!isEditModel"
              style="width: 100%;"
            />
          </el-form-item>
          <!--          责任人-->
          <el-form-item :label="$t('personInCharge') + '：'">
            <el-input
              clearable
              v-model="personincharge.name"
              :disabled="!isEditModel"
              @focus="showResponsiblePerson"
            />
          </el-form-item>
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
  name: 'orgDeptInfoTab',
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
      deptForm: {
        name: '',
        code: '',
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
      deptRules: {
        name: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseEnterCompanyName'),
            trigger: 'blur'
          }
        ],
        shortname: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseEnterCompanyAbbreviation'),
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
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
            required: true,
            message: this.$t('placeholderText.pleaseEnterpName'),
            trigger: 'blur'
          }
        ],
        pcode: [
          {
            required: true,
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
          if (this.deptForm.expiredate) {
            return (
              time.getTime() >
                new Date(this.deptForm.expiredate).getTime() - 86400000 ||
              time.getTime() < Date.now() - 86400000
            )
          } else {
            return time.getTime() < Date.now() - 86400000
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.deptForm.effectivedate) {
            return (
              time.getTime() < new Date(this.deptForm.effectivedate).getTime()
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
      if (this.orgTitle === '组织选择') {
        this.$set(this.deptForm, 'pname', data.name)
        this.$set(this.deptForm, 'pid', data.id)
        this.$set(this.deptForm, 'pcode', data.id)
        this.$set(this.deptForm, 'attribute2', data.idType)
      } else {
        this.deptForm.relDtos = []
        this.$set(this.personincharge, 'name', data.name.split('&').join(','))
        this.$set(this.personincharge, 'pid', data.id)
        this.$set(this.personincharge, 'pcode', data.id)
        this.$set(this.personincharge, 'attribute2', data.idType)
        this.$set(this.personincharge, 'mainPost', true)
        this.$set(this.personincharge, 'memberId', data.id)
        this.deptForm.relDtos.push(this.personincharge)
      }
      this.orgShow = false
    },
    /*获取选择框情况下，下拉内容*/
    getEditSelectData() {
      let selectListReq = [
        getDictionaryOption({ dictionaryen: '组织类型' }),
        getDictionaryOption({ dictionaryen: '公司管理-状态' })
        // getDictionaryOption({dictionaryen: "公司管理-审批组织分类"}),
        // getDictionaryOption({dictionaryen: "公司管理-控股类型"}),
      ]
      Promise.all(selectListReq).then(res => {
        this.hrtypeList = res[0].data
        this.subtypeList = res[1].data
        // this.approvalorgdescList = res[2].data
        // this.comtypeList = res[3].data
      })
    },
    /*根据ID获取责任人*/
    getResponsiblePerson() {
      queryOrgSuperior(this.deptForm.id).then(res => {
        if (res.data.length > 0) {
          this.deptForm.relDtos = []
          this.$set(this.personincharge, 'name', res.data[0].name)
          this.$set(this.personincharge, 'memberId', res.data[0].memberId)
          this.deptForm.relDtos.push(this.personincharge)
        } else {
          this.personincharge = { name: '' }
        }
      })
    },
    /*获取主数据*/
    getCompanyData() {
      if (!this.selectedId) {
        return
      }
      this.$refs.deptForm.resetFields()
      queryOrgDetailInfo(this.selectedId).then(res => {
        console.log('🍉0', res.data)
        // this.deptForm = Object.assign({}, res.data)
        this.deptForm = JSON.parse(JSON.stringify(res.data))
        console.log('🍉1', this.deptForm)
        // this.$set(this.deptForm, 'pname', res.data.treeNamePath)
        this.getResponsiblePerson()
      })
    },
    /*保存编辑的数据*/
    saveEditDataReq() {
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          this.deptForm.type = '2'
          this.deptForm.isdelete = 'N'
          orgSave(this.deptForm)
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
