<template>
  <el-card shadow="never" id="systemAppearance">
    <div class="version mb-10">
      <div class="buton">版本信息：</div>
      <div
        v-for="item in versionList"
        :key="item.id"
        class="buton"
        :class="{'active-buton': activeId === item.id }"
        @click="getFrameVersion(item.id)"
      >{{ item.versionname }}</div>
    </div>
    <el-form :model="searchForm" label-width="64px" size="mini">
      <el-row :gutter="20" class="tool-common-wrap">
        <el-col :span="6">
          <el-form-item :label="$t('taskName')">
            <el-input clearable type="text" v-model="searchForm.taskName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('startTime')">
            <el-date-picker
              v-model="searchForm.startTime"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="searchTasks">搜索</el-button>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <el-upload
            class="margin-r10"
            style="display: inline-block;"
            accept=".xlsx,.xls"
            :action="action"
            :on-success="handlerSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
            :headers="myHeaders"
            v-show="!readOnly"
          >
            <el-button type="primary">
              导入
            </el-button>
          </el-upload>
          <el-button
            v-show="!!activeId"
            type="primary"
            :loading="exportLoading"
            @click="exportFile"
          >导出{{ exportLoading ? '中' : '' }}</el-button>
          <el-button type="primary" :loading="downloadLoading" @click="downloadFile">
            {{ downloadLoading ? '下载中' : '下载模板' }}
          </el-button>
          <el-button type="primary" @click="versionUpgrade">版本升级</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="project" v-loading="loading">
      <div class="mini-toolbar" style="border-bottom:0;">
        <span @click="save()" v-show="!readOnly">
          <a class="mini-button" plain="true" iconCls="icon-save">保存</a>
        </span>
        <span class="separator" v-show="!readOnly" />
        <span @click="addTask()" v-show="!readOnly">
          <a class="mini-button" plain="true" iconCls="icon-add">增加</a>
        </span>
        <span @click="updateTask()" v-show="!readOnly">
          <a class="mini-button" plain="true" iconCls="icon-edit">修改</a>
        </span>
        <span @click="removeTask()" v-show="!readOnly">
          <a class="mini-button" plain="true" iconCls="icon-remove">删除</a>
        </span>
        <span class="separator" v-show="!readOnly" />
        <span @click="upgradeTask()" v-show="!readOnly">
          <a class="mini-button" plain="true" iconCls="icon-upgrade">升级</a>
        </span>
        <span @click="downgradeTask()" v-show="!readOnly">
          <a class="mini-button" plain="true" iconCls="icon-downgrade">降级</a>
        </span>
        <span class="separator" v-show="!readOnly" />
        <span @click="onLockClick">
          <a class="mini-button" plain="true" iconCls="icon-lock" checkOnClick="true" :checkedState="checkedState">锁定列</a>
        </span>
        <span class="separator"/>
        <span @click="zoomIn()">
          <a class="mini-button" plain="true" iconCls="icon-zoomin">{{$t('amplification')}}</a>
        </span>
        <span @click="zoomOut()">
          <a class="mini-button" plain="true" iconCls="icon-zoomout">{{$t('narrow') }}</a>
        </span>
      </div>
      <div id="viewCt">
      </div>
    </div>
  </el-card>
</template>

