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
              :placeholder="$t('BusinessObjectName')"
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
              v-if="modelid !== '' && modelid != 7"
              type="primary"
              @click="addDialog"
            >
              {{ $t("add") }}
            </el-button>
          </el-col>
        </el-row>
        <el-table :data="repositorybopageList" class="main_tab" stripe border>
          <el-table-column :label="$t('bpa_number')" type="index" width="50" />
          <el-table-column :label="$t('BusinessObjectName')" prop="boname" />
          <el-table-column
            :label="$t('BusinessObjectDescription')"
            prop="bodesc"
          />
          <el-table-column
            :label="$t('TheFinalClassificationOfTheText')"
            prop="foldername"
          />
          <el-table-column
            :label="$t('LevelOfClassification')"
            prop="oneLeverFolderName"
          />
          <el-table-column :label="$t('majorname')" prop="specname" />
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
                  v-if="scope.row.edit !== 'N'"
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
                  v-if="scope.row.edit !== 'N'"
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
        edittype == 'edit'
          ? $t('BusinessObjectModification')
          : $t('BusinessObjectAddition')
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
            <el-form-item :label="$t('BusinessObjectName')" prop="boname">
              <el-input v-model="editFormObj.boname" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('TheCategory')" prop="foldername">
              <el-input disabled v-model="editFormObj.foldername" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('majorname')" prop="boname">
              <el-tooltip
                class="item"
                effect="light"
                :content="editFormObj.specname"
                placement="top-start"
              >
                <el-input v-model="editFormObj.specname" @focus="Suk_open" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('BusinessObjectDescription')" prop="bodesc">
          <el-input v-model="editFormObj.bodesc" />
        </el-form-item>
        <el-form-item :label="$t('remarks')">
          <el-input v-model="editFormObj.remark" />
        </el-form-item>

        <!-- 表格 ------------------------->
        <el-form-item>
          <div class="search_buttons_wrap">
            <el-button type="primary" @click="addTabs">
              {{ $t("add") }}
            </el-button>
          </div>
        </el-form-item>
        <el-table
          :data="editFormObj.repositorydoDtos"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column :label="$t('bpa_number')" type="index" width="50" />

          <el-table-column prop="doname">
            <template slot="header">
              <span class="btnWarn">*</span>
              <span>{{ $t("DataObjectName") }}</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'repositorydoDtos.' + scope.$index + '.doname'"
                :rules="lxrListRules.doname"
              >
                <el-input id="input" v-model="scope.row.doname"></el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column prop="dodesc">
            <template slot="header">
              <span class="btnWarn">*</span>
              <span>{{ $t("DataObjectDescription") }}</span>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'repositorydoDtos.' + scope.$index + '.dodesc'"
                :rules="lxrListRules.dodesc"
              >
                <el-input v-model="scope.row.dodesc"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('remarks')">
            <template slot-scope="scope">
              <el-form-item
                :prop="'repositorydoDtos.' + scope.$index + '.remark'"
              >
                <el-input v-model="scope.row.remark"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="medium"
                @click="deleteData(scope.row, scope.$index)"
              >
                <i class="el-icon-delete" aria-hidden="true"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
    <selectper
      v-model="isDialogsVisible"
      :enterpriseStandardSelected="enterpriseStandardSelected"
      @confirm="selectEnterpriseStandardConfirm"
    >
    </selectper>
  </div>
</template>

<script>
import enterTree from "./components/index.vue";
import selectper from "./components/selectper.vue";
import {
  repositorybopage,
  repositorybosave,
  repositoryboDelete,
  repositoryboget,
} from "@/bpa/api/resourcelibraryCenter";
export default {
  components: {
    enterTree,
    selectper,
  },
  data() {
    return {
      enterpriseStandardSelected: [],
      dialogVisible: false,
      dialogVisibleTab: false,
      keyWords: "",
      editFormObj: {
        foldername: "",
      },
      isDialogsVisible: false,
      modelid: "",
      repositorybopageList: [],
      rules: {
        boname: [{ required: true, message: " ", trigger: "blur" }],
        foldername: [{ required: true, message: " ", trigger: "blur" }],
        bodesc: [{ required: true, message: " ", trigger: "blur" }],
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
      enterpriseStandardSelected: [],
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
    selectEnterpriseStandardConfirm(list) {
      let ids = [];
      let names = [];
      list.forEach((ele) => {
        ids.push(ele.id);
        names.push(ele.specname);
      });
      this.$set(this.editFormObj, "specid", ids.join(","));
      this.$set(this.editFormObj, "specname", names.join(","));
    },
    Suk_open() {
      this.enterpriseStandardSelected = [];
      if (this.editFormObj.specname && this.editFormObj.specid) {
        let ennameArr = this.editFormObj.specname.split(",");
        let docIdArr = this.editFormObj.specid.split(",");
        this.enterpriseStandardSelected = ennameArr.map((item, index) => {
          return {
            specname: item,
            id: docIdArr[index],
          };
        });
      }
      this.isDialogsVisible = true;
    },
    getList() {
      this.repositorybopage();
    },
    getDetails(id) {
      this.dialogVisible = true;
      this.edittype = "edit";
      repositoryboget(id.id).then((res) => {
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
          repositoryboDelete(id)
            .then((res) => {
              if (res) {
                this.$message({
                  type: "success",
                  message: this.$t("hintText.successfullyDelete"),
                });
                this.repositorybopage();
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
            key: "boname",
            opt: "LIKE",
            type: "S",
            value: this.keyWords.trim(),
          },
          { key: "folderid", opt: "EQ", type: "S", value: this.modelid },
        ],
        // attr: { folderid: this.modelid }
      };
      repositorybopage(obj).then((res) => {
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
          repositorybosave(obj).then((res) => {
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