<template>
  <div id="handbookFiles">
    <el-row>
      <el-col :span="12">
        <el-input
          placeholder="请输入"
          class="search_component"
          v-model="keyWords"
          clearable
          @keyup.13.native="singleSearch"
        >
          <el-button type="primary" slot="append" @click="singleSearch"
            >搜索</el-button
          >
        </el-input>
        <el-button
          class="high_search"
          @click="isHighSearch = !isHighSearch"
          type="primary"
        >
          高级查询
          <i
            :class="isHighSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          ></i>
        </el-button>
      </el-col>
      <el-col :span="12" class="search_buttons_wrap">
        <el-button type="primary" @click="addDialog">添加</el-button>
        <el-button type="primary" @click="reset">刷新</el-button>
      </el-col>
    </el-row>
    <el-collapse-transition>
      <el-form
        v-show="isHighSearch"
        class="search_options_wrap"
        :model="searchForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="计划主题">
              <el-input
                v-model="searchForm.theme"
                @keyup.13.native="highSearch"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划年度">
              <el-input
                v-model="searchForm.year"
                @keyup.13.native="highSearch"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建部门">
              <el-input
                v-model="searchForm.department"
                @keyup.13.native="highSearch"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人">
              <el-input
                v-model="searchForm.createby"
                @keyup.13.native="highSearch"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select
                v-model="searchForm.status"
                @keyup.13.native="highSearch"
                clearable
              >
                <el-option label="草 拟" value="0"></el-option>
                <el-option label="已完成" value="1"></el-option>
                <el-option label="审批中" value="2"></el-option>
                <el-option label="退 回" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <el-date-picker
                clearable
                value-format="yyyy-MM-dd"
                v-model="searchForm.createtime"
                @keyup.13.native="highSearch"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
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
    <el-table :data="booksList" border class="main_tab">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="theme" label="计划主题"></el-table-column>
      <el-table-column prop="year" label="计划年度"></el-table-column>
      <el-table-column prop="department" label="创建部门"></el-table-column>
      <el-table-column label="创建人" prop="createby"></el-table-column>
      <el-table-column prop="createtime" label="创建时间"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">{{
          getStatus(scope.row.status)
        }}</template>
      </el-table-column>
      <el-table-column width="200" label="操作">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="修改"
            placement="top"
            v-if="
              userid === scope.row.createid &&
              (scope.row.status == 0 || scope.row.status == 3)
            "
          >
            <el-button
              @click="getDetails(scope.row.id, '修改');clearValidate()"
              class="no-border"
              type="text"
              circle
              >修改</el-button
            >
          </el-tooltip>
          <!-- v-if="userid === scope.row.createid && scope.row.status==0" -->
          <el-tooltip class="item" effect="dark" content="上报" placement="top">
            <el-button
              class="no-border"
              v-if="userid === scope.row.createid && scope.row.status == 0"
              @click="updateStatus(scope.row)"
              type="text"
              circle
              >上报</el-button
            >
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="重新发起"
            placement="top"
            v-if="userid === scope.row.createid && scope.row.status == 3"
          >
            <el-button
              class="no-border"
              @click="updateStatus(scope.row, '重新发起')"
              type="text"
              circle
              >重新发起</el-button
            >
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="查看表单"
            placement="top"
            v-if="userid === scope.row.createid && scope.row.status == 3"
          >
            <el-button
              class="no-border"
              @click="openBpm(scope.row)"
              type="text"
              circle
              >查看表单</el-button
            >
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            v-if="userid === scope.row.createid && scope.row.status == 0"
          >
            <el-button
              @click="deleteRow(scope.row.id)"
              class="no-border"
              type="text"
              circle
              >删除</el-button
            >
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button
              @click="getDetails(scope.row.id, '查看')"
              class="no-border"
              type="text"
              circle
              >查看</el-button
            >
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pages.pageNum"
      :page-sizes="[10, 15, 20]"
      :page-size="pages.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pages.total"
    ></el-pagination>
    <!-- 添加弹框 -->
    <el-dialog
      title="计划制定"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      fullscreen
      :close-on-press-escape="false"
    >
      <el-form
        style="width: 100%"
        ref="form"
        :model="editFormObj"
        label-width="90px"
        :rules="rules"
      >
        <el-row v-if="!isEdit" style="padding: 0 10px">
          <el-col :span="4" :offset="20" align="right">
            <!-- <el-button
              type="primary"
              @click="
                getPdf({
                  title: editFormObj.department + '-' + editFormObj.theme,
                })
              "
              >下 载</el-button
            > -->
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

            <el-col :span="11" :offset="1">
              <el-form-item label="评估报告" prop="noticname">
                <el-input
                  :disabled="!isEdit"
                  v-model="editFormObj.noticname"
                  placeholder="请单击选择"
                  @focus="showSelect('notic')"
                />
              </el-form-item>
            </el-col>
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
          <!-- <div class="card">
            <el-row>
              <div class="header">
                <el-col :span="12">
                  <span class="title">评估报告</span>
                </el-col>
                <el-col :span="12"
                        v-if="isEdit"
                        class="text-right">
                  <el-button size="mini"
                             @click.native="showSelect('notic')"
                             type="primary">选择报告</el-button>
                </el-col>
              </div>
            </el-row>
          </div> -->
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
            <el-table-column label="序号" type="index"></el-table-column>
            <!-- <el-table-column
              label="制度所属层级"
              min-width="200"
              fixed="left"
              :render-header="renderHeader"
              prop="sysnameleaveid"
            > -->
            <!-- <template slot-scope="scope">
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
            </el-table-column> -->
            <!-- <el-table-column
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
            </el-table-column> -->
            <el-table-column
              label="制度名称"
              min-width="200"
              :render-header="renderHeader"
              prop="newname"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.newname"
                  :disabled="!isEdit"
                ></el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="syslevel"
              min-width="200"
              :render-header="renderHeader"
              label="制度层级"
            >
              <template slot-scope="scope">
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
                </el-select> -->

            <!-- <el-input v-model="scope.row.syslevel"
                          type="number"
                          :disabled="!isEdit"
                          onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                          maxlength="1000"></el-input> -->
            <!-- </template>
            </el-table-column> -->

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
                  maxlength="225"
                  show-word-limit
                  :disabled="!isEdit"
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
                  :title="scope.row.maincontent"
                  v-model="scope.row.maincontent"
                  type="textarea"
                  maxlength="225"
                  show-word-limit
                  :disabled="!isEdit"
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
                  :title="scope.row.abolishsystem"
                  v-model="scope.row.abolishsystem"
                  :disabled="!isEdit"
                  @focus="addList1('xbList', scope.$index)"
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
                  :picker-options="timeOptions"
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
              min-width="160"
              :render-header="renderHeader"
              label="预计完成时间"
            >
              <template slot-scope="scope">
                <el-date-picker
                  :picker-options="timeOptions"
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
                  :title=scope.row.systemwriter
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
                  :title='scope.row.systemcontacts'
                  v-model="scope.row.systemcontacts"
                  @focus="focusHandle('制度联络人', 'xbList', scope.$index)"
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
              <!-- 修订制度 -->
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
            <!-- <el-table-column
              prop="syslevel"
              min-width="160"
              :render-header="renderHeader"
              label="制度层级"
            >
              <template slot-scope="scope">
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
            </el-table-column> -->
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
                  :title="scope.row.assessmentresults"
                  v-model="scope.row.assessmentresults"
                  type="textarea"
                  maxlength="225"
                  show-word-limit
                  :disabled="!isEdit"
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
                  :title="scope.row.mainrevisioncontents"
                  v-model="scope.row.mainrevisioncontents"
                  type="textarea"
                  maxlength="225"
                  show-word-limit
                  :disabled="!isEdit"
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
                  :title="scope.row.abolishsystem"
                  v-model="scope.row.abolishsystem"
                  :disabled="!isEdit"
                  @focus="addList1('xdList', scope.$index)"
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
                  :picker-options="timeOptions"
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
              min-width="200"
              label="预计完成时间"
            >
              <template slot-scope="scope">
                <el-date-picker
                  :picker-options="timeOptions"
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
                  :title="scope.row.systemwriter"
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
                 :title="scope.row.systemcontacts"
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

          <!-- 废止制度 -->
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
            <!-- <el-table-column prop="publishnumber" label="发文文号">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.publishnumber"
                  :disabled="!isEdit"
                ></el-input>
              </template>
            </el-table-column> -->
            <el-table-column label="发布时间" min-width="160">
              <template slot-scope="scope">
                <el-date-picker
                  :disabled="!isEdit"
                  v-model="scope.row.publishtime"
                  value-format="yyyy-MM-dd HH:mm:ss"
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
                  :title="scope.row.assessmentresults"
                  v-model="scope.row.assessmentresults"
                  type="textarea"
                  maxlength="225"
                  show-word-limit
                  :disabled="!isEdit"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="abolishtype"
              min-width="150"
              label="废止类型"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.abolishtype" :title="scope.row.abolishtype" :disabled="!isEdit">
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
                  :title="scope.row.abolishreason"
                  v-model="scope.row.abolishreason"
                  type="textarea"
                  maxlength="225"
                  show-word-limit
                  :disabled="!isEdit"
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
                  :picker-options="timeOptions"
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
                  :picker-options="timeOptions"
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
        </div>
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          v-if="isEdit"
          @click="
            userkey = '';
            saveInstitution();
            this.selectedPersonList = [];
          "
          >确 定</el-button
        >
        <!-- <el-button type="primary" v-if="isEdit" @click="saveIssueReport"
          >上 报</el-button -->
        <!-- > -->
      </span>
    </el-dialog>
    <select-person2
      :selected="selectedPersonList"
      v-model="isSelectPersonVisible"
      @confirm="handlerSelectPersonComfirm"
    ></select-person2>
    <!-- 添加弹框 -->
    <!-- <el-dialog title="详细信息"
               :visible.sync="dialogReportVisible"
               width="60%">
      <el-row>
        <el-form label-width="90px">
          <el-col :span="16"
                  :offset="4">
            <el-form-item label="部门领导:"
                          required="">
              <el-input @focus="focusMainLeader('mainLeader')"
                        placeholder="请选择部门正职，若无则选择主持工作的副职"
                        v-model="mainLeader.mainLeader"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16"
                  :offset="4">
            <el-form-item label="评估报告"
                          required>
              <el-select v-model="checkReportid"
                         filterable
                         clearable>
                <el-option v-for="(item, index) in reportList"
                           :key="index"
                           :label="item.subject"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogReportVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveReport">确 定</el-button>
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
    <select-person2
      v-model="isPersonVisible"
      :selected="selectedPersonList"
      :isRequired="true"
      title="选择部门领导审批人"
      @confirm="handlerPersonComfirm"
    ></select-person2>
    <select-group
      v-model="isGroupVisible"
      :selectGroupSingle="isSelectGroupSingle"
      :selectTree="['2']"
      :showTree="'1,2,3,4'"
      :selected="selectedID"
      @confirm="handlerGroupSelect"
    ></select-group>
    <!-- <systemDialog
      v-model="systemVisible"
      @confirm="confirmSystem"
      :title="title"
      :processlists="defaultList"
    ></systemDialog> -->
    <select-assessment-report
      v-model="innerVisible"
      :radioChecked="radioChecked"
      @confirm="getNotic"
    ></select-assessment-report>
    <selectRulesForQuote
      v-model="systemVisible"
      :ruleSelected="defaultList"
      @confirm="confirmSystem"
    />
  </div>
