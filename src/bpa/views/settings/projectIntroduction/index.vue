<template>
  <div style="background-color: white;" id="processCard">
    <el-table :data="tableCardlist" stripe class="main_tab">
      <el-table-column :label="number" type="index" />
      <el-table-column prop="description" :label="fieldNames" />
      <el-table-column prop="content" :label="fieldContent" />
      <el-table-column :label="operation">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="edit" placement="top">
            <!-- class="no-border" icon="el-icon-edit" circle -->
            <el-button type="text" @click="addfield(scope.row)" >{{ edit }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--    添加或者修改字段-->
    <el-dialog :title="ModifyProjectIntroductionManagement" :visible.sync="dialogVisible" width="40%">
      <el-form ref="fieldlist" :model="fieldlist" label-width="120px">
        <el-form-item :label="fieldNames" required>
          <el-input clearable v-model="fieldlist.description" />
        </el-form-item>
        <el-form-item :label="fieldContent">
          <el-input clearable v-model="fieldlist.content" resize="none" :rows="6" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="confirmField('fieldlist')">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getIntroduction, updateIntroduction } from '@/bpa/api/settings/projectIntroduction'
export default {
  data () {
    return {
      // 标签页的字段
      tableTabCardlist: [],
      // 控制显示隐藏弹出框
      dialogVisible: false,
      params: {
        attr: {},
        filters: [
          { key: 'name', opt: 'LIKE', type: 'S', value: '' },
          { key: 'state', opt: 'LIKE', type: 'S', value: '' },
          { key: 'sheetname', opt: 'LIKE', type: 'S', value: null }
        ],
        logic: 'or',
        orderby: 'createon',
        pageNum: 1,
        pageSize: 10,
        sort: 'desc'
      },
      tableCardlist: [],
      isHighSearch: false,
      searchContent: '',
      searchForm: {
        blgLabel: '',
        name: '',
        state: ''
      },
      form: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      fieldtitle: '修改项目介绍管理',
      // 弹出框的变量部分
      fieldlist: {
        id: '',
        description: '',
        content: ''
      },
      number: this.$t("number"),
      fieldNames: this.$t("fieldNames"),
      fieldContent: this.$t("fieldContent"),
      operation: this.$t("operation"),
      edit: this.$t("edit"),
      ModifyProjectIntroductionManagement: this.$t("ModifyProjectIntroductionManagement"),
      fieldNameShouldNotExceedTenWords: this.$t("hintText.fieldNameShouldNotExceedTenWords"),
      fieldNameShouldNotExceedTwoHundredWords: this.$t("hintText.fieldNameShouldNotExceedTwoHundredWords"),
      dataSavedSuccessfully: this.$t("hintText.dataSavedSuccessfully"),
      requiredFieldsCannotBeEmpty: this.$t("hintText.requiredFieldsCannotBeEmpty"),
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    /*
      获取标签页内列表数据
     */
    getData (type) {
      const self = this
      getIntroduction({}).then(res => {
        self.tableCardlist = res
      })
    },

    handleCurrentChange (val) {
      this.params.pageNum = val
      this.getData()
    },
    /*
      弹出添加或者修改的对话框
     */
    addfield (item) {
      this.dialogVisible = true
      this.fieldlist.id = item.id
      this.fieldlist.description = item.description
      this.fieldlist.content = item.content
    },
    /*
      弹出框确认
     */
    confirmField (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.fieldlist.description) {
            this.$message({
              type: 'warning',
              message: this.$t('placeholderText.enterSettingsProcessTabCard')
            })
            return false
          }
          console.log(this.fieldlist.description.length > 10)
          if (this.fieldlist.description.length > 10) {
            this.$message({
              type: 'warning',
              message: this.fieldNameShouldNotExceedTenWords
            })
            return false
          }
          if (this.fieldlist.content.length > 200) {
            this.$message({
              type: 'warning',
              message: this.fieldNameShouldNotExceedTwoHundredWords
            })
            return false
          }
          updateIntroduction({
            'id': this.fieldlist.id,
            description: this.fieldlist.description,
            content: this.fieldlist.content
          }).then(res => {
            this.$message({
              type: 'success',
              message: this.dataSavedSuccessfully
            })
            this.dialogVisible = false
            this.getData()
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.requiredFieldsCannotBeEmpty
          })
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
#processCard{
  background-color: white;
  height: calc(100vh - 172px);
  padding: 10px;
  overflow-x: hidden;
}
</style>