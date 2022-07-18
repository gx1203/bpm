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
      ref="postForm"
      :model="postForm"
      :rules="postRules"
      label-width="120px"
      style="clear: right"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <!-- 部门名称-->
          <el-form-item :label="$t('postnameinlist') + '：'" prop="name">
            <el-input
              clearable
              v-model="postForm.name"
              :disabled="!isEditModel"
            />
          </el-form-item>
          <!--          上级组织-->
          <el-form-item :label="$t('parentOrganization') + '：'" prop="pname">
            <el-input v-model="postForm.pname" :disabled="!isEditModel">
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
              v-model="postForm.hrtype"
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
              v-model="postForm.effectivedate"
              :disabled="!isEditModel"
              style="width: 100%;"
            />
          </el-form-item>
          <!--          状态-->
          <el-form-item :label="$t('state') + '：'" prop="subtype">
            <el-select
              clearable
              v-model="postForm.subtype"
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
          <el-form-item :label="$t('postcodeinlist') + '：'" prop="code">
            <el-input
              clearable
              v-model="postForm.code"
              :disabled="!isEditModel"
            />
          </el-form-item>
          <!--          上级组织编码-->
          <el-form-item
            :label="$t('parentOrganizationCode') + '：'"
            prop="pcode"
          >
            <el-input clearable v-model="postForm.pcode" disabled />
          </el-form-item>
          <!--    排序      -->
          <el-form-item :label="$t('sort') + '：'">
            <el-input
              type="number"
              onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
              v-model="postForm.rank"
              :disabled="!isEditModel"
            />
          </el-form-item>
          <!--          失效日期-->
          <el-form-item :label="$t('expirationDate') + '：'">
            <el-date-picker
              type="datetime"
              :picker-options="pickerOptions1"
              v-model="postForm.expiredate"
              :disabled="!isEditModel"
              style="width: 100%;"
            />
          </el-form-item>
          <!--          责任人-->
          <!--          <el-form-item :label="$t('personInCharge') + '：'">-->
          <!--            <el-input-->
          <!--              clearable-->
          <!--              v-model="personincharge.name"-->
          <!--              :disabled="!isEditModel"-->
          <!--              @focus="showResponsiblePerson"-->
          <!--            />-->
          <!--          </el-form-item>-->
        </el-col>
      </el-row>
      <el-form-item :label="$t('includeMembers') + '：'">
        <el-button @click="showResponsiblePerson" :disabled="!isEditModel">{{
          $t('add')
        }}</el-button>
        <el-table
          :data="postForm.members"
          class="margin-t10"
          stripe
          :header-cell-style="{ background: '#E1EAFD !important' }"
          highlight-current-row
          style="width: 100%;margin-top: 20px"
        >
          <el-table-column prop="name" label="序号" type="index">
          </el-table-column>
          <el-table-column prop="name" label="姓名" sortable> </el-table-column>
          <el-table-column prop="memberId" label="登录账号" sortable>
          </el-table-column>
          <el-table-column prop="jobNumber" label="工号" sortable>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-delete"
                style="padding:5px"
                :disabled="!isEditModel"
                @click="delData(scope.$index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
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
import {
  queryOrgDetailInfo,
  findOrgUsers,
  assignUsers
} from '@/bpm/api/configManage/institutionalFramework/organization'
import {
  orgSave,
  queryOrgSuperior,
  getOrgInfo
} from '@/bpm/api/configManage/institutionalFramework/org_info'
import { getOrgTree } from '@/bpm/api/app'

