<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="4">
        <div class="left_tree_wrapper">
          <enter-tree @edit="Suk_edit" @conClick="nodeClick" />
        </div>
      </el-col>
      <el-col :span="20">
        <el-row>
          <el-col :span="12">
            <el-input
              v-model="keyWords"
              :placeholder="$t('majorname')"
              :title="$t('BusinessObjectName')"
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
                >{{ $t("search") }}</el-button
              >
            </el-input>
          </el-col>
          <el-col :span="12" class="search_buttons_wrap">
            <el-button
              v-if="modelid !== '' && modelid !== '12-1'"
              type="primary"
              @click="addDialog"
            >
              {{ $t("add") }}
            </el-button>
          </el-col>
        </el-row>
        <el-table :data="repositorybopageList" class="main_tab" stripe border>
          <el-table-column :label="$t('bpa_number')" type="index" width="50" />
          <el-table-column :label="$t('majorname')" prop="specname" />
          <el-table-column :label="$t('majordes')" prop="specdesc" />
          <el-table-column
            :label="$t('TheFinalClassificationOfTheText')"
            prop="foldername"
          />
          <el-table-column
            :label="$t('LevelOfClassification')"
            prop="oneLeverFolderName"
          />
          <el-table-column :label="$t('remarks')" prop="remark" />
          <el-table-column :label="$t('operating')">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('edit')"
                placement="top"
              >
                <el-button
                  class="no-border"
                  circle
                  @click="getDetails(scope.row)"
                >{{ $t('edit') }}</el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('delete')"
                placement="top"
              >
                <el-button
                  class="no-border"
                  circle
                  @click="deleteRow(scope.row.id)"
                >{{ $t('delete') }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="pages.pageNum"
          :page-size="pages.pageSize"
          background
          layout="prev, pager, next, jumper, total"
          :total="pages.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
    <el-dialog
      :title="
        edittype == 'edit' ? $t('professionaledit') : $t('professionaladd')
      "
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form
        ref="form"
        :model="editFormObj"
        label-width="110px"
        :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('majorname')" prop="specname">
              <el-input v-model="editFormObj.specname" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('professionalauthority')" prop="orgname">
              <el-input v-model="editFormObj.orgname" @focus="Suk_open" />
              <!-- <el-input disabled v-model="editFormObj.foldername" /> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('majordes')" prop="specdesc">
          <el-input v-model="editFormObj.specdesc" />
        </el-form-item>

        <el-form-item :label="$t('remarks')">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="editFormObj.remark"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="(dialogVisible = false), resetForm()">{{
          $t("cancel")
        }}</el-button>
        <el-button type="primary" @click="submit()">{{
          $t("confirm")
        }}</el-button>
      </span>
    </el-dialog>
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
  </div>
</template>

<script>
import BasComponent from "bas-component";
Vue.use(BasComponent);
import "bas-component/lib/BasComponent.css";
import enterTree from "./components/index.vue";
import {
  repositoryget,
  repositorySpecpage,
  repositorybosave,
  repositorydelete,
  repositorySpecsave,
} from "@/bpa/api/resourcelibraryCenter";
export default {
  components: {
    enterTree,
  },
  data() {
    return {
      edittype: "",
      selectedElement: {},
      showElement: [],
      selectElement: ["2"],
      orgtitle: "选择组织",
      organieationShow: false,
      dialogVisible: false,
      dialogVisibleTab: false,
      keyWords: "",
      editFormObj: {
        foldername: "",
      },
      modelid: "",
      repositorybopageList: [],
      rules: {
        specname: [{ required: true, message: " ", trigger: "blur" }],
        orgname: [{ required: true, message: " ", trigger: "blur" }],
        specdesc: [{ required: true, message: " ", trigger: "blur" }],
      },
      lxrListRules: {
        doname: [{ required: true, message: " ", trigger: "blur" }],
        dodesc: [{ required: true, message: " ", trigger: "blur" }],
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      type: "",
      editFormObj: {
        repositorydoDtos: [
          //  {
          //    boid:'',
          //    createby:'',
          //    createon:'',
          //    dodesc:'',
          //    doname:'',
          //    id	:'',
          //    remark:'',
          //    updateby:'',
          //    updateon:''
          //    }
        ],
      },
    };
  },
  mounted() {
    this.repositorybopage();
  },
  methods: {
    Suk_edit() {
      this.repositorybopage();
    },
    Suk_open() {
      if (this.editFormObj.orgname) {
        let arr = [];
        if (this.editFormObj.orgid) {
          this.editFormObj.orgid.split(",").forEach((item, index) => {
            arr.push(item + "-2");
          });
        }
        this.selectedElement = {
          id: this.editFormObj.orgid || "",
          name: this.editFormObj.orgname
            ? this.editFormObj.orgname.split(",").join("&")
            : "",
          idType: arr.join(";") || "",
        };
      } else {
        this.selectedElement = {};
      }
      this.organieationShow = true;
    },
    fnBasOrganieationCallBack(data) {
      console.log();
      this.$set(this.editFormObj, "orgname", data.name.split("&").join(","));
      this.$set(this.editFormObj, "orgid", data.id);
      this.$set(this.editFormObj, "idType", data.idType);
      this.organieationShow = false;
    },
    getList() {
      this.repositorybopage();
    },
    getDetails(id) {
      this.edittype = "edit";
      repositoryget(id.id).then((res) => {
        this.dialogVisible = true;
        if (!res) return false;
        this.editFormObj = res;
      });
    },
    handleSizeChange() {},
    handleCurrentChange(e) {
      this.pages.pageNum = e;
      this.repositorybopage();
    },
    addTabs() {
      const item = {
        boid: "",
        createby: "",
        createon: "",
        dodesc: "",
        doname: "",
        id: "",
        remark: "",
        updateby: "",
        updateon: "",
      };
      this.editFormObj.repositorydoDtos.push(item);
    },
    deleteData(row, index) {
      this.editFormObj.repositorydoDtos.splice(index, 1);
    },
    //  列表删除
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
          repositorydelete(id)
            .then((res) => {
              if (typeof res === "boolean") {
                this.$message({
                  type: "success",
                  message: this.$t("hintText.successfullyDelete"),
                });
                this.repositorybopage();
              } else {
                this.$message({
                  type: "info",
                  message: res,
                });
              }
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    },

    repositorybopage() {
      const obj = {
        orderby: "createon",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: "desc",
        filters: [
          {
            key: "specname",
            opt: "LIKE",
            type: "S",
            value: this.keyWords.trim(),
          },
          { key: "folderid", opt: "EQ", type: "S", value: this.modelid },
          { key: "state", opt: "EQ", type: "S", value: "0" },
        ],
        // attr: { folderid: this.modelid }
      };
      repositorySpecpage(obj).then((res) => {
        this.pages.total = res.total;
        this.repositorybopageList = res.list;
      });
    },

    // 添加按钮
    addDialog() {
      this.edittype = "add";
      this.resetForm();
      this.dialogVisible = true;
      this.editFormObj.foldername = this.type;
    },
    //  提交
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let obj = {
            ...this.editFormObj,
            folderid: this.editFormObj.folderid
              ? this.editFormObj.folderid
              : this.modelid,
          };
          repositorySpecsave(obj).then((res) => {
            if (!res) return false;
            this.dialogVisible = false;
            this.$message({
              type: "success",
              message: this.$t("hintText.saveSuccessfully"),
            });
            this.repositorybopage();
          });
        } else {
          this.$message({
            type: "warning",
            message: this.$t("hintText.requiredFieldsCannotBeEmpty"),
          });
        }
      });
    },
    resetForm() {
      this.editFormObj = {
        repositorydoDtos: [],
      };
    },
    nodeClick(obj) {
      const self = this;
      if (obj.data) {
        this.editFormObj.folderid = self.modelid =
          obj.data.id == 7 ? "" : obj.data.id;
        self.type = obj.data.foldername;
      }
      this.repositorybopage();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.cell > .el-form-item > .el-form-item__content {
  margin-left: 0px !important;
}
.btnWarn {
  color: red;
}
// /deep/ .el-form-item__label{
//     width: 102px !important;
// }
//  /deed/ .el-input{
//      width: 76% !important;
//  }
.left_tree_wrapper {
  width: 100%;
  overflow: auto;
  height: calc(100vh - 208px) !important;
}
</style>