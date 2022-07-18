<template>
  <div id="approvalTimeManage">
    <el-row>
      <el-col :span="6">
        <el-input clearable placeholder="请输入内容" class="search_component" v-model="keyWords">
          <el-button type="primary"  slot="append"> {{$t('search')}}</el-button>
        </el-input>
      </el-col>
      <el-col :span="6" :offset="12" class="search_buttons_wrap">
        <el-button type="primary" @click="editTime('')">添加</el-button>
      </el-col>
    </el-row>
    <el-table :data="timeList" class="main_tab">
      <el-table-column :label="$t('number')" type="index"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="nodetiem" label="规定节点审批时长"></el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">{{!scope.row.updateon ? scope.row.createon:scope.row.updateon}}</template>
      </el-table-column>
      <el-table-column prop="address" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('modify')" placement="top">
            <el-button class="no-border" @click="editTime(scope.row.id)" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
            <el-button
              class="no-border"
              @click="deleteTime(scope.row.id)"
              icon="el-icon-delete"
              circle
            ></el-button>
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
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="130px" :rules="rules" :model="timeInfo" ref="timeInfoRef">
        <el-form-item label="适用审批流" prop="apptimeid">
          <el-select clearable v-model="timeInfo.apptimeid">
            <el-option
              v-for="item in selectTimelist"
              :key="item.id"
              :label="item.processnamecn"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节点规定天数(天)" prop="nodetiem">
          <el-input clearable type="number" v-model="timeInfo.nodetiem"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="handlerSaveTime">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTimeList,
  saveTime,
  deleteTime,
  getTimeDetail,
  getAppoval
} from '@/bpa/api/settings/approvalTimeManage'
export default {
  data() {
    return {
      timeList: [],
      dialogVisible: false,
      keyWords: '',
      title: '',
      timeInfo: {
        nodetiem: '',
        apptimeid: ''
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      rules: {
        apptimeid: [{ required: true, message: ' ', trigger: 'blur' }],
        nodetiem: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      selectTimelist: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getTimeList({
        attr: {},
        filters: [],
        logic: 'or',
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc'
      }).then(res => {
        if (!res) return false
        this.timeList = res.list
        this.pages.total = res.total
      })
    },
    // 获取适用审批流
    getAppovallist() {
      let self = this
      getAppoval({}).then(res => {
        console.log(res)
        if (!res) return false
        self.selectTimelist = res.list
      })
    },
    handleSizeChange(item) {
      this.pages.pageSize = item
      this.getList()
    },
    handleCurrentChange(item) {
      this.pages.pageNum = item
      this.getList()
    },
    editTime(id) {
      this.dialogVisible = true
      this.getAppovallist()
      this.title = '添加'
      this.$nextTick(() => {
        this.$refs.timeInfoRef.resetFields()
      })
      this.timeInfo.id = ''
      if (id) {
        this.title = '修改'
        getTimeDetail(id).then(res => {
          if (!res) return false
          this.timeInfo = res
        })
      }
    },
    handlerSaveTime() {
      let self = this
      this.$refs.timeInfoRef.validate(valid => {
        if (valid) {
          let name = ''
          let enname = ''
          this.selectTimelist.forEach(item => {
            if (item.id == self.timeInfo.apptimeid) {
              name = item.processnamecn
              enname = item.processname
              return false
            }
          })
          let obj = {
            id: this.timeInfo.id,
            apptimeid: this.timeInfo.apptimeid,
            enname: enname,
            name: name,
            nodetiem: this.timeInfo.nodetiem
          }
          if (!this.timeInfo.id) {
            delete obj.id
          }
          saveTime(obj).then(res => {
            if (res) {
              this.dialogVisible = false
              this.getList()
              this.$message({
                type: 'success',
                message: '修改成功！'
              })
            }
          })
        }
      })
    },
    deleteTime(id) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          deleteTime(id).then(res => {
            if (res) {
              this.getList()
              this.$message({
                type: 'success',
                message: this.$t('hintText.successfullyDelete')
              })
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>
