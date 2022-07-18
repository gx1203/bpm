<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-input
          v-model="keyWords"
          :placeholder="$t('namesToolVersionrangeOfApplication')"
          :title="$t('namesToolVersionrangeOfApplication')"
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
          type="primary"
          @click="(dialogVisible = true), (show = false), (editFormObj = {})"
        >
          {{ $t("add") }}
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="modelRepositoryTooList" class="main_tab" stripe border>
      <el-table-column :label="$t('bpa_number')" type="index" width="50" />
      <el-table-column :label="$t('names')" prop="toolname" />
      <el-table-column :label="$t('ToolVersion')" prop="toolversion" />
      <el-table-column :label="$t('rangeOfApplication')" prop="limituse" />
      <el-table-column :label="$t('remarks')" prop="remark" />
      <el-table-column :label="$t('operating')">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('relation')"
            placement="top"
          >
            <el-button
              class="no-border"
              circle
              @click="lookRelation(scope.row)"
            >{{ $t('relation') }}</el-button>
          </el-tooltip>
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
    <el-dialog
      :title="show == true ? $t('ToolToAlter') : $t('ToolToAdd')"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form
        ref="form"
        :model="editFormObj"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item :label="$t('names')" prop="toolname">
          <el-input v-model="editFormObj.toolname" />
        </el-form-item>
        <el-form-item :label="$t('ToolVersion')" prop="toolversion">
          <el-input v-model="editFormObj.toolversion" />
        </el-form-item>
        <el-form-item :label="$t('rangeOfApplication')">
          <el-input v-model="editFormObj.limituse" />
        </el-form-item>
        <el-form-item :label="$t('remarks')">
          <el-input style="textarea" v-model="editFormObj.remark" />
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
    <el-pagination
      :current-page="pages.pageNum"
      :page-size="pages.pageSize"
      background
      layout="prev, pager, next, jumper, total"
      :total="pages.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <relation-dialog v-model="relationVisible" :currentObj="currentObj" />
  </div>
</template>

<script>
import {
  modelRepositoryToolSave,
  modelRepositoryToolQuery,
  modelRepositoryToolGet,
  modelRepositoryToolDelete,
} from "@/bpa/api/resourcelibraryCenter";
import relationDialog from './relationDialog'

export default {
  components: {
    relationDialog
  },
  data() {
    return {
      keyWords: "",
      dialogVisible: false,
      editId: "",
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      show: false,
      modelRepositoryTooList: [],
      editFormObj: {},
      rules: {
        toolname: [{ required: true, message: " ", trigger: "blur" }],
        toolversion: [{ required: true, message: " ", trigger: "blur" }],
      },
      relationVisible: false,
      currentObj: {}
    };
  },
  mounted() {
    this.modelRepositoryToo();
  },
  methods: {
    handleSizeChange(e) {
      console.log(e);
    },
    handleCurrentChange(e) {
      console.log(e);
      this.pages.pageNum = e;
      this.modelRepositoryToo();
    },

    deleteRow(e) {
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
          modelRepositoryToolDelete(e).then((res) => {
            if (res) {
              this.$message({
                type: "success",
                message: this.$t("hintText.successfullyDelete"),
              });
              this.modelRepositoryToo();
            }
          });
        })
        .catch(() => {});
    },

    lookRelation (item) {
      this.relationVisible = true
      this.currentObj = item
    },

    // 编辑
    getDetails(e) {
      console.log(e);
      this.editId = e.id;
      this.dialogVisible = true;
      this.show = true;
      this.editFormObj = {
        toolname: e.toolname,
        toolversion: e.toolversion,
        limituse: e.limituse,
        remark: e.remark,
      };
    },
    resetForm() {
      this.$refs["form"].resetFields();
      this.editFormObj = {};
      console.log(this.editFormObj);
    },
    //  获取列表
    modelRepositoryToo() {
      const obj = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: "desc",
        // logic: 'or',
        logic: "or",
        filters: [
          { key: "toolname", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "toolversion", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "limituse", opt: "LIKE", type: "S", value: this.keyWords },
        ],
      };
      modelRepositoryToolQuery(obj).then((res) => {
        console.log(res);
        this.pages.total = res.total;
        if (!res) return false;
        this.modelRepositoryTooList = res.list;
        console.log(this.modelRepositoryTooList);
      });
    },
    submit() {
      console.log(this.editFormObj);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let obj;
          if (this.show) {
            obj = this.editFormObj;
            obj.id = this.editId;
          } else {
            obj = this.editFormObj;
          }
          modelRepositoryToolSave(obj).then((res) => {
            this.show = false;
            console.log(res);
            if (!res) return false;
            this.dialogVisible = false;
            this.show = false;
            this.modelRepositoryToo();

            this.$message({
              message: $t("hintText.submittedSuccessfully"),
              type: "success",
            });
          });
        } else {
          this.$message({
            type: "warning",
            message: this.$t("hintText.requiredFieldsCannotBeEmpty"),
          });
        }
      });
    },
    getList() {
      this.modelRepositoryToo();
    }
  },
};
</script>

<style></style>