<script>
// 图片上传
import uploadImage from '@/bpm/components/uploadImage'
import { getPlan, getPlanManageList, savePlan, versionUpgrade, verificationDataPlan } from '@/bpm/api/configManage/plan' // 首页应用页面接口
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import axios from "axios";
export default {
  components: {
    QuickQuery,
    uploadImage
  },
  mixins: [SearchListMixin],
  data() {
    return {
      loading: false,
      searchForm: {},
      versionList: [],
      activeId: '',
      project: null,
      checkedState: false,
      readOnly: false,
      exportLoading: false,
      downloadLoading: false,
      myHeaders: {token: localStorage.getItem('token')},
      projectList: {
        "UID": "100",
        "Name": "软件开发100",
        // "StartDate": "2021-01-22T08:00:00",
        // "FinishDate": "2021-05-14T15:00:00",
        "CalendarUID": "1",
        "Principals": [
          {
            "Name": "张三",
            "UID": 1,
            "Department": "1"
          },
          {
            "Name": "李四",
            "UID": 2,
            "Department": "1"
          },
          {
            "Name": "赵五",
            "UID": 3,
            "Department": "1"
          },
          {
            "Name": "Jack",
            "UID": 4,
            "Department": "2"
          },
          {
            "Name": "Rose",
            "UID": 5,
            "Department": "2"
          },
          {
            "Name": "Mark",
            "UID": 6,
            "Department": "2"
          },
          {
            "Name": "Niko",
            "UID": 7,
            "Department": "2"
          },
          {
            "Name": "李泉",
            "UID": 8,
            "Department": "3"
          },
          {
            "Name": "陈光",
            "UID": 9,
            "Department": "3"
          },
          {
            "Name": "李健",
            "UID": 10,
            "Department": "3"
          },
          {
            "Name": "顾姗姗",
            "UID": 11,
            "Department": "3"
          }
        ],
        "Departments": [
          {
            "Name": "研发部",
            "UID": 1
          },
          {
            "Name": "财务部",
            "UID": 2
          },
          {
            "Name": "人事部",
            "UID": 3
          }
        ],
        "Resources": [
          {
            "Name": "管理人员",
            "UID": "1",
            "Type": 1,
            "MaxUnits": 100
          },
          {
            "Name": "项目经理",
            "UID": "2",
            "Type": 1,
            "MaxUnits": 100
          },
          {
            "Name": "分析人员",
            "UID": "3",
            "Type": 1,
            "MaxUnits": 100
          },
          {
            "Name": "开发人员",
            "UID": "4",
            "Type": 1,
            "MaxUnits": 100
          },
          {
            "Name": "测试人员",
            "UID": "5",
            "Type": 1,
            "MaxUnits": 100
          },
          {
            "Name": "讲师",
            "UID": "6",
            "Type": 1,
            "MaxUnits": 100
          },
          {
            "Name": "技术联络人员",
            "UID": "7",
            "Type": 1,
            "MaxUnits": 100
          },
          {
            "Name": "部署小组",
            "UID": "8",
            "Type": 1,
            "MaxUnits": 100
          }
        ],
        // "Tasks": [{
        //   "UID": "1",
        //   "Name": "项目范围规划",
        //   "Start": "2007-01-01T00:00:00",
        //   "Finish": "2007-01-10T23:59:59",
        //   "Duration": 8,
        //   "PercentComplete": 0,
        //   "PredecessorLink": [],
        //   "Summary": 1,
        //   "children": [{
        //     "UID": "2",
        //     "Name": "项目范围规划",
        //     "Start": "2007-01-01T00:00:00",
        //     "Finish": "2007-01-10T23:59:59",
        //     "Duration": 8,
        //     "PercentComplete": 0,
        //     "PredecessorLink": [],
        //     "Summary": 1,
        //   },
        //     {
        //       "UID": "3",
        //       "Name": "项目范围规划",
        //       "Start": "2007-01-01T00:00:00",
        //       "Finish": "2007-01-10T23:59:59",
        //       "Duration": 8,
        //       "PercentComplete": 0,
        //       "Summary": 1,
        //       "PredecessorLink": [{
        //         "TaskUID": "3",
        //         "LinkLag": 0,
        //         "LagFormat": 7,
        //         "Type": 1,
        //         "PredecessorUID": "2"
        //       }]
        //     },
        //     {
        //       "UID": "4",
        //       "Name": "项目范围规划",
        //       "Start": "2007-01-01T00:00:00",
        //       "Finish": "2007-01-10T23:59:59",
        //       "Duration": 8,
        //       "PercentComplete": 0,
        //       "Summary": 1,
        //       "PredecessorLink": [{
        //         "TaskUID": "4",
        //         "LinkLag": 0,
        //         "LagFormat": 7,
        //         "Type": 1,
        //         "PredecessorUID": "3"
        //       }],
        //       "Priority": 500,
        //       "ActualStart": null
        //     },
        //     {
        //       "UID": "5",
        //       "Name": "项目范围规划",
        //       "Start": "2007-01-01T00:00:00",
        //       "Finish": "2007-01-10T23:59:59",
        //       "Duration": 8,
        //       "PercentComplete": 0,
        //       "Summary": 1,
        //       "PredecessorLink": [{
        //         "TaskUID": "5",
        //         "LinkLag": 0,
        //         "LagFormat": 7,
        //         "Type": 1,
        //         "PredecessorUID": "4"
        //       }]
        //     },
        //     {
        //       "UID": "6",
        //       "Name": "项目范围规划",
        //       "Start": "2007-01-01T00:00:00",
        //       "Finish": "2007-01-10T23:59:59",
        //       "Duration": 8,
        //       "PercentComplete": 0,
        //       "Summary": 1,
        //       "PredecessorLink": [{
        //         "TaskUID": "6",
        //         "LinkLag": 0,
        //         "LagFormat": 7,
        //         "Type": 1,
        //         "PredecessorUID": "5"
        //       }]
        //     }]
        // }]
      }
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    action() {
      return `${this.host}/planmanage/importExcel`;
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (extension !== "xlsx" && extension !== "xls") {
        this.$message({
          type: "warning",
          message: "请上传.xlsx/.xls 文件"
        });
        return false;
      }
    },
    handlerSuccess(rt) {
      console.log(rt);
      if (rt.status === '200' && rt.data) {
        this.projectList.Tasks = rt.data ? JSON.parse(rt.data) : []
        this.initProject()
      } else {
        this.$message({
          type: "warning",
          message: this.$t("hintText.attachmentUploadedfailed")
        });
      }
    },
    exportFile() {
      this.exportLoading = true;
      verificationDataPlan(this.activeId).then(res => {
        axios({
          method: "get",
          url: `${this.host}/planmanage/exportExcel/${this.activeId}`,
          responseType: "blob",
          timeout: 60000000
        })
        .then(res => {
          console.log(res)
          this.exportLoading = false;
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
          });
          console.log(blob)
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // 兼容TMD IE
            navigator.msSaveBlob(blob, this.downloadName);
          } else {
            // 其他浏览器
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", "计划管理.xls");
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        })
        .catch(err => {
          this.exportLoading = false;
        });
      }).catch(err => {
        this.exportLoading = false;
      })

    },
    downloadFile() {
      this.downloadLoading = true;
      axios({
        method: "get",
        url: `${this.host}/planmanage/download`,
        responseType: "blob",
        timeout: 60000000
      })
        .then(res => {
          this.downloadLoading = false;
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
          });
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // 兼容TMD IE
            navigator.msSaveBlob(blob, this.downloadName);
          } else {
            // 其他浏览器
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", "计划模板.xls");
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        })
        .catch(() => {
          this.downloadLoading = false;
        });
    },
    searchTasks(e){
      let that = this
      this.project.filter(function (task) {
        let name = that.searchForm.taskName ? task.Name.indexOf(that.searchForm.taskName) > -1 : true;
        let start = that.searchForm.startTime && that.searchForm.startTime.length > 0 ? that.currentDateLater(task.Start) >= that.searchForm.startTime[0] && that.currentDateLater(task.Start) <= that.searchForm.startTime[1] : true;
        return start && name
      })
    },
    getPlanManageList() {
      getPlanManageList().then(rt => {
        if (rt.status === '200' && rt.data)
        this.versionList = rt.data || []
        if (this.versionList && this.versionList.length > 0) {
          this.activeId = this.versionList[0].id
          this.getPlan()
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    versionUpgrade() {
      let tasks = this.project.data.Tasks && this.project.data.Tasks.length > 0 ? JSON.stringify(this.project.data.Tasks) : ''
      versionUpgrade({
        projectdata: tasks
      }).then(rt => {
        this.getPlanManageList()
      }).catch(() => {
      })
    },
    getPlan() {
      this.projectList.Tasks = []
      this.loading = true
      getPlan({
        id: this.activeId
      }).then(rt => {
        this.loading = false
        if (rt.status === '200' && rt.data) {
          this.projectList.Tasks = rt.data.projectdata ? JSON.parse(rt.data.projectdata) : []
          this.initProject()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    initProject () {
      let dataProject = mini.decode(this.projectList);
      this.doSetProjectData(this.project, dataProject);
      this.project.orderProject();
    },
    save() {
      console.log(this.project)
      this.loading = true
      let tasks = this.project.data.Tasks && this.project.data.Tasks.length > 0 ? JSON.stringify(this.project.data.Tasks) : ''
      savePlan({
        id: this.activeId,
        projectdata: tasks
      }).then(rt => {
        this.getPlan()
      }).catch(() => {
        this.loading = false
      })
    },
    getFrameVersion(id) {
      this.searchForm = {}
      this.activeId = id;
      this.readOnly = this.activeId !== this.versionList[0].id;
      this.project.setReadOnly(this.readOnly);
      this.getPlan()
    },
    currentDateLater(param) {
      var date = param || new Date();
      var y = param ? date.getFullYear() : date.getFullYear() + 1;
      var m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      var h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? ('1' + minute) : minute;
      second = second < 10 ? ('0' + second) : second;
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    },
    addTask() {
      var newTask = this.project.newTask();
      newTask.Name = '<新增任务>';    //初始化任务属性

      var selectedTask = this.project.getSelected();
      if (selectedTask) {
        this.project.addTask(newTask, "before", selectedTask);   //插入到到选中任务之前
        //this.project.addTask(newTask, "add", selectedTask);       //加入到选中任务之内
      } else {
        this.project.addTask(newTask);
      }
    },
    removeTask() {
      var task = this.project.getSelected();
      if (task) {
        this.$confirm("确定删除任务 \""+task.Name+"\" ？", this.$t('hintText.hint'), {
          type: 'warning'
        }).then(() => {
          this.project.removeTask(task);
        }).catch(() => {})
      } else {
        this.$message({
          message: '请选选中任务',
          type: 'warning'
        });
      }
    },
    updateTask() {
      ShowTaskWindow(this.project);
    },
    upgradeTask() {
      var task = this.project.getSelected();
      if (task) {
        this.project.upgradeTask(task);
      } else {
        this.$message({
          message: '请选选中任务',
          type: 'warning'
        });
      }
    },
    downgradeTask() {
      var task = this.project.getSelected();
      if (task) {
        this.project.downgradeTask(task);
      } else {
        this.$message({
          message: '请选选中任务',
          type: 'warning'
        });
      }
    },
    zoomIn() {
      this.project.zoomIn();
    },
    zoomOut() {
      this.project.zoomOut();
    },

    onLockClick(e) {
      this.checkedState = !this.checkedState
      if (this.checkedState) {
        this.project.frozenColumn(0, 2);
      } else {
        this.project.unfrozenColumn();
      }
    },

    doSetProjectData (project, dataProject) {
      if (project.showProjectTask) {

        var root = { Name: dataProject.Name, isProject: true };
        root.children = dataProject.Tasks;

        dataProject.Tasks = [root];

        project.loadData(dataProject);

        //如果是将项目作为顶级父任务，则需要处理下数据联动

        project.orderProject();

      } else {
        project.loadData(dataProject);
      }
    }
  },
  mounted () {
    this.getPlanManageList()
    this.projectList.StartDate = new Date().toJSON()
    this.projectList.FinishDate = new Date(this.currentDateLater()).toJSON()
    mini.parse();
    /* 创建项目甘特图对象，设置列配置，创建右键菜单和任务面板
    -----------------------------------------------------------------------------*/
    this.project = new PlusProject();
    this.project.setStyle("height:400px");
    this.project.setColumns([
      new PlusProject.IDColumn(),
      new PlusProject.StatusColumn(),
      new PlusProject.NameColumn(),
      new PlusProject.PredecessorLinkColumn(),
      new PlusProject.PercentCompleteColumn(),
      new PlusProject.DurationColumn(),
      new PlusProject.StartColumn(),
      new PlusProject.FinishColumn(),
      new PlusProject.WorkColumn(),
      new PlusProject.DepartmentColumn(),
      new PlusProject.PrincipalColumn(),
      new PlusProject.AssignmentsColumn()
    ]);
    this.project.render(document.getElementById("viewCt"));
    this.getPlan()
    // this.initProject(this.item)
    // if (this.item.editstate !== 'W') {
    //   this.project.setReadOnly(true);
    // }
  }
}
</script>
<style lang="scss" scoped>
.version {
  overflow: hidden;
  .buton {
    float: left;
    margin-right: 10px;
    color: #000;
    font-family: Arial, 微软雅黑, "Microsoft Sans Serif";
    font-size: 12px;
    cursor: pointer;
  }
  .active-buton {
    color: #2d42af;
  }
}
#viewCt {
  /deep/ .mini-gantt, /deep/ .mini-splitter-border {
    width: 100% !important;
  }
}
</style>
