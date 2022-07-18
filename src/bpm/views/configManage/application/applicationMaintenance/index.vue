<template>
  <el-card shadow="never" id="systemAppearance" class="card-reset">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query
          placeholder="请输入应用名称"
          :isDate="false"
          ref="quick"
          @quickSearch="quickSearch"
        />
      </div>
      <div class="btn-wrap">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="getapplicationAdd"
          >新增应用</el-button
        >
        <!--        <el-button type="primary" @click="reset">-->
        <!--          {{ $t('refresh') }}-->
        <!--        </el-button>-->
      </div>
    </div>
    <div class="tableWrap" v-loading="loading">
      <el-table
        :data="content.list"
        class="margin-t10"
        stripe
        :header-cell-style="{ background: '#E1EAFD' }"
        highlight-current-row
        @sort-change="elHandleSort"
        current-row-key="id"
      >
        <el-table-column width="50" label="序号" type="index" />
        <el-table-column prop="applistname" label="应用名称" />
        <el-table-column
          :filters="[
            { text: '应用系统', value: '应用系统' },
            { text: '应用功能', value: '应用功能' },
            { text: '附加功能', value: '附加功能' }
          ]"
          :filter-method="filterTag"
          prop="applistclassify"
          label="应用分类"
        />
        <el-table-column
          width="120"
          label="应用简介"
          prop="applistdescription"
        />
        <el-table-column
          width="100"
          label="应用排序"
          sortable
          prop="sort"
          sortable="custom"
        />
        <el-table-column min-width="200" prop="applisturl" label="应用链接">
          <template slot-scope="scope">
            <el-row>
              <el-col
                :span="20"
                class="more-ellipsis doch5"
                style="-webkit-line-clamp: 1;"
                ><p :title="scope.row.applisturl">
                  {{ scope.row.applisturl }}
                </p></el-col
              >
            </el-row>
          </template>
        </el-table-column>
