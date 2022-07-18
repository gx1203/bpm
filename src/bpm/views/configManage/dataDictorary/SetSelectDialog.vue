<template>
  <el-dialog :title="$t('configurationOptions')" :visible.sync="dialogVisible" append-to-body width='800px'>
    <el-form :model="dataList" ref="item" label-width="30px" class="content">
      <el-button @click="addList">{{ $t('add') }}</el-button>
      <el-table
        :data="dataList.data"
        border
        v-loading="loading"
        tooltip-effect="dark"
        style="width:100%;margin:15px 0;"
        :header-cell-style="{background: '#E1EAFD !important'}"
      >
        <el-table-column label="Text" prop="name" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <el-form-item
              :prop="`data.${scope.$index}.text`"
              :rules="[
                  { required: true, message: ' ', trigger: 'blur' },
                ]"
            >
              <el-input clearable v-model="scope.row.text"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="Value" prop="name" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <el-form-item
              :prop="`data.${scope.$index}.value`"
              :rules="[
                  { required: true, message: ' ', trigger: 'blur' },
                ]"
            >
              <el-input clearable v-model="scope.row.value"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column :label="$t('sort')" prop="name" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <el-form-item
              :prop="`data.${scope.$index}.sort`"
              :rules="[
                  { required: true, message: ' ', trigger: 'blur' },
                ]"
            >
              <el-input clearable @input="checkVal(scope.$index)" v-model="scope.row.sort" type="number"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" show-overflow-tooltip align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" @click="delData(scope.row,scope.$index)">{{ $t('deleteAndSave') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button
        type="primary"
        @click="submit('item')"
        :disabled="dataList.data && dataList.data.length ===0"
      >{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getOptionListById,
  saveOptionList,
  deleteOptionList
} from "@/bpm/api/configManage/dataDictorary";
export default {
  data() {
    return {
      dialogVisible: this.value,
      loading: false,
      dataList: {}
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: String,
      default: ""
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.getData();
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    checkVal(i) {
      if (/\D/.test(this.dataList.data[i].sort)) {
        this.dataList.data[i].sort = "";
      } else if (Number(this.dataList.data[i].sort) < 0) {
        this.dataList.data[i].sort = "";
      }
    },
    getData() {
      this.loading = true;
      getOptionListById(this.item)
        .then(rt => {
          if (rt.status === "200") {
            this.dataList = rt;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.dataList.data.forEach(item => {
            item.pid = this.item;
          });
          saveOptionList(this.dataList.data)
            .then(rt => {
              if (rt.status === "200") {
                this.$message.success(this.$t('hintText.addedSuccess'));
                this.dialogVisible = false;
                this.$emit("confirm", this.item);
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    },
    delData(val,index) {
      if (val.id) {
        this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
          type: "warning"
        })
          .then(() => {
            deleteOptionList(val.id).then(rt => {
              if (rt.status === "200") {
                this.getData();
                this.$message({
                  message: this.$t('hintText.successfullyDelete'),
                  type: "success"
                });
              } else {
                this.$message({
                  message: this.$t('hintText.failToDelete'),
                  type: "error"
                });
              }
            });
          })
          .catch(_ => {});
      } else {
        this.dataList.data.splice(index,1);
      }
    },
    addList() {
      this.dataList.data.push({});
    }
  }
};
</script>

<style lang="scss" scoped>
  .el-dialog__wrapper {
    /deep/ .el-dialog__body {
      max-height: 65vh;
    }
  }
</style>