export default {
  name: 'orgPostInfoTab',
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
    subtypeList: {
      handler(val) {
      },
      deep: true,
      immediate: true
    },
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
      postForm: {
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
      postRules: {
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
          if (this.postForm.expiredate) {
            return (
              time.getTime() >
                new Date(this.postForm.expiredate).getTime() - 86400000 ||
              time.getTime() < Date.now() - 86400000
            )
          } else {
            return time.getTime() < Date.now() - 86400000
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.postForm.effectivedate) {
            return (
              time.getTime() < new Date(this.postForm.effectivedate).getTime()
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
    delData(index) {
      console.log('删除的行数', index)
      this.$confirm(
        this.$t('hintText.areYouSureDelete'),
        this.$t('hintText.hint'),
        {
          type: 'warning'
        }
      ).then(() => {
        this.postForm.members.splice(index, 1)
      })
    },
    /*显示责任人选择*/
    showResponsiblePerson() {
      this.selectedElement = {}
      this.selectElement = ['9']
      this.multiple = true
      this.orgTitle = '成员选择'
      if (
        this.postForm &&
        this.postForm.members &&
        this.postForm.members.length > 0
      ) {
        this.selectedElement = {
          id: this.postForm.members.map(item => item.memberId).join(','),
          name: this.postForm.members.map(item => item.name).join('&'),
          idType: this.postForm.members
            .map(item => {
              return item.memberId + '-' + item.type
            })
            .join(';'),
          attrs: this.postForm.members.map(item => {
            return {
              jobNumber: item.jobNumber
            }
          })
        }
      }

      this.orgShow = true
    },
    /*显示上级组织选择*/
    showParentOrg() {
      this.selectedElement = {}
      this.selectElement = ['2']
      this.orgTitle = '组织选择'
      this.multiple = false

      if (this.postForm.pid) {
        let params = {
          logic: 'and',
          filters: [
            { key: 'id', opt: 'IN', type: 'S', value: this.postForm.pid }
          ],
          pageNum: 1,
          pageSize: 10000
        }
        getOrgTree(params).then(rt => {
          if (rt.status === '200') {
            this.selectedElement = {
              id: rt.data.list.map(item => item.id).join(','),
              name: rt.data.list.map(item => item.name).join('&'),
              idType: rt.data.list
                .map(item => {
                  return `${item.id}-${item.type}`
                })
                .join(';')
            }
          }
          this.orgShow = true
        })
        return
      }

      this.orgShow = true
    },
    /*保存编辑按钮*/
    actionClick() {
      if (this.isEditModel) {
        //这里进行网络请求，请求成功后，将编辑状态变成false
        this.saveEditDataReq()
      }
    },
    /*组织、人员弹框返回事件*/
    fnBasOrgCallBack(data) {
      if (this.orgTitle === '组织选择') {
        this.$set(this.postForm, 'pname', data.name)
        this.$set(this.postForm, 'pid', data.id)
        this.$set(this.postForm, 'pcode', data.id)
        this.$set(this.postForm, 'attribute2', data.idType)
      } else {
        // this.postForm.relDtos = []
        // this.$set(this.personincharge, "name", data.name.split("&").join(","));
        // this.$set(this.personincharge, "pid", data.id);
        // this.$set(this.personincharge, "pcode", data.id);
        // this.$set(this.personincharge, "attribute2", data.idType);
        // this.$set(this.personincharge, "mainPost", true);
        // this.$set(this.personincharge, "memberId", data.id);
        // this.postForm.relDtos.push(this.personincharge);
        let tempList = []
        if (data.idType) {
          data.idType.split(';').forEach((item, index) => {
            let nameType = ''
            this.hrtypeList.forEach(val => {
              if (item.split('-')[1] === val.value) {
                nameType = val.text
              }
            })
            tempList.push({
              memberId: item.split('-')[0],
              jobNumber: data.attrs[index].jobNumber,
              name: data.name.split('&')[index],
              type: item.split('-')[1]
            })
          })
        }
        this.$set(this.postForm, 'members', tempList)
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
    /*根据ID获取成员*/
    getResponsiblePerson() {
      if (this.postForm.id) {
        findOrgUsers(
          {
            logic: 'and',
            filters: [],
            pageNum: 1,
            pageSize: 10000
          },
          this.postForm.id,
          false
        ).then(rt => {
          if (
            rt.status === '200' &&
            rt.data &&
            rt.data.list &&
            rt.data.list.length > 0
          ) {
            this.$set(
              this.postForm,
              'members',
              rt.data.list.map(item => {
                return {
                  jobNumber: item.attr.jobNumber,
                  memberId: item.memberId,
                  name: item.name,
                  type: item.type
                }
              })
            )
          }
        })
      }
    },
    /*获取主数据*/
    getCompanyData() {
      if (!this.selectedId) {
        return
      }
      this.$refs.postForm.resetFields()
      queryOrgDetailInfo(this.selectedId).then(res => {
        console.log(res.data)
        // this.postForm = Object.assign({}, res.data)
        // this.$set(this.postForm, 'pname', res.data.treeNamePath)
        this.postForm = JSON.parse(JSON.stringify(res.data))
        this.getResponsiblePerson()
      })
    },
    /*保存编辑的数据*/
    saveEditDataReq() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.postForm.type = '3'
          this.postForm.isdelete = 'N'
          orgSave(this.postForm)
            .then(res => {
              if (res.status === '200') {
                if (this.postForm.members && this.postForm.members.length > 0) {
                  let members = this.postForm.members.map(item => {
                    return {
                      groupId: res.data.id,
                      memberId: item.memberId
                    }
                  })
                  assignUsers(members).then(rt => {
                    if (rt.status === '200') {
                      this.$message.success(this.$t('hintText.editedSuccess'))
                      this.isEditModel = false
                    }
                  })
                } else {
                  this.$message.success(this.$t('hintText.editedSuccess'))
                  this.isEditModel = false
                }
              }
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
