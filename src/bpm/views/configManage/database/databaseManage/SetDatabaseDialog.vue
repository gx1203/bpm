<template>
  <el-dialog :title="$t('addTableField')" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body width="1000px">
    <el-form :model="formData" ref="item" label-width="80px" class="content">
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('tableName') + '：'">
            <el-input v-model="item.tableName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item :label="$t('tableType') + '：'">
            <el-radio-group v-model="item.isMainTable" disabled>
              <el-radio label="0">{{$t('mainTable')}}</el-radio>
              <el-radio label="1">{{$t('subtabulation')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('mainTableName') + '：'">
            <el-input v-model="item.mainTableName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-button type="primary" @click="addList">{{ $t('add') }}</el-button>
      <el-table
        :data="dataList"
        border
        v-loading="loading"
        tooltip-effect="dark"
        style="width:100%;margin:15px 0;"
        :header-cell-style="{background: '#E1EAFD !important'}"
      >
        <el-table-column :label="$t('number')" type="index" align="center">
        </el-table-column>
        <el-table-column :label="$t('fieldName')" prop="fieldName" align="center" width="120px">
          <template slot="header" slot-scope="scope">
            <span class="red">*</span>{{$t('fieldName')}}
          </template>
          <template slot-scope="scope">
            <el-input clearable v-model="scope.row.fieldName"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('showName')" prop="fieldCnname" show-overflow-tooltip align="center" width="120px">
          <template slot="header" slot-scope="scope">
            <span class="red">*</span>{{$t('showName')}}
          </template>
          <template slot-scope="scope">
            <el-input clearable v-model="scope.row.fieldCnname"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('type')" prop="inputType" align="center" width="120px">
          <template slot="header" slot-scope="scope">
            <span class="red">*</span>{{$t('type')}}
          </template>
          <template slot-scope="scope">
            <el-select clearable v-model="scope.row.inputType">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('length')" prop="length" align="center" width="120px">
          <template slot="header" slot-scope="scope">
            <span class="red">*</span>{{$t('length')}}
          </template>
          <template slot-scope="scope">
            <el-input clearable type="number" min="1" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" @input="checkVal(scope.$index,'length')" v-model="scope.row.length"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('notes')" prop="fieldComment" align="center"  width="140px">
          <template slot-scope="scope">
            <el-input clearable v-model="scope.row.fieldComment"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('key')" prop="isKey" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isKey === '0' ? '否' : scope.row.isKey === '1' ? '是' : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('mainTableID')" prop="mainTableField" show-overflow-tooltip align="center" width="130px">
        </el-table-column>
        <el-table-column :label="$t('createTime')" prop="createon" show-overflow-tooltip align="center" width="130px">
        </el-table-column>
        <el-table-column :label="$t('updateTime')" prop="updateon" show-overflow-tooltip align="center" width="130px">
        </el-table-column>
        <el-table-column fixed="right" :label="$t('operation')" show-overflow-tooltip align="center" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t('deleteAndSave')" placement="top">
              <el-button type="text" icon="el-icon-delete" @click="delData(scope.row, scope.$index)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button
        type="primary"
        @click="submit"
        :disabled="dataList && dataList.length === 0"
      >{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  queryTableField,
  deleteTableField,
  saveTableField
} from "@/bpm/api/configManage/database";
import {
  getDictionaryOption
} from "@/bpm/api/process/processModeling/classificationModel";
export default {
  data() {
    return {
      dialogVisible: this.value,
      loading: false,
      formData: {},
      dataList: [],
      typeList: []
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: {}
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
  mounted () {
    getDictionaryOption({
      dictionaryen: "subparagraphType"
    }).then(rt => {
      this.typeList = rt.data;
    });
  },
  methods: {
    checkVal (index, name) {
      if (
        name === "length" &&
        this.dataList[index].length < 1
      ) {
        this.dataList[index].length = 1;
      }
    },
    addList () {
      this.dataList.push({});
    },
    delData (val, index) {
      if (val.id) {
        this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
          type: "warning"
        }).then(() => {
          deleteTableField(this.item.tableName, val.fieldName, val.id).then(rt => {
            if (rt.status === "200") {
              this.dataList.splice(index,1);
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
        }).catch(() => {});
      } else {
        this.dataList.splice(index,1);
      }
    },
    getData () {
      this.loading = true;
      queryTableField({
        tableId: this.item.id,
        tableName: this.item.tableName
      })
        .then(rt => {
          if (rt.status === "200") {
            this.dataList = rt.data;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    submit () {
      for (let i = 0, len = this.dataList.length; i < len; i++) {
        if (!this.dataList[i].fieldName) {
          this.$message.error(`${this.$t('number')}${i + 1}：${this.$t('fieldName')}${this.$t('hintText.cannotBeEmpty')}`);
          return false;
        } else if (!this.dataList[i].fieldCnname) {
          this.$message.error(`${this.$t('number')}${i + 1}：${this.$t('showName')}${this.$t('hintText.cannotBeEmpty')}`);
          return false;
        } else if (!this.dataList[i].inputType) {
          this.$message.error(`${this.$t('number')}${i + 1}：${this.$t('type')}${this.$t('hintText.cannotBeEmpty')}`);
          return false;
        } else if (!this.dataList[i].length) {
          this.$message.error(`${this.$t('number')}${i + 1}：${this.$t('length')}${this.$t('hintText.cannotBeEmpty')}`);
          return false;
        }
      }
      this.loading = true;
      saveTableField({
        id: this.item.id,
        tableName: this.item.tableName,
        isMainTable: this.item.isMainTable,
        mainTableName: this.item.mainTableName,
        isDelete: this.item.isDelete,
        tableFieldDtoList: this.dataList
      })
        .then(rt => {
          if (rt.status === "200") {
            this.$message.success(this.$t('hintText.addedSuccess'));
            this.dialogVisible = false;
            this.$emit("confirm", this.item);
          } else {
            this.$message.error(rt.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    cancel () {
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped>
</style>
