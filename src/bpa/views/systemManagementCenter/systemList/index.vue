<template>
  <div id="systemList">
    <el-tabs
      class="weight-tab"
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="内部管理体系" name="first">
        <div style="padding: 15px">
          <el-row>
            <el-col :span="12">
              <el-input
                placeholder="体系名称、体系编号、主责部门"
                class="search_component"
                v-model="keyWords"
                clearable
                @keyup.13.native="singleSearch"
                title="体系名称、体系编号、主责部门"
              >
                <el-button type="primary" slot="append" @click="singleSearch"
                  >搜索</el-button
                >
              </el-input>
            </el-col>
            <el-col :span="12" class="search_buttons_wrap">
              <el-button type="primary" @click="addDialog">添加</el-button>
              <el-button type="primary" @click="reset">刷新</el-button>
            </el-col>
          </el-row>
          <div class="systemListMain">
            <el-row :gutter="20">
              <el-col
                class="margin-t20"
                :span="6"
                v-for="(item, index) in booksList"
                :key="index"
              >
                <div class="systemListMainCrad">
                  <div class="text-right" style="height: 28px">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      v-if="
                        item.status === '0' ||
                        item.status === '2' ||
                        item.status === '3' ||
                        item.status === '6'
                      "
                      :content="item.status === '3' ? '修订' : '修改'"
                      placement="top"
                    >
                      <el-button
                        v-if="
                          item.status === '0' ||
                          item.status === '2' ||
                          item.status === '3' ||
                          item.status === '6'
                        "
                        @click="getDetails(item.id, '修改', item);clearValidate(item)"
                        icon="el-icon-edit"
                        type="text"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="发布"
                      v-if="item.status === '0' || item.status === '2' || item.status === '6'"
                      placement="top"
                    >
                      <el-button
                        @click="updateStatus(item, '1')"
                        v-if="item.status === '0' || item.status === '2' || item.status === '6'"
                        icon="el-icon-s-promotion"
                        type="text"
                      >
                      </el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      v-if="item.status === '1' || item.status === '3' || item.status === '4' || item.status === '5'"
                      content="查看"
                      placement="top"
                    >
                      <el-button
                        v-if="item.status === '1' || item.status === '3' || item.status === '4' || item.status === '5'"
                        @click="getDetails(item.id, '查看', item)"
                        icon="el-icon-view"
                        type="text"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      v-if="item.status === '3' || item.status === '6'"
                      content="废止"
                      placement="top"
                    >
                      <el-button
                        @click="updateStatus(item, '2')"
                        v-if="item.status === '3' || item.status === '6'"
                        icon="el-icon-s-open"
                        type="text"
                      >
                      </el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      v-if="
                        item.status === '0'"
                      content="删除"
                      placement="top"
                    >
                      <el-button
                        @click="deleteRow(item.id)"
                        v-if="
                          item.status === '0'"
                        type="text"
                        icon="el-icon-delete"
                      ></el-button>
                    </el-tooltip>
                  </div>
                  <h2 class="nowarp">{{ item.name }}&nbsp;</h2>
                  <div class="text-center systemListMainInfo">
                    <div class="padding10px">
                      <div class="systemListMainCradTop">
                        <div class="info">
                          <h3>体系版本</h3>
                          <p>{{ item.versions }}</p>
                        </div>
                        <div class="info">
                          <h3>发布时间</h3>
                          <p>{{ item.releasetime }}</p>
                        </div>
                      </div>
                      <div class="systemListMainCradBottom">
                        <div class="info">
                          <h3>体系编号</h3>
                          <p>{{ item.num }}</p>
                        </div>
                        <div class="info">
                          <h3>主责部门</h3>
                          <p>{{ item.deptname }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span class="status" v-if="item.status === '0'">草拟</span>
                  <span
                    class="status"
                    @click="openBpm(item)"
                    style="cursor: pointer"
                    v-if="item.status === '1'"
                    >审核中</span
                  >
                  <span class="status" v-if="item.status === '2'">已退回</span>
                  <span class="status" v-if="item.status === '3'">运行中</span>
                  <span class="status" v-if="item.status === '4'">已废止</span>
                  <span class="status" v-if="item.status === '5'">历史版本</span>
                  <span class="status" v-if="item.status === '6'">修订中</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pages.pageNum"
            :page-size="pages.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pages.total"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="外部管理体系" name="second">
        <div style="padding: 15px">
          <el-row>
            <el-col :span="12">
              <el-input
                placeholder="体系名称、体系执行标准、颁布单位"
                class="search_component"
                v-model="keyWords1"
                clearable
                @keyup.13.native="singleSearch1"
                title="体系名称、体系执行标准、颁布单位"
              >
                <el-button type="primary" slot="append" @click="singleSearch1"
                  >搜索</el-button
                >
              </el-input>
            </el-col>
            <el-col :span="12" class="search_buttons_wrap">
              <el-button type="primary" @click="addDialog1">添加</el-button>
              <el-button type="primary" @click="reset1">刷新</el-button>
            </el-col>
          </el-row>
          <div class="systemListMain">
            <el-row :gutter="20">
              <el-col
                class="margin-t20"
                :span="6"
                v-for="(item, index) in booksList1"
                :key="index"
              >
                <div class="systemListMainCrad">
                  <div class="text-right" style="height: 28px">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="修改"
                      v-if="item.status === '0' || item.status === '1'"
                      placement="top"
                    >
                      <el-button
                        v-if="item.status === '0' || item.status === '1'"
                        @click="getDetailsList(item.id, '修改', item)"
                        icon="el-icon-edit"
                        type="text"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="查看"
                      v-if="item.status === '2' || item.status === '3'"
                      placement="top"
                    >
                      <el-button
                        @click="getDetailsList(item.id, '查看', item)"
                        v-if="item.status === '2' || item.status === '3'"
                        icon="el-icon-view"
                        type="text"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="发布"
                      v-if="item.status === '0' || item.status === '1'"
                      placement="top"
                    >
                      <el-button
                        @click="updateStatus1(item, '1')"
                        v-if="item.status === '0' || item.status === '1'"
                        icon="el-icon-s-promotion"
                        type="text"
                      >
                      </el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      v-if="
                        item.status === '0' ||
                        item.status === '1' ||
                        item.status === '3'
                      "
                      content="删除"
                      placement="top"
                    >
                      <el-button
                        @click="deleteRow1(item.id)"
                        type="text"
                        v-if="
                          item.status === '0' ||
                          item.status === '1' ||
                          item.status === '3'
                        "
                        icon="el-icon-delete"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="废止"
                      v-if="item.status === '2'"
                      placement="top"
                    >
                      <el-button
                        @click="updateStatus1(item, '2')"
                        v-if="item.status === '2'"
                        icon="el-icon-s-open"
                        type="text"
                      >
                      </el-button>
                    </el-tooltip>
                  </div>
                  <h2>{{ item.name }}&nbsp;</h2>
                  <div class="text-center systemListMainInfo">
                    <div class="padding10px">
                      <div class="systemListMainCradTop">
                        <div class="info">
                          <h3>体系名称</h3>
                          <p>{{ item.name }}</p>
                        </div>
                        <div class="info">
                          <h3>体系执行标准</h3>
                          <p>{{ item.standard }}</p>
                        </div>
                      </div>
                      <div class="systemListMainCradBottom">
                        <div class="info">
                          <h3>颁布单位</h3>
                          <p>{{ item.dept }}</p>
                        </div>
                        <div class="info">
                          <h3>颁布日期</h3>
                          <p>{{ item.issue }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span class="status" v-if="item.status === '0'">草拟</span>
                  <span class="status" v-if="item.status === '1'">修改中</span>
                  <span class="status" v-if="item.status === '2'">运行中</span>
                  <span class="status" v-if="item.status === '3'">已废止</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="pages1.pageNum"
            :page-size="pages1.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pages1.total"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加弹框内部体系 -->
    <el-dialog
      :title= 'this.title'
      :visible.sync="dialogVisible"
      width="65%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="form"
        :model="editFormObj"
        label-width="120px"
        :rules="rules"
      >
        <el-row>
          <el-form-item label="体系名称:" prop="name">
            <el-input
              v-model="editFormObj.name"
              :disabled="!isEdit || editType === '修改'"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="体系版本:" required>
            <el-input
              v-model="editFormObj.versions"
              disabled
              :style="isEdit ? 'width: 100%' : 'width: 80%'"
              maxlength="100"
            ></el-input>
            <el-button v-if="!isEdit" type="text" @click="detailsHistory" v-show="editFormObj.versions != 'V1.0'"
              >查看历史版本</el-button
            >
          </el-form-item>

          <el-form-item label="体系编号:" prop="num">
            <el-input
              v-model="editFormObj.num"
              :disabled="!isEdit"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="发布时间:" required>
            <el-date-picker
              disabled
              v-model="editFormObj.releasetime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="主责部门:" prop="deptname">
            <el-input
              v-model="editFormObj.deptname"
              :disabled="!isEdit"
              @focus="focusHandle"
              maxlength="1000"
            ></el-input>
          </el-form-item>
          <el-form-item label="体系执行标准" required>
            <el-button
              size="mini"
              v-if="isEdit"
              @click="selectList"
              type="primary"
              >选择标准</el-button
            >
            <!-- <el-button size="mini"
            v-if="isEdit"
                       @click='addList'
                       type="primary">新增标准</el-button> -->
          </el-form-item>
          <el-table class="main_tab" :data="editFormObj.standardDtoList">
            <el-table-column prop="name" label="体系名称">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.name"
                  :disabled="!isEdit"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="standard" label="体系执行标准">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.standard"
                  :disabled="!isEdit"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item"
                            effect="dark"
                            v-if="isEdit"
                            content="删除"
                            placement="top">
                <el-button
                  @click="deleteList(scope.$index)"
                  class="no-border"
                  type="text"
                  >删除</el-button
                >
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isEdit" @click="saveNotice"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 废止弹框 -->
    <el-dialog
      :title="outSystemName"
      :visible.sync="dialogOutVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="outRef" label-width="120px">
        <el-row>
          <el-form-item label="废止原因:" required>
            <el-input v-model="reason" type="textarea"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOutVisible = false">取 消</el-button>
        <el-button type="primary" @click="agreeOut">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 历史版本弹框 -->
    <el-dialog
      title="历史版本"
      :visible.sync="dialogHistoryVisible"
      :close-on-click-modal="false"
      width="70%"
      :close-on-press-escape="false"
    >
      <el-form ref="form1" label-width="90px">
        <div>
          <el-table border class="main_tab blue-table" :data="nameList">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="体系名称" prop="name"> </el-table-column>
            <el-table-column label="体系版本" prop="versions">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- <el-tooltip class="item"
                          effect="dark"
                          content="查看详情"
                          placement="top"> -->
                <el-button
                  @click="getDetails1(scope.row.id, '查看', scope.row)"
                  type="text"
                  >查看详情</el-button
                >
                <!-- </el-tooltip> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogHistoryVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog
      title="查看体系详情"
      :visible.sync="dialogVisible1"
      width="65%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="editFormObj1" label-width="120px">
        <el-row>
          <el-form-item label="体系名称:">
            <el-input
              v-model="editFormObj1.name"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="体系版本:">
            <el-input
              v-model="editFormObj1.versions"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>

          <el-form-item label="体系编号:" prop="num">
            <el-input
              v-model="editFormObj1.num"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="发布时间:">
            <el-date-picker
              disabled
              v-model="editFormObj1.releasetime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="主责部门:">
            <el-input
              v-model="editFormObj1.deptname"
              disabled
              @focus="focusHandle"
              maxlength="1000"
            ></el-input>
          </el-form-item>
          <el-form-item label="废止原因:" v-if="editFormObj1.status === '4'">
            <el-input
              v-model="editFormObj1.reason"
              disabled
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item label="体系执行标准"> </el-form-item>
          <el-table class="main_tab" :data="editFormObj1.standardDtoList">
            <el-table-column prop="name" label="体系名称"> </el-table-column>
            <el-table-column prop="standard" label="体系执行标准">
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 添加外部体系列表 -->
    <el-dialog
      title="体系详情"
      :visible.sync="dialogOutListVisible"
      width="35%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="formOut"
        :model="editFormOutObj"
        label-width="120px"
        :rules="rulesname"
      >
        <el-row>
          <el-form-item label="体系名称:" prop="name">
            <el-input
              v-model="editFormOutObj.name"
              :disabled="!isEdit1 || editType === '修改'"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="体系执行标准:" prop="standard">
            <el-input
              v-model="editFormOutObj.standard"
              :disabled="!isEdit1"
              maxlength="100"
            ></el-input>
          </el-form-item>

          <el-form-item label="颁布单位:" prop="dept">
            <el-input
              v-model="editFormOutObj.dept"
              :disabled="!isEdit1"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="颁布日期:" prop="issue">
            <el-date-picker
              :disabled="!isEdit1"
              :picker-options="pickerOptionsStart"
              v-model="editFormOutObj.issue"
              type="date"
              format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="废止原因:" v-if="editFormOutObj.status === '3'">
            <el-input
              v-model="editFormOutObj.reason"
              disabled
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOutListVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isEdit1" @click="saveNotice1"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 选择标准 -->
    <el-dialog
      title="选择标准"
      :visible.sync="dialogSelectVisible"
      width="50%"
      @opened="handleSelectStard"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-input
              placeholder="体系名称、体系执行标准、颁布单位"
              class="search_component"
              v-model="keyWords3"
              clearable
              @keyup.13.native="singleSearch3"
            >
              <el-button type="primary" slot="append" @click="singleSearch3"
                >搜索</el-button
              >
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-table
            border
            ref="multipleTable"
            class="main_tab blue-table"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
            :data="dataList"
          >
            <el-table-column
              type="selection"
              :reserve-selection="true"
              width="55"
            >
            </el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="体系名称" prop="name"> </el-table-column>
            <el-table-column label="体系执行标准" prop="standard">
            </el-table-column>
            <el-table-column label="颁布单位" prop="dept"> </el-table-column>
            <el-table-column label="颁布日期" prop="issue"> </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange3"
            @current-change="handleCurrentChange3"
            :current-page="pages3.pageNum"
            :page-size="pages3.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pages3.total"
          ></el-pagination>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveNoticeSelect">确 定</el-button>
      </span>
    </el-dialog>

    <select-group
      v-model="isSelectPersonVisible"
      :selectTree="['1', '2']"
      :showTree="'1,2,3,4'"
      :selected="selectedPersonList"
      @confirm="handlerSelectPersonComfirm"
    ></select-group>
  </div>
</template>

<script>
import {
  getSystemManagement,
  saveSystemManagement,
  delSystemManagement,
  getSystemManagementById,
  startProcess,
  reviseSystemManagement,
  getDetails,
  getwbSystemList,
  wbSystemList,
  wbSystemListDelete,
  getSystemwbSystemList,
  wbstartProcess,
  getWbSystemListOut,
} from "@/bpa/api/systemManagementCenter/systemList";
import paginations from "@/bpa/mixins/pagination_mixin";
import fileOperation from "@/bpa/mixins/fileDownView";
import { getFormateDate } from "@/bpa/utils/common";
import { createNamespacedHelpers } from "vuex";
const userInfo = createNamespacedHelpers("userInfo");
export default {
  data() {
    return {
      title: '',
      booksList: [],
      docFile: [],
      selectedPersonList: [],
      keyWords: "",
      isSelectPersonVisible: false,
      params: {
        orderby: "createon",
        sort: "desc",
      },
      dialogVisible: false,
      isHighSearch: false,
      isEdit: false,
      searchForm: {
        name: "",
        username: "",
        content: "",
        createon: "",
      },
      editFormObj: {},
      pages: {
        pageSize: 8,
        pageNum: 1,
        total: 100,
      },
      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }],
        num: [{ required: true, message: " ", trigger: "blur" }],
        deptname: [{ required: true, message: " ", trigger: "blur" }],
      },
      rulesname: {
        name: [{ required: true, message: " ", trigger: "blur" }],
        standard: [{ required: true, message: " ", trigger: "blur" }],
      },
      pickerOptionsStart: {
        disabledDate(time) {
          return (
            time.getTime() > new Date(new Date().toLocaleDateString()).getTime()
          );
        },
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      // 体系分类
      sysLists: [],
      reason: "",
      dialogOutVisible: false,
      outStatus: "",
      outId: "",
      editItem: {},
      dialogHistoryVisible: false,
      nameList: [],
      activeName: "first",
      keyWords1: "",
      dialogVisible1: false,
      editFormObj1: {},
      dialogOutListVisible: false,
      editFormOutObj: {},
      isEdit1: false,
      params1: {
        orderby: "createon",
        sort: "desc",
      },
      pages1: {
        pageSize: 8,
        pageNum: 1,
        total: 100,
      },
      booksList1: [],
      dialogSelectVisible: false,
      dataList: [],
      multipleSelection: [],
      editType: "",
      pages3: {
        pageSize: 8,
        pageNum: 1,
        total: 100,
      },
      keyWords3: "",
      outSystemName: "",
      outRules: {
        reason: [{ required: true, message: " ", trigger: "blur" }],
      },
    };
  },
  mixins: [paginations, fileOperation],
  computed: {
    host() {
      // return process.env.BPA_URL
      return process.env.HOST_URL + process.env.BASE_URL;
    },
    // hostbpa(){
      
    // },
    username() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .cnname;
    },
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .empuid;
    },
    action() {
      return `${this.host}/attach/upload2?username=${this.userid}`;
    },
    ...userInfo.mapGetters(["getUserAuthor"]),
    download() {
      return this.host + "/attach/download/";
    },
  },
  mounted() {
    this.getList();
    this.getSecondList();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick() {
      if (this.activeName === "first") {
        this.getList();
      } else {
        this.getSecondList();
      }
    },
    addDialog(form) {
      // this.$refs['form'].clearValidate()
      this.title = '添加体系'
      this.dialogVisible = true;
      this.isEdit = true;
      this.editType = "";
      this.editFormObj = {
        standardDtoList: [],
        releasetime: this.getdate(),
        status: "0",
        type: "1",
        versions: "V1.0",
      };
      this.$refs['form'].clearValidate()
    },
    // 获取当前时间
    getdate() {
      var now = new Date();
      var y = now.getFullYear();
      var m = now.getMonth() + 1;
      var d = now.getDate();
      var h = now.getHours();
      var mm = now.getMinutes();
      var ff = now.getSeconds();
      return (
        y +
        "-" +
        (m < 10 ? "0" + m : m) +
        "-" +
        (d < 10 ? "0" + d : d) +
        " " +
        (h < 10 ? "0" + h : h) +
        ":" +
        (mm < 10 ? "0" + mm : mm) +
        ":" +
        (ff < 10 ? "0" + ff : ff)
      );
    },
    focusHandle() {
      this.selectedPersonList = [];
      if (this.editFormObj.deptid) {
        this.editFormObj.deptid.split(",").forEach((item, index) => {
          this.selectedPersonList.push({
            name: this.editFormObj.deptname
              ? this.editFormObj.deptname.split(",")[index]
              : "",
            id: Number(item),
            // cnname: this.editFormObj.username
            //   ? this.editFormObj.username.split(',')[index]
            //   : '',
            // empuid: item
          });
        });
      }
      this.isSelectPersonVisible = true;
    },
    addList() {
      this.editFormObj.standardDtoList.push({});
    },
    selectList() {
      this.getwbSystemList();
      this.dialogSelectVisible = true;
    },
    singleSearch3() {
      this.pages3.pageNum = 1;
      this.getwbSystemList();
    },
    getwbSystemList() {
      getWbSystemListOut({
        data: this.keyWords3,
        ...this.pages3,
      }).then((res) => {
        if (!res) return false;
        this.dataList = res.list.map((item) => {
          if (item.issue) {
            item.issue = !item.issue
              ? ""
              : getFormateDate(new Date(item.issue), "yyyy-MM-dd");
          }
          return item;
        });
        this.pages3.total = res.total;
      });
    },
    handleSizeChange3(val) {
      this.pages3.pageNum = val;
      this.getwbSystemList();
    },
    handleCurrentChange3(val) {
      this.pages3.pageNum = val;
      this.getwbSystemList();
    },
    handleSelectStard() {
      this.multipleSelection = [];
      for (let a = 0; a < this.editFormObj.standardDtoList.length; a++) {
        for (let i = 0; i < this.dataList.length; i++) {
          if (this.editFormObj.standardDtoList[a].systemid) {
            if (
              this.editFormObj.standardDtoList[a].systemid ===
              this.dataList[i].id
            ) {
              this.multipleSelection.push(this.dataList[i]);
              this.$refs.multipleTable.toggleRowSelection(
                this.dataList[i],
                true
              );
            }
          }
        }
      }
    },
    clearValidate(item){
      this.$refs['form'].clearValidate()
    },
    openBpm(item) {
      console.log(item);
      let a = document.createElement("a");
      // 给创建好的a标签赋值
      a.setAttribute(
        "href",process.env.VUE_APP_BPA_URL+"/#/processForm/view?instanceId=" +
          item.instid +
          "&username=" +
          this.userid + "&name=" +
          item.name
      );
      // 设置css 隐藏属性
      a.setAttribute("style", "display:none");
      // 设置 a标签为新窗口打开
      a.setAttribute("target", "_blank");
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a);
      // 模拟点击
      a.click();
      // 移除a标签
      a.parentNode.removeChild(a);
    },
    singleSearch() {
      this.pages.pageNum = 1;
      this.params = {
        orderby: "createon",
        sort: "desc",
        filters: [
          { key: "name", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "num", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "deptname", opt: "LIKE", type: "S", value: this.keyWords },
        ],
        logic: "or",
      };
      this.getList();
    },
    singleSearch1() {
      this.pages1.pageNum = 1;
      this.params1 = {
        orderby: "createon",
        sort: "desc",
        filters: [
          { key: "name", opt: "LIKE", type: "S", value: this.keyWords1 },
          { key: "standard", opt: "LIKE", type: "S", value: this.keyWords1 },
          { key: "dept", opt: "LIKE", type: "S", value: this.keyWords1 },
        ],
        logic: "or",
      };
      this.getSecondList();
    },
    reset1() {
      this.pages1.pageNum = 1;
      this.keyWords1 = "";
      this.params1 = {
        orderby: "createon",
        sort: "desc",
      };
      this.getSecondList();
    },
    getSecondList() {
      this.isEdit1 = true;
      let obj = {
        ...this.params1,
        ...this.pages1,
      };
      getwbSystemList(obj).then((res) => {
        if (!res) return false;
        this.booksList1 = res.list.map((item) => {
          if (item.issue) {
            item.issue = !item.issue
              ? ""
              : getFormateDate(new Date(item.issue), "yyyy-MM-dd");
          }
          return item;
        });
        this.pages1.total = res.total;
      });
    },
    addDialog1() {
      this.dialogOutListVisible = true;
      this.isEdit1 = true;
      this.editType = "";
      this.editFormOutObj = {
        status: "0",
      };
    },
    handlerSelectPersonComfirm(list) {
      this.$set(
        this.editFormObj,
        "deptname",
        list
          .map((item) => {
            return item.name;
          })
          .toString()
      );
      this.$set(
        this.editFormObj,
        "deptid",
        list
          .map((item) => {
            return item.id;
          })
          .join(",")
      );
    },
    reset() {
      this.pages.pageNum = 1;
      this.keyWords = "";
      this.params = {
        orderby: "createon",
        sort: "desc",
      };
      this.getList();
    },
    getList() {
      let obj = {
        ...this.params,
        ...this.pages,
      };
      getSystemManagement(obj).then((res) => {
        if (!res) return false;
        this.booksList = res.list.map((item) => {
          if (item.releasetime) {
            item.releasetime = !item.releasetime
              ? ""
              : getFormateDate(new Date(item.releasetime), "yyyy-MM-dd");
          }
          return item;
        });
        this.pages.total = res.total;
      });
    },
    // 确认添加
    saveNotice() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.editFormObj.standardDtoList.length === 0) {
            this.$message.error("请输入体系执行标准");
            return false;
          }
          if (this.editItem.status === "3") {
            reviseSystemManagement(this.editFormObj).then((res) => {
              this.$message({
                type: "success",
                message: "保存成功！",
              });
              this.dialogVisible = false;
              this.getList();
            });
          } else {
            saveSystemManagement(this.editFormObj).then((res) => {
              this.$message({
                type: "success",
                message: "保存成功！",
              });
              this.dialogVisible = false;
              this.getList();
            });
          }
        }
      });
    },
    saveNotice1() {
      this.$refs["formOut"].validate((valid) => {
        if (valid) {
          wbSystemList(this.editFormOutObj)
            .then((res) => {
              // this.$message({
              //   type: "success",
              //   message: "保存成功！",
              // });
              this.dialogOutListVisible = false;
              this.getSecondList();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    deleteList(index) {
      this.$confirm("确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.editFormObj.standardDtoList.splice(index, 1);
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
          delSystemManagement(id).then((res) => {
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
    // 删除表格某一行数据
    deleteRow1(id) {
      this.$confirm("确认要删除该条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          wbSystemListDelete(id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功！",
            });
            this.getSecondList();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handlerFileUploadSuccess(res) {
      this.docFile.push({
        filename: res.newName,
        filesize: res.size + "B",
        downloadUrl: this.host + "/attach/download/" + res.id,
        status: "已上传",
        fileId: res.id,
      });
    },
    getDetails(id, type, item) {
      this.editItem = item;
      this.editType = type;
      getSystemManagementById(id).then((res) => {
        if (!res) return false;
        this.editFormObj = res;
        if (type === "修改") {
          this.title = '修改体系'
          this.isEdit = true;
        } else if(type === '查看') {
          this.title = '查看体系详情'
          this.isEdit = false;
        }
        this.dialogVisible = true;
        this.editFormObj = Object.assign({}, this.editFormObj);
      });
    },
    getDetails1(id, type, item) {
      getSystemManagementById(id).then((res) => {
        if (!res) return false;
        this.editFormObj1 = res;
        this.dialogVisible1 = true;
        this.editFormObj1 = Object.assign({}, this.editFormObj1);
      });
    },
    getDetailsList(id, type, item) {
      this.editType = type;
      getSystemwbSystemList(id).then((res) => {
        if (!res) return false;
        this.editFormOutObj = res;
        if (type === "查看") {
          this.isEdit1 = false;
        } else {
          this.isEdit1 = true;
        }
        this.dialogOutListVisible = true;
        this.editFormOutObj = Object.assign({}, this.editFormOutObj);
      });
    },
    handleSizeChange1(val) {
      this.pages1.pageNum = val;
      this.getSecondList();
    },
    handleCurrentChange1(val) {
      this.pages1.pageNum = val;
      this.getSecondList();
    },
    // 下发事件
    updateStatus(item, type) {
      console.log(item)
      this.outStatus = type;
      this.outId = item.id;
      if (type === "1") {
        this.$confirm(
          `<p>标题: ${item.name}</p><p>是否确认发布？</p>`,
          "发布提示",
          {
            confirmButtonText: "确定",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            startProcess({
              id: item.id,
              type: type,
            }).then((res) => {
              console.log(res)
              this.$message({
                type: "success",
                message: res,
              });
              this.getList();
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$confirm(
          `<p>确认废止内部体系${item.name}吗？废止后相关流程和文件将同步废止</p>`,
          {
            confirmButtonText: "确定",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          this.outSystemName = "【" + item.name + "】废止原因填写";
          this.dialogOutVisible = true;
        });
      }
    },
    updateStatus1(item, type) {
      if (type === "1") {
        this.$confirm(`<p>标题: ${item.name}</p>`, "发布提示", {
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            wbstartProcess({
              id: item.id,
              type: type,
            }).then((res) => {
              this.$message({
                type: "success",
                message: "发布成功!",
              });
              this.getSecondList();
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$confirm(
          `<p>确认废止外部体系${item.name}吗？废止后相关流程和文件将同步废止</p>`,
          {
            confirmButtonText: "确定",
            dangerouslyUseHTMLString: true,
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          this.outStatus = type;
          this.outId = item.id;
          this.outSystemName = "【" + item.name + "】废止原因填写";
          this.dialogOutVisible = true;
        });
      }
    },
    // 废止
    agreeOut() {
      // this.$refs['outRef'].validate((valid) => {
      //   if (valid) {
      if (!this.reason) {
        this.$message.error("请输入废止原因");
        return false;
      }
      if (this.activeName === "first") {
        startProcess({
          id: this.outId,
          reason: this.reason,
          type: this.outStatus,
        }).then((res) => {
          this.$message({
            type: "success",
            message: "废止成功!",
          });
          this.dialogOutVisible = false;
          this.getList();
        });
      } else {
        wbstartProcess({
          id: this.outId,
          reason: this.reason,
          type: this.outStatus,
        }).then((res) => {
          this.$message({
            type: "success",
            message: "废止成功!",
          });
          this.dialogOutVisible = false;
          this.getSecondList();
        });
      }
      //   }
      // })
    },
    detailsHistory() {
      if (this.editFormObj.systemid) {
        getDetails(this.editFormObj.systemid).then((rt) => {
          this.nameList = rt;
          this.dialogHistoryVisible = true;
        });
      } else {
        this.$message.error("当前暂无历史版本");
      }
    },
    saveNoticeSelect() {
      if (
        this.editFormObj.standardDtoList &&
        this.editFormObj.standardDtoList.length > 0
      ) {
        let list = JSON.parse(JSON.stringify(this.editFormObj.standardDtoList));
        let data = list.map((b) => b.systemid);
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (!data.includes(this.multipleSelection[i].id)) {
            this.editFormObj.standardDtoList.push({
              name: this.multipleSelection[i].name,
              standard: this.multipleSelection[i].standard,
              systemid: this.multipleSelection[i].id,
            });
          }
        }
      } else {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.editFormObj.standardDtoList.push({
            name: this.multipleSelection[i].name,
            standard: this.multipleSelection[i].standard,
            systemid: this.multipleSelection[i].id,
          });
        }
      }
      this.$refs.multipleTable.clearSelection();
      this.dialogSelectVisible = false;
    },
    getRowKeys(row) {
      return row.id;
    },
  },
};
</script>

<style lang="scss" scoped>
#systemList {
  .systemListMain {
    &Info {
      height: 250px;
      display: flex;
      align-items: center;
      & > div {
        flex: auto;
      }
    }
    &Crad {
      padding: 10px;
      height: 300px;
      border: 3px solid $bc4;
      position: relative;
      top: 0;
      .status {
        position: absolute;
        background-color: #fa6f03;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        top: -15px;
        left: -20px;
        font-weight: bold;
      }
      h2 {
        font-size: 16px;
      }
      &Top {
        display: flex;
        border-bottom: 1px solid $bc4;
        div {
          flex: 1;
          padding: 10px;
        }
        div:last-child {
          border-left: 1px solid $bc4;
        }
        .info {
          display: flex;
          flex-direction: column;
          flex-flow: column-reverse;
          p,
          h3 {
            width: 100%;
          }
        }
      }
      .info {
        height: 80px;
        h3 {
          line-height: 30px;
        }
        p {
          white-space: normal;
          word-break: break-all;
          color: $bc4;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
      &Bottom {
        display: flex;
        div {
          flex: 1;
          padding: 10px;
        }
        div:last-child {
          border-left: 1px solid $bc4;
        }
      }
    }
  }
}
.systemListMainCrad {
  width: 90%;
  .nowarp {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
