<template>
  <div id="handbookFiles" class="w100">
    <el-row :gutter="10">
      <el-col :span="4">
        <div class="left_tree_wrapper">
          <enter-tree @conClick="nodeClick" />
        </div>
      </el-col>
      <el-col :span="20">
        <!--<el-scrollbar class="rightPart">-->
        <el-row>
          <el-col :span="12">
            <el-input
              v-model="keyWords"
              :placeholder="$t('standardNumber')"
              :title="$t('standardNumber')"
              class="search_component"
              clearable
              @keyup.13.native="getList"
            >
              <el-button
                slot="append"
                type="primary"
                @click="
                  pages.pageNum = 1;
                  getList();
                "
              >
                {{ $t("search") }}</el-button
              >
            </el-input>
          </el-col>
          <el-col :span="12" class="search_buttons_wrap">
            <el-button type="primary" @click="isHighSearch = !isHighSearch">
              {{ $t("advancedQuery") }}
              <i
                :class="
                  isHighSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                "
              ></i>
            </el-button>
            <el-button type="primary" @click="addDialog">
              {{ $t("add") }}
            </el-button>
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
                <el-form-item :label="$t('standardNumber')">
                  <el-input v-model="searchForm.doctitle" clearable />
                </el-form-item>
              </el-col>
              <!--<el-col :span="8">-->
              <!--<el-form-item label="发布人">-->
              <!--<el-input v-model="searchForm.provideruser" clearable></el-input>-->
              <!--</el-form-item>-->
              <!--</el-col>-->
              <!--<el-col :span="8">-->
              <!--<el-form-item label="拟制人">-->
              <!--<el-input v-model="searchForm.authorname" clearable></el-input>-->
              <!--</el-form-item>-->
              <!--</el-col>-->
              <!--</el-row>-->
              <!--<el-row>-->
              <el-col :span="8">
                <el-form-item :label="$t('state')">
                  <el-select v-model="searchForm.status" clearable>
                    <el-option :label="$t('newAdd')" value="1" />
                    <!--                    <el-option :label="$t('beingProcessed')" value="2"></el-option>-->
                    <el-option :label="$t('published')" value="3" />
                    <!--                    <el-option :label="$t('underRevision')" value="4"></el-option>-->
                    <!--                    <el-option :label="$t('haveBeenVoided')" value="5"></el-option>-->
                  </el-select>
                </el-form-item>
              </el-col>
              <!--<el-col :span="8">-->
              <!--<el-form-item label="部门">-->
              <!--<el-input v-model="searchForm.deptname" clearable></el-input>-->
              <!--</el-form-item>-->
              <!--</el-col>-->
              <el-col :span="8">
                <el-form-item :label="$t('standardLevel')">
                  <el-input v-model="searchForm.system" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <!--<el-row>-->
            <!--<el-col :span="8">-->
            <!--<el-form-item label="生效日期">-->
            <!--<el-date-picker-->
            <!--clearable-->
            <!--value-format="yyyy-MM-dd"-->
            <!--v-model="searchForm.value1"-->
            <!--type="daterange"-->
            <!--range-separator="-"-->
            <!--start-placeholder="开始日期"-->
            <!--end-placeholder="结束日期"-->
            <!--&gt;</el-date-picker>-->
            <!--</el-form-item>-->
            <!--</el-col>-->
            <!--</el-row>-->
            <div class="search_buttons_wrap">
              <el-button type="primary" @click="highSearch">
                {{ $t("search") }}
              </el-button>
              <el-button type="primary" @click="reset">
                {{ $t("reset") }}
              </el-button>
            </div>
          </el-form>
        </el-collapse-transition>
        <!-- 信息表格 -->
        <el-table :data="booksList" border class="main_tab">
          <el-table-column :label="$t('number')" type="index" />
          <el-table-column prop="foldertype" :label="$t('standardElements')">
            <!--<el-table-column prop="type" label="1"></el-table-column>-->
            <!--<el-table-column prop="type" label="2"></el-table-column>-->
            <!--<el-table-column prop="type" label="3"></el-table-column>-->
          </el-table-column>
          <!--<el-table-column prop="title" label="标准项目">-->
          <el-table-column prop="title" :label="$t('standardNumber')" />
          <el-table-column prop="enname" :label="$t('standardName')" />
          <!--</el-table-column>-->
          <el-table-column prop="system" :label="$t('standardLevel')" />
          <el-table-column
            prop="officicalTitle"
            :label="$t('standardClassify')"
          >
            <!--<el-table-column prop="officicalTitle" label="1"></el-table-column>-->
            <!--<el-table-column prop="officicalTitle" label="2"></el-table-column>-->
            <!--<el-table-column prop="officicalTitle" label="3"></el-table-column>-->
          </el-table-column>
          <el-table-column
            prop="docnum"
            :label="$t('adaptableAutomobileMode')"
          />
          <el-table-column prop="publishType" :label="$t('lifeCyclePhase')" />
          <el-table-column prop="filelevel" :label="$t('digitization')">
            <!--<el-table-column prop="filelevel" label="1"></el-table-column>-->
            <!--<el-table-column prop="filelevel" label="2"></el-table-column>-->
          </el-table-column>
          <el-table-column :label="$t('fileName')">
            <template slot-scope="scope">
              <a target="_blank" :href="viewFile(scope.row.docId)">{{
                scope.row.filename
              }}</a>
              <el-tooltip
                :open-delay="1000"
                class="item margin-l5"
                effect="dark"
                :content="$t('download')"
                placement="top"
              >
                <a :href="downloadUrl(scope.row.docId)">
                  <i class="el-icon-download" />
                </a>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('state')">
            <template slot-scope="scope">
              {{ scope.row.status | regState }}
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('operation')">
            <template slot-scope="scope">
              <el-tooltip
                v-if="
                  !!scope.row.authorname[0]
                    ? scope.row.authorname[0].userid == userid ||
                      getUserAuthor.indexOf('3') > -1
                      ? scope.row.status == 1 ||
                        scope.row.status == 3 ||
                        scope.row.status == 4 ||
                        scope.row.status == 7 ||
                        scope.row.status == 6
                      : false
                    : false
                "
                :open-delay="1000"
                class="item"
                effect="dark"
                :content="$t('modify')"
                placement="top"
              >
              <!-- class="no-border"
                  icon="el-icon-edit iconClass"
                  circle -->
                <el-button
                  type="text"
                  @click="getDetails(scope.row.docId)"
                >{{
                  $t("modify")
                }}</el-button>
              </el-tooltip>
              <el-tooltip
                v-if="
                  scope.row.status == 1 ||
                  scope.row.status == 4 ||
                  scope.row.status == 6
                "
                :open-delay="1000"
                class="item"
                effect="dark"
                :content="$t('publish')"
                placement="top"
              >
                <!-- class="no-border"
                  icon="el-icon-s-promotion iconClass"
                  circle -->
                <el-button type="text" @click="publishReg(scope.row)">{{
                  $t("publish")
                }}</el-button>
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.status == 1"
                :open-delay="1000"
                class="item"
                effect="dark"
                :content="$t('delete')"
                placement="top"
              >
              <!-- class="no-border"
                  icon="el-icon-delete iconClass"
                  circle -->
                <el-button
                  type="text"
                  @click="deleteRow(scope.row.docId)"
                >{{
                  $t("delete")
                }}</el-button>
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.status == 3 || scope.row.status == 7"
                :open-delay="1000"
                class="item"
                effect="dark"
                :content="$t('invalid')"
                placement="top"
              >
              <!-- class="no-border"
                  icon="el-icon-error iconClass"
                  circle -->
                <el-button
                  type="text"
                  @click="abolishRow(scope.row)"
                >{{
                  $t("invalid")
                }}</el-button>
              </el-tooltip>
              <!--生产环境隐藏-->
              <!--<el-tooltip :open-delay="1000" class="item" effect="dark" content="讨论" placement="top" v-if="scope.row.status == 2 || scope.row.status == 3 || scope.row.status == 4">-->
              <!--<el-button-->
              <!--@click="abolishRow(scope.row)"-->
              <!--class="no-border"-->
              <!--icon="fa fa-comments iconClass"-->
              <!--circle-->
              <!--&gt;</el-button>-->
              <!--</el-tooltip>-->
              <!--<el-tooltip :open-delay="1000" class="item" effect="dark" content="考试" placement="top" v-if="scope.row.status == 3 || scope.row.status == 6">-->
              <!--<el-button-->
              <!--@click="abolishRow(scope.row)"-->
              <!--class="no-border"-->
              <!--icon="fa fa-tasks iconClass"-->
              <!--circle-->
              <!--&gt;</el-button>-->
              <!--</el-tooltip>-->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :current-page.sync="pages.pageNum"
          :page-sizes="[10, 15, 20]"
          :page-size="pages.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pages.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <!--</el-scrollbar>-->
      </el-col>
    </el-row>
    <!-- 添加弹框 -->
    <el-dialog
      v-loading="loading"
      title="企业标准添加"
      :visible.sync="dialogVisible"
      width="65%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="form"
        :model="editFormObj"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item :label="$t('standardNumber')" prop="docTitle">
          <el-input
            v-model="editFormObj.docTitle"
            maxlength="50"
            clearable
            @input="descInput1"
          />
        </el-form-item>
        <el-form-item :label="$t('standardName')" prop="enname">
          <el-input
            v-model="editFormObj.enname"
            maxlength="50"
            clearable
            @input="descInput2"
          />
        </el-form-item>
        <el-form-item :label="$t('standardElements')">
          <el-input v-model="type" disabled />
        </el-form-item>
        <el-form-item :label="$t('standardLevel')">
          <el-input v-model="editFormObj.system" clearable />
        </el-form-item>
        <el-form-item :label="$t('standardClassify')">
          <el-input v-model="editFormObj.value1" clearable />
        </el-form-item>
        <el-form-item :label="$t('adaptableAutomobileMode')">
          <el-input v-model="editFormObj.value2" clearable />
        </el-form-item>
        <el-form-item :label="$t('lifeCyclePhase')">
          <el-input v-model="editFormObj.value3" clearable />
        </el-form-item>
        <el-form-item :label="$t('digitization')">
          <el-input v-model="editFormObj.value4" clearable />
        </el-form-item>
        <!--<el-form-item label="生效日期" prop="effectiveDate">-->
        <!--<el-date-picker-->
        <!--v-model="editFormObj.effectiveDate"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--type="date"-->
        <!--placeholder="选择日期"-->
        <!--&gt;</el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('bpa_mainDocument')" required>
          <el-upload
            :action="action"
            :on-success="handlerFileUploadSuccess"
            :on-error="handlerFileUploadError"
            :before-upload="handlerFileUploadBefore"
            :show-file-list="false"
          >
            <el-button size="mini" type="primary">
              {{ $t("bpa_clickUpload") }}
            </el-button>
          </el-upload>
        </el-form-item>
        <el-table class="main_tab" :data="fileList">
          <el-table-column prop="filename" :label="$t('fileName')" />
          <el-table-column prop="filesize" :label="$t('fileSize')" />
          <el-table-column prop="status" :label="$t('uploadStatus')" />
          <el-table-column :label="$t('operation')">
            <template slot-scope="scope">
              <el-tooltip
                :open-delay="1000"
                class="item"
                effect="dark"
                :content="$t('delete')"
                placement="top"
              >
                <el-button
                  class="no-border"
                  icon="el-icon-delete"
                  circle
                  @click="deleteFile"
                />
              </el-tooltip>
              <el-tooltip
                :open-delay="1000"
                class="item"
                effect="dark"
                :content="$t('download')"
                placement="top"
              >
                <a :href="downloadUrl(scope.row.fileId)" download>
                  <el-button class="no-border" icon="el-icon-download" circle />
                </a>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t("cancel") }}</el-button>
        <el-button type="primary" :disabled="isSaving" @click="saveBooks">{{
          $t("confirm")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBooksList,
  saveBooks,
  deleteBooks,
  getDetails,
  pblishRefuse,
  abolishRefuse,
  getRuleIframeTree,
} from "@/bpa/api/rulesCenter/handbookFiles";
import enterTree from "./components/index.vue";
import paginations from "@/bpa/mixins/pagination_mixin";
import fileOperation from "@/bpa/mixins/fileDownView";
import { getFormateDate } from "@/bpa/utils/common";
import { createNamespacedHelpers } from "vuex";

import { updateStatusRule } from "@/bpa/api/common";

// 控制流程审批的方式
import { requireProcess } from "@/bpa/api/settings/processApprovalManage";

const userInfo = createNamespacedHelpers("userInfo");
export default {
  components: {
    enterTree,
  },
  mixins: [paginations, fileOperation],
  data() {
    return {
      // 组织树
      props: {
        label: "foldername",
        isLeaf: function (data, node) {
          if (data.parent === true) {
            return false;
          } else {
            return true;
          }
        },
      },
      modelid: "",
      booksList: [],
      keyWords: "",
      type: "",
      dialogVisible: false,
      isHighSearch: false,
      fileList: [],
      searchForm: {
        doctitle: "",
        enname: "",
        provideruser: "",
        authorname: "",
        docAuthorDis: "",
        deptname: "",
        system: "",
        status: "",
        fordertype: "",
        effectivedate: "",
      },
      editFormObj: {
        // effectiveDate: '',
        checkList: [],
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      rules: {
        docTitle: [{ required: true, message: " ", trigger: "blur" }],
        enname: [{ required: true, message: " ", trigger: "blur" }],
        // effectiveDate: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      // 判断是否修改主文档
      referMainDoc: false,
      processType: "",
      loading: false,
      isSaving: false,
    };
  },
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
      return `${this.host}/regulation/upload?username=${this.userid}`;
    },
    ...userInfo.mapGetters(["getUserAuthor"]),
    download() {
      return this.host + "/regulation/download/";
    },
  },
  mounted() {
    // 获取当前登录人权限
    this.requireAuthoriy();
    // 审批方式
    this.getprocessType();
  },
  methods: {
    ...userInfo.mapActions(["requireAuthoriy"]),
    downloadUrl(fileid) {
      return `${this.host}/regulation/download/${fileid}?username=${this.userid}`;
    },
    nodeClick(obj) {
      console.log(obj.node, obj.data);
      const self = this;
      if (obj.data) {
        self.modelid = obj.data.id;
        self.type = obj.data.foldername;
        this.getList();
      }
    },
    // 控制流程审批的方式
    getprocessType() {
      requireProcess({
        filters: [
          { key: "name", opt: "LIKE", type: "S", value: "手册及体系文件" },
        ],
      }).then((res) => {
        if (!res) return false;
        this.processType = res.list[0].choosed;
      });
    },
    addDialog() {
      this.dialogVisible = true;
      this.referMainDoc = false;
      this.fileList = [];
      this.editFormObj = {
        docTitle: "",
        enname: "",
        // effectiveDate: '',
        checkList: [],
      };
    },
    // singleSearch() {
    //   this.pages.pageNum = 1
    //   let obj = {
    //     orderby: 'createon',
    //     pageNum: this.pages.pageNum,
    //     pageSize: this.pages.pageSize,
    //     sort: 'desc',
    //     filters: [
    //       { key: 'title', opt: 'LIKE', type: 'S', value: this.keyWords },
    //       { key: 'provideruser', opt: 'LIKE', type: 'S', value: '' },
    //       { key: 'authorname', opt: 'LIKE', type: 'S', value: '' },
    //       { key: 'status', opt: 'LIKE', type: 'S', value: '' },
    //       { key: 'deptname', opt: 'LIKE', type: 'S', value: '' },
    //       { key: 'effectivedate', opt: 'BETWEEN', type: 'D', value: '' }
    //     ],
    //     attr: { folderid: '5001' },
    //     logic: 'or'
    //   }
    //   getBooksList(obj).then(res => {
    //     console.log(res)
    //     if (!res) return false
    //     this.booksList = res.list.map(item => {
    //       item.effectiveion = !item.effectiveion
    //         ? ''
    //         : getFormateDate(new Date(item.effectiveion), 'yyyy-MM-dd')
    //       return item
    //     })
    //     this.pages.total = res.total
    //   })
    // },
    // 高级搜索
    highSearch() {
      this.pages.pageNum = 1;
      const obj = {
        attr: { folderid: this.modelid },
        orderby: "createon",
        pageNum: 1,
        pageSize: 10,
        sort: "desc",
        logic: "and",
        filters: [
          {
            key: "title",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.doctitle,
          },
          // 发布人
          {
            key: "provideruser",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.provideruser,
          },
          // 拟制人
          {
            key: "authorname",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.authorname,
          },
          // 部门
          {
            key: "deptname",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.deptname,
          },
          // 状态
          {
            key: "status",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.status,
          },
          // 体系分类
          {
            key: "system",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.system,
          },
          // 生效日期
          {
            key: "effectivedate",
            opt: "BETWEEN",
            type: "D",
            value:
              this.searchForm.value1 && this.searchForm.value1.length
                ? this.searchForm.value1[0] + "~" + this.searchForm.value1[1]
                : "",
          },
        ],
      };
      getBooksList(obj).then((res) => {
        if (!res) return false;
        this.booksList = res.list.map((item) => {
          item.effectiveion = !item.effectiveion
            ? ""
            : getFormateDate(new Date(item.effectiveion), "yyyy-MM-dd");
          return item;
        });
        this.pages.total = res.total;
      });
    },
    reset() {
      this.pages.pageNum = 1;
      this.searchForm = {
        doctitle: "",
        enname: "",
        provideruser: "",
        docAuthorDis: "",
        status: "",
        name: "",
        value1: [],
      };
      this.getList();
    },
    getList() {
      const obj = {
        orderby: "createon",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: "desc",
        filters: [
          { key: "title", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "provideruser", opt: "LIKE", type: "S", value: "" },
          { key: "authorname", opt: "LIKE", type: "S", value: "" },
          { key: "status", opt: "LIKE", type: "S", value: "" },
          { key: "deptname", opt: "LIKE", type: "S", value: "" },
          { key: "effectivedate", opt: "BETWEEN", type: "D", value: "" },
        ],
        attr: { folderid: this.modelid },
      };
      getBooksList(obj).then((res) => {
        if (!res) return false;
        this.booksList = res.list.map((item) => {
          item.effectiveion = !item.effectiveion
            ? ""
            : getFormateDate(new Date(item.effectiveion), "yyyy-MM-dd");
          return item;
        });
        this.pages.total = res.total;
        console.log(this.booksList);
      });
    },
    // 确认添加
    saveBooks() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // // 生效日期验证
          // if (this.editFormObj.effectiveDate.length === 0) {
          //   this.$message({
          //     type: 'warning',
          //     message: '日期未选择！'
          //   })
          //   return
          // }
          // // 主文档验证
          if (this.fileList.length !== 1) {
            this.$message({
              type: "warning",
              message: this.$t("hintText.pleaseUploadtheMainDocument"),
            });
            return;
          }
          // let obj = {
          //   docId: !this.editFormObj.docId ? '' : this.editFormObj.docId,
          //   docTitle: this.editFormObj.docTitle,
          //   fileId: this.referMainDoc ? this.fileList[0].fileId : '',
          //   inDate: getFormateDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          //   folderDocumentList: [{ documentid: '', folderid: this.modelid }],
          //   enname: this.editFormObj.enname,
          //   signerlist: [{ userid: this.userid, cnname: this.username }],
          //   system: this.editFormObj.checkList.toString(),
          //   effectiveDate: !this.editFormObj.effectiveDate
          //     ? ''
          //     : getFormateDate(
          //       new Date(this.editFormObj.effectiveDate),
          //       'yyyy-MM-dd hh:mm:ss'
          //     )
          // }
          const obj = {
            docId: !this.editFormObj.docId ? "" : this.editFormObj.docId,
            ...this.editFormObj,
            effectiveDate: getFormateDate(
              new Date(new Date()),
              "yyyy-MM-dd hh:mm:ss"
            ),
            fileId: this.referMainDoc ? this.fileList[0].fileId : "",
            folderDocumentList: [{ documentid: "", folderid: this.modelid }],
          };
          this.isSaving = true;
          saveBooks(obj)
            .then((res) => {
              this.isSaving = false;
              if (res) {
                this.$message({
                  type: "success",
                  message: this.$t("hintText.saveSuccessfully"),
                });
                this.dialogVisible = false;
                this.getList();
              }
            })
            .catch(() => {
              this.isSaving = false;
            });
        } else {
          this.$message({
            type: "warning",
            message: this.$t("hintText.requiredFieldsCannotBeEmpty"),
          });
        }
      });
    },
    deleteFile() {
      this.fileList = [];
    },
    // 删除表格某一行数据
    deleteRow(id) {
      this.$confirm(
        this.$t("hintText.areYouSureDelete"),
        this.$t("hintText.hint"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(() => {
          deleteBooks(id).then((res) => {
            if (res) {
              this.$message({
                type: "success",
                message: this.$t("hintText.successfullyDelete"),
              });
              this.getList();
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 作废
    abolishRow(item) {
      const me = this;
      this.$confirm(
        this.$t("hintText.areYouSureYouWantToInvalidateThisInformation"),
        this.$t("hintText.hint"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(() => {
          switch (true) {
            case me.processType === "bpm":
              // if (item.status == 7) {
              //   abolishRefuse({
              //     docid: item.docId,
              //     type: 'docid',
              //     userid: userId,
              //     newdocid: item.docId
              //   }).subscribe(res => {
              //     let openUrl = `${process.env.URL_BAS_HOST}${Base64.encode(
              //       userId + '●password1'
              //     )}&param=${Base64.encode(res.url + '&lang=zh-CN')}`
              //     window.open(openUrl)
              //   })
              // } else {
              //   let urlStr = `/bpm/creater-process!apply.action?processname=Departmentdutiesprocess&processnodename=Start&projectname=departmentdutiesprocess&defaultOrganization=39390&baProcessId=${item.docId}&state=5&lang=zh-CN`
              //   let openUrl = `${process.env.URL_BAS_HOST}${Base64.encode(
              //     userId + '●password1'
              //   )}&param=${Base64.encode(urlStr)}`
              //   window.open(openUrl)
              // }
              break;
            case me.processType === "direct":
              updateStatusRule({
                id: item.docId,
                status: 5,
              }).then((res) => {
                if (!res) return false;
                this.$message({
                  type: "success",
                  message: this.$t("hintText.invalidSuccess"),
                });
                this.keyWords = "";
                this.reset();
              });
              break;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 修改功能
    getDetails(id) {
      console.log(id);
      this.referMainDoc = false;
      getDetails(id).then((res) => {
        console.log(res);
        if (!res) return false;
        this.editFormObj = res;
        this.dialogVisible = true;
        this.editFormObj = Object.assign({}, this.editFormObj, {
          docTitle: res.title,
          effectiveDate: getFormateDate(
            new Date(res.effectiveion),
            "yyyy-MM-dd"
          ),
          docId: res.docId,
          checkList: !res.system ? [] : res.system.split(","),
        });
        this.fileList = res.docFile.map((item) => {
          return {
            filename: item.originalname,
            filesize: item.fileSize + "B",
            downloadUrl: item.downloadUrl,
            status: "已上传",
            fileId: res.docId,
          };
        });
        // console.log(this.fileList)
      });
    },
    // 上传失败
    handlerFileUploadError(err, file, fileList) {
      this.loading = false;
      this.$message({
        type: "warning",
        message: this.$t("hintText.attachmentUploadedfailed"),
        // message: '主文档上传失败'
      });
    },
    // 上传前
    handlerFileUploadBefore(res) {
      console.log(res);
      this.loading = true;
    },
    handlerFileUploadSuccess(res) {
      console.log(res);
      this.loading = false;
      if (this.fileList.length === 1) {
        this.$message({
          type: "warning",
          message: this.$t("hintText.pleaseDeleteItAndUploadItAgain"),
        });
      } else {
        console.log(res);
        this.referMainDoc = true;
        this.fileList.push({
          filename: res.data.newName,
          filesize: res.data.size + "B",
          downloadUrl: this.host + "/regulation/download/" + res.data.id,
          status: this.$t("uploaded"),
          fileId: res.data.id,
        });
      }
    },
    // 发布事件
    publishReg(item) {
      const me = this;
      this.$confirm(
        this.$t("hintText.areYouSureYouWantToRelease"),
        this.$t("hintText.hint"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(() => {
          switch (true) {
            case me.processType === "bpm":
              // if (item.status == 6) {
              //   pblishRefuse({
              //     docid: item.docId,
              //     type: 'docid',
              //     userid: userId,
              //     newdocid: item.docId
              //   }).subscribe(res => {
              //     let openUrl = `${process.env.URL_BAS_HOST}${Base64.encode(
              //       userId + '●password1'
              //     )}&param=${Base64.encode(res.url + '&lang=zh-CN')}`
              //     window.open(openUrl)
              //   })
              // } else {
              //   let urlStr = `/bpm/creater-process!apply.action?processname=Manualsystemprocess&processnodename=Start&projectname=manualsystemprocess&defaultOrganization=39390&baProcessId=${
              //     item.docId
              //   }&state=${item.status == 1 ? 3 : 4}&lang=zh-CN`
              //   let openUrl = `${process.env.URL_BAS_HOST}${Base64.encode(
              //     userId + '●password1'
              //   )}&param=${Base64.encode(urlStr)}`
              //   window.open(openUrl)
              // }
              break;
            case me.processType === "direct":
              updateStatusRule({
                id: item.docId,
                status: 3,
              }).then((res) => {
                if (!res) return false;
                this.$message({
                  type: "success",
                  message: this.$t("hintText.releaseSuccess"),
                });
                this.keyWords = "";
                this.reset();
              });
              break;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 文本框字数限制
    descInput1(editFormObj) {
      if (this.editFormObj.docTitle.length > this.textMaxLength) {
        this.$message({
          message: this.$t("hintText.fieldNameShouldNotExceedFiftyWords"),
          type: "error",
        });
      }
    },
    descInput2(editFormObj) {
      if (this.editFormObj.enname.length > this.textMaxLength) {
        this.$message({
          message: this.$t("hintText.fieldNameShouldNotExceedFiftyWords"),
          type: "error",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.left_tree_wrapper {
  height: calc(100vh - 160px) !important;
  overflow: auto;
  .custom-tree-node {
    width: calc(100% - 24px);
    display: flex;
    align-items: center;
    box-sizing: border-box;
    p {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.rightPart {
  height: calc(100vh - 160px) !important;
}
.el-scrollbar__bar.is-horizontal > div {
  width: auto;
}
</style>
