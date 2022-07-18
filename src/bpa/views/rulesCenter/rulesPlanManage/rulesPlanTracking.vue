<template>
  <div id="handbookFiles">
    <el-row style="margin-bottom: 10px">
      <el-col :span="24" class="search_buttons_wrap">
        <el-button type="primary" @click="downloadHandle">导出</el-button>
        <el-button type="primary" @click="innerHandle">调整计划</el-button>
      </el-col>
    </el-row>
    <el-collapse-transition>
      <el-form
        class="search_options_wrap"
        :model="searchForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="制度名称">
              <el-input v-model="searchForm.newname" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年度">
              <el-date-picker
                v-model="searchForm.year"
                type="year"
                value-format="yyyy"
                placeholder="选择年"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="authority === '3'">
            <el-form-item label="创建部门">
              <el-input v-model="searchForm.deptname" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="显示周期">
              <el-select v-model="period">
                <el-option label="月" value="yearAndMonth"></el-option>
                <el-option label="周" value="yearAndWeek"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="search_buttons_wrap">
          <el-button type="primary" @click="highSearch">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-collapse-transition>
    <!-- 信息表格 -->
    <wl-gantt ref="wl-gantt-demo"
              size="medium"
              :data="booksList"
              :edit="false"
              height="580"
              use-real-time
              useIndexColumn
              :date-type="period"
              :startDate="booksList.length>0?booksList[0].mindate:null"
              :endDate="booksList.length>0?booksList[0].maxdate:null">
      <el-table-column align="center"
                       label="制度名称"
                       show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.newname}}</template>
      </el-table-column>

      <el-table-column align="center"
                       label="部门"
                       min-width="200"
                       show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.deptname}}</template>
      </el-table-column>

      <el-table-column align="center"
                       label="方式"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <p v-if="scope.row.systype === '1'">新编</p>
          <p v-else-if="scope.row.systype === '2'">修订</p>
          <p v-else-if="scope.row.systype === '3'">废止</p>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="状态"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <p v-if="scope.row.status === '1'">未开始</p>
          <p v-else-if="scope.row.status === '2'">进行中</p>
          <p v-else-if="scope.row.status === '3'">已结束</p>
        </template>
      </el-table-column>

      <el-table-column label="提示"
                       min-width="180"
                       align="center"
                       show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.tips}}</template>
      </el-table-column>
      <el-table-column label="操作"
                       v-if="authority === '3'"
                       align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.status === '2' && scope.row.tips.startsWith('超期')">
            <el-tooltip class="item"
                        effect="dark"
                        content="催办"
                        placement="top">
              <el-button class="no-border"
                         @click="hastenWork(scope.row.id)"
                         icon="el-icon-message-solid"
                         circle></el-button>
            </el-tooltip>
          </p>
        </template>
      </el-table-column>
    </wl-gantt>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.pageNum"
      :page-sizes="[10, 15, 20]"
      :page-size="pages.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pages.total"
    ></el-pagination>
    <!-- 添加弹框 -->
    <el-dialog
      title="计划调整"
      :visible.sync="dialogVisible"
      fullscreen
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="form"
        :model="editFormObj"
        label-width="90px"
        :rules="rules"
      >
        <el-row v-if="!isEdit" style="padding: 0 10px">
          <el-col :span="4" :offset="20" align="right">
            <el-button
              type="primary"
              @click="
                getPdf({
                  title: editFormObj.department + '-' + editFormObj.theme,
                })
              "
              >下 载</el-button
            >
          </el-col>
        </el-row>
        <div id="pdfDom">
          <el-row>
            <div class="card">
              <div class="header">
                <span class="title">基本信息</span>
              </div>
            </div>
            <el-col :span="11" :offset="1">
              <el-form-item label="计划主题:" prop="theme">
                <el-input
                  v-model="editFormObj.theme"
                  :disabled="!isEdit"
                  maxlength="100"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="计划年度:" prop="year">
                <el-date-picker
                  :disabled="!isEdit"
                  v-model="editFormObj.year"
                  type="year"
                  value-format="yyyy"
                  placeholder="选择年"
                ></el-date-picker>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="11"
                    :offset="1">
              <el-form-item label="评估报告"
                            prop="noticid">
                <el-select v-model="editFormObj.noticid"
                           filterable
                           :disabled="!isEdit"
                           @change="noticHandle"
                           clearable>
                  <el-option v-for="(item, index) in reportList"
                             :key="index"
                             :label="item.subject"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->

            <el-col :span="11" :offset="1" v-if="editFormObj.id">
              <el-form-item label="创建部门:">
                <el-input v-model="editFormObj.department" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1" v-if="editFormObj.id">
              <el-form-item label="创建人:">
                <el-input v-model="editFormObj.createby" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1" v-if="editFormObj.id">
              <el-form-item label="创建时间:" prop="createtime">
                <el-date-picker
                  disabled
                  v-model="editFormObj.createtime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="card">
            <div class="header">
              <span class="title">新编制度</span>
            </div>
          </div>
          <div class="text-right">
            <el-button
              size="mini"
              v-if="isEdit"
              type="primary"
              @click="addList('xbList')"
              >添加</el-button
            >
          </div>
          <el-table border class="main_tab" :data="editFormObj.xbList">
            <el-table-column
              label="序号"
              fixed="left"
              type="index"
            ></el-table-column>
            <el-table-column
              label="制度所属层级"
              min-width="200"
              :render-header="renderHeader"
              fixed="left"
              prop="sysnameleaveid"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.sysnameleaveid"
                  @change="sysnameLeaveHandle(scope)"
                  :disabled="!isEdit"
                >
                  <el-option
                    v-for="(item, index) in sysnameLeaveList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="制度类别"
              min-width="200"
              fixed="left"
              prop="sysnameid"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.sysnameid"
                  @change="sysnameHandle(scope)"
                  :disabled="!isEdit"
                >
                  <el-option
                    v-for="(item, index) in scope.row.sysnameList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="制度名称"
              min-width="200"
              fixed="left"
              :render-header="renderHeader"
              prop="newname"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.newname"
                  :disabled="!isEdit"
                  maxlength="1000"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="syslevel"
              min-width="200"
              :render-header="renderHeader"
              label="制度层级"
            >
              <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.syslevel"
                          type="number"
                          :disabled="!isEdit"
                          onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                          maxlength="1000"></el-input> -->
                <el-select
                  v-model="scope.row.syslevel"
                  clearable
                  :disabled="!isEdit"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in sysOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="maindepartment"
              min-width="200"
              :render-header="renderHeader"
              label="主责部门"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.maindepartment"
                  @focus="focusDeptHandle('主责部门', 'xbList', scope.$index)"
                  :disabled="!isEdit"
                  maxlength="1000"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="cooperatedepartment"
              min-width="200"
              label="配合部门"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.cooperatedepartment"
                  :disabled="!isEdit"
                  @focus="focusDeptHandle('配合部门', 'xbList', scope.$index)"
                  maxlength="1000"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column
              prop="formationreason"
              min-width="200"
              label="编制原因"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.formationreason"
                  type="textarea"
                  :disabled="!isEdit"
                  show-word-limit
                  maxlength="225"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column
              prop="maincontent"
              min-width="200"
              label="主要内容"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.maincontent"
                  type="textarea"
                  :disabled="!isEdit"
                  show-word-limit
                  maxlength="225"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="abolishsystem"
              label="同步废止制度"
              min-width="180"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.abolishsystem"
                  :disabled="!isEdit"
                  maxlength="1000"
                  @focus="addList1('xbList', scope.$index)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="begindate"
              min-width="200"
              label="预计开始时间"
            >
              <template slot-scope="scope">
                <el-date-picker
                  :disabled="!isEdit"
                  v-model="scope.row.begindate"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  default-time="00:00:00"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="enddate"
              min-width="200"
              :render-header="renderHeader"
              label="预计完成时间"
            >
              <template slot-scope="scope">
                <el-date-picker
                  :disabled="!isEdit"
                  v-model="scope.row.enddate"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  default-time="00:00:00"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="systemwriter"
              :render-header="renderHeader"
              min-width="120"
              label="制度编写人"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.systemwriter"
                  @focus="focusHandle('制度编写人', 'xbList', scope.$index)"
                  :disabled="!isEdit"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="systemcontacts"
              min-width="120"
              label="制度联络人"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.systemcontacts"
                  @focus="focusHandle('制度联络人', 'xbList', scope.$index)"
                  :disabled="!isEdit"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right" v-if="isEdit">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button
                    @click="deleteFile(scope.$index, '1')"
                    class="no-border"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="card">
            <div class="header">
              <span class="title">修订制度</span>
            </div>
          </div>
          <div class="text-right">
            <el-button
              size="mini"
              v-if="isEdit"
              type="primary"
              @click="addList('xdList')"
              >添加</el-button
            >
          </div>
          <el-table border class="main_tab" :data="editFormObj.xdList">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="制度名称" min-width="200" prop="sysname">
            </el-table-column>
            <el-table-column
              prop="syslevel"
              min-width="160"
              :render-header="renderHeader"
              label="制度层级"
            >
              <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.syslevel"
                          type="number"
                          onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                          maxlength="1000"></el-input> -->
                <el-select
                  v-model="scope.row.syslevel"
                  clearable
                  :disabled="!isEdit"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in sysOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="maindepartment"
              min-width="120"
              :render-header="renderHeader"
              label="主责部门"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.maindepartment"
                  @focus="focusDeptHandle('主责部门', 'xdList', scope.$index)"
                  :disabled="!isEdit"
                  maxlength="1000"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="cooperatedepartment"
              min-width="120"
              label="配合部门"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.cooperatedepartment"
                  :disabled="!isEdit"
                  maxlength="1000"
                  @focus="focusDeptHandle('配合部门', 'xdList', scope.$index)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="assessmentresults"
              min-width="200"
              label="评估结果"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.assessmentresults"
                  type="textarea"
                  :disabled="!isEdit"
                  show-word-limit
                  maxlength="225"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column
              prop="mainrevisioncontents"
              min-width="200"
              label="主要修订内容"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.mainrevisioncontents"
                  type="textarea"
                  :disabled="!isEdit"
                  show-word-limit
                  maxlength="225"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="abolishsystem"
              label="同步废止制度"
              min-width="120"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.abolishsystem"
                  :disabled="!isEdit"
                  maxlength="1000"
                  @focus="addList1('xdList', scope.$index)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="begindate"
              min-width="160"
              label="预计开始时间"
            >
              <template slot-scope="scope">
                <el-date-picker
                  :disabled="!isEdit"
                  v-model="scope.row.begindate"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  default-time="00:00:00"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="enddate"
              :render-header="renderHeader"
              min-width="160"
              label="预计完成时间"
            >
              <template slot-scope="scope">
                <el-date-picker
                  :disabled="!isEdit"
                  v-model="scope.row.enddate"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  default-time="00:00:00"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="systemwriter"
              :render-header="renderHeader"
              min-width="90"
              label="制度编写人"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.systemwriter"
                  @focus="focusHandle('制度编写人', 'xdList', scope.$index)"
                  :disabled="!isEdit"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="systemcontacts"
              min-width="90"
              label="制度联络人"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.systemcontacts"
                  @focus="focusHandle('制度联络人', 'xdList', scope.$index)"
                  :disabled="!isEdit"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作" v-if="isEdit">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button
                    @click="deleteFile(scope.$index, '2')"
                    class="no-border"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="card">
            <div class="header">
              <span class="title">废止制度</span>
            </div>
          </div>
          <div class="text-right">
            <el-button
              size="mini"
              type="primary"
              v-if="isEdit"
              @click="addList('fzList')"
              >添加</el-button
            >
          </div>
          <el-table border class="main_tab" :data="editFormObj.fzList">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="制度名称" min-width="200" prop="sysname">
            </el-table-column>
            <el-table-column prop="publishnumber" label="发文文号">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.publishnumber"
                  :disabled="!isEdit"
                  maxlength="1000"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column label="发布时间" min-width="160">
              <template slot-scope="scope">
                <el-date-picker
                  :disabled="!isEdit"
                  v-model="scope.row.publishtime"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  default-time="00:00:00"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </template>
            </el-table-column>

            <el-table-column
              prop="maindepartment"
              min-width="120"
              :render-header="renderHeader"
              label="主责部门"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.maindepartment"
                  @focus="focusDeptHandle('主责部门', 'fzList', scope.$index)"
                  :disabled="!isEdit"
                  maxlength="1000"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="assessmentresults"
              min-width="200"
              label="评估结果"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.assessmentresults"
                  type="textarea"
                  :disabled="!isEdit"
                  show-word-limit
                  maxlength="225"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="abolishtype"
              min-width="150"
              label="废止类型"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.abolishtype" :disabled="!isEdit">
                  <el-option
                    label="因新编或修订而废止"
                    value="因新编或修订而废止"
                  ></el-option>
                  <el-option
                    label="制度本身已失效"
                    value="制度本身已失效"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              prop="abolishreason"
              min-width="200"
              label="废止原因说明"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.abolishreason"
                  type="textarea"
                  :disabled="!isEdit"
                  show-word-limit
                  maxlength="225"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="begindate"
              min-width="160"
              label="预计开始时间"
            >
              <template slot-scope="scope">
                <el-date-picker
                  :disabled="!isEdit"
                  v-model="scope.row.begindate"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  default-time="00:00:00"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="enddate"
              :render-header="renderHeader"
              min-width="160"
              label="预计完成时间"
            >
              <template slot-scope="scope">
                <el-date-picker
                  :disabled="!isEdit"
                  v-model="scope.row.enddate"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  default-time="00:00:00"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </template>
            </el-table-column>

            <el-table-column label="操作" v-if="isEdit">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button
                    @click="deleteFile(scope.$index, '3')"
                    class="no-border"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="card">
            <div class="header">
              <span class="title">评估报告</span>
            </div>
          </div>
          <el-table border class="main_tab" :data="editFormObj.docfiles">
            <el-table-column prop="filename" label="文件名"></el-table-column>
            <el-table-column prop="filesize" label="文件大小"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="下载"
                  placement="top"
                >
                  <a :href="downloadFile(scope.row.fileId)" download>
                    <el-button
                      class="no-border"
                      icon="el-icon-download"
                      circle
                    ></el-button>
                  </a>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          v-if="isEdit"
          @click="focusMainLeader('mainLeader')"
          >上 报</el-button
        >
      </span>
    </el-dialog>
    <select-rules-plan-summary
      isTrack
      v-model="innerVisible"
      @confirm="addDialog"
    ></select-rules-plan-summary>
    <!-- <el-dialog width="60%"
               title="选择计划"
               :visible.sync="innerVisible"
               append-to-body>
      <el-form ref="innerForm"
               label-width="90px">
        <el-row>
          <el-col :span="11"
                  :offset="1">
            <el-form-item label="计划年度:">
              <el-date-picker @change="planSummaryHandle"
                              v-model="innerObj.year"
                              type="year"
                              value-format="yyyy"
                              placeholder="选择年"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="22"
                  :offset="1">
            <el-form-item label="选择计划:">
              <el-select v-model="innerObj.plan"
                         filterable
                         clearable
                         placeholder="请选择">
                <el-option v-for="item in innerPlanList"
                           :key="item.id"
                           :label="item.theme"
                           :value="item.id">
                  <span style="float: left">{{ item.theme }}</span>
                  <span style="float: left; color: #8492a6; font-size: 13px">--{{ item.department }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addDialog">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 上报选岗 -->
    <el-dialog title="选择岗位" :visible.sync="dialogPositionVisible">
      <el-form ref="item" label-width="250px" class="content">
        <el-form-item label="选择岗位:" required>
          <el-select v-model="positionId" class="w100" placeholder="请选择">
            <el-option
              v-for="data in positionList"
              :key="data.pid"
              :label="data.dname + '-' + data.pname"
              :value="data.pid"
            >
              <span style="float: left">{{
                data.dname + "-" + data.pname
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogPositionVisible = false;
            positionId = '';
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="submitPosition">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加弹框 -->
    <el-dialog
      title="选择相关信息"
      :visible.sync="dialogReportVisible"
      width="60%"
    >
      <el-row>
        <el-col :span="16" :offset="4">
          <el-form label-width="90px">
            <el-form-item label="部门领导:" required="">
              <el-input
                @focus="focusHandle('mainLeader')"
                placeholder="请选择部门正职，若无则选择主持工作的副职"
                v-model="mainLeader.mainLeader"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="评估报告"
                          required>
              <el-select v-model="checkReportid"
                         filterable
                         clearable>
                <el-option v-for="(item, index) in reportList"
                           :key="index"
                           :label="item.subject"
                           :value="item.id"></el-option>
              </el-select> -->
            <!-- </el-form-item> -->
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogReportVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveReport">确 定</el-button>
      </span>
    </el-dialog>

    <select-person2
      v-model="isSelectPersonVisible"
      :selected="selectedPersonList"
      @confirm="handlerSelectPersonComfirm"
    ></select-person2>
    <select-person2
      v-model="isPersonVisible"
      :selected="selectedPersonList"
      title="选择部门领导审批人"
      :isRequired="true"
      @confirm="handlerPersonComfirm"
    ></select-person2>
    <select-group
      v-model="isGroupVisible"
      :selectTree="['2']"
      :showTree="'1,2,3,4'"
      :selected="selectedID"
      @confirm="handlerGroupSelect"
    ></select-group>
    <systemDialog
      v-model="systemVisible"
      @confirm="confirmSystem"
      :title="title"
      :processlists="defaultList"
    ></systemDialog>
  </div>
</template>

<script>
import {
  getPlanTrackingList,
  exportPlan,
  savePlanTracking,
} from "@/bpa/api/rulesCenter/rulesPlanTracking";
import selectRulesPlanSummary from "./selectRulesPlanSummary";
import {
  updateSelect,
  getDetailByModelIds,
} from "@/bpa/api/rulesCenter/rulesPlanManage";
import paginations from "@/bpa/mixins/pagination_mixin";
import fileOperation from "@/bpa/mixins/fileDownView";
import wlGantt from '@/bpa/components/gantt'
import systemDialog from "@/bpa/components/systemDialog";
import { getProcessIframeTree } from "@/bpa/api/componentsApi";
import { getFormateDate, export_post_list } from "@/utils/common";
import { createNamespacedHelpers } from "vuex";
import axios from "axios";

const userInfo = createNamespacedHelpers("userInfo");
export default {
  data() {
    return {
      booksList: [],
      keyWords: "",
      period: "yearAndMonth",
      mainLeader: {},
      dialogVisible: false,
      dialogReportVisible: false,
      isPersonVisible: false,
      reportList: [],
      sysnameLeaveList: [],
      params: {},
      isHighSearch: false,
      checkReportid: "",
      isEdit: false,
      innerVisible: false,
      title: "",
      innerObj: {
        year: getFormateDate(new Date(), "yyyy"),
        plan: [],
      },
      innerPlanList: [],
      selectedID: [],
      isGroupVisible: false,
      selectedPersonList: [],
      searchForm: {
        deptname: "",
        year: getFormateDate(new Date(), "yyyy"),
        newname: "",
      },
      isSelectPersonVisible: false,
      authority: "",
      editFormObj: {
        effectiveDate: "",
        fzList: [],
        xbList: [],
        xdList: [],
        postid: "",
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      rules: {
        theme: [{ required: true, message: " ", trigger: "blur" }],
        year: [{ required: true, message: " ", trigger: "blur" }],
        createon: [{ required: true, message: " ", trigger: "blur" }],
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      // 体系分类
      sysLists: [],
      dialogPositionVisible: false,
      positionList: [],
      positionId: "",
      itemId: "",
      systemVisible: false,
      defaultList: [],
      defaultType: "",
      defaultIndex: "",
      systemKey1: "",
      abolishsystemid: "",
      sysOptions: [
        {
          label: "三级以下",
          value: "1",
        },
        {
          label: "非三级以下",
          value: "2",
        },
      ],
    };
  },
  components: {
    wlGantt,
    selectRulesPlanSummary,
    systemDialog,
  },
  mixins: [paginations, fileOperation],
  computed: {
     host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    action() {
      return `${this.host}/regulation/upload?username=${this.userid}`;
    },
    download() {
      return this.host + "/regulation/download/";
    },
    viewfile() {
      return this.host + "/document/print/";
    },
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .empuid;
    },
    username() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .cnname;
    },
  },
  mounted() {
    // 获取当前登录人权限
    this.getAuthoriy();
    this.reset();
  },
  methods: {
    renderHeader(cerateElement, { column }) {
      return cerateElement("span", [
        cerateElement("span", {
          domProps: {
            innerHTML: "*",
          },
          style: {
            color: "red",
          },
        }),
        cerateElement("span", column.label),
      ]);
    },
    handlerPersonComfirm(list) {
      let self = this;
      self.$set(
        self.mainLeader,
        self.userkey + "id",
        list
          .map((item) => {
            return item.empuid;
          })
          .join(",")
      );
      self.$set(
        self.mainLeader,
        self.userkey,
        list
          .map((item) => {
            return item.cnname;
          })
          .join(",")
      );
      if (self.userkey === "mainLeader") {
        this.saveReport();
      }
      self.$forceUpdate();
    },
    focusMainLeader(key) {
      this.selectedPersonList = [];
      this.userkey = key;
      if (this.mainLeader[key + "id"]) {
        this.mainLeader[key].split(",").forEach((item, index) => {
          this.selectedPersonList.push({
            cnname: item,
            empuid: this.mainLeader[key + "id"]
              ? this.mainLeader[key + "id"].split(",")[index]
              : "",
          });
        });
      }
      this.isPersonVisible = true;
    },
    noticHandle() {
      this.editFormObj.noticname = "";
      this.editFormObj.noticname = this.reportList.find(
        (item) => item.id === this.editFormObj.noticid
      ).subject;
    },
    sysnameHandle(item) {
      let data = item.row.sysnameList.find(
        (val) => val.id === item.row.sysnameid
      );
      this.$set(item.row, "sysname", data.name);
    },
    sysnameLeaveHandle(item) {
      item.row.sysnameleave = this.sysnameLeaveList.find(
        (val) => val.id === item.row.sysnameleaveid
      ).name;
      if (item.row.sysnameleave.indexOf("三级以下制度") !== -1) {
        item.row.syslevel = "1";
      } else {
        item.row.syslevel = "2";
      }
      getProcessIframeTree(item.row.sysnameleaveid).then((res) => {
        this.$set(item.row, "sysnameid", "");
        this.$set(item.row, "sysname", "");
        this.$set(
          item.row,
          "sysnameList",
          res.filter((item) => item.typeid === "5")
        );
      });
    },
    getAuthoriy() {
      axios
        .get(`${this.host}/jurisdictionConfigration/getByUserId/${this.userid}`)
        .then((rt) => {
          let data = rt.data.data;
          if (data.type === "1") {
            this.authority = "1";
          } else if (data.type === "2") {
            if (data.jhgz === "Y") {
              this.authority = "2";
            } else {
              this.authority = "1";
            }
          } else if (data.type === "3") {
            this.authority = "3";
          }
        });
    },
    downloadHandle() {
      let obj = {
        pageNum: 0,
        pageSize: 0,
        sort: "desc",
        logic: "and",
        filters: [
          {
            key: "sysname",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.sysname,
          },
          {
            key: "year",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.year,
          },
          {
            key: "deptname",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.deptname,
          },
        ],
      };
      exportPlan(obj)
        .then((res) => {
          export_post_list(res, "计划跟踪.xls");
        })
        .catch(() => {});
    },
    innerHandle() {
      this.innerVisible = true;
      // let obj = {
      //   pageNum: 0,
      //   pageSize: 0,
      //   logic: 'and',
      //   filters: [
      //     {
      //       key: 'year',
      //       opt: 'LIKE',
      //       type: 'S',
      //       value: this.innerObj.year
      //     },
      //     {
      //       key: 'status',
      //       opt: 'LIKE',
      //       type: 'S',
      //       value: '1'
      //     }
      //   ]
      // }
      // queryForTk(obj).then(res => {
      //   if (!res) return false
      //   this.innerPlanList = res.list
      //   this.innerVisible = true
      // })
    },
    focusHandle(type, key, index) {
      this.selectedPersonList = [];
      this.personType = type;
      if (this.personType === "制度编写人") {
        this.personKey = key;
        this.personIndex = index;
        if (this.editFormObj[key][this.personIndex].systemwriter) {
          this.editFormObj[key][this.personIndex].systemwriter
            .split(",")
            .forEach((item, index) => {
              this.selectedPersonList.push({
                cnname: item,
                empuid: this.editFormObj[key][this.personIndex].systemwriterid
                  ? this.editFormObj[key][
                      this.personIndex
                    ].systemwriterid.split(",")[index]
                  : "",
              });
            });
        }
      } else if (this.personType === "制度联络人") {
        this.personKey = key;
        this.personIndex = index;
        if (this.editFormObj[key][this.personIndex].systemcontacts) {
          this.editFormObj[key][this.personIndex].systemcontacts
            .split(",")
            .forEach((item, index) => {
              this.selectedPersonList.push({
                cnname: item,
                empuid: this.editFormObj[key][this.personIndex].systemcontactsid
                  ? this.editFormObj[key][
                      this.personIndex
                    ].systemcontactsid.split(",")[index]
                  : "",
              });
            });
        }
      } else {
        this.personType = type;
        if (this.mainLeader[type + "id"]) {
          this.mainLeader[type].split(",").forEach((item, index) => {
            this.selectedPersonList.push({
              cnname: item,
              empuid: this.mainLeader[type + "id"]
                ? this.mainLeader[type + "id"].split(",")[index]
                : "",
            });
          });
        }
      }
      this.isSelectPersonVisible = true;
    },
    focusDeptHandle(type, key, index) {
      this.selectedID = [];
      this.groupType = type;
      if (this.groupType === "创建部门") {
        if (this.editFormObj.departmentid) {
          this.editFormObj.departmentid.split(",").forEach((item, index) => {
            this.selectedID.push({
              NAME: this.editFormObj.department
                ? this.editFormObj.department.split(",")[index]
                : "",
              ID: Number(item),
            });
          });
        }
      } else if (this.groupType === "主责部门") {
        this.groupKey = key;
        this.groupIndex = index;
        if (this.editFormObj[key][this.groupIndex].maindepartment) {
          this.editFormObj[key][this.groupIndex].maindepartment
            .split(",")
            .forEach((item, index) => {
              this.selectedID.push({
                NAME: item,
                ID: Number(
                  this.editFormObj[key][this.groupIndex].maindepartmentid
                    ? this.editFormObj[key][
                        this.groupIndex
                      ].maindepartmentid.split(",")[index]
                    : ""
                ),
              });
            });
        }
      } else if (this.groupType === "配合部门") {
        this.groupKey = key;
        this.groupIndex = index;
        if (this.editFormObj[key][this.groupIndex].cooperatedepartment) {
          this.editFormObj[key][this.groupIndex].cooperatedepartment
            .split(",")
            .forEach((item, index) => {
              this.selectedID.push({
                NAME: item,
                ID: Number(
                  this.editFormObj[key][this.groupIndex].cooperatedepartmentid
                    ? this.editFormObj[key][
                        this.groupIndex
                      ].cooperatedepartmentid.split(",")[index]
                    : ""
                ),
              });
            });
        }
      }
      this.isGroupVisible = true;
    },
    handlerGroupSelect(list) {
      if (this.groupType === "创建部门") {
        this.editFormObj.departmentid = list
          .map((item) => {
            return item.ID;
          })
          .join(",");
        this.editFormObj.department = list
          .map((item) => {
            return item.NAME;
          })
          .join(",");
      } else if (this.groupType === "主责部门") {
        this.$set(
          this.editFormObj[this.groupKey][this.groupIndex],
          "maindepartmentid",
          list
            .map((item) => {
              return item.ID;
            })
            .join(",")
        );
        this.$set(
          this.editFormObj[this.groupKey][this.groupIndex],
          "maindepartment",
          list
            .map((item) => {
              return item.NAME;
            })
            .join(",")
        );
      } else if (this.groupType === "配合部门") {
        this.$set(
          this.editFormObj[this.groupKey][this.groupIndex],
          "cooperatedepartmentid",
          list
            .map((item) => {
              return item.ID;
            })
            .join(",")
        );
        this.$set(
          this.editFormObj[this.groupKey][this.groupIndex],
          "cooperatedepartment",
          list
            .map((item) => {
              return item.NAME;
            })
            .join(",")
        );
      }
    },
    handlerSelectPersonComfirm(list) {
      if (this.personType === "制度编写人") {
        this.$set(
          this.editFormObj[this.personKey][this.personIndex],
          "systemwriterid",
          list
            .map((item) => {
              return item.empuid;
            })
            .join(",")
        );
        this.$set(
          this.editFormObj[this.personKey][this.personIndex],
          "systemwriter",
          list
            .map((item) => {
              return item.cnname;
            })
            .join(",")
        );
      } else if (this.personType === "制度联络人") {
        this.$set(
          this.editFormObj[this.personKey][this.personIndex],
          "systemcontactsid",
          list
            .map((item) => {
              return item.empuid;
            })
            .join(",")
        );
        this.$set(
          this.editFormObj[this.personKey][this.personIndex],
          "systemcontacts",
          list
            .map((item) => {
              return item.cnname;
            })
            .join(",")
        );
      } else {
        let self = this;
        self.$set(
          self.mainLeader,
          self.personType + "id",
          list
            .map((item) => {
              return item.empuid;
            })
            .join(",")
        );
        self.$set(
          self.mainLeader,
          self.personType,
          list
            .map((item) => {
              return item.cnname;
            })
            .join(",")
        );
        self.$forceUpdate();
      }
    },
    getReportList() {
      getProcessIframeTree(
        `${
          process.env.ROUTER_URL === "sxTest"
            ? "BD06C4AE2A712645E0533405A8C0C606"
            : "79957553BD2F3978E053BF1A13ACD4"
        }`
      ).then((res) => {
        this.sysnameLeaveList = res;
        this.editFormObj.xbList.forEach((val) => {
          getProcessIframeTree(val.sysnameleaveid).then((res) => {
            this.$set(
              val,
              "sysnameList",
              res.filter((item) => item.typeid === "5")
            );
          });
        });
      });
    },
    addDialog(list) {
      this.getReportList();
      // if (this.innerObj.plan) {
      //   this.dialogVisible = true
      //   this.isEdit = true
      //   let _obj = this.innerPlanList.find(item => {
      //     return item.id === this.innerObj.plan
      //   })

      this.dialogVisible = true;
      this.isEdit = true;
      if (list[0].docfiles) {
        list[0].docfiles.forEach((item) => {
          item.filename = item.originalName;
          item.filesize = item.fileSize + "B";
          item.fileId = item.id;
        });
      }
      this.editFormObj = JSON.parse(JSON.stringify(list[0]));
      // }
    },
    // addList(type) {
    //   if (type === '3') {
    //     this.editFormObj.fzList.push({
    //       systype: type
    //     })
    //   } else if (type === '2') {
    //     this.editFormObj.xbList.push({
    //       systype: type
    //     })
    //   } else if (type === '1') {
    //     this.editFormObj.xdList.push({
    //       systype: type
    //     })
    //   }
    // },
    addList(key) {
      this.defaultType = "0";
      this.defaultList = [];
      this.systemKey = key;
      if (key === "xbList") {
        this.title = "选择上级制度";
        this.editFormObj.xbList.push({});
      } else {
        this.title = "选择制度";
        if (this.editFormObj[key].length > 0) {
          this.editFormObj[key].forEach((item, index) => {
            this.defaultList.push({
              name: item.sysname,
              id: item.sysid,
            });
          });
        }
        this.systemVisible = true;
      }
    },
    addList1(key, index, item) {
      console.log(item);
      this.defaultType = "1";
      this.defaultIndex = index;
      this.defaultList = [];
      this.systemKey1 = key;
      if (this.editFormObj[key][index].abolishsystem) {
        this.defaultList.push({
          name: this.editFormObj[key][index].abolishsystem,
          id: this.editFormObj[key][index].abolishsystemid,
        });
      }
      this.systemVisible = true;
    },
    systemData(data) {
      if (this.defaultType === "0") {
        if (this.editFormObj[this.systemKey].length === 0) {
          this.editFormObj[this.systemKey] = data.map((item) => {
            return {
              sysname: item.newname,
              syslevel: item.syslevel !== "null" ? item.syslevel : "",
              maindepartment: item.maindepartment,
              maindepartmentid: item.maindepartmentid,
              cooperatedepartment: item.cooperatedepartment,
              cooperatedepartmentid: item.cooperatedepartmentid,
              systemwriter: item.systemwriter,
              systemwriterid: item.systemwriterid,
              systemcontactsid: item.systemcontactsid,
              systemcontacts: item.systemcontacts,
              sysnameid: item.id,
              sysid: item.sysid,
              enddate: item.enddate,
              begindate: item.begindate,
            };
          });
        } else {
          let sysname = [];
          data.forEach((val) => {
            let list = this.editFormObj[this.systemKey].map(
              (item) => item.sysid
            );
            if (list.indexOf(val.sysid) !== -1) {
              sysname.push(
                this.editFormObj[this.systemKey].find((item) => {
                  return item.sysid === val.sysid;
                })
              );
            }
          });
          data.forEach((val) => {
            let list = this.editFormObj[this.systemKey].map(
              (item) => item.sysid
            );
            if (list.indexOf(val.sysid) === -1) {
              sysname.push({
                sysname: val.newname,
                syslevel: val.syslevel !== "null" ? val.syslevel : "",
                maindepartment: val.maindepartment,
                maindepartmentid: val.maindepartmentid,
                cooperatedepartment: val.cooperatedepartment,
                cooperatedepartmentid: val.cooperatedepartmentid,
                systemwriter: val.systemwriter,
                systemwriterid: val.systemwriterid,
                systemcontactsid: val.systemcontactsid,
                systemcontacts: val.systemcontacts,
                enddate: val.enddate,
                begindate: val.begindate,
                sysnameid: val.id,
                sysid: val.sysid,
              });
            }
          });
          this.editFormObj[this.systemKey] = sysname;
        }
        this.systemVisible = false;
      } else {
        this.$set(
          this.editFormObj[this.systemKey1][this.defaultIndex],
          "abolishsystem",
          data[0].newname
        );
        this.$set(
          this.editFormObj[this.systemKey1][this.defaultIndex],
          "abolishsystemid",
          data[0].id
        );
        if (this.defaultList && this.defaultList.length > 0) {
          this.editFormObj.fzList.map((i) => {
            if (i.defaultIndex === this.defaultIndex) {
              i.sysname = data[0].newname;
              i.sysnameid = data[0].id;
              i.defaultIndex = this.defaultIndex;
              i.defaultKey = this.systemKey1;
              i.syslevel = data[0].syslevel !== "null" ? data[0].syslevel : "";
              i.maindepartment = data[0].maindepartment;
              i.maindepartmentid = data[0].maindepartmentid;
              i.cooperatedepartment = data[0].cooperatedepartment;
              i.cooperatedepartmentid = data[0].cooperatedepartmentid;
              i.systemwriter = data[0].systemwriter;
              i.systemwriterid = data[0].systemwriterid;
              i.systemcontactsid = data[0].systemcontactsid;
              i.systemcontacts = data[0].systemcontacts;
              i.sysid = data[0].sysid;
              i.enddate = data[0].enddate;
              i.begindate = data[0].begindate;
            }
          });
        } else {
          this.editFormObj.fzList.push({
            sysname: data[0].newname,
            sysnameid: data[0].id,
            defaultIndex: this.defaultIndex,
            defaultKey: this.systemKey1,
            syslevel: data[0].syslevel !== "null" ? data[0].syslevel : "",
            maindepartment: data[0].maindepartment,
            maindepartmentid: data[0].maindepartmentid,
            cooperatedepartment: data[0].cooperatedepartment,
            cooperatedepartmentid: data[0].cooperatedepartmentid,
            systemwriter: data[0].systemwriter,
            systemwriterid: data[0].systemwriterid,
            systemcontactsid: data[0].systemcontactsid,
            systemcontacts: data[0].systemcontacts,
            sysid: data[0].sysid,
            enddate: data[0].enddate,
            begindate: data[0].begindate,
          });
        }
        this.systemVisible = false;
      }
    },
    confirmSystem(data) {
      if (data.length !== 1 && this.defaultType !== "0") {
        this.$message.error("请选择一个制度");
        return false;
      }
      let params = data.map((item) => {
        return {
          sysid: item.id,
          newname: item.name,
        };
      });
      getDetailByModelIds(params).then((res) => {
        this.systemData(res);
      });
    },
    singleSearch() {
      this.pages.pageNum = 1;
      this.params = {
        orderby: "createon",
        sort: "desc",
        filters: [
          { key: "newname", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "year", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "deptname", opt: "LIKE", type: "S", value: this.keyWords },
        ],
        logic: "or",
      };
      this.getList();
    },
    highSearch() {
      this.pages.pageNum = 1;
      this.params = {
        orderby: "createon",
        sort: "desc",
        logic: "and",
        filters: [
          {
            key: "newname",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.newname,
          },
          {
            key: "year",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.year,
          },
          {
            key: "deptname",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.deptname,
          },
        ],
      };
      this.getList();
    },
    reset() {
      this.pages.pageNum = 1;
      this.searchForm = {
        deptname: "",
        year: "",
        sysname: "",
      };
      this.params = {
        orderby: "createon",
        sort: "desc",
        filters: [
          {
            key: "year",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.year,
          },
        ],
      };

      this.getList();
    },
    getList() {
      let obj = {
        ...this.pages,
        ...this.params,
      };
      getPlanTrackingList(obj).then((res) => {
        if (!res) return false;
        this.booksList = [];
        this.booksList = res.list.map((item) => {
          return {
            ...item,
            startDate: item.begindate
              ? getFormateDate(new Date(item.begindate), "yyyy-MM-dd")
              : "",
            endDate: item.enddate
              ? getFormateDate(new Date(item.enddate), "yyyy-MM-dd")
              : "",
            realStartDate: item.sjbegindate
              ? getFormateDate(new Date(item.sjbegindate), "yyyy-MM-dd")
              : "",
            realEndDate: item.sjenddate
              ? getFormateDate(new Date(item.sjenddate), "yyyy-MM-dd")
              : "",
          };
        });
        this.pages.total = res.total;
      });
    },
    saveReport() {
      if (!this.mainLeader.mainLeader) {
        this.$message.error("请选择部门领导！！！");
        return;
      }
      let data = JSON.parse(
        localStorage.getItem("portalCurrentUserInfo") || "{}"
      ).empuid;
      updateSelect(data).then((res) => {
        this.dialogReportVisible = false;
        if (res && res.length === 1) {
          this.positionId = res[0].pid;
          this.submitPosition();
        } else if (res.length === 0) {
          this.$message.error("当前没有岗位信息，请联系BPM");
        } else {
          this.positionList = res;
          this.dialogPositionVisible = true;
        }
      });
    },
    // 确认添加
    saveInstitution() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.dialogReportVisible = true;
        }
      });
    },
    // 选岗确认
    submitPosition() {
      for (let i = 0; i < this.editFormObj.xbList.length; i++) {
        let item = this.editFormObj.xbList[i];
        if (!item.newname) {
          this.$message.error(`新增制度第${i + 1}条制度名称不能为空`);
          return false;
        } else if (!item.sysnameleaveid) {
          this.$message.error(`新增制度第${i + 1}条制度所属层级不能为空`);
          return false;
        } else if (!item.syslevel) {
          this.$message.error(`新增制度第${i + 1}条制度层级不能为空`);
          return false;
        } else if (!item.maindepartment) {
          this.$message.error(`新增制度第${i + 1}条主责部门不能为空`);
          return false;
        } else if (
          item.enddate === "" ||
          item.enddate === null ||
          item.enddate === undefined
        ) {
          this.$message.error(`新增制度第${i + 1}条预计完成时间不能为空`);
          return false;
        } else if (item.enddate) {
          item.enddate = item.enddate
            ? getFormateDate(new Date(item.enddate), "yyyy-MM-dd hh:mm:ss")
            : "";
        } else if (item.begindate) {
          item.begindate = item.begindate
            ? getFormateDate(new Date(item.begindate), "yyyy-MM-dd hh:mm:ss")
            : "";
        }
        item.publishtime = item.publishtime
          ? getFormateDate(new Date(item.publishtime), "yyyy-MM-dd hh:mm:ss")
          : "";
      }
      for (let i = 0; i < this.editFormObj.xdList.length; i++) {
        let item = this.editFormObj.xdList[i];
        if (
          item.enddate === "" ||
          item.enddate === null ||
          item.enddate === undefined
        ) {
          this.$message.error(`修编制度第${i + 1}条预计完成时间不能为空`);
          return false;
        } else if (!item.syslevel) {
          this.$message.error(`修编制度第${i + 1}条制度层级不能为空`);
          return false;
        } else if (!item.maindepartment) {
          this.$message.error(`修编制度第${i + 1}条主责部门不能为空`);
          return false;
        } else if (
          item.enddate === "" ||
          item.enddate === null ||
          item.enddate === undefined
        ) {
          this.$message.error(`修编制度第${i + 1}条预计完成时间不能为空`);
          return false;
        } else if (item.enddate) {
          item.enddate = item.enddate
            ? getFormateDate(new Date(item.enddate), "yyyy-MM-dd hh:mm:ss")
            : "";
        } else if (item.begindate) {
          item.begindate = item.begindate
            ? getFormateDate(new Date(item.begindate), "yyyy-MM-dd hh:mm:ss")
            : "";
        }
        item.publishtime = item.publishtime
          ? getFormateDate(new Date(item.publishtime), "yyyy-MM-dd hh:mm:ss")
          : "";
      }
      for (let i = 0; i < this.editFormObj.fzList.length; i++) {
        let item = this.editFormObj.fzList[i];
        if (!item.maindepartment) {
          this.$message.error(`废止制度第${i + 1}条主责部门不能为空`);
          return false;
        } else if (
          item.enddate === "" ||
          item.enddate === null ||
          item.enddate === undefined
        ) {
          this.$message.error(`废止制度第${i + 1}条预计完成时间不能为空`);
          return false;
        } else if (item.enddate) {
          item.enddate = item.enddate
            ? getFormateDate(new Date(item.enddate), "yyyy-MM-dd hh:mm:ss")
            : "";
        } else if (item.begindate) {
          item.begindate = item.begindate
            ? getFormateDate(new Date(item.begindate), "yyyy-MM-dd hh:mm:ss")
            : "";
        }
        item.publishtime = item.publishtime
          ? getFormateDate(new Date(item.publishtime), "yyyy-MM-dd hh:mm:ss")
          : "";
      }
      this.editFormObj.postid = this.positionId;
      this.editFormObj.createon = getFormateDate(
        new Date(this.editFormObj.createon),
        "yyyy-MM-dd hh:mm:ss"
      );
      this.editFormObj.year = getFormateDate(
        new Date(this.editFormObj.year),
        "yyyy"
      );
      this.editFormObj.fzList.forEach((item) => {
        item.publishtime = item.publishtime
          ? getFormateDate(new Date(item.publishtime), "yyyy-MM-dd hh:mm:ss")
          : "";
        item.enddate = item.enddate
          ? getFormateDate(new Date(item.enddate), "yyyy-MM-dd hh:mm:ss")
          : "";
        item.begindate = item.begindate
          ? getFormateDate(new Date(item.begindate), "yyyy-MM-dd hh:mm:ss")
          : "";
      });
      this.editFormObj.xbList.forEach((item) => {
        item.publishtime = item.publishtime
          ? getFormateDate(new Date(item.publishtime), "yyyy-MM-dd hh:mm:ss")
          : "";
        item.enddate = item.enddate
          ? getFormateDate(new Date(item.enddate), "yyyy-MM-dd hh:mm:ss")
          : "";
        item.begindate = item.begindate
          ? getFormateDate(new Date(item.begindate), "yyyy-MM-dd hh:mm:ss")
          : "";
      });
      this.editFormObj.xdList.forEach((item) => {
        item.publishtime = item.publishtime
          ? getFormateDate(new Date(item.publishtime), "yyyy-MM-dd hh:mm:ss")
          : "";
        item.enddate = item.enddate
          ? getFormateDate(new Date(item.enddate), "yyyy-MM-dd hh:mm:ss")
          : "";
        item.begindate = item.begindate
          ? getFormateDate(new Date(item.begindate), "yyyy-MM-dd hh:mm:ss")
          : "";
      });
      this.editFormObj.abolishsystemid = this.editFormObj.fzList
        .map((i) => i.sysnameid)
        .join();
      this.editFormObj.deptHead = this.mainLeader.mainLeaderid;
      savePlanTracking(this.editFormObj).then((res) => {
        this.$message({
          type: "success",
          message: "保存成功！",
        });
        this.dialogVisible = false;
        this.innerVisible = false;
        this.dialogPositionVisible = false;
        this.getList();
      });
    },
    deleteFile(index, type) {
      let _this = this;
      _this
        .$confirm("确认要删除该条信息吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          if (type === "3") {
            if (_this.editFormObj.fzList[index].defaultKey) {
              let key = _this.editFormObj.fzList[index].defaultKey;
              let defaulIndex = _this.editFormObj.fzList[index].defaultIndex;
              _this.editFormObj[key][defaulIndex].abolishsystem = "";
              _this.editFormObj[key][defaulIndex].abolishsystemid = "";
            }
            _this.editFormObj.fzList.splice(index, 1);
          } else if (type === "2") {
            // if (_this.editFormObj.fzList && _this.editFormObj.fzList.length > 0) {
            //   _this.editFormObj.fzList.map((i, index1) => {
            //     if (i.sysnameid === _this.editFormObj.xdList[index].abolishsystemid) {
            //       _this.editFormObj.fzList.splice(index1, 1)
            //     }
            //   })
            // }
            _this.editFormObj.xdList.splice(index, 1);
          } else if (type === "1") {
            // if (_this.editFormObj.fzList && _this.editFormObj.fzList.length > 0) {
            //   _this.editFormObj.fzList.map((i, index1) => {
            //     if (i.sysnameid === _this.editFormObj.xbList[index].abolishsystemid) {
            //       _this.editFormObj.fzList.splice(index1, 1)
            //     }
            //   })
            // }
            _this.editFormObj.xbList.splice(index, 1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    planSummaryHandle() {
      this.innerObj.plan = "";
      this.innerHandle();
    },
  },
};
</script>

<style lang="scss" scoped>
#handbookFiles {
  padding: 20px;
}
.card {
  background: white;
  border-bottom: 1px solid $dc1;
  overflow: hidden;
  transition-duration: 0.5s;
  box-sizing: border-box;
  margin-bottom: 10px;
  .header {
    margin-right: 10px;
    display: flex;
    .title {
      height: 35px;
      line-height: 35px;
      color: $tc1;
      font-weight: bold;
    }
    .space {
      flex-grow: 1;
    }
  }
}
.w100 {
  width: 60% !important;
}
</style>

<style lang="scss" >
#pdfDom {
  .main_tab {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: unset;
    }
  }
  .el-table th > .cell {
    text-align: center;
    color: #000;
  }
}
</style>
