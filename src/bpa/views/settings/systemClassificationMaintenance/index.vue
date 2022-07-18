<template>
  <div class="systemClassificationMaintenance">
    <el-row>
      <el-col :span="6">
        <el-input
          :placeholder="enterTheSystemName"
          :title="enterTheSystemName"
          class="search_component"
          v-model="input3"
          clearable
          @keyup.13.native="searchSystem"
        >
          <el-button type="primary" slot="append" @click="searchSystem">
            {{ $t("search") }}</el-button
          >
        </el-input>
      </el-col>
      <el-col :span="6" :offset="12" class="search_buttons_wrap">
        <el-button type="primary" @click="addDialogFormVisible = true">{{
          $t("add")
        }}</el-button>
        <el-button type="primary" @click="mutipleDelteRows">{{
          $t("batchDelete")
        }}</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :header-row-style="{
        'font-weight': '700',
        color: '#000',
      }"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        type="index"
        prop="序号"
        :label="number"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="system_name"
        :label="systemName"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="system_cnname"
        :label="systemChineseName"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="system_enname"
        :label="systemEnglishName"
        align="center"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="system_no"
        :label="systemNumber"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="process_design_is_visible"
        :label="processDesignVisible"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.process_design_is_visible == "Y" ? "是" : "否"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rule_is_visible"
        :label="regulationsVisible"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.rule_is_visible == "Y" ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="filename"
        :label="attachment"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <a :href="downloadFile(scope.row.fileid)">{{ scope.row.filename }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateon"
        :label="updateTime"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.updateon == null
              ? scope.row.createon
              : scope.row.updateon | getFormateDate
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        :label="operation"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="edit2"
            placement="top"
          >
            <!-- icon="el-icon-edit" class="no-border" -->
            <el-button type="text" @click="editSystem(scope.row.id)">{{
              edit2
            }}</el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="delete2"
            placement="top"
          >
            <el-button type="text" @click="deleteSystem(scope.row.id)">{{
              delete2
            }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页码 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.pageNum"
      :page-size="pages.pageSize"
      background
      layout="prev, pager, next, jumper, total"
      :total="pages.total"
    >
    </el-pagination>
    <!-- 添加弹框 -->
    <el-dialog
      :title="addSystemClassification"
      :visible.sync="addDialogFormVisible"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @open="resetForm('addForm', 'addFileList')"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="150px"
        label-position="right"
        class="newForm"
        :rules="addrules"
      >
        <el-form-item :label="systemName" prop="system_name">
          <el-col>
            <el-input
              clearable
              v-model="addForm.system_name"
              autofocus="true"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item :label="systemChineseName" prop="system_cnname">
          <el-col>
            <el-input
              clearable
              v-model="addForm.system_cnname"
              autofocus="true"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item :label="systemEnglishName" prop="system_enname">
          <el-col>
            <el-input
              clearable
              v-model="addForm.system_enname"
              autofocus="true"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item :label="systemNumber" prop="system_no">
          <el-col>
            <el-input
              clearable
              v-model="addForm.system_no"
              autofocus="true"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item
          :label="processDesignVisible"
          prop="process_design_is_visible"
        >
          <el-col>
            <el-radio v-model="addForm.process_design_is_visible" label="Y">{{
              $t("yes")
            }}</el-radio>
            <el-radio v-model="addForm.process_design_is_visible" label="N">{{
              $t("no")
            }}</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item :label="regulationsVisible" prop="rule_is_visible">
          <el-col>
            <el-radio v-model="addForm.rule_is_visible" label="Y">{{
              $t("yes")
            }}</el-radio>
            <el-radio v-model="addForm.rule_is_visible" label="N">{{
              $t("no")
            }}</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item :label="attachment">
          <!-- 上传附件 -->
          <el-upload
            class="upload-demo"
            :action="fileUploadUrl"
            :limit="1"
            :file-list="addFileList"
            :on-exceed="editHandleExceed"
            :on-success="
              (res) => {
                addHandleUpload('success', res);
              }
            "
            :on-error="
              (err) => {
                addHandleUpload('error', err);
              }
            "
            :show-file-list="false"
          >
            <el-button size="small" type="primary">{{
              $t("bpa_clickUpload")
            }}</el-button>
          </el-upload>
        </el-form-item>
        <el-table class="main_tab" :data="addFileList" stripe border>
          <el-table-column prop="filename" :label="fileName"></el-table-column>
          <el-table-column
            prop="status"
            :label="uploadStatus"
          ></el-table-column>
          <el-table-column :label="operation">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('delete')"
                placement="top"
              >
                <!-- class="no-border" icon="el-icon-delete" circle -->
                <el-button type="text" @click="deleteAddFile">{{
                  $t("delete")
                }}</el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="下载"
                placement="top"
              >
                <a :href="downloadFile(scope.row.fileid)" download>
                  <!-- class="no-border" icon="el-icon-download" circle -->
                  <el-button type="text">下载</el-button>
                </a>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            resetForm('addForm', 'addFileList');
            addDialogFormVisible = false;
          "
          >{{ $t("cancel") }}</el-button
        >
        <el-button
          type="primary"
          @click="addConfirm('addForm', 'addFileList')"
          >{{ $t("confirm") }}</el-button
        >
      </div>
    </el-dialog>
    <!-- 修改弹框 -->
    <el-dialog
      :title="editSystemClassification"
      :visible.sync="editDialogFormVisible"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @open="resetEditForm('editForm', 'editFileList')"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="150px"
        label-position="right"
        class="newForm"
        :rules="addrules"
      >
        <el-form-item :label="systemName" prop="system_name">
          <el-col>
            <el-input
              clearable
              v-model="editForm.system_name"
              autofocus="true"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item :label="systemChineseName" prop="system_cnname">
          <el-col>
            <el-input
              clearable
              v-model="editForm.system_cnname"
              autofocus="true"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item :label="systemEnglishName" prop="system_enname">
          <el-col>
            <el-input
              clearable
              v-model="editForm.system_enname"
              autofocus="true"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item :label="systemNumber" prop="system_no">
          <el-col>
            <el-input
              clearable
              v-model="editForm.system_no"
              autofocus="true"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item
          :label="processDesignVisible"
          prop="process_design_is_visible"
        >
          <el-col>
            <el-radio v-model="editForm.process_design_is_visible" label="Y">{{
              $t("yes")
            }}</el-radio>
            <el-radio v-model="editForm.process_design_is_visible" label="N">{{
              $t("no")
            }}</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item :label="regulationsVisible" prop="rule_is_visible">
          <el-col>
            <el-radio v-model="editForm.rule_is_visible" label="Y">{{
              $t("yes")
            }}</el-radio>
            <el-radio v-model="editForm.rule_is_visible" label="N">{{
              $t("no")
            }}</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item :label="attachment">
          <!-- 上传附件 -->
          <el-upload
            class="upload-demo"
            :action="fileUploadUrl"
            :limit="1"
            :file-list="editFileList"
            :on-exceed="editHandleExceed"
            :on-success="
              (res) => {
                editHandleUpload('success', res);
              }
            "
            :on-error="
              (err) => {
                editHandleUpload('error', err);
              }
            "
            :show-file-list="false"
          >
            <el-button size="small" type="primary">{{
              $t("bpa_clickUpload")
            }}</el-button>
          </el-upload>
        </el-form-item>
        <el-table class="main_tab" :data="editFileList" stripe border>
          <el-table-column prop="filename" :label="fileName"></el-table-column>
          <el-table-column
            prop="status"
            :label="uploadStatus"
          ></el-table-column>
          <el-table-column :label="operation">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="delete2"
                placement="top"
              >
                <!-- class="no-border" icon="el-icon-delete" circle -->
                <el-button type="text" @click="deleteEditFile">{{
                  delete2
                }}</el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="download2"
                placement="top"
              >
                <a :href="downloadFile(scope.row.fileid)" download>
                  <!-- class="no-border" icon="el-icon-download" circle -->
                  <el-button type="text">{{ download2 }}</el-button>
                </a>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            resetEditForm('editForm', 'editFileList');
            editDialogFormVisible = false;
          "
          >{{ $t("cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="confirmSystem('editForm', 'editFileList')"
          >{{ $t("confirm") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSystemList,
  getSystem,
  editSystem,
  deleteSystem,
  addSystem,
  fileUploadStep2,
  searchSystem,
} from "@/bpa/api/settings/systemClassificationMaintenance";
import axios from "axios";
import paginations from "@/bpa/mixins/pagination_mixin";
import fileOperation from "@/bpa/mixins/fileDownView";
import { getFormateDate } from "@/bpa/utils/common.js";
import { fileUploadUrl } from "@/bpa/api/componentsApi";
export default {
  data() {
    return {
      // 主页表格数据
      tableData: [],
      // 分页的数据
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      // 添加的弹框
      addDialogFormVisible: false,
      // 修改的弹框
      editDialogFormVisible: false,
      // 添加弹框
      addForm: {
        system_name: "",
        system_cnname: "",
        system_enname: "",
        system_no: "",
        process_design_is_visible: "",
        rule_is_visible: "",
        filename: "",
        fileurl: "",
        fileid: "",
      },
      // 添加弹框表单的验证规则
      addrules: {
        system_name: [{ required: true, message: "  ", trigger: "blur" }],
        system_cnname: [{ required: true, message: "  ", trigger: "blur" }],
        system_enname: [{ required: true, message: "  ", trigger: "blur" }],
        system_no: [{ required: true, message: "  ", trigger: "blur" }],
        process_design_is_visible: [
          { required: true, message: "  ", trigger: "change" },
        ],
        rule_is_visible: [{ required: true, message: "  ", trigger: "change" }],
      },
      areaMaxLength: 1000, // 文本域最大字数限制
      textMaxLength: 50, // 文本框最大字数限制
      // 搜索输入框的数据
      input3: "",
      // 单选框
      radio: "",
      // 编辑修改弹框
      editForm: {
        system_name: "",
        system_cnname: "",
        system_enname: "",
        system_no: "",
        process_design_is_visible: "",
        rule_is_visible: "",
        id: "",
        fileid: "",
        filename: "",
        fileurl: "",
        updateon: "",
      },
      // 批量删除
      selectionList: [],
      // 添加的附件上传
      addFileList: [],
      // 修改的附件上传
      editFileList: [],
      fileUploadUrl,
      fileList: [],
      enterTheSystemName: this.$t("placeholderText.enterTheSystemName"),
      number: this.$t("bpa_number"),
      systemName: this.$t("systemName"),
      systemEnglishName: this.$t("systemEnglishName"),
      systemChineseName: this.$t("systemChineseName"),
      systemNumber: this.$t("systemNumber"),
      processDesignVisible: this.$t("processDesignVisible"),
      regulationsVisible: this.$t("regulationsVisible"),
      attachment: this.$t("attachment"),
      updateTime: this.$t("updateTime"),
      operation: this.$t("operation"),
      addSystemClassification: this.$t("addSystemClassification"),
      fileName: this.$t("fileName"),
      uploadStatus: this.$t("uploadStatus"),
      editSystemClassification: this.$t("editSystemClassification"),
      edit2: this.$t("edit"),
      delete2: this.$t("delete"),
      areYouSureDelete: this.$t("hintText.areYouSureDelete"),
      hint: this.$t("hintText.hint"),
      successfullyDelete: this.$t("hintText.successfullyDelete"),
      Undeleted: this.$t("hintText.Undeleted"),
      fieldNameShouldNotExceedFiftyWords: this.$t(
        "hintText.fieldNameShouldNotExceedFiftyWords"
      ),
      requiredFieldsCannotBeEmpty: this.$t(
        "hintText.requiredFieldsCannotBeEmpty"
      ),
      modifyTheSuccess: this.$t("hintText.modifyTheSuccess"),
      confirm: this.$t("confirm"),
      cancel: this.$t("cancel"),
      selectDeleteRow: this.$t("hintText.selectDeleteRow"),
      attachmentUploadedSuccessfully: this.$t(
        "hintText.attachmentUploadedSuccessfully"
      ),
      attachmentUploadedfailed: this.$t("hintText.attachmentUploadedfailed"),
      currentlyOnlyOneFileCanBeUploaded: this.$t(
        "hintText.currentlyOnlyOneFileCanBeUploaded"
      ),
      sureToRemove: this.$t("hintText.sureToRemove"),
      delete2: this.$t("delete"),
      download2: this.$t("download"),
      uploaded: this.$t("uploaded"),
    };
  },
  mounted() {
    this.getList();
  },
  filters: {
    getFormateDate(time) {
      // var date = new Date(time)
      return getFormateDate(time, "yyyy-MM-dd hh:mm");
    },
  },
  mixins: [paginations, fileOperation],
  methods: {
    getList() {
      getSystemList({
        attr: {},
        filters: [
          {
            key: "",
            opt: "",
            type: "",
            value: "",
          },
        ],
        logic: "or",
        orderby: "createon",
        pageNum: this.pages.pageNum || 1,
        pageSize: this.pages.pageSize,
        sort: "desc",
      }).then((res) => {
        console.log(res.list);
        this.tableData = res.list;
        this.pages.total = res.total;
      });
    },
    // 搜索功能
    searchSystem() {
      searchSystem({
        attr: {},
        filters: [
          {
            key: "system_name",
            opt: "LIKE",
            type: "S",
            value: this.input3,
          },
        ],
        logic: "",
        orderby: "",
        pageNum: 1,
        pageSize: 10000,
        sort: "",
      }).then((res) => {
        console.log(res);
        this.tableData = res.list;
        this.pages.total = res.total;
      });
    },
    // 删除功能
    deleteSystem(id) {
      this.$confirm(this.areYouSureDelete, this.hint, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: "warning",
      })
        .then(() => {
          // 发送请求
          deleteSystem({ id: id }).then((res) => {
            this.$message({
              type: "success",
              message: this.successfullyDelete,
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.Undeleted,
          });
        });
    },
    // 添加功能
    addConfirm(addForm, addFileList) {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          if (this.addForm.system_name.length > this.textMaxLength) {
            this.$message({
              message: this.fieldNameShouldNotExceedFiftyWords,
              type: "warning",
            });
            return false;
          }
          if (this.addForm.system_cnname.length > this.textMaxLength) {
            this.$message({
              message: this.fieldNameShouldNotExceedFiftyWords,
              type: "warning",
            });
            return false;
          }
          if (this.addForm.system_enname.length > this.textMaxLength) {
            this.$message({
              message: this.fieldNameShouldNotExceedFiftyWords,
              type: "warning",
            });
            return false;
          }
          if (this.addForm.system_no.length > this.textMaxLength) {
            this.$message({
              message: this.fieldNameShouldNotExceedFiftyWords,
              type: "warning",
            });
            return false;
          }
          // if (!this.addFileList.length) {
          //   this.$message({
          //     message: '警告哦，必须上传一个附件',
          //     type: 'warning'
          //   })
          //   return false
          // }
          console.log(1);
          console.log(this.addForm, this.addFileList);
          addSystem({
            fileid: !this.addFileList.length ? "" : this.addFileList[0].fileid,
            filename: !this.addFileList.length
              ? ""
              : this.addFileList[0].filename,
            fileurl: !this.addFileList.length
              ? ""
              : this.addFileList[0].downloadUrl,
            process_design_is_visible: this.addForm.process_design_is_visible,
            rule_is_visible: this.addForm.rule_is_visible,
            system_cnname: this.addForm.system_cnname,
            system_enname: this.addForm.system_enname,
            system_name: this.addForm.system_name,
            system_no: this.addForm.system_no,
          }).then((res) => {
            this.addDialogFormVisible = false;
            this.getList();
            this.$refs[addForm].resetFields();
            this.addFileList = [];
            this.addForm = Object.assign({}, this.addForm, {
              system_name: "",
              system_cnname: "",
              system_enname: "",
              system_no: "",
              process_design_is_visible: "",
              rule_is_visible: "",
              filename: "",
              fileurl: "",
              fileid: "",
            });
          });
        } else {
          this.$message({
            type: "warning",
            message: this.requiredFieldsCannotBeEmpty,
          });
        }
      });
    },
    // 重置按钮
    resetForm(addForm, addFileList) {
      this.$nextTick(() => {
        this.$refs[addForm].resetFields();
      });
      this.addFileList = [];
    },
    // 点击修改
    editSystem(id) {
      this.editDialogFormVisible = true;
      getSystem(id).then((res) => {
        console.log(res);
        this.editForm = res;
        if (res.filename == null) {
          this.editFileList = [];
        } else {
          this.editFileList.push({
            filename: res.filename,
            fileid: res.fileid,
            fileurl: res.fileurl,
            status: this.uploaded,
          });
        }
        console.log(this.editFileList);
      });
    },
    // 修改重置按钮
    resetEditForm(editForm, editFileList) {
      this.$nextTick(() => {
        this.$refs[editForm].resetFields();
      });
      this.editFileList = [];
    },
    // 确认修改
    confirmSystem(editForm, editFileList) {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          if (this.editForm.system_name.length > this.textMaxLength) {
            this.$message({
              message: this.fieldNameShouldNotExceedFiftyWords,
              type: "warning",
            });
            return false;
          }
          if (this.editForm.system_cnname.length > this.textMaxLength) {
            this.$message({
              message: this.fieldNameShouldNotExceedFiftyWords,
              type: "warning",
            });
            return false;
          }
          if (this.editForm.system_enname.length > this.textMaxLength) {
            this.$message({
              message: this.fieldNameShouldNotExceedFiftyWords,
              type: "warning",
            });
            return false;
          }
          if (this.editForm.system_no.length > this.textMaxLength) {
            this.$message({
              message: this.fieldNameShouldNotExceedFiftyWords,
              type: "warning",
            });
            return false;
          }
          // if (!this.editFileList.length) {
          //   this.$message({
          //     message: '警告哦，必须上传一个附件',
          //     type: 'warning'
          //   })
          //   return false
          // }
          console.log(1);
          console.log(this.editForm, this.editFileList);
          editSystem({
            id: this.editForm.id,
            fileid: !this.editFileList.length
              ? ""
              : this.editFileList[0].fileid,
            filename: !this.editFileList.length
              ? ""
              : this.editFileList[0].filename,
            fileurl: !this.editFileList.length
              ? ""
              : this.editFileList[0].downloadUrl,
            process_design_is_visible: this.editForm.process_design_is_visible,
            rule_is_visible: this.editForm.rule_is_visible,
            system_cnname: this.editForm.system_cnname,
            system_enname: this.editForm.system_enname,
            system_name: this.editForm.system_name,
            system_no: this.editForm.system_no,
          }).then((res) => {
            this.editDialogFormVisible = false;
            this.getList();
            this.editForm = Object.assign({}, this.editForm, {
              system_name: "",
              system_cnname: "",
              system_enname: "",
              system_no: "",
              process_design_is_visible: "",
              rule_is_visible: "",
              id: "",
              fileid: "",
              filename: "",
              fileurl: "",
              updateon: "",
            });
            this.$message({
              type: "success",
              message: this.modifyTheSuccess,
            });
          });
        } else {
          this.$message({
            type: "warning",
            message: this.requiredFieldsCannotBeEmpty,
          });
        }
      });
    },
    // 批量删除
    handleSelectionChange(list) {
      this.selectionList = list;
    },
    // 批量删除
    mutipleDelteRows() {
      if (this.selectionList.length === 0) {
        this.$message({
          type: "warning",
          message: this.selectDeleteRow,
        });
        return;
      }
      this.$confirm(this.areYouSureDelete, this.hint, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: "warning",
      })
        .then(() => {
          this.selectionList.map((item) => {
            deleteSystem({ id: item.id }).then((res) => {
              if (res) {
                this.getList();
              }
            });
          });
          this.$message({
              type: "success",
              message: this.successfullyDelete,
          });
        })
        .catch(() => {});
    },
    // 添加附件上传
    addHandleUpload(type, res) {
      this.addFileList.push({
        filename: res.data.newName,
        downloadUrl: res.data.downloadUrl,
        viewUrl: res.data.viewUrl,
        status: this.uploaded,
        fileid: res.data.id,
      });
      console.log(this.addFileList);
      if (type === "success") {
        let obj = {
          actrueurl: res.data.actrueUrl,
          currentdate: res.data.currentDate,
          docsize: res.data.size,
          downloadurl: res.data.downloadUrl,
          id: res.data.id,
          localpath: res.data.localPath,
          newname: res.data.newName,
          oldname: res.data.oldName,
          revid: res.data.revId,
          type: res.data.type,
          uploaduser: res.data.uploadUser,
          viewurl: res.data.viewUrl,
        };
        fileUploadStep2(obj).then((res) => {
          this.$message({
            type: "success",
            message: this.attachmentUploadedSuccessfully,
          });
          this.getList();
        });
      } else {
        this.$message({
          type: "warning",
          message: this.attachmentUploadedfailed,
        });
      }
    },
    // 删除添加附件
    deleteAddFile() {
      this.addFileList = [];
      this.$message({
        type: "success",
        message: this.successfullyDelete,
      });
    },
    // 修改附件上传
    editHandleUpload(type, res) {
      this.editFileList.push({
        filename: res.data.newName,
        fileid: res.data.id,
        viewUrl: res.data.viewUrl,
        downloadUrl: res.data.downloadUrl,
      });
      console.log(this.editFileList);
      if (type === "success") {
        let obj = {
          actrueurl: res.data.actrueUrl,
          currentdate: res.data.currentDate,
          docsize: res.data.size,
          downloadurl: res.data.downloadUrl,
          id: res.data.id,
          localpath: res.data.localPath,
          newname: res.data.newName,
          oldname: res.data.oldName,
          revid: res.data.revId,
          type: res.data.type,
          uploaduser: res.data.uploadUser,
          viewurl: res.data.viewUrl,
        };
        fileUploadStep2(obj).then((res) => {
          this.$message({
            type: "success",
            message: this.attachmentUploadedSuccessfully,
          });
          this.getList();
        });
      } else {
        this.$message({
          type: "warning",
          message: this.attachmentUploadedfailed,
        });
      }
    },
    // 删除修改附件
    deleteEditFile() {
      this.editFileList = [];
      this.$message({
        type: "success",
        message: this.successfullyDelete,
      });
    },
    editHandleRemove(file, editFileList) {
      console.log(file, editFileList);
    },
    editHandlePreview(file) {
      console.log(file);
    },
    editHandleExceed(files, editFileList) {
      this.$message.warning(this.currentlyOnlyOneFileCanBeUploaded);
    },
    editBeforeRemove(file, editFileList) {
      this.editFileList = [];
      return this.$confirm(`${this.sureToRemove}  ${file.name}？`);
    },
  },
};
</script>

<style scoped lang="scss">
.el-form .el-form-item {
  margin-bottom: 20px;
  margin-left: 20px;
}
a,
a:link,
a:visited,
a:hover,
a:active {
  color: #409eff;
}
.el-upload-list {
  height: 10px;
}
</style>
