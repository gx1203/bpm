<template>
  <el-dialog
    id="staffManageDialog"
    :title="title"
    width="60%"
    v-if="dialogVisible"
    :visible.sync="dialogVisible"
  >
    <el-form
      :model="item"
      ref="item"
      :rules="rules"
      label-width="auto"
      class="content"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('orgName') + '：'" prop="name">
            <el-input clearable v-model="item.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('organizationType') + '：'" prop="type">
            <el-select
              clearable
              v-model="item.type"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')"
            >
              <el-option
                v-for="item in comList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 状态-->
        <el-col :span="12">
        <el-form-item :label="$t('state') + '：'" prop="subtype">
          <el-select
            clearable
            v-model="item.subtype"
            class="w100"
            :placeholder="$t('placeholderText.pleaseSelect')" >
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
          <el-form-item :label="$t('orgCode') + '：'" prop="code">
            <el-input clearable v-model="item.code" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- 生效日期-->
          <el-form-item :label="$t('effectiveDate') + '：'">
            <el-date-picker
              type="datetime"
              :picker-options="pickerOptions0"
              v-model="item.effectivedate"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 失效日期-->
          <el-form-item :label="$t('expirationDate') + '：'">
            <el-date-picker
              type="datetime"
              :picker-options="pickerOptions1"
              v-model="item.expiredate"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            :label="$t('orgSimpleName') + '：'"
            prop="shortname"
          >
            <el-input clearable v-model="item.shortname" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('parentOrganizationCode') + '：'"
            prop="pcode"
          >
            <el-input clearable v-model="item.pcode" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- 上级组织-->
          <el-form-item :label="$t('parentOrganization') + '：'">
            <el-input v-model="item.pname" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{
        $t('confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  saveUserOrg,
  saveUserOrgEdit,
  getInfo
} from '@/bpm/api/configManage/institutionalFramework/organization.js'
import { getDictionaryOption } from '@/bpm/api/process/processModeling/classificationModel'
export default {
  data() {
    const rankPudge = (rule, value, callback) => {
      if (this.item.rank && this.item.rank.length > 10) {
        callback(new Error(this.$t('sortingIsTooLong')))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: this.value,
      item: {
        pname:'',
        pcode: '',
        effectivedate: '',
        expiredate: '',
        subtype: 'Y'
      },
      checktype: '',
      typeList: [
        {
          value: 'Y',
          label: this.$t('enable')
        },
        {
          value: 'N',
          label: this.$t('disable')
        }
      ],
      comList: [
        // {
        //   value: '0',
        //   label: this.$t('organization')
        // },
        {
          value: '1',
          label: this.$t('company')
        },
        {
          value: '2',
          label: this.$t('department')
        },
        {
          value: '3',
          label: this.$t('post')
        }
        // {
        //   value: '4',
        //   label: this.$t('businessDivision')
        // },
        // {
        //   value: '5',
        //   label: this.$t('district')
        // }
      ],
      roleList: [],
      subtypeList: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseEnterName'),
            trigger: 'blur'
          },
          { max: 100, message: '名称超长', trigger: 'blur' }
        ],
        code: [
          {
            required: false,
            message: this.$t('placeholderText.pleaseEnterNumber'),
            trigger: 'blur'
          },
          { max: 100, message: '编号超长', trigger: 'blur' }
        ],
        type: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseChooseTheType'),
            trigger: 'chang'
          }
        ],
        enname: [{ max: 100, message: '英文名超长', trigger: 'blur' }],
        area: [{ max: 100, message: '城市超长', trigger: 'blur' }],
        rank: [{ validator: rankPudge, trigger: 'blur' }],
        pcode: [{ max: 100, message: '上级组织结构编码超长', trigger: 'blur' }],
        language: [{ max: 100, message: '语言超长', trigger: 'blur' }],
        vatnumber: [{ max: 100, message: '增值税登记号超长', trigger: 'blur' }],
        currency: [{ max: 100, message: '货币超长', trigger: 'blur' }],
        address: [{ max: 100, message: '地址超长', trigger: 'blur' }],
        postno: [{ max: 100, message: '邮政编码超长', trigger: 'blur' }],
        post_box: [{ max: 100, message: '邮政信箱超长', trigger: 'blur' }],
        legalrepresentative: [
          { max: 100, message: '法人代表超长', trigger: 'blur' }
        ],
        phone: [{ max: 100, message: '电话超长', trigger: 'blur' }],
        mobilephone: [{ max: 100, message: '移动电话超长', trigger: 'blur' }],
        fax: [{ max: 100, message: '传真超长', trigger: 'blur' }],
        mail: [{ max: 100, message: '电子邮件超长', trigger: 'blur' }],
        subtype: [{required:true, max: 100, message: '请选择状态', trigger: 'change' }],
        comtype: [{ max: 100, message: '部门类型超长', trigger: 'blur' }],
        acctarea: [{ max: 100, message: '核算区域超长', trigger: 'blur' }],
        werks: [{ max: 50, message: '人事范围超长', trigger: 'blur' }],
        subranges: [{ max: 100, message: '人事子范围超长', trigger: 'blur' }],
        companycode: [{ max: 20, message: '公司代码超长', trigger: 'blur' }],
        costcenter: [{ max: 50, message: '成本中心超长', trigger: 'blur' }],
        bussscope: [{ max: 100, message: '业务范围超长', trigger: 'blur' }],
        postname: [{ max: 50, message: '职务超长', trigger: 'blur' }],
        shortname: [{ max: 100, message: '组织机构简称超长', trigger: 'blur' }],
        fullname: [{ max: 100, message: '全名超长', trigger: 'blur' }],
        othersystemid: [
          { max: 100, message: '其他系统ID超长', trigger: 'blur' }
        ],
        factory: [{ max: 100, message: '工厂(业务属性)超长', trigger: 'blur' }],
        suoshutype: [
          { max: 100, message: '所属类型(业务属性)超长', trigger: 'blur' }
        ]
      },
      pickerOptions0: {
        disabledDate: time => {
          if (this.item.expiredate) {
            return (
              time.getTime() >
              new Date(this.item.expiredate).getTime() - 86400000 ||
              time.getTime() < Date.now() - 86400000
            )
          } else {
            return time.getTime() < Date.now() - 86400000
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.item.effectivedate) {
            return (
              time.getTime() <
              new Date(this.item.effectivedate).getTime()
            )
          } else {
            return time.getTime() < Date.now() - 86400000
          }
        }
      }
    }
  },
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
    },
    checkData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    value(val) {
      if (val) {
        if (this.title === this.$t('hintText.editCurrentEntry')) {
          this.getUserDet()
        }
      } else {
        this.item = { subtype: 'Y' }
        this.$refs.item.resetFields()
      }
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val)
    },
    detail: {
      handler(val){
        this.item.pname = this.detail.name
        this.item.pcode = this.detail.code?this.detail.code:''
      },
      deep:true
    }
  },
  mounted() {
    this.getEditSelectData()
  },
  methods: {
    getUserDet() {
      getInfo(this.detail.dataid).then(rt => {
        if (rt.status === '200') {
          this.item = rt.data
        }
      })
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.item.hrtype = this.item.type
          if (this.title === this.$t('hintText.editCurrentEntry')) {
            console.log('编辑')
            saveUserOrgEdit(this.item)
              .then(rt => {
                if (rt.status === '200') {
                  this.$message({
                    message: this.$t('hintText.saveSuccessfully'),
                    type: 'success'
                  })
                  this.dialogVisible = false
                  this.item.id = rt.data.id
                  this.item.pid = this.detail.pid
                  this.$emit('confirm', this.item)
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
          } else {
            console.log('新增')
            saveUserOrg(this.detail.id, this.item)
              .then(rt => {
                if (rt.status === '200') {
                  this.$message({
                    message: this.$t('hintText.saveSuccessfully'),
                    type: 'success'
                  })
                  this.dialogVisible = false
                  this.item.id = rt.data.id
                  this.item.pid = this.detail.pid
                  this.$emit('confirm', this.item)
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
          }
        }
      })
    },
    /*获取选择框情况下，下拉内容*/
    getEditSelectData() {
      let selectListReq = [
        getDictionaryOption({ dictionaryen: '公司管理-状态' })
      ]
      Promise.all(selectListReq).then(res => {
        this.subtypeList = res[0].data
      })
    },
    cancel() {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
.content {
  height: 50vh;
  overflow: auto;
  padding: 0 10px;
}
.w100 {
  width: 100%;
}
</style>
<style lang="scss">
#staffManageDialog {
  .avatar-uploader .el-upload {
    border: 1px dashed $dc1;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
