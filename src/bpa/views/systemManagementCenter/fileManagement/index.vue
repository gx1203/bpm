<template>
  <div id="systemList">
    <el-tabs
      class="weight-tab"
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="内部管理文件" name="first">
        <div style="padding: 15px">
          <el-row>
            <el-col :span="8">
              <el-input
                placeholder="文件名称、适用体系、文件编号"
                class="search_component"
                v-model="keyWords"
                clearable
                @keyup.13.native="singleSearch"
                title="文件名称、适用体系、文件编号"
              >
                <el-button type="primary" slot="append" @click="singleSearch"
                  >搜索</el-button
                >
              </el-input>
            </el-col>
            <el-col :span="10">
              <div style="padding: 6px">
                <span
                  class="inside_all_span"
                  v-for="(item, index) in itSetList1"
                  :key="index"
                >
                  <span v-if="index !== 0">|</span
                  ><span
                    class="inside_item_span"
                    :style="indexInfo === index ? 'color: #4ba2ef;' : ''"
                    @click="queryFile(index)"
                    :title="item.title"
                    >&nbsp;&nbsp;{{ item.name }}（{{ item.count }}）&nbsp;</span
                  >
                </span>
              </div>
            </el-col>
            <el-col :span="6" class="search_buttons_wrap">
              <el-button type="primary" @click="addDialog">添加</el-button>
              <el-button type="primary" @click="reset">刷新</el-button>
            </el-col>
          </el-row>
          <div class="systemListMain">
            <el-row :gutter="20">
              <el-table :data="booksList" border class="main_tab blue-table">
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="文件名称" prop="name">
                  <template slot-scope="scope">
                    <a :href="txdownloadFile(scope.row.fileids)" download>
                      {{ scope.row.name }}
                    </a>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="适用体系"
                             prop="systemname"/> -->
                <el-table-column label="适用体系" prop="datas" />
                <el-table-column label="文件编号" prop="dnum" />
                <el-table-column label="文件类型" prop="types" />
                <el-table-column label="版本" prop="versions" />
                <el-table-column label="发布人" prop="username" />
                <el-table-column label="发布时间" prop="createdate" />
                <el-table-column label="状态" prop="status">
                  <template slot-scope="scope">
                    {{
                      scope.row.status === "0"
                        ? "草拟"
                        : scope.row.status === "1"
                        ? "修改中"
                        : scope.row.status === "2"
                        ? "审批中"
                        : scope.row.status === "3"
                        ? "退回修改中"
                        : scope.row.status === "4"
                        ? "已发布"
                        : scope.row.status === "5"
                        ? "废止"
                        : scope.row.status === "7"
                        ? "修订中"
                        : ""
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          :content="scope.row.status==='4' ? '修订' : '修改'"
                          placement="top"> -->
                    <el-button
                      v-if="
                        scope.row.status === '0' ||
                        scope.row.status === '1' ||
                        scope.row.status === '3' ||
                        scope.row.status === '4' ||
                        scope.row.status === '7'
                      "
                      @click="getDetails(scope.row.id, '修改', scope.row);clearValidate()"
                      type="text"
                    >
                      {{
                        scope.row.status === "4" ? "修订" : "修改"
                      }}</el-button
                    >
                    <!-- </el-tooltip> -->
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          content="发布"
                          placement="top"> -->
                    <el-button
                      @click="updateStatus(scope.row, '1')"
                      v-if="
                        scope.row.status === '0' ||
                        scope.row.status === '1' ||
                        scope.row.status === '7'
                      "
                      type="text"
                    >
                      发布
                    </el-button>
                    <!-- </el-tooltip> -->
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          content="查看"
                          placement="top"> -->
                    <el-button
                      v-if="
                        scope.row.status !== '0' &&
                        scope.row.status !== '1' &&
                        scope.row.status !== '7'
                      "
                      @click="getDetails(scope.row.id, '查看', scope.row)"
                      type="text"
                      >查看</el-button
                    >
                    <!-- </el-tooltip> -->
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          content="废止"
                          placement="top"> -->
                    <el-button
                      @click="updateStatus(scope.row, '2')"
                      v-if="scope.row.status === '4'"
                      type="text"
                    >
                      废止
                    </el-button>
                    <!-- </el-tooltip> -->
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          content="删除"
                          placement="top"> -->
                    <el-button
                      @click="deleteRow(scope.row.id)"
                      v-if="
                        scope.row.status === '0' ||
                        scope.row.status === '5' 
                      "
                      type="text"
                    >
                      删除</el-button
                    >
                    <!-- </el-tooltip> -->
                  </template>
                </el-table-column>
              </el-table>
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
      <el-tab-pane label="外来文件" name="second">
        <div style="padding: 15px">
          <el-row>
            <el-col :span="8">
              <el-input
                placeholder="文件名称、适用体系、体系执行标准、颁布单位"
                class="search_component"
                v-model="keyWords1"
                clearable
                @keyup.13.native="singleSearch1"
                title="文件名称、适用体系、体系执行标准、颁布单位"
              >
                <el-button type="primary" slot="append" @click="singleSearch1"
                  >搜索</el-button
                >
              </el-input>
            </el-col>
            <el-col :span="16" class="search_buttons_wrap">
              <el-button type="primary" @click="addDialog1">添加</el-button>
              <el-button type="primary" @click="reset">刷新</el-button>
            </el-col>
          </el-row>
          <div class="systemListMain">
            <el-row :gutter="20">
              <el-table :data="booksList1" border class="main_tab blue-table">
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="文件名称" prop="name" />
                <!-- <el-table-column label="适用体系"
                             prop="systemname"/> -->
                <el-table-column label="适用体系" prop="datas" />
                <el-table-column label="体系执行标准" prop="standard" />
                <el-table-column label="颁布单位" prop="dept" />
                <el-table-column label="颁布日期" prop="issue" />
                <el-table-column label="发布人" prop="username" />
                <el-table-column label="发布时间" prop="createdate" />
                <el-table-column label="状态" prop="status">
                  <template slot-scope="scope">
                    {{
                      scope.row.status === "0"
                        ? "草拟"
                        : scope.row.status === "1"
                        ? "修改中"
                        : scope.row.status === "2"
                        ? "审批中"
                        : scope.row.status === "3"
                        ? "退回修改中"
                        : scope.row.status === "4"
                        ? "已发布"
                        : scope.row.status === "5"
                        ? "废止"
                        : scope.row.status === "7"
                        ? "修订中"
                        : ""
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          :content="scope.row.status==='4' ? '修订' : '修改'"
                          placement="top"> -->
                    <el-button
                      v-if="
                        scope.row.status === '0' ||
                        scope.row.status === '1' ||
                        scope.row.status === '3' ||
                        scope.row.status === '4' ||
                        scope.row.status === '7'
                      "
                      @click="getDetails1(scope.row.id, '修改', scope.row);clearValidate2()"
                      type="text"
                      >{{
                        scope.row.status === "4" ? "修订" : "修改"
                      }}</el-button
                    >
                    <!-- </el-tooltip> -->
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          content="发布"
                          placement="top"> -->
                    <el-button
                      @click="updateStatus1(scope.row, '1')"
                      v-if="
                        scope.row.status === '0' ||
                        scope.row.status === '1' ||
                        scope.row.status === '7'
                      "
                      type="text"
                    >
                      发布
                    </el-button>
                    <!-- </el-tooltip> -->
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          content="查看"
                          placement="top"> -->
                    <el-button
                      v-if="
                        scope.row.status !== '0' &&
                        scope.row.status !== '1' &&
                        scope.row.status !== '7'
                      "
                      @click="getDetails1(scope.row.id, '查看', scope.row)"
                      type="text"
                      >查看</el-button
                    >
                    <!-- </el-tooltip> -->
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          content="废止"
                          placement="top"> -->
                    <el-button
                      @click="updateStatus1(scope.row, '2')"
                      v-if="scope.row.status === '4'"
                      type="text"
                    >
                      废止
                    </el-button>
                    <!-- </el-tooltip> -->
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          content="删除"
                          placement="top"> -->
                    <el-button
                      @click="deleteRow1(scope.row.id)"
                      v-if="
                        scope.row.status === '0' ||
                        scope.row.status === '5' ||
                        scope.row.status === '1'
                      "
                      type="text"
                    >
                      删除
                    </el-button>
                    <!-- </el-tooltip> -->
                  </template>
                </el-table-column>
              </el-table>
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
      <el-tab-pane label="记录文件" name="third">
        <el-row :gutter="20" style="padding: 15px">
          <el-col :span="4" class="tree_wrap">
            <el-row>
              <el-input
                placeholder="请输入内容"
                class="search_component remove-margin-b"
                v-model="filterText"
                clearable
                @keyup.13.native="abstractSearch"
              >
                <el-button type="primary" @click="abstractSearch" slot="append"
                  >搜索</el-button
                >
              </el-input>
            </el-row>
            <el-scrollbar class="tree_node" style="height: calc(60vh - 160px)">
              <el-tree
                v-show="!isSearch"
                :props="props"
                :isLeaf="isLeaf"
                node-key="id"
                class="treeNode"
                :load="getFilterTreeList"
                :default-expanded-keys="expandedList"
                :expand-on-click-node="false"
                ref="asyncTree"
                lazy
              >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <p
                    class="grow"
                    :title="node.label"
                    @click="handlerNodeClick(data, node)"
                  >
                    {{ node.label }}
                  </p>
                </div>
              </el-tree>
              <el-tree
                v-show="isSearch"
                :props="props"
                class="treeNode"
                :isLeaf="isLeaf"
                node-key="id"
                :data="treeData"
                :default-expand-all="true"
                :default-expanded-keys="expandedList"
                :expand-on-click-node="false"
                lazy
              >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <p
                    class="grow"
                    :title="node.label"
                    @click="handlerNodeClick(data, node)"
                  >
                    {{ node.label }}
                  </p>
                </div>
              </el-tree>
            </el-scrollbar>
          </el-col>
          <el-col :span="20">
            <!-- <el-scrollbar class="right-content"> -->
              <el-row>
                <el-col :span="6">
                  <el-input
                    placeholder="文件名称、适用体系"
                    class="search_component remove-margin-b"
                    v-model="filterText1"
                    clearable
                    @keyup.13.native="searchFiles"
                  >
                    <el-button type="primary" @click="searchFiles" slot="append"
                      >搜索</el-button
                    >
                  </el-input>
                </el-col>
                <el-col
                  :span="18"
                  class="search_buttons_wrap"
                  style="margin-bottom: 10px"
                >
                  <el-button type="primary" @click="addDialog2">添加</el-button>
                  <el-button type="primary" @click="reset">刷新</el-button>
                </el-col>
              </el-row>
              <el-table :data="userList" border class="main_tab blue-table">
                <el-table-column label="序号" type="index"> </el-table-column>
                <el-table-column prop="name" label="文件名称">
                </el-table-column>
                <!-- <el-table-column
              prop="systemname"
              label="相关体系">
            </el-table-column> -->
                <el-table-column label="适用体系" prop="datas" />
                <el-table-column prop="systemsclause" label="体系条款">
                </el-table-column>
                <el-table-column prop="years" label="审核年度">
                </el-table-column>
                <el-table-column prop="username" label="发布人">
                </el-table-column>
                <el-table-column prop="createdate" label="发布时间">
                </el-table-column>
                <el-table-column label="状态">
                  <template slot-scope="scope">
                    {{
                      scope.row.status === "0"
                        ? "草拟"
                        : scope.row.status === "1"
                        ? "修改中"
                        : scope.row.status === "2"
                        ? "审批中"
                        : scope.row.status === "3"
                        ? "退回修改中"
                        : scope.row.status === "4"
                        ? "已发布"
                        : scope.row.status === "5"
                        ? "废止"
                        : scope.row.status === "7"
                        ? "修订中"
                        : ""
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="email" label="操作">
                  <template slot-scope="scope">
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          :content="scope.row.status==='4' ? '修订' : '修改'"
                          placement="top"> -->
                    <el-button
                      v-if="
                        scope.row.status === '0' ||
                        scope.row.status === '1' ||
                        scope.row.status === '3' ||
                        scope.row.status === '4' ||
                        scope.row.status === '7'
                      "
                      @click="getDetails2(scope.row.id, '修改', scope.row);clearValidate1()"
                      type="text"
                      >{{
                        scope.row.status === "4" ? "修订" : "修改"
                      }}</el-button
                    >
                    <!-- </el-tooltip> -->
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          content="发布"
                          placement="top"> -->
                    <el-button
                      @click="updateStatus2(scope.row, '1')"
                      v-if="
                        scope.row.status === '0' ||
                        scope.row.status === '1' ||
                        scope.row.status === '7'
                      "
                      type="text"
                    >
                      发布
                    </el-button>
                    <!-- </el-tooltip> -->
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          content="查看"
                          placement="top"> -->
                    <el-button
                      v-if="
                        scope.row.status !== '0' &&
                        scope.row.status !== '1' &&
                        scope.row.status !== '7'
                      "
                      @click="getDetails2(scope.row.id, '查看', scope.row)"
                      type="text"
                      >查看</el-button
                    >
                    <!-- </el-tooltip> -->
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          content="废止"
                          placement="top"> -->
                    <el-button
                      @click="updateStatus2(scope.row, '2')"
                      v-if="scope.row.status === '4'"
                      type="text"
                    >
                      废止
                    </el-button>
                    <!-- </el-tooltip> -->
                    <!-- <el-tooltip class="item"
                          effect="dark"
                          content="删除"
                          placement="top"> -->
                    <el-button
                      @click="deleteRow2(scope.row.id)"
                      v-if="
                        scope.row.status === '0' ||
                        scope.row.status === '5' ||
                        scope.row.status === '1'
                      "
                      type="text"
                      >删除</el-button
                    >
                    <!-- </el-tooltip> -->
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pages.pageNum"
                :page-size="pages.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="pages.total"
              ></el-pagination>
            <!-- </el-scrollbar> -->
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加弹框内部管理文件 -->
    <el-dialog
      title="内部管理文件"
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
          <el-form-item label="文件名称:" prop="name">
            <el-input
              v-model="editFormObj.name"
              :disabled="!isEdit"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="适用体系:" prop="systemid">
            <el-select
              @change="handleSelect"
              v-if="isEdit"
              :disabled="!isEdit"
              v-model="editFormObj.systemid"
              placeholder="请选择"
            >
              <el-option
                v-for="item in itList"
                :key="item.id"
                :label="item.datas"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-input
              v-if="!isEdit"
              v-model="editFormObj.datas"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="文件类型:" prop="types">
            <el-select
              :disabled="!isEdit"
              @change="handleSelectType"
              v-model="editFormObj.types"
              placeholder="请选择"
            >
              <el-option
                v-for="item in itSetList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件编号:" prop="dnum">
            <el-input
              v-model="editFormObj.dnum"
              :disabled="!isEdit"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="版本:" prop="versions">
            <el-input
              v-model="editFormObj.versions"
              disabled
              :style="isEdit ? 'width: 100%' : 'width: 80%'"
              maxlength="100"
            ></el-input>
            <el-button v-if="!isEdit" type="text" @click="detailsHistory"
              >查看历史版本</el-button
            >
          </el-form-item>
          <el-form-item label="发布人:" prop="username">
            <el-input
              v-model="editFormObj.username"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="发布时间:" prop="createdate">
            <el-date-picker
              disabled
              v-model="editFormObj.createdate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="废止原因:" v-if="editFormObj.status === '5'">
            <el-input
              v-model="editFormObj.reason"
              disabled
              type="textarea"
            ></el-input>
          </el-form-item>
          <upload-files
            :isexct="isEdit"
            :labelName="name"
            :limitNum="limitNums"
            :fileList="fileList"
            @confirmUploadFilesList="uploadFilesList"
          ></upload-files>
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
      :title="statusTitle"
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
            <el-table-column label="文件名称" prop="name"> </el-table-column>
            <el-table-column label="适用体系" prop="systemname">
            </el-table-column>
            <el-table-column label="文件编号" prop="dnum"> </el-table-column>
            <el-table-column label="版本" prop="versions"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- <el-tooltip class="item"
                          effect="dark"
                          content="查看详情"
                          placement="top"> -->
                <el-button
                  @click="getHisDetails(scope.row.id, '查看', scope.row)"
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
      title="内部管理文件详情"
      :visible.sync="dialogVisible1"
      width="65%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="editFormObj1" label-width="120px">
        <el-row>
          <el-form-item label="文件名称:" prop="name">
            <el-input
              v-model="editFormObj1.name"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="适用体系:" prop="datas">
            <!-- <el-select disabled v-model="editFormObj1.systemname" placeholder="请选择">
    <el-option
      v-for="item in itList"
      :key="item.id"
      :label="item.name"
      :value="item.name">
    </el-option>
  </el-select> -->
            <el-input
              v-model="editFormObj1.datas"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="文件编号:" prop="dnum">
            <el-input
              v-model="editFormObj1.dnum"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="文件类型:" prop="types">
            <el-select
              disabled
              v-model="editFormObj1.types"
              placeholder="请选择"
            >
              <el-option
                v-for="item in itSetList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本:" prop="versions">
            <el-input
              v-model="editFormObj1.versions"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="发布人:" prop="username">
            <el-input
              v-model="editFormObj1.username"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="发布时间:" prop="createdate">
            <el-date-picker
              disabled
              v-model="editFormObj1.createdate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="废止原因:" v-if="editFormObj1.status === '5'">
            <el-input
              v-model="editFormObj1.reason"
              disabled
              type="textarea"
            ></el-input>
          </el-form-item>
          <upload-files
            :isexct="false"
            :labelName="name"
            :limitNum="limitNums"
            :fileList="fileList"
            @confirmUploadFilesList="uploadFilesList"
          ></upload-files>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 添加外来文件 -->
    <el-dialog
      title="外来文件"
      :visible.sync="dialogOutListVisible"
      width="65%"
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
          <el-form-item label="文件名称:" prop="name">
            <el-input
              v-model="editFormOutObj.name"
              :disabled="!isEdit1"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="适用体系:" prop="systemid">
            <el-select
              @change="handleSelect1"
              v-if="isEdit1"
              :disabled="!isEdit1"
              v-model="editFormOutObj.systemid"
              placeholder="请选择"
            >
              <el-option
                v-for="item in itList1"
                :key="item.id"
                :label="item.datas"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-input
              v-else
              v-model="editFormOutObj.datas"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="体系执行标准:" prop="dnum">
            <el-input
              v-model="editFormOutObj.standard"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="文件类型:" prop="type">
            <el-select
              :disabled="!isEdit1"
              @change="handleTypeChange"
              v-model="editFormOutObj.type"
              placeholder="请选择"
            >
              <el-option
                v-for="item in itTypeList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="颁布单位:" prop="dept">
            <el-input
              v-model="editFormOutObj.dept"
              :disabled="!isEdit1 || editFormOutObj.type === '体系文件'"
              maxlength="100"
            ></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="颁布日期:" prop="issue">
            <el-date-picker
              v-model="editFormOutObj.issue"
              type="date"
              :disabled="!isEdit1 || editFormOutObj.type === '体系文件'"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item> -->
          <el-form-item label="发布人:" prop="username">
            <el-input
              v-model="editFormOutObj.username"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="发布时间:" prop="createdate">
            <el-date-picker
              disabled
              v-model="editFormOutObj.createdate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="废止原因:" v-if="editFormOutObj.status === '5'">
            <el-input
              v-model="editFormOutObj.reason"
              disabled
              type="textarea"
            ></el-input>
          </el-form-item>
          <upload-files
            :isexct="isEdit1"
            :labelName="name1"
            :limitNum="limitNums1"
            :fileList="fileList1"
            @confirmUploadFilesList="uploadFilesList1"
          ></upload-files>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOutListVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isEdit1" @click="saveNotice1"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 添加记录文件 -->
    <el-dialog
      title="记录文件"
      :visible.sync="dialogRecordListVisible"
      width="65%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="formRecord"
        :model="editFormRecordObj"
        label-width="120px"
        :rules="rulesRecordname"
      >
        <el-row>
          <el-form-item label="文件名称:" prop="name">
            <el-input
              v-model="editFormRecordObj.name"
              :disabled="!isEdit2"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="相关体系:" prop="systemid">
            <el-select
              @change="handleSelect2"
              v-if="isEdit2"
              :disabled="!isEdit2"
              v-model="editFormRecordObj.systemid"
              placeholder="请选择"
            >
              <el-option
                v-for="item in itList"
                :key="item.id"
                :label="item.datas"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-input
              v-else
              v-model="editFormRecordObj.datas"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="体系条款:" prop="systemsclause">
            <el-input
              v-model="editFormRecordObj.systemsclause"
              :disabled="!isEdit2"
              @click.native="selectSystem"
              placeholder="请单击选择"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="审核年度:" prop="years">
            <!-- <el-input v-model="editFormRecordObj.years"
                      :disabled="!isEdit2"
                      maxlength="100"></el-input> -->
            <el-date-picker
              :disabled="!isEdit2"
              v-model="editFormRecordObj.years"
              type="year"
              format="yyyy"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择年度"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="发布人:" prop="username">
            <el-input
              v-model="editFormRecordObj.username"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="发布时间:" prop="createdate">
            <el-date-picker
              disabled
              v-model="editFormRecordObj.createdate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="废止原因:"
            v-if="editFormRecordObj.status === '5'"
          >
            <el-input
              v-model="editFormRecordObj.reason"
              disabled
              type="textarea"
            ></el-input>
          </el-form-item>
          <upload-files
            :activeName="activeName"
            :isexct="isEdit2"
            :labelName="name2"
            :limitNum="limitNums2"
            :fileList="fileList2"
            @confirmUploadFilesList="uploadFilesList2"
          ></upload-files>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRecordListVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isEdit2" @click="saveNotice2"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 体系章节树弹框 -->
    <el-dialog
      title="选择体系条款"
      class="tree_list"
      :visible.sync="dialogTreeVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row :gutter="20" class="group_container">
        <el-col :span="24" class="tree_wrap">
          <!-- <el-scrollbar class="tree_node"> -->
            <el-tree
              :highlight-current="true"
              :data="menusTree"
              node-key="id"
              :props="defaultoutProps"
              :default-checked-keys="grandParentId"
              show-checkbox
              :expand-on-click-node="false"
              :check-strictly="true"
              @check="handleNodeCheck"
              ref="menuTree"
            ></el-tree>
          <!-- </el-scrollbar> -->
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTreeVisible = false">取消</el-button>
        <el-button type="primary" @click="handlerConfirmDialog">确定</el-button>
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
  getinterneldm,
  getInterList,
  saveinterneldm,
  reviseinterneldm,
  startProcess,
  getinterneldmList,
  interneldmDelete,
  getexternaldm,
  saveExternaldm,
  reviseExternaldm,
  getexternaldmList,
  externaldmDelete,
  startexternaldm,
  getrecordingdm,
  getrecordingdmList,
  saverecordingdm,
  reviserecordingdm,
  startProcessrecordingdm,
  recordingdmDelete,
  getRecordCount,
  getDetails,
} from "@/bpa/api/systemManagementCenter/fileManagement";
import {
  getWbSystemListOut,
  getSystemwbSystemList,
} from "@/bpa/api/systemManagementCenter/systemList";
import { getSystemTree } from "@/bpa/api/systemManagementCenter/systemAuditplan";
import { getTreeList, abstractSearch } from "@/bpa/api/settings/groupManage";
import paginations from "@/bpa/mixins/pagination_mixin";
import fileOperation from "@/bpa/mixins/fileDownView";
import uploadFiles from "./uploadFiles";
import { getFormateDate, txdownloadFile } from "@/bpa/utils/common";
import { createNamespacedHelpers } from "vuex";
const userInfo = createNamespacedHelpers("userInfo");
export default {
  components: {
    uploadFiles,
  },
  data() {
    return {
      booksList: [],
      docFile: [],
      selectedPersonList: [],
      keyWords: "",
      isSelectPersonVisible: false,
      params: {},
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
        systemid: [{ required: true, message: " ", trigger: "blur" }],
        types: [{ required: true, message: " ", trigger: "blur" }],
        dnum: [{ required: true, message: " ", trigger: "blur" }],
      },
      rulesname: {
        name: [{ required: true, message: " ", trigger: "blur" }],
        type: [{ required: true, message: " ", trigger: "blur" }],
        systemid: [{ required: true, message: " ", trigger: "blur" }],
      },
      outRules: {
        reason: [{ required: true, message: " ", trigger: "blur" }],
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
      editItem1: {},
      editItem2: {},
      dialogHistoryVisible: false,
      nameList: [],
      activeName: "first",
      keyWords1: "",
      dialogVisible1: false,
      editFormObj1: {},
      dialogOutListVisible: false,
      editFormOutObj: {},
      isEdit1: false,
      params1: {},
      booksList1: [],
      itList: [],
      itSetList: ["一级文件", "二级文件", "三级文件"],
      itSetList1: [
        {
          name: "全部文件",
          count: 0,
          title: "",
        },
        {
          name: "一级文件",
          count: 0,
          title:
            "管理手册是体系管理的方针，描述体系管理范围、各过程之间相互关系、及各过程所要求形成的文件的控制程序，它对组织机构、程序、活动能力即过程和资源做出规定，它是体系建立和运行的纲领",
        },
        {
          name: "二级文件",
          count: 0,
          title:
            "程序文件是描述实施体系要求所涉及到的职能部门活动和具体程序的文件，对工作程序的细则做出规定",
        },
        {
          name: "三级文件",
          count: 0,
          title:
            "三级文件指实施过程中对体系活动控制的管理性文件依据和技术依据，主要回答依据什么执行的问题,为执行性文件",
        },
      ],
      fileList: [],
      name: "附件",
      limitNums: 1,
      fileList1: [],
      name1: "附件",
      limitNums1: 1,
      name2: "附件",
      limitNums2: 1,
      itList1: [],
      props: {
        label: "name",
        children: "subNodes",
        isLeaf: function (data, node) {
          if (data.isParent === "true") {
            return false;
          } else {
            return true;
          }
        },
      },
      defaultProps: {
        children: "children",
        label: "title",
      },
      expandedList: [],
      isSearch: false,
      filterText: "",
      treeData: [],
      userList: [],
      dialogRecordListVisible: false,
      editFormRecordObj: {},
      rulesRecordname: {
        name: [{ required: true, message: " ", trigger: "blur" }],
        systemid: [{ required: true, message: " ", trigger: "blur" }],
        systemsclause: [{ required: true, message: " ", trigger: "blur" }],
        years: [{ required: true, message: " ", trigger: "blur" }],
      },
      isEdit3: false,
      isEdit2: false,
      fileList2: [],
      params2: {},
      menusTree: [],
      defaultoutProps: {
        children: "sectionChildrens",
        label: "content",
      },
      grandParentId: [],
      dialogTreeVisible: false,
      grandParentName: [],
      deptid: "",
      indexInfo: "",
      deptname: "",
      oneCount: "",
      threeCount: "",
      twoCount: "",
      allCount: "",
      filterText1: "",
      itTypeList: ["体系文件", "其他文件"],
      statusTitle: "",
    };
  },
  mixins: [paginations, fileOperation],
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    username() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .cnname;
    },
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .empuid;
    },
    action() {
      return `${this.host}/attach/upload?username=${this.userid}`;
    },
    ...userInfo.mapGetters(["getUserAuthor"]),
    download() {
      return this.host + "/attach/download/";
    },
  },
  watch:{
    filterText(val){
      this.abstractSearch()
    }
  },
  mounted() {
    this.getList();
    this.getInterList();
    this.gewbSystemList();
    this.getRecordCount();
  },
  methods: {
    txdownloadFile(fileId) {
      return txdownloadFile(fileId);
    },
    clearValidate(){
      this.$refs['form'].clearValidate()
    },
    clearValidate1(){
      this.$refs['formRecord'].clearValidate()
    },
    clearValidate2(){
      this.$refs['formOut'].clearValidate()
    },
    getRecordCount() {
      getRecordCount().then((rt) => {
        for (let i = 0; i < this.itSetList1.length; i++) {
          if (this.itSetList1[i].name === "全部文件") {
            this.itSetList1[i].count = rt.allCount ? rt.allCount : 0;
          } else if (this.itSetList1[i].name === "一级文件") {
            this.itSetList1[i].count = rt.oneCount ? rt.oneCount : 0;
          } else if (this.itSetList1[i].name === "二级文件") {
            this.itSetList1[i].count = rt.twoCount ? rt.twoCount : 0;
          } else if (this.itSetList1[i].name === "三级文件") {
            this.itSetList1[i].count = rt.threeCount ? rt.threeCount : 0;
          }
        }
      });
    },
    uploadFilesList(data) {
      console.log(data)
      this.fileList = data.fileList || [];
      this.editFormObj.fileids = this.fileList[0].fileId;
    },
    uploadFilesList1(data) {
      console.log(data)
      this.fileList1 = data.fileList || [];
      this.editFormOutObj.fileids = this.fileList1[0].fileId;
    },
    uploadFilesList2(data) {
      this.fileList2 = data.fileList || [];
      this.editFormRecordObj.fileids = this.fileList2[0].fileId;
    },
    handleClick() {
      this.pages.pageNum = 1;
      this.pages.total = 0;
      if (this.activeName === "first") {
        this.getList();
      } else if (this.activeName === "second") {
        this.getSecondList();
      } else if (this.activeName === "second") {
        this.getSecondList();
      }
    },
    addDialog() {
      this.dialogVisible = true;
      this.isEdit = true;
      this.editFormObj = {
        createdate: this.getdate(),
        status: "0",
        versions: "V1.0",
        username: JSON.parse(localStorage.getItem("portalCurrentUserInfo"))
          .cnname,
        userid: JSON.parse(localStorage.getItem("portalCurrentUserInfo"))
          .empuid,
      };
      this.fileList = [];
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
    selectList() {},
    singleSearch() {
      this.pages.pageNum = 1;
      this.params = {
        filters: [
          { key: "name", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "systemname", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "dnum", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "datas", opt: "LIKE", type: "S", value: this.keyWords },
        ],
        logic: "or",
      };
      this.getList();
    },
    singleSearch1() {
      this.pages.pageNum = 1;
      this.params1 = {
        filters: [
          { key: "name", opt: "LIKE", type: "S", value: this.keyWords1 },
          { key: "standard", opt: "LIKE", type: "S", value: this.keyWords1 },
          { key: "systemname", opt: "LIKE", type: "S", value: this.keyWords1 },
          { key: "dept", opt: "LIKE", type: "S", value: this.keyWords1 },
          { key: "datas", opt: "LIKE", type: "S", value: this.keyWords1 },
        ],
        logic: "or",
      };
      this.getSecondList();
    },
    getSecondList() {
      this.isEdit1 = true;
      let obj = {
        ...this.params1,
        ...this.pages,
      };
      getexternaldm(obj).then((res) => {
        if (!res) return false;
        this.booksList1 = res.list.map((item) => {
          if (item.createdate) {
            item.createdate = !item.createdate
              ? ""
              : getFormateDate(
                  new Date(item.createdate),
                  "yyyy-MM-dd hh:mm:ss"
                );
          }
          if (item.issue) {
            item.issue = !item.issue
              ? ""
              : getFormateDate(new Date(item.issue), "yyyy-MM-dd");
          }
          return item;
        });
        this.pages.total = res.total;
      });
    },
    getThirdList() {
      this.isEdit2 = true;
      let obj = {
        ...this.params2,
        attr: {
          deptid: this.deptid ? this.deptid : "",
        },
        ...this.pages,
      };
      getrecordingdm(obj).then((res) => {
        if (!res) return false;
        this.userList = res.list.map((item) => {
          if (item.createdate) {
            item.createdate = !item.createdate
              ? ""
              : getFormateDate(
                  new Date(item.createdate),
                  "yyyy-MM-dd hh:mm:ss"
                );
          }
          if (item.years) {
            item.years = !item.years
              ? ""
              : getFormateDate(new Date(item.years), "yyyy");
          }
          return item;
        });
        this.pages.total = res.total;
      });
    },
    addDialog1() {
      this.dialogOutListVisible = true;
      this.isEdit1 = true;
      this.fileList1 = [];
      this.editFormOutObj = {
        createdate: this.getdate(),
        status: "0",
        username: JSON.parse(localStorage.getItem("portalCurrentUserInfo"))
          .cnname,
        userid: JSON.parse(localStorage.getItem("portalCurrentUserInfo"))
          .empuid,
        versions: "V1.0",
      };
      this.$refs['formOut'].clearValidate()
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
      if (this.activeName === "first") {
        this.pages.pageNum = 1;
        this.keyWords = "";
        this.indexInfo = "";
        this.searchForm = {};
        this.params = {};
        this.getList();
      } else if (this.activeName === "second") {
        this.pages.pageNum = 1;
        this.keyWords1 = "";
        this.params1 = {};
        this.getSecondList();
      } else if (this.activeName === "third") {
        this.pages.pageNum = 1;
        this.filterText1 = "";
        this.params2 = {};
        this.getThirdList();
      }
    },
    getList() {
      let obj = {
        ...this.params,
        ...this.pages,
      };
      getinterneldm(obj).then((res) => {
        if (!res) return false;
        this.booksList = res.list.map((item) => {
          if (item.createdate) {
            item.createdate = !item.createdate
              ? ""
              : getFormateDate(
                  new Date(item.createdate),
                  "yyyy-MM-dd hh:mm:ss"
                );
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
          if (!this.editFormObj.fileids) {
            this.$message.error("请上传附件");
            return false;
          }
          if (this.editItem.status === "4") {
            reviseinterneldm(this.editFormObj).then((res) => {
              this.$message({
                type: "success",
                message: "保存成功！",
              });
              this.dialogVisible = false;
              this.getList();
              this.getRecordCount();
            });
          } else {
            saveinterneldm(this.editFormObj).then((res) => {
              this.$message({
                type: "success",
                message: "保存成功！",
              });
              this.dialogVisible = false;
              this.getList();
              this.getRecordCount();
            });
          }
        }
      });
    },
    saveNotice1() {
      this.$refs["formOut"].validate((valid) => {
        if (valid) {
          if (!this.editFormOutObj.fileids) {
            this.$message.error("请上传附件");
            return false;
          }
          if (this.editItem1.status === "4") {
            reviseExternaldm(this.editFormOutObj).then((res) => {
              this.$message({
                type: "success",
                message: "保存成功！",
              });
              this.dialogOutListVisible = false;
              this.getSecondList();
            });
          } else {
            saveExternaldm(this.editFormOutObj).then((res) => {
              this.$message({
                type: "success",
                message: "保存成功！",
              });
              this.dialogOutListVisible = false;
              this.getSecondList();
            });
          }
        }
      });
    },
    saveNotice2() {
      this.$refs["formRecord"].validate((valid) => {
        if (valid) {
          if (!this.editFormRecordObj.fileids) {
            this.$message.error("请上传附件");
            return false;
          }
          if (this.editItem2.status === "4") {
            reviserecordingdm(this.editFormRecordObj).then((res) => {
              this.$message({
                type: "success",
                message: "保存成功！",
              });
              this.dialogRecordListVisible = false;
              this.getThirdList();
            });
          } else {
            saverecordingdm(this.editFormRecordObj).then((res) => {
              this.$message({
                type: "success",
                message: "保存成功！",
              });
              this.dialogRecordListVisible = false;
              this.getThirdList();
            });
          }
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
          interneldmDelete(id).then((res) => {
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
          externaldmDelete(id).then((res) => {
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
    deleteRow2(id) {
      this.$confirm("确认要删除该条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          recordingdmDelete(id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功！",
            });
            this.getThirdList();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDetails(id, type, item) {
      this.editItem = item;
      this.fileList = [];
      getinterneldmList(id).then((res) => {
        if (!res) return false;
        this.editFormObj = res;
        if (type === "修改") {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
        this.fileList = [
          {
            filename: res.list ? res.list.originalName : "",
            filesize: res.list ? res.list.fileSize + "B" : "",
            downloadUrl: this.host + "/attach/download/" + res.fileids,
            status: "已上传",
            fileId: res.fileids ? res.fileids : "",
          },
        ];
        this.dialogVisible = true;
        this.editFormObj = Object.assign({}, this.editFormObj);
      });
    },
    getHisDetails(id, type, item) {
      this.fileList = [];
      getinterneldmList(id).then((res) => {
        if (!res) return false;
        this.editFormObj1 = res;
        this.fileList = [
          {
            filename: res.list ? res.list.originalName : "",
            filesize: res.list ? res.list.fileSize + "B" : "",
            downloadUrl: this.host + "/attach/download/" + res.fileids,
            status: "已上传",
            fileId: res.fileids ? res.fileids : "",
          },
        ];
        this.dialogVisible1 = true;
        this.editFormObj1 = Object.assign({}, this.editFormObj1);
      });
    },
    getDetails1(id, type, item) {
      this.editItem1 = item;
      getexternaldmList(id).then((res) => {
        if (!res) return false;
        this.editFormOutObj = res;
        if (type === "修改") {
          this.isEdit1 = true;
        } else {
          this.isEdit1 = false;
        }
        this.fileList1 = [
          {
            filename: res.list ? res.list.originalName : "",
            filesize: res.list ? res.list.fileSize + "B" : "",
            downloadUrl: this.host + "/attach/download/" + res.fileids,
            status: "已上传",
            fileId: res.fileids ? res.fileids : "",
          },
        ];
        this.dialogOutListVisible = true;
        this.editFormOutObj = Object.assign({}, this.editFormOutObj);
      });
    },
    getDetails2(id, type, item) {
      this.editItem2 = item;
      getrecordingdmList(id).then((res) => {
        if (!res) return false;
        this.editFormRecordObj = res;
        if (type === "修改") {
          this.isEdit2 = true;
        } else {
          this.isEdit2 = false;
        }
        this.fileList2 = [
          {
            filename: res.list ? res.list.originalName : "",
            filesize: res.list ? res.list.fileSize + "B" : "",
            downloadUrl: this.host + "/attach/download/" + res.fileids,
            status: "已上传",
            fileId: res.fileids ? res.fileids : "",
          },
        ];
        this.dialogRecordListVisible = true;
        this.editFormRecordObj = Object.assign({}, this.editFormRecordObj);
      });
    },
    getDetailsList(id, type, item) {
      getSystemwbSystemList(id).then((res) => {
        if (!res) return false;
        this.editFormOutObj = res;
        this.dialogOutListVisible = true;
        this.editFormOutObj = Object.assign({}, this.editFormOutObj);
      });
    },
    handleSizeChange(val) {
      this.pages.pageNum = val;
      if (this.activeName === "first") {
        this.getList();
      } else if (this.activeName === "second") {
        this.getSecondList();
      } else if (this.activeName === "third") {
        this.getThirdList();
      }
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val;
      if (this.activeName === "first") {
        this.getList();
      } else if (this.activeName === "second") {
        this.getSecondList();
      } else if (this.activeName === "third") {
        this.getThirdList();
      }
    },
    // 下发事件
    updateStatus(item, type) {
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
              this.$message({
                type: "success",
                message: "发布成功!",
              });
              this.getList();
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.statusTitle = "是否废止内部管理文件【" + item.name + "】？";
        this.dialogOutVisible = true;
      }
    },
    updateStatus1(item, type) {
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
            startexternaldm({
              id: item.id,
              type: type,
            }).then((res) => {
              if (type === "1") {
                this.$message({
                  type: "success",
                  message: "发布成功!",
                });
              } else {
                this.$message({
                  type: "success",
                  message: "废止成功!",
                });
              }
              this.getSecondList();
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.statusTitle = "是否废止外来文件【" + item.name + "】？";
        this.dialogOutVisible = true;
      }
    },
    updateStatus2(item, type) {
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
            startProcessrecordingdm({
              id: item.id,
              type: type,
            }).then((res) => {
              if (type === "1") {
                this.$message({
                  type: "success",
                  message: "发布成功!",
                });
              } else {
                this.$message({
                  type: "success",
                  message: "废止成功!",
                });
              }
              this.getThirdList();
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.statusTitle = "是否废止记录文件【" + item.name + "】？";
        this.dialogOutVisible = true;
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
      } else if (this.activeName === "second") {
        startexternaldm({
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
      } else if (this.activeName === "third") {
        startProcessrecordingdm({
          id: this.outId,
          reason: this.reason,
          type: this.outStatus,
        }).then((res) => {
          this.$message({
            type: "success",
            message: "废止成功!",
          });
          this.dialogOutVisible = false;
          this.getThirdList();
        });
      }
      //   }
      // })
    },
    detailsHistory() {
      if (this.editFormObj.systemid) {
        getDetails(this.editFormObj.versionid).then((rt) => {
          this.nameList = rt;
          this.dialogHistoryVisible = true;
        });
      } else {
        this.$message.error("当前暂无历史版本");
      }
    },
    getInterList() {
      getInterList({
        pageSize: 9999,
        pageNum: 1,
        total: 100,
      }).then((res) => {
        this.itList = res.list;
      });
    },
    gewbSystemList() {
      getWbSystemListOut({
        pageNum: 1,
        pageSize: 9999,
      }).then((res) => {
        this.itList1 = res.list.map((item) => {
          if (item.issue) {
            item.issue = !item.issue
              ? ""
              : getFormateDate(new Date(item.issue), "yyyy-MM-dd");
          }
          return item;
        });
      });
    },
    handleSelect() {
      let data = this.itList.find((i) => i.id === this.editFormObj.systemid);
      this.editFormObj.systemname = data.name;
      this.editFormObj.datas = data.datas;
    },
    handleSelectType() {
      if (this.editFormObj.types === "一级文件") {
        let data = this.itList.find((i) => i.id === this.editFormObj.systemid);
        this.editFormObj.dnum = data.num;
      }
    },
    handleSelect1() {
      let data = this.itList1.find(
        (i) => i.id === this.editFormOutObj.systemid
      );
      this.editFormOutObj.standard = data.standard;
      this.editFormOutObj.systemname = data.name;
      this.editFormOutObj.datas = data.datas;
      if (this.editFormOutObj.type === "体系文件") {
        this.editFormOutObj.dept = data.dept;
        this.editFormOutObj.issue = data.issue;
      } else {
        this.editFormOutObj.dept = "";
        this.editFormOutObj.issue = "";
      }
    },
    handleTypeChange() {
      let data = this.itList1.find(
        (i) => i.id === this.editFormOutObj.systemid
      );
      if (this.editFormOutObj.type === "体系文件") {
        this.editFormOutObj.dept = data.dept;
        this.editFormOutObj.issue = data.issue;
      } else {
        this.editFormOutObj.dept = "";
        this.editFormOutObj.issue = "";
      }
    },
    handleSelect2() {
      let data = this.itList.find(
        (i) => i.id === this.editFormRecordObj.systemid
      );
      this.editFormRecordObj.systemname = data.name;
      this.editFormRecordObj.datas = data.datas;
    },
    getFilterTreeList(node, resolve) {
      let id = node.data ? node.data.id : "0";
      getTreeList(id).then((res) => {
        if (!res) return false;
        if (id === "0") {
          this.expandedList = [res[0].id];
        }
        resolve(res);
      });
    },
    abstractSearch() {
      if (!this.filterText) {
        this.isSearch = false
        return false
      }
      if (this.filterText) {
        abstractSearch({ orgname: this.filterText }).then((res) => {
          this.isSearch = true
          this.treeData = res;
        });
      } else {
        this.isSearch = false;
      }
    },
    // refTree(data) {
    //   console.log(data);
    //   if (data.type === "0") {
    //     this.isFilter = true;
    //     this.filterText = "";
    //     this.abstractSearch();
    //   }
    //   if (this.isFilter) {
    //     const node = this.$refs.tree.getNode(this.itemData.id); // 通过节点id找到对应树节点对象
    //     this.$set(data, "pid", node.data.id);
    //     if (this.linkTitle === this.$t("hintText.editCurrentEntry")) {
    //       this.$set(node.data, "name", data.name);
    //     } else {
    //       this.$refs.tree.append(data, node);
    //       this.refNode(data);
    //     }
    //   } else {
    //     this.abstractSearch();
    //   }
    // },
    isLeaf(data, node) {},
    addDialog2() {
      if (this.deptid) {
        this.dialogRecordListVisible = true;
        this.fileList2 = [];
        this.isEdit2 = true;
        this.editFormRecordObj = {
          deptid: this.deptid,
          deptname: this.deptname,
          createdate: this.getdate(),
          status: "0",
          username: JSON.parse(localStorage.getItem("portalCurrentUserInfo"))
            .cnname,
          userid: JSON.parse(localStorage.getItem("portalCurrentUserInfo"))
            .empuid,
          versions: "V1.0",
        };
      } else {
        this.$message.error("请先选择单位！！");
      }
      this.$refs['formRecord'].clearValidate()
    },
    selectSystem() {
      if (this.editFormRecordObj.systemid) {
        getSystemTree(this.editFormRecordObj.systemid).then((res) => {
          this.menusTree = [res];
          this.grandParentId = [this.editFormRecordObj.systemsclauseid];
          this.grandParentContent = [
            {
              id: this.editFormRecordObj.systemsclauseid,
              content: this.editFormRecordObj.systemsclause,
            },
          ];
          this.dialogTreeVisible = true;
        });
      } else {
        this.$message.error("请先选择相关体系！！");
      }
    },
    handleNodeCheck(
      checkedNodes,
      checkedKeys,
      halfCheckedNodes,
      halfCheckedKeys
    ) {
      console.log(checkedNodes)
      console.log(checkedKeys)
      console.log(halfCheckedNodes)
      console.log(halfCheckedKeys)
      this.grandParentId = checkedKeys.checkedKeys;
      this.grandParentName = checkedKeys.checkedNodes;
    },
    handlerConfirmDialog() {
      if (this.grandParentId && this.grandParentId.length === 1) {
        this.editFormRecordObj.systemsclauseid = this.grandParentId[0];
        this.editFormRecordObj.systemsclause = this.grandParentName[0].content;
        this.dialogTreeVisible = false;
      } else {
        this.$message.error("请选择一条体系条款！！");
      }
    },
    handlerNodeClick(node, item) {
      this.deptid = node.id;
      this.deptname = node.name;
      this.getThirdList();
    },
    queryFile(index) {
      this.pages.pageNum = 1;
      this.indexInfo = index;
      this.keyWords = "";
      if (index === 0) {
        this.params = {};
      } else {
        this.params = {
          filters: [
            {
              key: "types",
              opt: "LIKE",
              type: "S",
              value: this.itSetList1[index].name,
            },
          ],
        };
      }
      this.getList();
    },
    searchFiles() {
      this.pages.pageNum = 1;
      this.params2 = {
        filters: [
          { key: "name", opt: "LIKE", type: "S", value: this.filterText1 },
          {
            key: "systemname",
            opt: "LIKE",
            type: "S",
            value: this.filterText1,
          },
        ],
        logic: "or",
      };
      this.getThirdList();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-tree-node > .el-tree-node__children {
  overflow: visible;
}
.custom-tree-node {
  height: 100%;
  position: relative;
  .opertionBtn {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    min-width: 50px;
    display: flex;
    display: none;
    justify-content: space-between;
    align-items: center;
    i {
      display: inline-block;
      height: 14px;
      padding: 0;
      margin: 0;
      &:hover {
        background: none;
        font-weight: bold;
      }
    }
  }
  &:hover {
    .opertionBtn {
      display: flex;
    }
  }
}
.custom-tree-node {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .grow {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 70px;
  }
  .add {
    color: $tc5;
    padding: 5px;
    display: none;
    &:hover {
      background: $dc1;
    }
  }
  .del {
    color: $tc4;
    padding: 5px;
    display: none;
    &:hover {
      background: $dc1;
    }
  }
  &:hover {
    .add {
      display: inherit;
    }
    .del {
      display: inherit;
    }
  }
}
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
      border: 3px solid $bc5;
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
        border-bottom: 1px solid $bc5;
        div {
          flex: 1;
          padding: 10px;
        }
        div:last-child {
          border-left: 1px solid $bc5;
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
          color: $bc5;
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
          border-left: 1px solid $bc5;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.inside_all_span {
  .inside_item_span {
    font-weight: 600 !important;
    &:hover {
      color: #4ba2ef;
      cursor: pointer;
    }
  }
}

</style>