<!--        <el-table-column
          width="120"
          label="应用场景"
          prop="applistscenariosname"
        />-->
        <el-table-column width="80" label="是否显示" prop="isdelete">
          <template slot-scope="scope">
            <span>{{
              scope.row.isdelete === '0'
                ? '显示'
                : scope.row.isdelete === '1'
                ? '隐藏'
                : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          :label="$t('operating')">
          <template slot-scope="scope">
            <el-tooltip class="item" content="应用详情">
              <el-button type="text" @click="editorapplication(scope.row)">应用详情</el-button>
            </el-tooltip>
            <el-tooltip class="item" content="删除应用">
              <el-button type="text" @click="deleteapplication(scope.row.id)">删除应用</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="quickQueryData()"
      :total="content.total"
    ></el-pagination>
    <!-- 首页应用上传-->
    <el-dialog
      :title="'新增应用'"
      :visible.sync="applicationAdd"
      :before-close="handleClose"
      width="42%"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="applicationForm"
        label-position="right"
        label-width="112px"
      >
        <el-form-item label="上传应用图标">
          <bus-avatar-upload
            :upload-files="uploadFiles"
            @uploadCallbackData="getBgImg"
          ></bus-avatar-upload>
        </el-form-item>
        <el-form-item label="应用名称" prop="applistname">
          <el-row>
            <el-col :span="20">
              <el-input v-model="applicationForm.applistname" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="应用分类" prop="applistclassify">
          <el-row>
            <el-col :span="20">
              <el-select
                v-model="applicationForm.applistclassify"
                placeholder="请选择"
              >
                <el-option label="应用功能" value="应用功能" />
                <el-option label="应用系统" value="应用系统" />
                <el-option label="附加功能" value="附加功能" />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="应用简介" prop="applistdescription">
          <el-row>
            <el-col :span="20">
              <el-input
                :rows="4"
                v-model="applicationForm.applistdescription"
                type="textarea"
                placeholder="请输入简介内容"
              />
            </el-col>
          </el-row>
        </el-form-item>
<!--        <el-form-item label="应用场景" prop="applistscenarios">
          <el-row>
            <el-col :span="20">
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  v-for="(item, index) in scenariosList"
                  :key="index"
                  :label="item.value"
                  >{{ item.text }}</el-checkbox
                >
              </el-checkbox-group>
            </el-col>
          </el-row>
        </el-form-item>-->
        <el-form-item v-show="false" label="应用场景" prop="applistscenarios">
          <el-row>
            <el-col :span="20">
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  v-for="(item, index) in scenariosList"
                  :key="index"
                  :label="item.value"
                >{{ item.text }}</el-checkbox
                >
              </el-checkbox-group>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="应用排序" prop="sort">
          <el-row>
            <el-col :span="20">
<!--              <el-input-number-->
<!--                v-model="applicationForm.sort"-->
<!--                :min="0"-->
<!--                :max="99999"-->
<!--                style="width:100%"-->
<!--                controls-position="right"-->
<!--                placeholder="请输入数字，数字越小排在最前！"-->
<!--              />-->
              <el-input
                v-model="applicationForm.sort"
                type="number"
                :min="0"
                :max="99999"
                style="width:100%"
                controls-position="right"
                placeholder="请输入数字，数字越小排在最前！"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="应用链接">
          <el-row>
            <el-col :span="20">
              <el-input
                v-model="applicationForm.applisturl"
                placeholder="请以http、https开头！"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-row>
            <el-col :span="20">
              <el-switch
                v-model="applicationForm.isdelete"
                active-text="隐藏"
                inactive-text="显示"
                active-value="1"
                inactive-value="0"
                active-color="#ff4949"
                inactive-color="#13ce66"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="Submissionapplication('form')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 首页应用修改-->
    <el-dialog
      :title="'应用详情'"
      :visible.sync="applicationModify"
      :before-close="handleClose"
      width="42%"
    >
      <el-form
        ref="editForm"
        :rules="rules"
        :model="applicationForm"
        label-position="right"
        label-width="112px"
      >
        <el-form-item label="上传应用图标" required>
          <bus-avatar-upload
            :upload-files="uploadFiles"
            @uploadCallbackData="getBgImg"
          ></bus-avatar-upload>
        </el-form-item>
        <el-form-item label="应用名称" prop="applistname">
          <el-row>
            <el-col :span="20">
              <el-input v-model="applicationForm.applistname" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="应用分类" prop="applistclassify">
          <el-row>
            <el-col :span="20">
              <el-select
                v-model="applicationForm.applistclassify"
                disabled
                placeholder="请选择"
              >
                <el-option label="应用功能" value="应用功能" />
                <el-option label="应用系统" value="应用系统" />
                <el-option label="附加功能" value="附加功能" />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="应用简介" prop="applistdescription">
          <el-row>
            <el-col :span="20">
              <el-input
                :rows="4"
                v-model="applicationForm.applistdescription"
                type="textarea"
                placeholder="请输入简介内容"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <!-- <el-form-item label="应用场景" prop="applistscenarios">
          <el-row>
            <el-col :span="20">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="app">应用导航</el-checkbox>
                <el-checkbox label="process">流程图节点</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
        </el-form-item> -->
        <el-form-item label="应用排序" prop="sort">
          <el-row>
            <el-col :span="20">
              <el-input
                type="number"
                v-model="applicationForm.sort"
                :min="0"
                :max="99999"
                style="width:100%"
                controls-position="right"
                placeholder="请输入数字，数字越小排在最前！"
              >
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="应用链接">
          <el-row>
            <el-col :span="20">
              <el-input
                v-model="applicationForm.applisturl"
                placeholder="请以http、https开头！"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-row>
            <el-col :span="20">
              <el-switch
                v-model="applicationForm.isdelete"
                active-text="隐藏"
                inactive-text="显示"
                active-value="1"
                inactive-value="0"
                active-color="#ff4949"
                inactive-color="#13ce66"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="modifyapplication('editForm')"
          >修 改</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
// 图片上传
// import uploadImage from '@/bpm/components/uploadImage'
import uploadImage from './components/UploadImage'
import {
  getQueryCopy,
  addApplication,
  delApplication
} from '@/bpm/api/confinBusinessRule' // 首页应用页面接口
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import BusAvatarUpload from './components/BusAvatarUpload'
export default {
  components: {
    QuickQuery,
    uploadImage,
    BusAvatarUpload
  },
  mixins: [SearchListMixin],
  data() {
    return {
      content: {
        list: []
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      searchType: 'quick',
      applicationAdd: false, // 首页应用新增弹框
      applicationModify: false, // 修改应用新增弹框
      applicationForm: {}, // 应用上传对象
      uploadFiles: [], // 上传应用
      rules: {
        appnewimg: [
          { required: true, message: '请上传应用图标！', trigger: 'blur' }
        ],
        applistclassify: [
          { required: true, message: '请选择应用分类！', trigger: 'change' }
        ],
        applistname: [
          { required: true, message: '请输入应用名称！', trigger: 'blur' }
        ],
        // applistscenarios: [
        //   { required: true, message: '请选择应用场景！', trigger: 'change' }
        // ],
        sort: [
          { required: true, message: '请输入应用排序！', trigger: 'blur' }
        ],
        applicationlink: [
          { required: true, message: '请输入跳转链接！', trigger: 'blur' }
        ]
      },
      checkList: [],
      // scenariosList: [
      //   { text: '应用导航', value: 'app' },
      //   { text: '流程图节点', value: 'process' }
      // ],
      scenariosList: [
        { text: '应用导航', value: 'app' },
        { text: '流程图节点', value: 'process' }
      ]
    }
  },
  watch: {
    checkList: {
      handler(list) {
        this.$set(this.applicationForm, 'applistscenarios', list.join())
        let checkNameList = list.map(item => {
          let scenarios = this.scenariosList.find(el => el.value === item)
          return scenarios.text
        })
        this.$set(
          this.applicationForm,
          'applistscenariosname',
          checkNameList.join()
        )
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.quickQueryData() // 初始化页面页应用信息列表
  },
  methods: {
    // 表格筛选过滤区
    filterTag(value, row) {
      return row.applistclassify === value
    },
    // 弹框出发 清除自定义验证
    getapplicationAdd() {
      this.applicationForm = {
        applistclassify: '应用系统'
      }
      this.uploadFiles = []
      this.applicationAdd = true
      this.checkList = ['app']
    },
    // 修改application 触发
    editorapplication(val) {
      this.applicationForm = JSON.parse(JSON.stringify(val))
      if (this.applicationForm.applistscenarios) {
        this.checkList = this.applicationForm.applistscenarios.split(',')
      }
      let url = ''
      if (process.env.NODE_ENV === 'production') {
        url = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${val.appnewimg}?attachmentType=bpm`
      } else {
        url = `${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${val.appnewimg}?attachmentType=bpm`
      }
      this.uploadFiles.push({ url })
      this.applicationModify = true
    },
    // 重置
    reset() {
      this.searchKey = ''
      this.page.pageNum = 1
      this.quickQueryData()
    },
    // 获取首页应用信息列表方法
    quickQueryData() {
      this.loading = true
      const obj = {
        attr: {},
        filters: [
          {
            key: 'applistname',
            opt: 'LIKE',
            type: 'S',
            value: this.quickData.searchData
          }
        ],
        sort: 'asc',
        orderby: 'sort',
        ...this.sort,
        ...this.page
      }
      getQueryCopy(obj)
        .then(rt => {
          if (rt.status === '200') {
            this.content = rt.data
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取登录页背景图上传id
    getBgImg(val) {
      this.applicationForm.appnewimg = val.id
      let url = ''
      if (process.env.NODE_ENV === 'production') {
        url = `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${val.id}?attachmentType=bpm`
      } else {
        url = `${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${val.id}?attachmentType=bpm`
      }
      this.uploadFiles.push({ url })
    },
    // 关闭弹框初始化数据
    handleClose() {
      if(this.applicationAdd === true) {
        this.$refs.form.resetFields()
        this.$refs.form.clearValidate() // 等弹窗里的form表单的dom渲染完在执行this.$refs.staffForm.resetFields()，去除验证
        this.applicationAdd = false
      } else {
        this.$refs.editForm.resetFields()
        this.$refs.editForm.clearValidate() // 等弹窗里的form表单的dom渲染完在执行this.$refs.staffForm.resetFields()，去除验证
        this.applicationModify = false
      }
      this.uploadFiles = []
      this.checkList = []
      // this.$nextTick(() => {
      //
      // })
    },
    // 提交application应用
    Submissionapplication(formName) {
      if(this.uploadFiles.length === 0) {
        return this.$message.error('请上传图片')
      }
      this.applicationForm.applistimg = ''
      this.applicationForm.applistscenarios = 'app'
      if (this.applicationForm.isdelete === undefined) {
        this.applicationForm.isdelete = 0
      }
      if (this.applicationForm.appnewimg === undefined) {
        this.$message({
          message: '请上传应用图标！',
          type: 'warning'
        })
      } else {
        // 表单自定义验证
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (
              this.applicationForm.applisturl &&
              this.applicationForm.applisturl.indexOf('http') === -1
            ) {
              this.$message({
                message: '应用链接请以http、https开头！',
                type: 'warning'
              })
              return
            }
            // 表单上传
            addApplication(this.applicationForm).then(res => {
              this.$message({
                message: '新增应用成功!',
                type: 'success'
              })
              this.handleClose()
              this.quickQueryData()
            })
          } else {
            this.$message({
              message: '请输入应用信息！',
              type: 'warning'
            })
            return false
          }
        })
      }
    },
    // 修改application应用
    modifyapplication(formName) {
      if(this.uploadFiles.length === 0) {
        return this.$message.error('请上传图片')
      }
      // 表单自定义验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.applicationForm.applisturl &&
            this.applicationForm.applisturl.indexOf('http') === -1
          ) {
            this.$message({
              message: '应用链接请以http、https开头！',
              type: 'warning'
            })
            return
          }
          addApplication(this.applicationForm).then(res => {
            this.$message({
              message: '修改应用信息成功!',
              type: 'success'
            })
            this.handleClose()
            this.quickQueryData()
          })
        } else {
          this.$message({
            message: '请输入应用信息！',
            type: 'warning'
          })
          return false
        }
      })
    },
    // 删除application应用
    deleteapplication(id) {
      const self = this
      self
        .$confirm('是否删除这个应用？', '提示', {
          confirmBtnText: '确定',
          cancelBtnText: '取消'
        })
        .then(res => {
          this.loading = true
          delApplication(id)
            .then(res => {
              this.$message({
                message: '删除应用信息成功!',
                type: 'success'
              })
              this.quickQueryData()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
#systemAppearance {
  .header-header {
    color: #009cd2;
    font-size: 18px;
    margin-bottom: 10px;
    line-height: 30px;
  }
  .header-search {
    border: 1px solid #dbd7d7;
    padding: 12px;
  }
  .button-blue {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    border: 1px solid;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    color: #fff;
    background-color: #2d42af;
    border-color: #2d42af;
  }
  .button-red {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    border: 1px solid;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    color: #fff;
    background-color: #c90110;
    border-color: #c90110;
  }
}
.el-dialog__wrapper {
  /deep/ .el-dialog__body {
    max-height: 65vh;
  }
}
</style>
