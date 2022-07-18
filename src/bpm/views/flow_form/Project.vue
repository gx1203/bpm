<template>
  <div class="project">
    <div v-if="!isChild" class="project-head">
      <span v-if="item.isrequired === 'required' && item.editstate === 'W'" style="color: red">*</span>
      <span>{{item.fieldShowName}}</span>
      <div class="fill"></div>
    </div>
    <div v-if="!isPrint">
      <div class="mini-toolbar" style="border-bottom:0;">
<!--        <span @click="save()">-->
<!--          <a class="mini-button" plain="true" iconCls="icon-save">保存</a>-->
<!--        </span>-->
<!--        <span class="separator"/>-->
        <span @click="addTask()" v-if="item.editstate === 'W'">
          <a class="mini-button" plain="true" iconCls="icon-add">增加</a>
        </span>
        <span @click="updateTask()" v-if="item.editstate === 'W'">
          <a class="mini-button" plain="true" iconCls="icon-edit">修改</a>
        </span>
        <span @click="removeTask()" v-if="item.editstate === 'W'">
          <a class="mini-button" plain="true" iconCls="icon-remove">删除</a>
        </span>
        <span class="separator" v-if="item.editstate === 'W'"/>
        <span @click="upgradeTask()" v-if="item.editstate === 'W'">
          <a class="mini-button" plain="true" iconCls="icon-upgrade">升级</a>
        </span>
        <span @click="downgradeTask()" v-if="item.editstate === 'W'">
          <a class="mini-button" plain="true" iconCls="icon-downgrade">降级</a>
        </span>
        <span class="separator" v-if="item.editstate === 'W'"/>
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
<!--        <span @click="zoomOut()">-->
<!--          <a class="mini-button" plain="true" iconCls="icon-edit">批量修改</a>-->
<!--        </span>-->
      </div>
    </div>
    <div id="viewCt">
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import {deleteDraft} from "../../api/staging/personal/drafts";
const { mapGetters } = createNamespacedHelpers('app')
export default {
  name: 'Project',
  components: {},
  data () {
    return {
      project: null,
      checkedState: false,
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
        ]
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
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    bizData: {
      type: Object,
      default: () => ({})
    },
    isChild: {
      type: Boolean,
      default: false
    },
    isPrint: {
      type: Boolean
    },
    isNoStart: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    bizData: {
      handler (val) {
        this.initProject(this.item)
      }
    },
    'project.data': {
      handler (val) {
        this.$set(this.item, 'tasks', val.Tasks)
        this.$set(this.item, 'applyvalue', this.item.tasks && this.item.tasks.length > 0 ? JSON.stringify(this.item.tasks) : '')
        this.$set(this.item, 'showValue', this.item.tasks && this.item.tasks.length > 0 ? JSON.stringify(this.item.tasks) : '')
      },
      deep: true
    }
  },
  methods: {
    currentDateLater() {
      var date = new Date();
      var y = date.getFullYear() + 1;
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
    initProject (val) {
      this.$set(val, 'tasks', [])
      if (this.bizData[val.fieldName]) {
        val.tasks = this.bizData[val.fieldName].value
      }
      this.projectList.Tasks = val.tasks

      let dataProject = mini.decode(this.projectList);

      this.doSetProjectData(this.project, dataProject);

      this.project.orderProject();
    },
    save() {
      console.log(this.item)
      console.log(this.project)
      SaveProject(this.project);
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
      // this.checkedState = this.project.getChecked();
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
    this.projectList.StartDate = new Date().toJSON()
    this.projectList.FinishDate = new Date(this.currentDateLater()).toJSON()
    console.log(this.projectList)
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
    //创建右键菜单
    // var menu = new ProjectMenu();
    // this.project.setContextMenu(menu);
    // menu.edit.on("click", (e) {
    //   ShowTaskWindow(this.project);
    // });
    this.initProject(this.item)
    if (this.item.editstate !== 'W') {
      this.project.setReadOnly(true);
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.project {
  padding-right: 10px;
  .project-head {
    margin-bottom: 10px;
  }
}
#viewCt {
  /deep/ .mini-gantt, /deep/ .mini-splitter-border {
    width: 100% !important;
  }
}
</style>
