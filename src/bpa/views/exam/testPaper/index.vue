<template>
  <div id="systemRoleManage">
    <el-row>
      <el-col :span="6">
        <el-input
          v-model="subjectName"
          :placeholder="$t('testSystem.PleaseEnterContent')"
          class="search_component"
          clearable
          @keyup.13.native="getList"
        >
          <el-button slot="append" type="primary" @click="getList">{{$t('testSystem.search')}}</el-button>
        </el-input>
      </el-col>
      <el-button
        type="primary"
        size="small"
        class="float-r margin-r10"
        @click="testPaperAdd = true"
      >{{$t('testSystem.AddTestType')}}</el-button>
    </el-row>
    <el-table :data="roleList" border class="main_tab">
      <el-table-column :label="$t('bpa_number')" type="index" width="50px"/>
      <el-table-column prop="subjectNo" :label="$t('testSystem.TestTypeNo')"/>
      <el-table-column prop="subjectName" :label="$t('testSystem.TestTypeName')"/>
      <el-table-column :label="$t('testSystem.operation')">
        <template slot-scope="scope">
          <el-tooltip :open-delay="1000"
            class="item"
            effect="dark"
            :content="$t('modify')"
            placement="top"
          >
            <el-button class="no-border" icon="el-icon-edit" circle @click="editRole(scope.row)"/>
          </el-tooltip>
          <el-tooltip :open-delay="1000"
            class="item"
            effect="dark"
            :content="$t('delete')"
            placement="top"
          >
            <el-button
              class="no-border"
              icon="el-icon-delete"
              circle
              @click="deleteRow(scope.row.id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background
      :total="pages.total"
      :current-page="pages.pageNum"
      :page-size="pages.pageSize"
      layout="total, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      :title="$t('testSystem.NewTestTypes')"
      :visible.sync="testPaperAdd"
      :before-close="handleClose"
      width="42%">
      <el-form ref="form" :rules="rules" :model="testPaperForm" label-position="right" label-width="112px">
        <el-form-item :label="$t('testSystem.TestTypeNo')">
          <el-row>
            <el-col :span="20">
              <el-input v-model="testPaperForm.subjectNo" :placeholder="$t('testSystem.PleaseEnterTheTestTypeNumber1')"/>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item  :label="$t('testSystem.TestTypeName')" prop="subjectName">
          <el-row>
            <el-col :span="20">
              <el-input v-model="testPaperForm.subjectName" :placeholder="$t('testSystem.PleaseEnterTheTestTypeNumber')"/>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{$t('testSystem.cancel')}}</el-button>
        <el-button type="primary" @click="addtestPaper('form')">{{$t('testSystem.confirm')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('testSystem.ModifyTestType')"
      :visible.sync="testPaperAddg"
      width="42%">
      <el-form ref="form" :rules="rules" :model="testPaperFormg" label-position="right" label-width="112px">
        <el-form-item :label="$t('testSystem.TestTypeNo')">
          <el-row>
            <el-col :span="20">
              <el-input v-model="testPaperFormg.subjectNo" :placeholder="$t('testSystem.PleaseEnterTheTestTypeNumber1')"/>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('testSystem.TestTypeName')" prop="subjectName">
          <el-row>
            <el-col :span="20">
              <el-input v-model="testPaperFormg.subjectName" :placeholder="$t('testSystem.PleaseEnterTheTestTypeNumber')" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="testPaperAddg = false">{{$t('testSystem.cancel')}}</el-button>
        <el-button type="primary" @click="addtestPaperg('form')">{{$t('testSystem.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addSubject, querySubject, delSubjectById, changeSubjectInfo } from '@/bpa/api/examination'
import paginations from '@/bpa/mixins/pagination_mixin.js'
export default {
  components: {
  },
  mixins: [paginations],
  data() {
    return {
      input3: '',
      subjectName: '',
      testPaperAdd: false,
      testPaperAddg: false,
      testPaperForm: {},
      testPaperFormg: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      roleList: [],
      rules: {
        subjectName: [
          { required: true, message: this.$t('testSystem.PleaseEnterContent')+'！', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 新增考试类型信息
    addtestPaper(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        // 表单上传
          addSubject(this.testPaperForm).then(res => {
            console.log(res);
            if(res){
            this.testPaperAdd = false
            this.testPaperForm = {}
            this.$message({
              message: this.$t('testSystem.AddedTestTypeSuccessfully')+'!',
              type: 'success'
            })
            this.getList()
            }
           
          }
          )
        } else {
          this.$message({
            message: this.$t('testSystem.PleaseEnterTestTypeInformation')+'!',
            type: 'warning'
          })
          return false
        }
      })
    },
    addtestPaperg(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        // 表单上传
          changeSubjectInfo(this.testPaperFormg).then(res => {
          
             if(res){
            this.testPaperAddg = false
            this.testPaperFormg = {}
              this.$message({message: this.$t('testSystem.ModifiedTestTypeTuccessfully')+'!',  type: 'success'
              })
              this.getList()
             }
          }
          )
        } else {
          this.$message({
            message: this.$t('testSystem.PleaseEnterTestTypeInformation')+'!',
            type: 'warning'
          })
          return false
        }
      })
    },
    handleClose() {
      this.testPaperAdd = false
      this.testPaperForm = {}
      this.$nextTick(() => {
        this.$refs.form.clearValidate() // 等弹窗里的form表单的dom渲染完在执行this.$refs.staffForm.resetFields()，去除验证
      })
    },
    // 获取考试类型列表
    getList() {
      const obj = {
        startPage: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        subjectName: this.subjectName
      }
      querySubject(obj).then(res => {
        console.log(res)
        this.roleList = res.list
        this.pages.total = res.total
      })
    },
    editRole(val) {
      this.testPaperFormg = {
        id: val.id,
        subjectName: val.subjectName,
        subjectNo: val.subjectNo
      }
      this.testPaperAddg = true
    },
    // 删除考试类型信息
    deleteRow(item) {
      this.$confirm(this.$t('testSystem.AreYouSureToDeleteTheExamTypeInformation'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('testSystem.verify'),
        cancelButtonText: this.$t('testSystem.cancel'),
        type: 'warning'
      }).then(() => {
        delSubjectById(item).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('hintText.successfullyDelete')+'!'
          })
          this.getList()
        })
      }).catch(() => {
        console.log('取消')
      })
    }
  }
}
</script>
