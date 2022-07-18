<template>
  <div id="setintervalTasks">
    <el-row>
      <el-col :span="6">
        <el-input clearable placeholder="请输入内容" class="search_component" v-model="keyWords">
          <el-button type="primary"  slot="append" @click="getList"> {{$t('search')}}</el-button>
        </el-input>
      </el-col>
      <el-col :span="6" :offset="12" class="search_buttons_wrap">
        <el-button type="primary" @click="openDialog('add')">添加</el-button>
      </el-col>
    </el-row>
    <el-table :data="tasksList" class="main_tab">
      <el-table-column :label="$t('number')" type="index"></el-table-column>
      <el-table-column prop="name" label="任务名称"></el-table-column>
      <el-table-column prop="prevFireTime" label="上次执行时间"></el-table-column>
      <el-table-column prop="nextFireTime" label="下次指向时间"></el-table-column>
      <el-table-column prop="triggerStateShow" :label="$t('state')"></el-table-column>
      <el-table-column prop="startTime" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" label="结束时间"></el-table-column>
      <el-table-column prop="address" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('modify')" placement="top">
            <el-button
              class="no-border"
              @click="openDialog('modify', scope.row)"
              icon="el-icon-edit"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
            <el-button class="no-border" @click="delTask(scope.row)" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="scope.row.triggerState === 'PAUSED'"
            class="item"
            effect="dark"
            content="启用"
            placement="top"
          >
            <el-button
              @click="handlerTask('enable', scope.row)"
              class="no-border"
              icon="el-icon-video-play"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip
            v-if="scope.row.triggerState === 'WAITING'"
            class="item"
            effect="dark"
            content="禁用"
            placement="top"
          >
            <el-button
              @click="handlerTask('unable', scope.row)"
              class="no-border"
              icon="el-icon-video-pause"
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
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="120px" ref="form" :model="form" :rules="rules">
        <el-form-item label="任务名称" prop="name">
          <el-input clearable v-model="form.name" maxlength="50" prop="name"></el-input>
        </el-form-item>
        <el-form-item label="任务描述" prop="desc">
          <el-input clearable type="textarea" resize="none" rows="3" v-model="form.desc" maxlength="1000"></el-input>
        </el-form-item>
        <el-form-item label="执行者" prop="operator">
          <el-select clearable v-model="form.operator" placeholder="请选择执行者">
            <el-option
              v-for="item in operatlist"
              :key="item.classPath"
              :label="item.name"
              :value="item.classPath"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="触发器类型" prop="triggerType">
          <el-select clearable v-model="form.triggerType" placeholder="请选择执行者">
            <el-option label="CRON" value="CRON"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="CRON表达式" prop="expression">
          <el-input clearable v-model="form.expression" maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="saveInterTask">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTasksList,
  enableTask,
  getOperatlist,
  intervalSave,
  delintervalTask,
  edit2Save
} from '@/bpa/api/settings/setintervalTasks'
import paginations from '@/bpa/mixins/pagination_mixin'
export default {
  data() {
    return {
      saveType: 'new',
      tasksList: [],
      dialogVisible: false,
      keyWords: '',
      form: {
        name: '',
        desc: '',
        expression: ''
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      dialogTitle: '添加定时任务',
      operatlist: [],
      rules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        desc: [{ required: true, message: ' ', trigger: 'blur' }],
        operator: [{ required: true, message: ' ', trigger: 'change' }],
        triggerType: [{ required: true, message: ' ', trigger: 'change' }],
        expression: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000 // 文本框最大字数限制
    }
  },
  mixins: [paginations],
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getTasksList({
        attr: {},
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        logic: 'or',
        filters: [{ key: 'name', opt: 'LIKE', type: 'S', value: this.keyWords }]
      }).then(res => {
        this.tasksList = res.list
        this.pages.total = res.total
      })
    },
    handlerTask(type, row) {
      enableTask({
        taskId: row.id,
        type: type === 'enable' ? 'resume' : 'pause'
      }).then(res => {
        this.$message({
          type: 'success',
          message: type === 'enable' ? '启用' : '禁用' + '成功!'
        })
        this.getList()
      })
    },
    openDialog(type, item) {
      this.form = {}
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      if (type === 'add') {
        this.saveType = 'new'
        this.dialogTitle = '添加定时任务'
      } else {
        this.saveType = 'modify'
        this.dialogTitle = '修改定时任务'
        this.form = Object.assign({}, item, {
          name: item.name,
          id: item.id,
          expression: item.cronExpression,
          desc: item.description,
          operator: item.jobClass,
          triggerType: item.triggerType
        })
      }
      this.dialogVisible = true
      this.getOperatlist()
    },
    getOperatlist() {
      getOperatlist().then(res => {
        this.operatlist = res
      })
    },
    saveInterTask() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.name.length > this.textMaxLength) {
            this.$message({
              type: 'warning',
              message: '警告哦，任务名称不能超过50字符哦'
            })
            return false
          } else if (this.form.desc.length > this.areaMaxLength) {
            this.$message({
              type: 'warning',
              message: '警告哦，任务描述不能超过1000字符哦'
            })
            return false
          } else if (this.form.expression.length > this.textMaxLength) {
            this.$message({
              type: 'warning',
              message: '警告哦，CRON表达式不能超过50字符哦'
            })
            return false
          }
          let obj = {
            cronExpression: this.form.expression,
            description: this.form.desc,
            jobClass: this.form.operator,
            name: this.form.name,
            triggerType: this.form.triggerType,
            id: this.form.id
          }
          if (this.saveType === 'modify') {
            obj = Object.assign({}, this.form, obj)
          }
          edit2Save(obj).then(res => {
            if (!res) {
              return false
            }
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.dialogVisible = false
            this.remnant1 = 0
            this.remnant2 = 0
            this.remnant3 = 0
            this.getList()
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    // 删除定时任务
    delTask(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        delintervalTask({
          taskId: item.id,
          type: 'delete'
        }).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('hintText.successfullyDelete')
          })
          this.getList()
        })
      })
    }
  }
}
</script>