</template>

<script>
import {
  getInstitutionList,
  saveInstitution,
  deleteInstitution,
  getDetails,
  restartProcess,
  getDetailByModelIds,
  updateStatusPlan,
} from "@/bpa/api/rulesCenter/rulesProcessPlan";
import {
  getReportList,
  updateSelect,
} from "@/bpa/api/rulesCenter/rulesPlanManage";
import paginations from "@/bpa/mixins/pagination_mixin";
import systemDialog from "@/bpa/components/systemDialog";
import fileOperation from "@/bpa/mixins/fileDownView";
import SelectAssessmentReport from "./SelectAssessmentReport";
import selectRulesForQuote from "./selectRulesForQuote.vue";

import { getProcessIframeTree } from "@/bpa/api/componentsApi";
import { getRuleIframeTree } from "@/bpa/api/rulesCenter/handbookFiles";
import { getFormateDate } from "@/bpa/utils/common";
import { createNamespacedHelpers } from "vuex";
import { downloadFile } from "@/bpa/utils/common";
const userInfo = createNamespacedHelpers("userInfo");
export default {
  components: {
    systemDialog,
    SelectAssessmentReport,
    selectRulesForQuote,
  },
  data() {
    return {
      timeOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      booksList: [],
      keyWords: "",
      mainLeader: {},
      dialogVisible: false,
      dialogReportVisible: false,
      innerVisible: false,
      checkReportid: "",
      systemVisible: false,
      defaultList: [],
      systemKey: "",
      reportList: [],
      checkReport: {},
      params: {},
      isHighSearch: false,
      isEdit: false,
      selectedID: [],
      isGroupVisible: false,
      selectedPersonList: [],
      isSelectPersonVisible: false,
      isPersonVisible: false,
      // 是否开启单选 true单选  false多选
      isSelectGroupSingle: false,
      groupType: "",
      groupKey: "",
      groupIndex: "",
      personType: "",
      personKey: "",
      personIndex: "",
      searchForm: {
        theme: "",
        year: "",
        department: "",
        createby: "",
        createtime: "",
        status: "",
      },
      editFormObj: {
        fzList: [],
        xbList: [],
        xdList: [],
        abolishsystemid: '',
        noticname: ''
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      rules: {
        theme: [{ required: true, message: ' ', trigger: 'blur' }],
        year: [{ required: true, message: ' ', trigger: 'blur' }],
        noticname: [{ required: true, message: ' ', trigger: 'blur' }],
        createtime: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      // 体系分类
      sysLists: [],
      dialogPositionVisible: false,
      isIssue: false,
      positionList: [],
      sysnameLeaveList: [],
      title: "",
      positionId: "",
      itemId: "",
      defaultType: "",
      updateType: "",
      defaultIndex: "",
      systemKey1: "",
      userkey: "",
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
      radioChecked: {},
      rulesVisible: false,
      ruleSelected: [],
    };
  },
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
    this.reset();
  },
  methods: {
    //清除表单验证
    clearValidate(){
      this.$refs['form'].clearValidate()
    },
    // 下载文件
    downloadFile(fileId) {
      return downloadFile(fileId);
    },
    //分页
    handleCurrentChange(value) {
      console.log(this.pages);
      console.log(value);
      this.processlistpage = value;
      this.pages.pageNum = value;
      if (this.historyPages == "1") {
        this.checkHistoryRules(this.docno);
      } else {
        this.getList();
      }
    },

    getNotic(data) {
      this.innerVisible = false;
      // debugger
      this.$set(
        this.editFormObj,
        this.userKey + "name",
        data.map((item) => item.subject).join(",")
      );
      this.$set(
        this.editFormObj,
        this.userKey + "id",
        data.map((item) => item.id).join(",")
      );
      this.$set(
        this.editFormObj,
        "docfiles",
        data.map((item) => {
          return {
            ...item.fjDto,
            filename: item.fjDto.originalName,
            filesize: item.fjDto.fileSize + "B",
            fileId: item.fjDto.id,
          };
        })

      );
      // this.$set(this.editFormObj, "fjs", data.map((item) => item.fj).join(","));

      // )
      this.$set(
        this.editFormObj,
        'fjs',
        data.map(item => item.fj).join(',')
      )
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })

    },
    showSelect(key) {
      this.userKey = key;
      this.radioChecked = {};
      if (this.editFormObj[key + "id"]) {
        this.radioChecked = {
          id: this.editFormObj[key + "id"],
          empuid: this.editFormObj[key + "id"],
          cnname: this.editFormObj[key + "name"],
          displayname: this.editFormObj[key + "name"],
        };
      }
      this.innerVisible = true;
    },
    saveIssueReport() {
      this.isIssue = false;
      this.userkey = "mainLeader";
      this.selectedPersonList = [];
      if (this.editFormObj.status !== "3") {
        this.focusMainLeader("mainLeader");
        // this.focusMainLeader('')
      } else {
        this.saveInstitution();
      }
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
    sysnameHandle(item) {
      let data = item.row.sysnameList.find(
        (val) => val.id === item.row.sysnameid
      );
      this.$set(item.row, "sysname", data.name);
    },
    noticHandle() {
      this.editFormObj.noticname = "";
      this.editFormObj.noticname = this.reportList.find(
        (item) => item.id === this.editFormObj.noticid
      ).subject;
    },
    handlerPersonComfirm(list) {
      let self = this;
      if (!list || list.length === 0) {
        this.$message.error("请选择部门领导审批人！");
        return false;
      }
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
        if (self.isIssue) {
          this.saveReport();
        } else {
          self.saveInstitution();
        }
      }
      self.$forceUpdate();
    },
    focusMainLeader(key) {
      this.selectedPersonList = [];
      this.userkey = key;
      if (this.mainLeader[key + "id"] && key !== "mainLeader") {
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
    focusHandle(type, key, index) {
      let than = this;
      than.selectedPersonList = [];
      than.personType = type;
      if (than.personType === "制度编写人") {
        than.personKey = key;
        than.personIndex = index;
        if (than.editFormObj[key][index].systemwriter) {
          than.editFormObj[key][index].systemwriter
            .split(",")
            .forEach((item, index) => {
              than.selectedPersonList.push({
                cnname: item,
                empuid: than.editFormObj[key][than.personIndex].systemwriterid
                  ? than.editFormObj[key][
                      than.personIndex
                    ].systemwriterid.split(",")[index]
                  : "",
              });
            });
        }
      } else if (than.personType === "制度联络人") {
        than.personKey = key;
        than.personIndex = index;
        if (than.editFormObj[key][than.personIndex].systemcontacts) {
          than.editFormObj[key][than.personIndex].systemcontacts
            .split(",")
            .forEach((item, index) => {
              than.selectedPersonList.push({
                cnname: item,
                empuid: than.editFormObj[key][than.personIndex].systemcontactsid
                  ? than.editFormObj[key][
                      than.personIndex
                    ].systemcontactsid.split(",")[index]
                  : "",
              });
            });
        }
      }
      than.isSelectPersonVisible = true;
    },
    focusDeptHandle(type, key, index) {
      this.selectedID = [];
      this.isSelectGroupSingle = false;
      console.log(this.selectedID);
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
        this.isSelectGroupSingle = true;
        this.groupKey = key;
        this.groupIndex = index;
        if (this.editFormObj[key][this.groupIndex].maindepartment) {
          this.editFormObj[key][this.groupIndex].maindepartment
            .split(",")
            .forEach((item, index) => {
              this.selectedID.push({
                name: item,
                id: Number(
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
                name: item,
                id: Number(
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
      console.log(this.selectedID);
      this.isGroupVisible = true;
    },
    handlerGroupSelect(list) {
      console.log("------------------------------------------");
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
              return item.name;
            })
            .join(",")
        );
        // console.log(item.NAME)
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
              return item.name;
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
      }
    },
    getStatus(type) {
      if (type === "0") {
        return "草拟";
      } else if (type === "1") {
        return "已完成";
      } else if (type === "2") {
        return "审批中";
      } else if (type === "3") {
        return "退回";
      }
    },
    addDialog() {
      this.dialogVisible = true;
      this.userkey = "";
      this.isEdit = true;
      this.getReportList();
      this.editFormObj = {
        theme: "",
        year: new Date(),
        createtime: new Date(),
        fzList: [],
        xbList: [],
        xdList: [],
      };
    },
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
              title: item.sysname,
              docId: item.sysid
            })
          })
        }
        this.systemVisible = true;
      }
    },
    addList1(key, index) {
      this.defaultType = "1";
      this.defaultIndex = index;
      this.defaultList = [];
      this.systemKey1 = key;
      if (this.editFormObj[key][index].abolishsystem) {
        this.defaultList.push({
          title: this.editFormObj[key][index].abolishsystem,
          docId: this.editFormObj[key][index].abolishsystemid
        })
      }
      console.log(this.editFormObj,key,index)
      console.log(this.defaultList)
      this.systemVisible = true
    },
    systemData(data) {
      if (this.defaultType === "0") {
        if (this.editFormObj[this.systemKey].length === 0) {
          this.editFormObj[this.systemKey] = data.map((item) => {
            return {
              sysname: item.newname,
              // syslevel: item.syslevel !== 'null' ? item.syslevel : '',
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
                // syslevel: val.syslevel !== 'null' ? val.syslevel : '',
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
          data[0].sysid
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
      console.log(data);
      let params = data.map((item) => {
        return {
          sysid: item.docId,
          newname: item.title,
        };
      });
      console.log(params);
      getDetailByModelIds(params).then((res) => {
        this.systemData(res);
      });
    },
    singleSearch() {
      this.pages.pageNum = 1;
      this.params = {
        orderby: "createtime",
        sort: "desc",
        attr: { jstatus: "0" },
        filters: [
          { key: "theme", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "year", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "createby", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "department", opt: "LIKE", type: "S", value: this.keyWords },
        ],
        logic: "or",
      };
      let obj = {
        ...this.pages,
        ...this.params,
      };
      getInstitutionList(obj).then((res) => {
        if (!res) return false;
        this.booksList = res.list;
        this.pages.total = res.total;
      });
    },
    highSearch() {
      this.pages.pageNum = 1;
      this.params = {
        orderby: "createtime",
        sort: "desc",
        logic: "and",
        attr: { jstatus: "0" },
        filters: [
          {
            key: "theme",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.theme,
          },
          {
            key: "year",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.year,
          },
          {
            key: "department",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.department,
          },
          {
            key: "createby",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.createby,
          },
          {
            key: "status",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.status,
          },
          {
            key: "createtime",
            opt: "BETWEEN",
            type: "D",
            value:
              this.searchForm.createtime && this.searchForm.createtime.length
                ? this.searchForm.createtime[0] +
                  "~" +
                  this.searchForm.createtime[1]
                : "",
          },
        ],
      };
      let obj = {
        ...this.pages,
        ...this.params,
      };
      getInstitutionList(obj).then((res) => {
        if (!res) return false;
        this.booksList = res.list;
        this.pages.total = res.total;
      });
    },
    reset() {
      this.pages.pageNum = 1;
      this.keyWords = "";
      this.searchForm = {
        doctitle: "",
        enname: "",
        provideruser: "",
        docAuthorDis: "",
        status: "",
        name: "",
        value1: [],
      };
      this.params = {
        orderby: "createtime",
        sort: "desc",
        logic: "and",
        attr: { jstatus: "0" },
      };
      this.getList();
    },
    getList() {
      let obj = {
        ...this.pages,
        ...this.params,
      };
      getInstitutionList(obj).then((res) => {
        if (!res) return false;
        this.booksList = res.list;
        this.pages.total = res.total;
      });
    },
    // 确认添加
    saveInstitution() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.editFormObj.createtime = getFormateDate(
            new Date(this.editFormObj.createtime),
            "yyyy-MM-dd hh:mm:ss"
          );
          this.editFormObj.year = getFormateDate(
            new Date(this.editFormObj.year),
            "yyyy"
          );
          for (let i = 0; i < this.editFormObj.xbList.length; i++) {
            let item = this.editFormObj.xbList[i];
            if (!item.newname) {
              this.$message.error(`新增制度第${i + 1}条制度名称不能为空`);
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
            } else if (!item.systemwriter) {
              this.$message.error(`新增制度第${i + 1}条制度编写人不能为空`);
              return false;
            } else if (item.enddate) {
              item.enddate = item.enddate
                ? getFormateDate(new Date(item.enddate), "yyyy-MM-dd hh:mm:ss")
                : "";
            } else if (item.begindate) {
              item.begindate = item.begindate
                ? getFormateDate(
                    new Date(item.begindate),
                    "yyyy-MM-dd hh:mm:ss"
                  )
                : "";
            }
            item.publishtime = item.publishtime
              ? getFormateDate(
                  new Date(item.publishtime),
                  "yyyy-MM-dd hh:mm:ss"
                )
              : "";
            // console.log(item)
            this.selectedPersonList = [];
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
            } else if (!item.maindepartment) {
              this.$message.error(`修编制度第${i + 1}条主责部门不能为空`);
              return false;
            } else if (!item.systemwriter) {
              this.$message.error(`修编制度第${i + 1}条制度编写人不能为空`);
              return false;
            } else if (item.enddate) {
              item.enddate = item.enddate
                ? getFormateDate(new Date(item.enddate), "yyyy-MM-dd hh:mm:ss")
                : "";
            } else if (item.begindate) {
              item.begindate = item.begindate
                ? getFormateDate(
                    new Date(item.begindate),
                    "yyyy-MM-dd hh:mm:ss"
                  )
                : "";
            }
            item.publishtime = item.publishtime
              ? getFormateDate(
                  new Date(item.publishtime),
                  "yyyy-MM-dd hh:mm:ss"
                )
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
                ? getFormateDate(
                    new Date(item.begindate),
                    "yyyy-MM-dd hh:mm:ss"
                  )
                : "";
            }
            console.log(item);
            item.publishtime = item.publishtime
              ? getFormateDate(
                  new Date(item.publishtime),
                  "yyyy-MM-dd hh:mm:ss"
                )
              : "";
          }
          this.editFormObj.abolishsystemid = this.editFormObj.fzList
            .map((i) => i.sysnameid)
            .join();
          this.editFormObj.jstatus = "0";
          saveInstitution(this.editFormObj).then((res) => {
            if (this.userkey === "mainLeader") {
              this.checkReport = res;
              if (res.status === "3") {
                this.updateType = "重新发起";
              }
              this.saveReport();
            } else {
              this.$message({
                type: "success",
                message: "保存成功！",
              });
              this.dialogVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    deleteFile(index, type) {
      this.$confirm("确认要删除该条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (type === "3") {
            if (this.editFormObj.fzList[index].defaultKey) {
              let key = this.editFormObj.fzList[index].defaultKey;
              let defaulIndex = this.editFormObj.fzList[index].defaultIndex;
              this.editFormObj[key][defaulIndex].abolishsystem = "";
              this.editFormObj[key][defaulIndex].abolishsystemid = "";
            }
            this.editFormObj.fzList.splice(index, 1);
          } else if (type === "2") {
            // if (this.editFormObj.fzList && this.editFormObj.fzList.length > 0) {
            //   this.editFormObj.fzList.map((i, index1) => {
            //     if (i.sysnameid === this.editFormObj.xdList[index].abolishsystemid) {
            //       this.editFormObj.fzList.splice(index1, 1)
            //     }
            //   })
            // }
            this.editFormObj.xdList.splice(index, 1);
          } else if (type === "1") {
            // if (this.editFormObj.fzList && this.editFormObj.fzList.length > 0) {
            //   this.editFormObj.fzList.map((i, index1) => {
            //     if (i.sysnameid === this.editFormObj.xbList[index].abolishsystemid) {
            //       this.editFormObj.fzList.splice(index1, 1)
            //     }
            //   })
            // }
            this.editFormObj.xbList.splice(index, 1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除表格某一行数据
    deleteRow(id) {
      this.$confirm("确认要删除该条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteInstitution(id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功！",
            });
            this.getList();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getReportList() {
      let obj = {
        orderby: "createon",
        pageNum: 0,
        pageSize: 0,
        filters: [{ key: "status", opt: "LIKE", type: "S", value: "1" }],
        sort: "desc",
        attr: { jstatus: "0" },
      };
      getReportList(obj)
        .then((res) => {
          if (!res) return false;
          this.reportList = res.list;
          return getProcessIframeTree(
            `${
              process.env.ROUTER_URL === "sxTest"
                ? "BD06C4AE2A712645E0533405A8C0C606"
                : "79957553BD2F3978E053BF1A13ACD4"
            }`
          );
        })
        .then((res) => {
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
    getDetails(id, type) {
      let than = this;
      than.getReportList();
      getDetails(id).then((res) => {
        if (!res) return false;
        res.fzList.forEach(item => {
          item.publishtime = item.publishtime?item.publishtime:''
          item.enddate = item.enddate?item.enddate:''
          item.begindate = item.begindate?item.begindate:''
        })
        than.editFormObj = res;
        if (type === "修改") {
          than.isEdit = true;
        } else {
          than.isEdit = false;
        }
        if (than.editFormObj.fzList) {
          than.editFormObj.fzList.forEach((item) => {
            item.publishtime = item.publishtime
              ? getFormateDate(
                  new Date(item.publishtime),
                  "yyyy-MM-dd hh:mm:ss"
                )
              : "";
            item.enddate = item.enddate
              ? getFormateDate(new Date(item.enddate), "yyyy-MM-dd hh:mm:ss")
              : "";
            item.begindate = item.begindate
              ? getFormateDate(new Date(item.begindate), "yyyy-MM-dd hh:mm:ss")
              : "";
          });
        }
        if (than.editFormObj.docfiles) {
          than.editFormObj.docfiles.forEach((item) => {
            item.filename = item.originalName;
            item.filesize = item.fileSize + "B";
            item.fileId = item.id;
          });
        }
        than.userkey = "";
        than.dialogVisible = true;
        than.editFormObj = Object.assign({}, than.editFormObj);
      });
    },
    saveReport() {
      if (this.updateType === "重新发起") {
        this.toInitiate(this.checkReport);
      } else {
        // let data = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
        // updateSelect(data).then(res => {
        //   if (res && res.length === 1) {
        //     this.positionId = res[0].pid
        this.submitPosition();
        //   } else if (res.length === 0) {
        //     this.$message.error('当前没有岗位信息，请联系BPM')
        //   } else {
        //     this.positionList = res
        //     this.dialogPositionVisible = true
        //   }
        // })
      }
    },
    // 上报事件
    updateStatus(item, type) {
      this.checkReport = item;
      if (type === "重新发起") {
        this.toInitiate(this.checkReport);
      } else {
        this.isIssue = true;
        this.focusMainLeader("mainLeader");
        // this.focusMainLeader('')
      }
    },
    // 选岗确认
    submitPosition() {
      updateStatusPlan({
        id: this.checkReport.id,
        // nid: this.checkReportid,
        postid: this.positionId,
        userids: this.mainLeader.mainLeaderid,
      }).then((res) => {
        this.$message({
          type: "success",
          message: "上报成功!",
        });
        this.selectedPersonList = [];
        this.dialogVisible = false;
        this.dialogReportVisible = false;
        this.dialogPositionVisible = false;
        this.getList();
      });
    },
    openBpm(item) {
      window.open(
        process.env.VUE_APP_BPA_URL +
          "/#/processForm/view?name=%E5%88%B6%E5%BA%A6%E6%B5%81%E7%A8%8B%E8%AE%A1%E5%88%92%E5%88%9B%E5%BB%BA%E6%B5%81%E7%A8%8B&instanceId=" +
          item.instid +
          "&username=" +
          this.userid,
        "_blank"
      );
    },
    toInitiate(item) {
      getDetails(item.id)
        .then((res) => {
          if (!res) return false;
          // res.noticid = this.checkReportid
          // res.noticname = this.reportList.find(item => item.id === this.checkReportid).subject
          return restartProcess(res);
        })
        .then((re) => {
          this.$message({
            type: "success",
            message: "发起成功!",
          });
          this.dialogVisible = false;
          this.dialogReportVisible = false;
          this.dialogPositionVisible = false;
          this.selectedPersonList = [];
          this.getList();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
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
#pdfDom {
  padding: 10px;
}
#handbookFiles {
  padding: 20px;
}
.high_search {
  margin-left: 20px;
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
.dialog-footer{
  margin-right: 20px;
}
</style>