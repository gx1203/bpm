<template>
  <div id="handbookFiles">
    <el-row>
      <el-col :span="12">
        <el-input placeholder="请输入"
                  class="search_component"
                  v-model="keyWords"
                  clearable
                  @keyup.13.native="singleSearch">
          <el-button type="primary"
                     slot="append"
                     @click="singleSearch">搜索</el-button>
        </el-input>
        <el-button class="high_search"
                   @click="isHighSearch=!isHighSearch"
                   type="primary">
          高级查询
          <i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
        </el-button>
      </el-col>
      <el-col :span="12"
              class="search_buttons_wrap">
        <el-button type="primary"
                   @click="addDialog">添加</el-button>
        <el-button type="primary"
                   @click="reset">刷新</el-button>
      </el-col>
    </el-row>
    <el-collapse-transition>
      <el-form v-show="isHighSearch"
               class="search_options_wrap"
               :model="searchForm"
               label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="计划主题">
              <el-input v-model="searchForm.theme"
                        @keyup.13.native="highSearch"
                        clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划年度">
              <el-input v-model="searchForm.year"
                        @keyup.13.native="highSearch"
                        clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建部门">
              <el-input v-model="searchForm.department"
                        @keyup.13.native="highSearch"
                        clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人">
              <el-input v-model="searchForm.createby"
                        @keyup.13.native="highSearch"
                        clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status"
                          @keyup.13.native="highSearch"
                         clearable>
                <el-option label="草 拟"
                           value="0"></el-option>
                <el-option label="已完成"
                           value="1"></el-option>
                <el-option label="审批中"
                           value="2"></el-option>
                <el-option label="退 回"
                           value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <el-date-picker clearable
                              @keyup.13.native="highSearch"
                              value-format="yyyy-MM-dd"
                              v-model="searchForm.createtime"
                              type="daterange"
                              range-separator="-"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="search_buttons_wrap">
          <el-button type="primary"
                     @click="highSearch">搜索</el-button>
          <el-button type="primary"
                     @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-collapse-transition>
    <!-- 信息表格 -->
    <el-table :data="booksList"
              border
              class="main_tab">
      <el-table-column label="序号"
                       type="index"></el-table-column>
      <el-table-column prop="theme"
                       label="计划主题"></el-table-column>
      <el-table-column prop="year"
                       label="计划年度"></el-table-column>
      <el-table-column prop="department"
                       label="创建部门"></el-table-column>
      <el-table-column label="创建人"
                       prop="createby"></el-table-column>
      <el-table-column prop="createtime"
                       label="创建时间"></el-table-column>
      <el-table-column prop="status"
                       label="状态">
        <template slot-scope="scope">{{getStatus(scope.row.status)}}</template>
      </el-table-column>
      <el-table-column width="200"
                       label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item"
                      effect="dark"
                      content="修改"
                      placement="top"
                      v-if="userid === scope.row.createid && (scope.row.status==0 || scope.row.status==3)">
            <el-button @click="getDetails(scope.row.id,'修改');clearValidate()"
                       class="no-border"
                       type="text"
                       circle>修改</el-button>
          </el-tooltip>

          <el-tooltip class="item"
                      effect="dark"
                      content="上报"
                      placement="top"
                      v-if="userid === scope.row.createid && scope.row.status==0">
            <el-button class="no-border"
                       @click="updateStatus(scope.row)"
                       type="text"
                       circle>上报</el-button>
          </el-tooltip>

          <el-tooltip class="item"
                      effect="dark"
                      content="重新发起"
                      placement="top"
                      v-if="userid === scope.row.createid && scope.row.status==3">
            <el-button class="no-border"
                       @click="updateStatus(scope.row,'重新发起')"
                       type="text"
                       circle>重新发起</el-button>
          </el-tooltip>
          <el-tooltip class="item"
                      effect="dark"
                      content="查看表单"
                      placement="top"
                      v-if="userid === scope.row.createid && scope.row.status==3">
            <el-button class="no-border"
                       @click="openBpm(scope.row)"
                       type="text"
                       circle>查看表单</el-button>
          </el-tooltip>
          <el-tooltip class="item"
                      effect="dark"
                      content="删除"
                      placement="top"
                      v-if="userid === scope.row.createid && (scope.row.status==0)">
            <el-button @click="deleteRow(scope.row.id)"
                       class="no-border"
                       type="text"
                       circle>删除</el-button>
          </el-tooltip>
          <el-tooltip class="item"
                      effect="dark"
                      content="查看"
                      placement="top">
            <el-button @click="getDetails(scope.row.id,'查看')"
                       class="no-border"
                       type="text"
                       circle>查看</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pages.pageNum"
                   :page-sizes="[10, 15, 20]"
                   :page-size="pages.pageSize"
                   layout="total, prev, pager, next, jumper"
                   :total="pages.total"></el-pagination>
    <!-- 添加弹框 -->
    <el-dialog title="计划汇总"
               :visible.sync="dialogVisible"
               width="100%"
               fullscreen
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form ref="form"
               :model="editFormObj"
               label-width="90px"
               :rules="rules">
        <el-row v-if="!isEdit"
                style="padding: 0 10px;">
          <el-col :span="4"
                  :offset="20"
                  align="right">
            <!-- <el-button type="primary"
                       @click="getPdf({title:editFormObj.department+'-'+ editFormObj.theme })">下 载</el-button> -->
          </el-col>
        </el-row>
        <div id="pdfDom">
          <el-row>
            <div class="card">
              <div class="header">
                <span class="title">基本信息</span>
              </div>
            </div>
            <el-col :span="11"
                    :offset="1">
              <el-form-item label="计划主题:"
                            prop="theme">
                <el-input v-model="editFormObj.theme"
                          :disabled="!isEdit"
                          maxlength="100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11"
                    :offset="1">
              <el-form-item label="计划年度:"
                            prop="year">
                <el-date-picker :disabled="!isEdit"
                                v-model="editFormObj.year"
                                type="year"
                                value-format="yyyy"
                                placeholder="选择年"></el-date-picker>
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
            <el-col :span="11"
                    :offset="1">
              <el-form-item label="创建部门:"
                            v-if="editFormObj.id">
                <el-input v-model="editFormObj.department"
                          disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11"
                    :offset="1"
                    v-if="editFormObj.id">
              <el-form-item label="创建人:">
                <el-input v-model="editFormObj.createby"
                          disabled></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="11"
                    :offset="1"
                    prop="createtime">
              <el-form-item label="创建时间:">
                <el-date-picker disabled
                                v-model="editFormObj.createtime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="date"
                                placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="22"
                    v-if="isEdit"
                    :offset="1">
              <el-form-item label="汇总计划:">
                <el-button size="mini"
                           @click.native="innerHandle"
                           type="primary">选择计划</el-button>
              </el-form-item>
            </el-col> -->
          </el-row>
          <div v-if="isEdit"
               class="card">
            <el-row>
              <div class="header">
                <el-col :span="12">
                  <span class="title">制度计划汇总</span>
                </el-col>
                <el-col class="text-right"
                        :span="12">
                  <el-button size="mini"
                             @click.native="innerHandle"
                             type="primary">选择计划</el-button>
                </el-col>
              </div>
            </el-row>
          </div>

           <div class="card">
            <div class="header">
              <span class="title">新编制度</span>
            </div>
          </div>
          <div class="text-right">
            <el-button size="mini"
                       v-if="isEdit"
                       type="primary"
                       @click="addList('xbList')">添加</el-button>
          </div>
          <el-table border
                    class="main_tab"
                    :data="editFormObj.xbList">
            <el-table-column label="序号"
                             type="index"></el-table-column>
            <!-- <el-table-column label="制度所属层级"
                             min-width="200"
                             fixed='left'
                             :render-header="renderHeader"
                             prop="sysnameleaveid"> -->
              <!-- <template slot-scope="scope">
                <el-select v-model="scope.row.sysnameleaveid"
                           @change="sysnameLeaveHandle(scope)"
                           :disabled="!isEdit">
                  <el-option v-for="(item, index) in sysnameLeaveList"
                             :key="index"
                             :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="制度类别"
                             min-width="200"
                             fixed='left'
                             prop="sysnameid">
              <template slot-scope="scope">
                <el-select v-model="scope.row.sysnameid"
                           @change="sysnameHandle(scope)"
                           :disabled="!isEdit">
                  <el-option v-for="(item, index) in scope.row.sysnameList"
                             :key="index"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column> -->
            <el-table-column label="制度名称"
                             min-width="200"
                             :render-header="renderHeader"
                             prop="newname">
              <template slot-scope="scope">
                <el-input v-model="scope.row.newname"
                          :disabled="!isEdit"
                          maxlength="1000"></el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="syslevel"
                             min-width="200"
                             :render-header="renderHeader"
                             label="制度层级">
              <template slot-scope="scope">
                <el-select v-model="scope.row.syslevel"
                           clearable
                           :disabled="!isEdit"
                           placeholder="请选择">
                  <el-option v-for="item in sysOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select> -->

                <!-- <el-input v-model="scope.row.syslevel"
                          type="number"
                          :disabled="!isEdit"
                          onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                          maxlength="1000"></el-input> -->
              <!-- </template>
            </el-table-column> -->
            <el-table-column prop="maindepartment"
                             min-width="200"
                             :render-header="renderHeader"
                             label="主责部门">
              <template slot-scope="scope">
                <el-input v-model="scope.row.maindepartment"
                          @focus="focusDeptHandle('主责部门','xbList',scope.$index)"
                          :disabled="!isEdit"
                          maxlength="1000"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="cooperatedepartment"
                             min-width="200"
                             label="配合部门">
              <template slot-scope="scope">
                <el-input v-model="scope.row.cooperatedepartment"
                          :disabled="!isEdit"
                          @focus="focusDeptHandle('配合部门','xbList',scope.$index)"
                          maxlength="1000"></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="formationreason"
                             min-width="200"
                             label="编制原因">
              <template slot-scope="scope">
                <el-input v-model="scope.row.formationreason"
                          type="textarea"
                          :disabled="!isEdit"
                          show-word-limit
                          maxlength="225"></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="maincontent"
                             min-width="200"
                             label="主要内容">
              <template slot-scope="scope">
                <el-input v-model="scope.row.maincontent"
                          type="textarea"
                          :disabled="!isEdit"
                          show-word-limit
                          maxlength="225"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="abolishsystem"
                             label="同步废止制度"
                             min-width="180">
              <template slot-scope="scope">
                <el-input :title="scope.row.abolishsystem"
                          v-model="scope.row.abolishsystem"
                          :disabled="!isEdit"
                          maxlength="1000"
                          @focus="addList1('xbList', scope.$index)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="begindate"
                             min-width="160"
                             label="预计开始时间">
              <template slot-scope="scope">
                <el-date-picker :disabled="!isEdit"
                                v-model="scope.row.begindate"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                default-time="00:00:00"
                                type="date"
                                placeholder="选择日期"
                                :picker-options="timeOptions"
                                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="enddate"
                             min-width="160"
                             :render-header="renderHeader"
                             label="预计完成时间">
              <template slot-scope="scope">
                <el-date-picker :disabled="!isEdit"
                                v-model="scope.row.enddate"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                default-time="00:00:00"
                                type="date"
                                :picker-options="timeOptions"
                                placeholder="选择日期"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="systemwriter"
                             :render-header="renderHeader"
                             min-width="120"
                             label="制度编写人">
              <template slot-scope="scope">
                <el-input :title="scope.row.systemwriter"
                          v-model="scope.row.systemwriter"
                          @focus="focusHandle('制度编写人','xbList',scope.$index)"
                          :disabled="!isEdit"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="systemcontacts"
                             min-width="120"
                             label="制度联络人">
              <template slot-scope="scope">
                <el-input :title="scope.row.systemcontacts"
                          v-model="scope.row.systemcontacts"
                          @focus="focusHandle('制度联络人','xbList',scope.$index)"
                          :disabled="!isEdit"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作"
                             v-if="isEdit">
              <template slot-scope="scope">
                <el-tooltip class="item"
                            effect="dark"
                            content="删除"
                            placement="top">
                  <el-button @click="deleteFile(scope.$index,'1')"
                             class="no-border"
                             icon="el-icon-delete"
                             circle></el-button>
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
            <el-button size="mini"
                       v-if="isEdit"
                       type="primary"
                       @click="addList('xdList')">添加</el-button>
          </div>
          <el-table border
                    class="main_tab"
                    :data="editFormObj.xdList">
            <el-table-column label="序号"
                             type="index"></el-table-column>
            <el-table-column label="制度名称"
                             min-width="200"
                             prop="sysname">
            </el-table-column>
            <!-- <el-table-column prop="syslevel"
                             min-width="160"
                             :render-header="renderHeader"
                             label="制度层级">
              <template slot-scope="scope">
                <el-select v-model="scope.row.syslevel"
                           clearable
                           :disabled="!isEdit"
                           placeholder="请选择">
                  <el-option v-for="item in sysOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column> -->
            <el-table-column prop="maindepartment"
                             min-width="120"
                             :render-header="renderHeader"
                             label="主责部门">
              <template slot-scope="scope">
                <el-input v-model="scope.row.maindepartment"
                          @focus="focusDeptHandle('主责部门','xdList',scope.$index)"
                          :disabled="!isEdit"
                          maxlength="1000"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="cooperatedepartment"
                             min-width="120"
                             label="配合部门">
              <template slot-scope="scope">
                <el-input v-model="scope.row.cooperatedepartment"
                          :disabled="!isEdit"
                          maxlength="1000"
                          @focus="focusDeptHandle('配合部门','xdList',scope.$index)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="assessmentresults"
                             min-width="200"
                             label="评估结果">
              <template slot-scope="scope">
                <el-input v-model="scope.row.assessmentresults"
                          type="textarea"
                          :disabled="!isEdit"
                          show-word-limit
                          maxlength="225"></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="mainrevisioncontents"
                             min-width="200"
                             label="主要修订内容">
              <template slot-scope="scope">
                <el-input v-model="scope.row.mainrevisioncontents"
                          type="textarea"
                          :disabled="!isEdit"
                          show-word-limit
                          maxlength="225"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="abolishsystem"
                             label="同步废止制度"
                             min-width="120">
              <template slot-scope="scope">
                <el-input :title="scope.row.abolishsystem"
                          v-model="scope.row.abolishsystem"
                          :disabled="!isEdit"
                          maxlength="1000"
                          @focus="addList1('xdList', scope.$index)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="begindate"
                             min-width="200"
                             label="预计开始时间">
              <template slot-scope="scope">
                <el-date-picker :disabled="!isEdit"
                                v-model="scope.row.begindate"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                default-time="00:00:00"
                                type="date"
                                :picker-options="timeOptions"
                                placeholder="选择日期"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="enddate"
                             :render-header="renderHeader"
                             min-width="200"
                             label="预计完成时间">
              <template slot-scope="scope">
                <el-date-picker :disabled="!isEdit"
                                v-model="scope.row.enddate"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                default-time="00:00:00"
                                type="date"
                                :picker-options="timeOptions"
                                placeholder="选择日期"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="systemwriter"
                             :render-header="renderHeader"
                             min-width="90"
                             label="制度编写人">
              <template slot-scope="scope">
                <el-input :title="scope.row.systemwriter"
                          v-model="scope.row.systemwriter"
                          @focus="focusHandle('制度编写人','xdList',scope.$index)"
                          :disabled="!isEdit"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="systemcontacts"
                             min-width="90"
                             label="制度联络人">
              <template slot-scope="scope">
                <el-input :title="scope.row.systemcontacts"
                          v-model="scope.row.systemcontacts"
                          @focus="focusHandle('制度联络人','xdList',scope.$index)"
                          :disabled="!isEdit"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作"
                             v-if="isEdit">
              <template slot-scope="scope">
                <el-tooltip class="item"
                            effect="dark"
                            content="删除"
                            placement="top">
                  <el-button @click="deleteFile(scope.$index,'2')"
                             class="no-border"
                             icon="el-icon-delete"
                             circle></el-button>
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
            <el-button size="mini"
                       type="primary"
                       v-if="isEdit"
                       @click="addList('fzList')">添加</el-button>
          </div>
          <el-table border
                    class="main_tab"
                    :data="editFormObj.fzList">
            <el-table-column label="序号"
                             type="index"></el-table-column>
            <el-table-column label="制度名称"
                             min-width="200"
                             prop="sysname">
            </el-table-column>
            <!-- <el-table-column prop="publishnumber"
                             label="发文文号">
              <template slot-scope="scope">
                <el-input v-model="scope.row.publishnumber"
                          :disabled="!isEdit"
                          maxlength="1000"></el-input>
              </template>
            </el-table-column> -->
            <el-table-column label="发布时间"
                             min-width="160">
              <template slot-scope="scope">
                <el-date-picker :disabled="!isEdit"
                                v-model="scope.row.publishtime"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                type="date"
                                placeholder="选择日期"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="maindepartment"
                             min-width="120"
                             :render-header="renderHeader"
                             label="主责部门">
              <template slot-scope="scope">
                <el-input v-model="scope.row.maindepartment"
                          @focus="focusDeptHandle('主责部门','fzList',scope.$index)"
                          :disabled="!isEdit"
                          maxlength="1000"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="assessmentresults"
                             min-width="200"
                             label="评估结果">
              <template slot-scope="scope">
                <el-input v-model="scope.row.assessmentresults"
                          type="textarea"
                          :disabled="!isEdit"
                          show-word-limit
                          maxlength="225"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="abolishtype"
                             min-width="150"
                             label="废止类型">
              <template slot-scope="scope">
                <el-select  :title="scope.row.abolishtype"
                            v-model="scope.row.abolishtype"
                           :disabled="!isEdit">
                  <el-option label="因新编或修订而废止"
                             value="因新编或修订而废止"></el-option>
                  <el-option label="制度本身已失效"
                             value="制度本身已失效"></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column prop="abolishreason"
                             min-width="200"
                             label="废止原因说明">
              <template slot-scope="scope">
                <el-input :title="scope.row.abolishreason"
                          v-model="scope.row.abolishreason"
                          type="textarea"
                          show-word-limit
                          :disabled="!isEdit"
                          maxlength="225"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="begindate"
                              min-width="160"
                             label="预计开始时间">
              <template slot-scope="scope">
                <el-date-picker :disabled="!isEdit"
                                v-model="scope.row.begindate"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                default-time="00:00:00"
                                type="date"
                                :picker-options="timeOptions"
                                placeholder="选择日期"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="enddate"
                             :render-header="renderHeader"
                              min-width="160"
                             label="预计完成时间">
              <template slot-scope="scope">
                <el-date-picker :disabled="!isEdit"
                                v-model="scope.row.enddate"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                default-time="00:00:00"
                                type="date"
                                :picker-options="timeOptions"
                                placeholder="选择日期"></el-date-picker>
              </template>
            </el-table-column>

            <el-table-column label="操作"
                             v-if="isEdit">
              <template slot-scope="scope">
                <el-tooltip class="item"
                            effect="dark"
                            content="删除"
                            placement="top">
                  <el-button @click="deleteFile(scope.$index,'3')"
                             class="no-border"
                             icon="el-icon-delete"
                             circle></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="card">
            <div class="header">
              <span class="title">评估报告</span>
            </div>
          </div>
          <el-table border
                    class="main_tab"
                    :data="editFormObj.docfiles">
            <el-table-column prop="filename"
                             label="文件名"></el-table-column>
            <el-table-column prop="filesize"
                             label="文件大小"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item"
                            effect="dark"
                            content="下载"
                            placement="top">
                  <a :href="downloadFile(scope.row.fileId)"
                     download>
                    <el-button class="no-border"
                               icon="el-icon-download"
                               circle></el-button>
                  </a>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

        </div>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   v-if="isEdit"
                   @click="userkey='';saveInstitution()">确 定</el-button>
        <!-- <el-button type="primary"
                   v-if="isEdit"
                   @click="saveIssueReport">上 报</el-button> -->
      </span>
      <select-rules-plan-summary isMore
                           :userAll="userAll"
                           v-model="innerVisible"
                           @confirm="saveInnerPlan"></select-rules-plan-summary>
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
                           multiple
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
                     @click="saveInnerPlan">确 定</el-button>
        </span>
      </el-dialog> -->

    </el-dialog>
    <!-- 添加弹框 -->
    <!-- <el-dialog title="选择评估报告"
               :visible.sync="dialogReportVisible"
               width="60%">
      <el-row>
        <el-col :span="16"
                :offset="4">
          <el-form label-width="90px">
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
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogReportVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveReport">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 上报选岗 -->
    <el-dialog title="选择岗位"
               :visible.sync="dialogPositionVisible">
      <el-form ref="item"
               label-width="250px"
               class="content">
        <el-form-item label="选择岗位:"
                      required>
          <el-select v-model="positionId"
                     class="w100"
                     placeholder="请选择">
            <el-option v-for="data in positionList"
                       :key="data.pid"
                       :label="data.dname+'-'+data.pname"
                       :value="data.pid">
              <span style="float: left">{{data.dname+'-'+data.pname}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogPositionVisible = false;positionId = ''">取 消</el-button>
        <el-button type="primary"
                   @click="submitPosition">确 定</el-button>
      </span>
    </el-dialog>
    <select-person2 v-model="isSelectPersonVisible"
                    :selected="selectedPersonList"
                    @confirm="handlerSelectPersonComfirm"></select-person2>
    <select-person2 v-model="isPersonVisible"
                    :selected="selectedPersonList"
                    :isRequired='true'
                    title="选择部门领导审批人"
                    @confirm="handlerPersonComfirm"></select-person2>
    <select-group v-model="isGroupVisible"
                  :selectTree="['2']"
                  :showTree="'1,2,3,4'"
                  :selectGroupSingle="isSelectGroupSingle"
                  :selected="selectedID"
                  @confirm="handlerGroupSelect"></select-group>
          <!-- <systemDialog v-model="systemVisible"
                  @confirm="confirmSystem"
                  :title="title"
                  :processlists='defaultList'></systemDialog> -->
    <selectRulesForQuote v-model="systemVisible" :ruleSelected="defaultList" @confirm="confirmSystem" />

  </div>
</template>

<script>
import {
  getInstitutionQueryForHZList,
  saveInstitution,
  deleteInstitution,
  getDetailss,
  restartProcess,
  getDetailByModelIds,
  updateStatusPlan
} from '@/bpa/api/rulesCenter/rulesPlanManage'
import { updateSelect } from '@/bpa/api/rulesCenter/rulesPlanManage'
// import paginations from '@/mixins/pagination_mixin'
import paginations from '@/bpa/mixins/pagination_mixin.js'
import fileOperation from '@/bpa/mixins/fileDownView'
import { getProcessIframeTree } from '@/bpa/api/componentsApi'
import systemDialog from '@/bpa/components/systemDialog'
import selectRulesForQuote from './selectRulesForQuote.vue'


import {
  getFormateDate
} from '@/utils/common'
import { createNamespacedHelpers } from 'vuex'
import selectRulesPlanSummary from './selectRulesPlanSummary'
import { downloadFile } from '@/bpa/utils/common'

const userInfo = createNamespacedHelpers('userInfo')
export default {
  components: {
    selectRulesPlanSummary,
    systemDialog,
    selectRulesForQuote
  },
  data () {
    return {
       timeOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      booksList: [],
      userAll: [],
      keyWords: '',
      dialogVisible: false,
      isPersonVisible: false,
      systemVisible: false,
      defaultList: [],
      // startDatePicker:this.begindate(),
      title: '',
      mainLeader: {},
      isHighSearch: false,
      dialogReportVisible: false,
      isIssue: true,
      checkReportid: '',
      reportList: [],
      checkReport: {},
      innerVisible: false,
      isEdit: false,
      selectedID: [],
      isGroupVisible: false,
      selectedPersonList: [],
      isSelectPersonVisible: false,
      // 是否开启单选 true单选  false多选
      isSelectGroupSingle: false,
      params: {},
      innerObj: {
        year: getFormateDate(new Date(), 'yyyy'),
        plan: []
      },
      innerPlanList: [],
      sysnameLeaveList: [],
      searchForm: {
        theme: '',
        year: '',
        department: '',
        createby: '',
        createtime: '',
        status: ''
      },
      editFormObj: {
        effectiveDate: '',
        fzList: [],
        xbList: [],
        xdList: []
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      rules: {
        theme: [{ required: true, message: ' ', trigger: 'blur' }],
        year: [{ required: true, message: ' ', trigger: 'blur' }],
        createtime: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      // 体系分类
      sysLists: [],
      dialogPositionVisible: false,
      positionList: [],
      positionId: '',
      itemId: '',
      sysOptions: [
        {
          label: '三级以下',
          value: '1'
        },
        {
          label: '非三级以下',
          value: '2'
        }]
    }
  },
  mixins: [paginations, fileOperation],
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    createby () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    },
    userid () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    action () {
      return `${this.host}/attach/upload2?createby=${this.userid}`
    },
    ...userInfo.mapGetters(['getUserAuthor']),
    download () {
      return this.host + '/attach/download/'
    }
  },
  mounted () {
    this.reset()
    // // 获取当前登录人权限
    // this.requireAuthoriy();
  },
  methods: {
    //清除表单验证
    clearValidate(){
      this.$refs['form'].clearValidate()
    },

    //  beginDate(){
    //     let self = this
    //     return {
    //       disabledDate(time){
    //       return time.getTime() > Date.now() -8.64e7//开始时间不选时，结束时间最大值小于等于当天
    //          }
    //        }
    //   },
 
    // 下载文件
    downloadFile (fileId) {
      return downloadFile(fileId)
    },
    systemData (data) {
      if (this.defaultType === '0') {
        if (this.editFormObj[this.systemKey].length === 0) {
          this.editFormObj[this.systemKey] = data.map(item => {
            return {
              sysname: item.newname,
              syslevel: item.syslevel !== 'null' ? item.syslevel : '',
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
              begindate: item.begindate
            }
          })
        } else {
          let sysname = []
          data.forEach(val => {
            let list = this.editFormObj[this.systemKey].map(item => item.sysid)
            if (list.indexOf(val.sysid) !== -1) {
              sysname.push(this.editFormObj[this.systemKey].find(item => {
                return item.sysid === val.sysid
              }))
            }
          })
          data.forEach(val => {
            let list = this.editFormObj[this.systemKey].map(item => item.sysid)
            if (list.indexOf(val.sysid) === -1) {
              sysname.push({
                sysname: val.newname,
                syslevel: val.syslevel !== 'null' ? val.syslevel : '',
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
                sysid: val.sysid
              })
            }
          })
          this.editFormObj[this.systemKey] = sysname
        }
        this.systemVisible = false
      } else {
        this.$set(
          this.editFormObj[this.systemKey1][this.defaultIndex],
          'abolishsystem',
          data[0].newname
        )
        this.$set(
          this.editFormObj[this.systemKey1][this.defaultIndex],
          'abolishsystemid',
          data[0].sysid
        )
        if (this.defaultList && this.defaultList.length > 0) {
          this.editFormObj.fzList.map(i => {
            if (i.defaultIndex === this.defaultIndex) {
              i.sysname = data[0].newname
              i.sysnameid = data[0].id
              i.publishtime = data[0].publishtime
              i.defaultIndex = this.defaultIndex
              i.defaultKey = this.systemKey1
              i.syslevel = data[0].syslevel !== 'null' ? data[0].syslevel : ''
              i.maindepartment = data[0].maindepartment
              i.maindepartmentid = data[0].maindepartmentid
              i.cooperatedepartment = data[0].cooperatedepartment
              i.cooperatedepartmentid = data[0].cooperatedepartmentid
              i.systemwriter = data[0].systemwriter
              i.systemwriterid = data[0].systemwriterid
              i.systemcontactsid = data[0].systemcontactsid
              i.systemcontacts = data[0].systemcontacts
              i.sysid = data[0].sysid
              i.enddate = data[0].enddate
              i.begindate = data[0].begindate
            }
          })
        } else {
          this.editFormObj.fzList.push({
            sysname: data[0].newname,
            sysnameid: data[0].id,
            defaultIndex: this.defaultIndex,
            publishtime: data[0].publishtime,
            defaultKey: this.systemKey1,
            syslevel: data[0].syslevel !== 'null' ? data[0].syslevel : '',
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
            begindate: data[0].begindate
          })
        }
        this.systemVisible = false
      }
    },
    confirmSystem (data) {
      if (data.length !== 1 && this.defaultType !== '0') {
        this.$message.error('请选择一个制度')
        return false
      }
      let params = data.map(item => {
        return {
          sysid: item.docId,
          newname: item.title,
        }
      })
      getDetailByModelIds(params).then(res => {
        this.systemData(res)
      })
    },
    saveIssueReport () {
      this.isIssue = false
      this.userkey = 'mainLeader'
      if (this.editFormObj.status !== '3') {
        this.focusMainLeader('mainLeader')
      } else {
        this.saveInstitution()
      }
    },
    sysnameLeaveHandle (item) {
      item.row.sysnameleave = this.sysnameLeaveList.find(val => val.id === item.row.sysnameleaveid).name
      if (item.row.sysnameleave.indexOf('三级以下制度') !== -1) {
        item.row.syslevel = '1'
      } else {
        item.row.syslevel = '2'
      }
      getProcessIframeTree(item.row.sysnameleaveid).then(res => {
        this.$set(item.row, 'sysnameid', '')
        this.$set(item.row, 'sysname', '')
        this.$set(item.row, 'sysnameList', res.filter(item => item.typeid === '5'))
      })
    },
    sysnameHandle (item) {
      let data = item.row.sysnameList.find(val => val.id === item.row.sysnameid)
      this.$set(item.row, 'sysname', data.name)
    },

    getSysnameLeaveList (id) {
      let data = this.sysnameLeaveList.find(item => item.id === id)
      return data ? data.name : ''
    },
    planSummaryHandle () {
      this.innerObj.plan = []
      this.innerHandle()
    },
    focusHandle (type, key, index) {
      let than = this
      than.selectedPersonList = []
      than.personType = type
      if (than.personType === '制度编写人') {
        than.personKey = key
        than.personIndex = index
        if (than.editFormObj[key][index].systemwriter) {
          than.editFormObj[key][index].systemwriter.split(',').forEach((item, index) => {
            than.selectedPersonList.push({
              cnname: item,
              empuid: than.editFormObj[key][than.personIndex].systemwriterid
                ? than.editFormObj[key][than.personIndex].systemwriterid.split(',')[index]
                : ''
            })
          })
        }
      } else if (than.personType === '制度联络人') {
        than.personKey = key
        than.personIndex = index
        if (than.editFormObj[key][than.personIndex].systemcontacts) {
          than.editFormObj[key][than.personIndex].systemcontacts.split(',').forEach((item, index) => {
            than.selectedPersonList.push({
              cnname: item,
              empuid: than.editFormObj[key][than.personIndex].systemcontactsid
                ? than.editFormObj[key][than.personIndex].systemcontactsid.split(',')[index]
                : ''
            })
          })
        }
      }
      than.isSelectPersonVisible = true
    },
    focusDeptHandle (type, key, index) {
      this.selectedID = []
      this.isSelectGroupSingle = false
      this.groupType = type
      if (this.groupType === '创建部门') {
        if (this.editFormObj.departmentid) {
          this.editFormObj.departmentid.split(',').forEach((item, index) => {
            this.selectedID.push({
              NAME: this.editFormObj.department
                ? this.editFormObj.department.split(',')[index]
                : '',
              ID: Number(item)
            })
          })
        }
      } else if (this.groupType === '主责部门') {
        this.isSelectGroupSingle = true
        this.groupKey = key
        this.groupIndex = index
        if (this.editFormObj[key][this.groupIndex].maindepartment) {
          this.editFormObj[key][this.groupIndex].maindepartment
            .split(',')
            .forEach((item, index) => {
              this.selectedID.push({
                name: item,
                ID: Number(
                  this.editFormObj[key][this.groupIndex].maindepartmentid
                    ? this.editFormObj[key][this.groupIndex].maindepartmentid.split(',')[index]
                    : ''
                )
              })
            })
        }
      } else if (this.groupType === '配合部门') {
        this.groupKey = key
        this.groupIndex = index
        if (this.editFormObj[key][this.groupIndex].cooperatedepartment) {
          this.editFormObj[key][this.groupIndex].cooperatedepartment
            .split(',')
            .forEach((item, index) => {
              this.selectedID.push({
                name: item,
                ID: Number(
                  this.editFormObj[key][this.groupIndex].cooperatedepartmentid
                    ? this.editFormObj[key][this.groupIndex].cooperatedepartmentid.split(',')[index]
                    : ''
                )
              })
            })
        }
      }
      this.isGroupVisible = true

    },
    focusMainLeader (key) {
      this.selectedPersonList = []
      this.userkey = key
      this.isPersonVisible = true
    },
    handlerPersonComfirm (list) {
      let self = this
      if (!list || list.length === 0) {
        this.$message.error("请选择部门领导审批人！");
        return false;
      }
      self.$set(self.mainLeader, self.userkey + 'id', list
        .map(item => {
          return item.empuid
        })
        .join(','))
      self.$set(self.mainLeader, self.userkey, list
        .map(item => {
          return item.cnname
        })
        .join(','))
      if (self.userkey === 'mainLeader') {
        if (self.isIssue) {
          this.saveReport()
        } else {
          self.saveInstitution()
        }
      }
      self.$forceUpdate()
    },
    handlerGroupSelect (list) {
      if (this.groupType === '创建部门') {
        this.editFormObj.departmentid = list
          .map(item => {
            return item.ID
          })
          .join(',')
        this.editFormObj.department = list
          .map(item => {
            return item.NAME
          })
          .join(',')
      } else if (this.groupType === '主责部门') {
        this.$set(
          this.editFormObj[this.groupKey][this.groupIndex],
          'maindepartmentid',
          list
            .map(item => {
              return item.ID
            })
            .join(',')
        )
        this.$set(
          this.editFormObj[this.groupKey][this.groupIndex],
          'maindepartment',
          list
            .map(item => {
              return item.name
            })
            .join(',')
        )
      } else if (this.groupType === '配合部门') {
        this.$set(
          this.editFormObj[this.groupKey][this.groupIndex],
          'cooperatedepartmentid',
          list
            .map(item => {
              return item.ID
            })
            .join(',')
        )
        this.$set(
          this.editFormObj[this.groupKey][this.groupIndex],
          'cooperatedepartment',
          list
            .map(item => {
              return item.name
            })
            .join(',')
        )
      }
    },
    handlerSelectPersonComfirm (list) {
      if (this.personType === '制度编写人') {
        this.$set(
          this.editFormObj[this.personKey][this.personIndex],
          'systemwriterid',
          list
            .map(item => {
              return item.empuid
            })
            .join(',')
        )
        this.$set(
          this.editFormObj[this.personKey][this.personIndex],
          'systemwriter',
          list
            .map(item => {
              return item.cnname
            })
            .join(',')
        )
      } else if (this.personType === '制度联络人') {
        this.$set(
          this.editFormObj[this.personKey][this.personIndex],
          'systemcontactsid',
          list
            .map(item => {
              return item.empuid
            })
            .join(',')
        )
        this.$set(
          this.editFormObj[this.personKey][this.personIndex],
          'systemcontacts',
          list
            .map(item => {
              return item.cnname
            })
            .join(',')
        )
      }
    },
    innerHandle () {
      let _this = this
      _this.userAll = []
      if (_this.editFormObj.planids) {
        _this.editFormObj.planids.split(',').forEach((item, index) => {
          this.userAll.push({
            id: item,
            theme: _this.editFormObj.plannames.split(',')[index]
          })
        })
      }
      _this.innerVisible = true
    },
    saveInnerPlan (list) {
      this.editFormObj.fzList = []
      this.editFormObj.xbList = []
      this.editFormObj.xdList = []
      list.forEach(val => {
        let fzList = JSON.parse(JSON.stringify(val.fzList))
        let xbList = JSON.parse(JSON.stringify(val.xbList))
        let xdList = JSON.parse(JSON.stringify(val.xdList))
        fzList.forEach(v => {
          delete v.id
          delete v.pid
        })
        xbList.forEach(v => {
          delete v.id
          delete v.pid
        })
        xdList.forEach(v => {
          delete v.id
          delete v.pid
        })
        this.editFormObj.fzList = this.editFormObj.fzList.concat(fzList)
        this.editFormObj.xbList = this.editFormObj.xbList.concat(xbList)
        this.editFormObj.xdList = this.editFormObj.xdList.concat(xdList)
      })
      this.editFormObj.xbList.forEach(val => {
        getProcessIframeTree(val.sysnameleaveid).then(res => {
          this.$set(val, 'sysnameList', res.filter(item => item.typeid === '5'))
        })
      })
      this.editFormObj.planids = list.map(item => item.id).join()
      this.editFormObj.plannames = list.map(item => item.theme).join()
      let docfiles = []
      list.forEach(item => {
        if (item.docfiles) {
          item.docfiles.forEach(val => {
            val.filename = val.originalName
            val.filesize = val.fileSize + 'B'
            val.fileId = val.id
            docfiles.push(val)
          })
        }
      })
      this.$set(
        this.editFormObj,
        'docfiles',
        docfiles
      )
      this.$set(
        this.editFormObj,
        'fjs',
        list.map(item => item.fjs).join(',')
      )
      this.innerVisible = false
    },
    getStatus (type) {
      if (type === '0') {
        return '草拟'
      } else if (type === '1') {
        return '已完成'
      } else if (type === '2') {
        return '审批中'
      } else if (type === '3') {
        return '退回'
      }
    },
    addDialog () {
      this.dialogVisible = true
      this.userkey = ''
      this.isEdit = true
      this.getReportList()
      this.editFormObj = {
        theme: '',
        year: new Date(),
        createtime: new Date(),
        fzList: [],
        xbList: [],
        xdList: []
      }
    },
    addList (key) {
      this.defaultType = '0'
      this.defaultList = []
      this.systemKey = key
      if (key === 'xbList') {
        this.title = '选择上级制度'
        this.editFormObj.xbList.push({})
      } else {
        this.title = '选择制度'
        if (this.editFormObj[key].length > 0) {
          this.editFormObj[key].forEach((item, index) => {
            this.defaultList.push({
              title: item.sysname,
              docId: item.sysid
            })
          })
        }
        this.defaultList = []
        this.systemVisible = true
      }
    },
    addList1 (key, index) {
      this.defaultType = '1'
      this.defaultIndex = index
      this.defaultList = []
      this.systemKey1 = key
      if (this.editFormObj[key][index].abolishsystem) {
        this.defaultList.push({
          title: this.editFormObj[key][index].abolishsystem,
          docId: this.editFormObj[key][index].abolishsystemid
        })
      }
      this.systemVisible = true
    },
    singleSearch () {
      this.pages.pageNum = 1
      this.params = {
        orderby: 'createtime',
        sort: 'desc',
        attr: { jstatus: '1' },
        filters: [
          { key: 'theme', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'year', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'createby', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'department', opt: 'LIKE', type: 'S', value: this.keyWords }
        ],
        logic: 'or'
      }
      this.getList()
    },
    highSearch () {
      this.pages.pageNum = 1
      this.params = {
        orderby: 'createtime',
        sort: 'desc',
        logic: 'and',
        attr: { jstatus: '1' },
        filters: [
          {
            key: 'theme',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.theme
          },
          {
            key: 'year',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.year
          },
          {
            key: 'department',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.department
          },
          {
            key: 'createby',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.createby
          },
          {
            key: 'status',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.status
          },
          {
            key: 'createtime',
            opt: 'BETWEEN',
            type: 'D',
            value:
              this.searchForm.createtime && this.searchForm.createtime.length
                ? this.searchForm.createtime[0] +
                '~' +
                this.searchForm.createtime[1]
                : ''
          }
        ]
      }
      this.getList()
    },
    reset () {
      this.pages.pageNum = 1
      this.keyWords = ''
      this.searchForm = {
        doctitle: '',
        enname: '',
        provideruser: '',
        docAuthorDis: '',
        status: '',
        name: '',
        value1: []
      }
      this.params = {
        orderby: 'createtime',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        attr: { jstatus: '1' }
      }

      this.getList()
    },
    getList () {
      let obj = {
        ...this.params,
        ...this.pages
      }
      getInstitutionQueryForHZList(obj).then(res => {
        if (!res) return false
        this.booksList = res.list
        this.pages.total = res.total
      })
    },
    renderHeader (cerateElement, { column }) {
      return cerateElement('span', [
        cerateElement('span', {
          domProps: {
            innerHTML: '*'
          },
          style: {
            color: 'red'
          }
        }),
        cerateElement('span', column.label)
      ])
    },
    // 确认添加
    saveInstitution () {
      let than = this
      than.$refs['form'].validate(valid => {
        if (valid) {
          than.editFormObj.createtime = getFormateDate(
            new Date(than.editFormObj.createtime),
            'yyyy-MM-dd hh:mm:ss'
          )
          than.editFormObj.year = getFormateDate(
            new Date(than.editFormObj.year),
            'yyyy'
          )
          than.editFormObj.fzList.forEach(item => {
            item.publishtime = item.publishtime
              ? getFormateDate(
                new Date(item.publishtime),
                'yyyy-MM-dd hh:mm:ss'
              )
              : ''
            item.enddate = item.enddate
              ? getFormateDate(new Date(item.enddate), 'yyyy-MM-dd hh:mm:ss')
              : ''
            item.begindate = item.begindate
              ? getFormateDate(new Date(item.begindate), 'yyyy-MM-dd hh:mm:ss')
              : ''
          })
          console.log(than)
          than.editFormObj.xbList.forEach(item => {
            item.publishtime = item.publishtime
              ? getFormateDate(
                new Date(item.publishtime),
                'yyyy-MM-dd hh:mm:ss'
              )
              : ''
            item.enddate = item.enddate
              ? getFormateDate(new Date(item.enddate), 'yyyy-MM-dd hh:mm:ss')
              : ''
            item.begindate = item.begindate
              ? getFormateDate(new Date(item.begindate), 'yyyy-MM-dd hh:mm:ss')
              : ''
          })
          than.editFormObj.xdList.forEach(item => {
            item.publishtime = item.publishtime
              ? getFormateDate(
                new Date(item.publishtime),
                'yyyy-MM-dd hh:mm:ss'
              )
              : ''
            item.enddate = item.enddate
              ? getFormateDate(new Date(item.enddate), 'yyyy-MM-dd hh:mm:ss')
              : ''
            item.begindate = item.begindate
              ? getFormateDate(new Date(item.begindate), 'yyyy-MM-dd hh:mm:ss')
              : ''
          })
          for (let i = 0; i < this.editFormObj.xbList.length; i++) {
            let item = this.editFormObj.xbList[i]
            if (!item.newname) {
              this.$message.error(`新增制度第${i + 1}条制度名称不能为空`)
              return false
            } else if (!item.maindepartment) {
              this.$message.error(`新增制度第${i + 1}条主责部门不能为空`)
              return false
            } else if (item.enddate === '' || item.enddate === null || item.enddate === undefined) {
              this.$message.error(`新增制度第${i + 1}条预计完成时间不能为空`)
              return false
            } else if (!item.systemwriter) {
              this.$message.error(`新增制度第${i + 1}条制度编写人不能为空`)
              return false
            } else if (item.enddate) {
              item.enddate = item.enddate
                ? getFormateDate(new Date(item.enddate), 'yyyy-MM-dd hh:mm:ss')
                : ''
            } else if (item.begindate) {
              item.begindate = item.begindate
                ? getFormateDate(new Date(item.begindate), 'yyyy-MM-dd hh:mm:ss')
                : ''
            }
            item.publishtime = item.publishtime
              ? getFormateDate(
                new Date(item.publishtime),
                'yyyy-MM-dd hh:mm:ss'
              )
              : ''
          }

          for (let i = 0; i < than.editFormObj.xdList.length; i++) {
            let item = than.editFormObj.xdList[i]
            if (item.enddate === '' || item.enddate === null || item.enddate === undefined) {
              than.$message.error(`修编制度第${i + 1}条预计完成时间不能为空`)
              return false
            } else if (!item.maindepartment) {
              than.$message.error(`修编制度第${i + 1}条主责部门不能为空`)
              return false
            } else if (!item.systemwriter) {
              than.$message.error(`修编制度第${i + 1}条制度编写人不能为空`)
              return false
            } else if (item.enddate) {
              item.enddate = item.enddate
                ? getFormateDate(new Date(item.enddate), 'yyyy-MM-dd hh:mm:ss')
                : ''
            } else if (item.begindate) {
              item.begindate = item.begindate
                ? getFormateDate(new Date(item.begindate), 'yyyy-MM-dd hh:mm:ss')
                : ''
            }
            item.publishtime = item.publishtime
              ? getFormateDate(
                new Date(item.publishtime),
                'yyyy-MM-dd hh:mm:ss'
              )
              : ''
          }
          for (let i = 0; i < than.editFormObj.fzList.length; i++) {
            let item = than.editFormObj.fzList[i]
            if (!item.maindepartment) {
              than.$message.error(`废止制度第${i + 1}条主责部门不能为空`)
              return false
            } else if (item.enddate === '' || item.enddate === null || item.enddate === undefined) {
              than.$message.error(`废止制度第${i + 1}条预计完成时间不能为空`)
              return false
            } else if (item.enddate) {
              item.enddate = item.enddate
                ? getFormateDate(new Date(item.enddate), 'yyyy-MM-dd hh:mm:ss')
                : ''
            } else if (item.begindate) {
              item.begindate = item.begindate
                ? getFormateDate(new Date(item.begindate), 'yyyy-MM-dd hh:mm:ss')
                : ''
            }
            item.publishtime = item.publishtime
              ? getFormateDate(
                new Date(item.publishtime),
                'yyyy-MM-dd hh:mm:ss'
              )
              : ''
          }

          than.editFormObj.sxnd = getFormateDate(
            new Date(than.innerObj.year),
            'yyyy'
          )
          than.editFormObj.nd = than.innerObj.plan.join(',')
          than.editFormObj.jstatus = '1'
          than.editFormObj.abolishsystemid = than.editFormObj.fzList.map(i => i.sysnameid).join()
          saveInstitution(than.editFormObj).then(res => {
            if (this.userkey === 'mainLeader') {
              this.checkReport = res
              if (res.status === '3') {
                this.updateType = '重新发起'
              }
              this.saveReport()
            } else {
              than.$message({
                type: 'success',
                message: '保存成功！'
              })
              than.dialogVisible = false
              than.getList()
            }
          })
        }
      })
    },
    deleteFile (index, type) {
      this.$confirm('确认要删除该条信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (type === '3') {
            this.editFormObj.fzList.splice(index, 1)
          } else if (type === '2') {
            this.editFormObj.xdList.splice(index, 1)
          } else if (type === '1') {
            this.editFormObj.xbList.splice(index, 1)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除表格某一行数据
    deleteRow (id) {
      this.$confirm('确认要删除该条信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteInstitution(id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.getList()
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    getReportList () {
      getProcessIframeTree('BD06C4AE2A712645E0533405A8C0C606').then(res => {
        this.sysnameLeaveList = res
        this.editFormObj.xbList.forEach(val => {
          if (!val.sysnameleaveid) return
          getProcessIframeTree(val.sysnameleaveid).then(res => {
            this.$set(val, 'sysnameList', res.filter(item => item.typeid === '5'))
          })
        })
      })
    },
    getDetails (id, type) {
      let than = this
      this.getReportList()
      getDetailss(id).then(res => {
        if (!res) return false
        res.fzList.forEach(item => {
          item.publishtime = item.publishtime?item.publishtime:''
          item.enddate = item.enddate?item.enddate:''
          item.begindate = item.begindate?item.begindate:''
        })
        than.editFormObj = res
        console.log(res)
        console.log(type)
        if (type === '修改') {
          than.isEdit = true
        } else {
          than.isEdit = false
        }
        if (than.editFormObj.fzList) {
          than.editFormObj.fzList.forEach(item => {
            console.log(item.publishtime)
            console.log(item)
            item.publishtime = item.publishtime
              ? getFormateDate(
                new Date(item.publishtime),
                'yyyy-MM-dd hh:mm:ss'
              )
              : ''
            item.enddate = item.enddate
              ? getFormateDate(new Date(item.enddate), 'yyyy-MM-dd hh:mm:ss')
              : ''
            item.begindate = item.begindate
              ? getFormateDate(new Date(item.begindate), 'yyyy-MM-dd hh:mm:ss')
              : ''
          })
        }
        if (this.editFormObj.sxnd) {
          this.innerObj.year = getFormateDate(
            new Date(this.editFormObj.sxnd),
            'yyyy'
          )
        }
        if (this.editFormObj.nd) {
          this.innerObj.report = this.editFormObj.nd.split(',')
        }
        if (this.editFormObj.docfiles) {
          this.editFormObj.docfiles.forEach(item => {
            item.filename = item.originalName
            item.filesize = item.fileSize + 'B'
            item.fileId = item.id
          })
        }
        this.userkey = ''
        than.dialogVisible = true
        than.editFormObj = Object.assign({}, than.editFormObj)
      })
    },
    saveReport () {
      // if (this.checkReportid) {
      if (this.updateType === '重新发起') {
        this.toInitiate(this.checkReport)
      } else {
        // let data = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
        // updateSelect(data).then(res => {
        //   if (res && res.length === 1) {
        //     this.positionId = res[0].pid
            this.submitPosition()
        //   } else if (res.length === 0) {
        //     this.$message.error('当前没有岗位信息，请联系BPM')
        //   } else {
        //     this.positionList = res
        //     this.dialogPositionVisible = true
        //   }
        // })
      }
      // } else {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择评估报告!'
      //   })
      // }
    },
    // 上报事件
    updateStatus (item, type) {
      this.updateType = type
      this.checkReport = item
      if (type === '重新发起') {
        this.toInitiate(this.checkReport)
      } else {
        this.isIssue = true
        this.focusMainLeader('mainLeader')
      }

      // let obj = {
      //   orderby: 'createon',
      //   pageNum: 0,
      //   pageSize: 0,
      //   filters: [{ key: 'status', opt: 'LIKE', type: 'S', value: '1' }],
      //   sort: 'desc',
      //   attr: { jstatus: '1' }
      // }
      // getReportQueryAllList(obj).then(res => {
      //   if (!res) return false
      //   this.reportList = res.list
      //   this.dialogReportVisible = true
      // })
    },
    // 选岗确认
    submitPosition () {
      updateStatusPlan({
        id: this.checkReport.id,
        // nid: this.checkReportid,
        userids: this.mainLeader.mainLeaderid,
        postid: this.positionId
      }).then(res => {
        this.$message({
          type: 'success',
          message: '上报成功!'
        })
        this.dialogVisible = false
        this.dialogReportVisible = false
        this.dialogPositionVisible = false
        this.getList()
      })
    },
    openBpm (item) {
      window.open(process.env.VUE_APP_BPA_URL + '/#/processForm/view?name=%E5%88%B6%E5%BA%A6%E6%B5%81%E7%A8%8B%E8%AE%A1%E5%88%92%E6%B1%87%E6%80%BB%E6%B5%81%E7%A8%8B&instanceId=' + item.instid + '&username=' + this.userid, '_blank')
    },
    toInitiate (item) {
      getDetailss(item.id).then(res => {
        if (!res) return false
        // res.noticid = this.checkReportid
        // res.noticname = this.reportList.find(item => item.id === this.checkReportid).subject
        return restartProcess(res)
      }).then(re => {
        this.$message({
          type: 'success',
          message: '发起成功!'
        })
        this.dialogReportVisible = false
        this.dialogPositionVisible = false
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#handbookFiles{
    padding: 20px;
    .high_search{
        margin-left: 20px;
    }
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

#pdfDom {
  padding: 10px;
}
.dialog-footer{
  margin-right: 20px;
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
