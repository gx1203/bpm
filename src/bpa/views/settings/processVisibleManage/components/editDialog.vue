<template>
  <div class="w100">
    <el-dialog title="详情" :visible.sync="isShow" :close-on-click-modal = false
    :close-on-press-escape = false>
      <el-form ref="itemDataRef" :model="itemDataCopy" :rules="itemDataRule">
        <el-row>
          <el-col :span="22">
            <el-form-item label="活动名称" label-width="100px" prop="name">
              <el-input clearable :value="itemDataCopy.name" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item :label="$t('processResponsibility')" label-width="100px" prop="bponame">
              <el-input clearable :value="itemDataCopy.bponame" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label="$t('issuer')" label-width="100px" prop="submitby">
              <el-input clearable :value="itemDataCopy.submitby" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="可见人员" label-width="100px" prop="typeid">
              <el-select clearable v-model="itemDataCopy.typeid" @change="changeTypeId">
                <el-option
                  v-for="item in visitorlists"
                  :key="item.id"
                  :label="item.authorityname"
                  :value="item.typeid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="showTxtareaIdList.indexOf(itemDataCopy.typeid) > -1">
          <el-col :span="22" v-if="itemDataCopy.typeid != 8">
            <el-form-item
              class="label-height-auto"
              label="详情"
              label-width="100px"
              prop="orgnameFormat"
            >
              <el-input clearable
                readonly="readonly"
                v-model="itemDataCopy.orgnameFormat"
                type="textarea"
                resize="none"
                rows="5"
                maxlength="1000"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="19" v-if="itemDataCopy.typeid == 8">
            <el-form-item
              class="label-height-auto"
              label="详情"
              label-width="100px"
              prop="orgnameFormat"
              :rules="rules"
            >
              <el-input clearable
                readonly="readonly"
                v-model="itemDataCopy.orgnameFormat"
                type="textarea"
                resize="none"
                rows="5"
                 maxlength="1000"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" v-if="itemDataCopy.typeid == 8">
            <el-button type="primary" @click="showOrganTree" class="choose-button">选择</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="修改原因" label-width="100px" prop="updatereason">
              <el-input clearable
                v-model="itemDataCopy.updatereason"
                type="textarea"
                resize="none"
                rows="5"
                 maxlength="1000"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">{{$t("confirm")}}</el-button>
        <el-button @click="isShow = false">{{$t("cancel")}}</el-button>
      </div>
    </el-dialog>
    <organizationTree v-model="orgnizationModal" :disData="itemDataCopy" @confirm="confirmTree"></organizationTree>
  </div>
</template>

<script>
import {
  getOrgidAndName,
  getViewableSelectList,
  saveAuthority
} from '@/bpa/api/settings/processVisibleManage'
import organizationTree from './organizationTree.vue'

export default {
  name: 'Description',
  components: {
    organizationTree
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      showTxtareaIdList: ['2', '7', '8'],
      isShow: false,
      visitorlists: [],
      itemDataCopy: {},
      orgnizationModal: false,
      // 验证规则
      itemDataRule: {
        typeid: [{ required: true, message: ' ', trigger: 'change' }]
        // orgnameFormat: [
        //   {min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur'}
        // ],
        // updatereason: [
        //   {min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur'}
        // ]
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000 // 文本框最大字数限制
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.isShow = true
        this.itemDataCopy = JSON.parse(JSON.stringify(this.itemData))
        this.requireVisior()
      }
    },
    isShow(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    // 获取下拉菜单的数据
    requireVisior() {
      // 请求下拉菜单数据
      getViewableSelectList({
        attr: {},
        orderby: 'createon',
        pageNum: 1,
        pageSize: 10,
        sort: 'desc'
      }).then(res => {
        this.visitorlists = res.list
      })
    },
    // 选择自定义的可见人员
    showOrganTree() {
      this.orgnizationModal = true
    },
    changeTypeId() {
      this.$refs.itemDataRef.clearValidate()
      if (this.itemDataCopy.typeid === 2 || this.itemDataCopy.typeid === 7) {
        this.requireDetail()
      } else {
        this.itemDataCopy.checkname = ''
        this.$set(this.itemDataCopy, 'orgnameFormat', '')
        this.itemDataCopy.orgname = ''
      }
    },
    // 获取一些可见人员的详情
    requireDetail() {
      getOrgidAndName({
        listId: this.itemDataCopy.listid,
        typeId: this.itemDataCopy.typeid
      }).then(res => {
        this.$set(this.itemDataCopy, 'orgnameFormat', res.orgname)
        this.itemDataCopy.orgname = res.orgname
      })
    },
    // 确认选择的组织树
    confirmTree(data) {
      console.log(data)
      this.itemDataCopy.checkname = data.sendState
      let temp = JSON.parse(data.orginalChecktion).orglist
      this.$set(
        this.itemDataCopy,
        'orgnameFormat',
        temp.map(item => item.name).join(',')
      )
      this.itemDataCopy.orgname = data.orginalChecktion
    },
    // 确认
    confirm() {
        let self = this
        this.$refs.itemDataRef.validate(valid => {
          if (valid) {
            if (this.itemDataCopy.orgnameFormat.length > this.areaMaxLength) {
              this.$message({
                type: 'warning',
                message: '警告哦，详情不能超过1000字符哦'
              })
              return false
            } else if (this.itemDataCopy.updatereason.length > this.areaMaxLength) {
              this.$message({
                type: 'warning',
                message: '警告哦，修改原因不能超过1000字符哦'
              })
              return false
            }
            saveAuthority(self.itemDataCopy).then(res => {
              if (!res) return
              this.$message({
                message: '保存成功!',
                type: 'success'
              })
              this.isShow = false
              this.$emit('reInitReq', '')
            })
          } else {
            this.$message({
              message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty'),
              type: 'warning'
            })
            return false
          }
        })
    },
    // 文本框字数限制
    descInput1(itemDataCopy) {
      if (this.itemDataCopy.orgnameFormat.length > this.areaMaxLength) {
        this.$message({
          message: '警告哦，字符不能超过50字符哦',
          type: 'error'
        })
      }
    },
    descInput2(itemDataCopy) {
      if (this.itemDataCopy.updatereason.length > this.areaMaxLength) {
        this.$message({
          message: '警告哦，字符不能超过50字符哦',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.choose-button {
  float: right;
}

</style>
