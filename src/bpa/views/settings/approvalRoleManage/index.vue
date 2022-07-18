<template>
  <div id="approvalRoleManage">
    <el-row>
      <el-col :span="6">
        <el-input clearable placeholder="请输入内容" class="search_component" v-model="input3">
          <el-button type="primary"  slot="append" @click="search" :value="value"> {{$t('search')}}</el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="tableData" class="main_tab">
      <el-table-column :label="$t('number')" type="index"></el-table-column>
      <el-table-column prop="date" label="审批角色"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="name" label="适用审批流"></el-table-column>
      <el-table-column prop="address" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button class="no-border" @click="dialogVisible=true" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.pageNum"
      :page-size="pages.pageSize"
      background
      layout="prev, pager, next, jumper, total"
      :total="pages.total"
    ></el-pagination>
    <!-- 修改的弹框 -->
    <el-dialog
      title="修改"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="120px">
        <el-form-item label="适用审批流">
          <el-input clearable v-model="form.name" maxlength="50" @input="descInput"></el-input>
        </el-form-item>
        <el-form-item label="节点规定天数(天)">
          <el-input clearable v-model="form.desc" maxlength="50" @input="descInput"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="dialogVisible = false">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const tableData = [
  {
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  },
  {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1517 弄'
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1519 弄'
  },
  {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄'
  }
]
export default {
  data() {
    return {
      tableData,
      dialogVisible: false,
      input3: '',
      form: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      value: '',
      textMaxLength: 5, // 文本框最大字数限制
      areaMaxLength: 10 // 文本框最大字数限制
    }
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    search() {}
  }
}
</script>
