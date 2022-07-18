<template>
  <div id="modifyProcess">
    <el-form :model="ruleForm" ref="ruleForm" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-table
            :data="userData.nodeList"
            :v-loading="pageLoading"
            stripe
            :header-cell-style="{background: '#E1EAFD !important'}"
            highlight-current-row
            ref="multipleTable"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            current-row-key="id"
          >
            <el-table-column type="selection" align="center" width="100"></el-table-column>
            <el-table-column
              prop="activityname"
              align="center"
              :label="$t('nodeName')"
              show-overflow-tooltip
            ></el-table-column>
            <!-- <el-table-column align="center" width="100" show-overflow-tooltip>
              <template slot="header">
                默认配置
                <el-button title="取消默认配置" type="text" icon="el-icon-close" @click="closeRadio"></el-button>
              </template>
              <template slot-scope="scope">
                <el-radio-group v-model="radio">
                  <el-radio :disabled="scope.row.isCheck==='N'" :label="scope.row">&nbsp;</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column align="center" label="选择节点复制配置信息" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-select clearable v-model="scope.row.copy" :disabled="scope.row.isCheck==='N'" class="select">
                  <el-option
                    v-for="(item, index) in userData.nodes"
                    :key="index"
                    :label="item"
                    :value="item"
                    :disabled="item === scope.row.activityname"
                  >
                  </el-option>
                </el-select>
                <el-button type="primary" :disabled="scope.row.isCheck==='N'" @click="copyHandle(scope.row)">复制</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <div class="text-r">
      <el-button type="primary" @click="saveForm">{{ $t('submit') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getProcessNode, saveMobileProcessConfig, copyProcessNodeField } from "@/bpm/api/process/mobileConfig/mobile_process";
export default {
  name: "mobileProcess",
  data() {
    return {
      pageLoading: false,
      ruleForm: {},
      radio: "",
      userData: {
      },
      isSel:false,
      multipleSelection: []
    };
  },
  props: {
    treeData: {
      type: Object,
      default: {},
    }
  },
  watch: {
    treeData(val) {
      this.getData();
    }
  },
  methods: {
    saveForm() {
       let delNodeList = Object.assign([],this.userData.nodeList)
        this.multipleSelection.forEach(item => {
            let index = delNodeList.indexOf(item);
            if (index !== -1) {
              delNodeList.splice(index, 1);
            }
        });
        this.multipleSelection
        if(this.radio){
          this.multipleSelection.forEach(v => {
            if (v.id === this.radio.id) {
                v.isdefault = 1
            }
          });
        }
        saveMobileProcessConfig({
             processId: this.treeData.id,
             nodeList: this.multipleSelection,
             delNodeList: delNodeList
             }).then(rt => {
          this.loading = false;
          if (rt.status === "200") {
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: "success"
            });
            this.getData()
          } else {
            this.loading = false;
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: "error"
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: "error"
          });
        });
    },
    copyHandle (item) {
        if(!item.copy){
             this.$message({
              message: this.$t('placeholderText.pleaseSelectNodeConfigurationInformation'),
              type: "error"
            });
            return
        }
        copyProcessNodeField({
             processId: this.treeData.id,
             tragetActivityName: item.activityname,
             soruceActivityName: item.copy
             }).then(rt => {
          this.loading = false;
          if (rt.status === "200") {
            this.$message({
              message: this.$t('copySuccessfully'),
              type: "success"
            });
            this.getData()
          } else {
            this.loading = false;
            this.$message({
              message: this.$t('hintText.copyFailed'),
              type: "error"
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            message: this.$t('hintText.copyFailed'),
            type: "error"
          });
        });
    },
    handleSelectionChange(val) {
     if(!this.isSel) return
     this.multipleSelection = val;
     this.userData.nodeList.forEach(row => {
        row.isCheck = 'N'
        this.multipleSelection.forEach(v => {
          if (row.id === v.id) {
            row.isCheck = 'Y'
          }
        });
      });
    },
    closeRadio() {
      this.radio = "";
    },
    toggleSelection() {
      let _this = this;
      this.userData.nodeList.forEach(row => {
        if (row.isCheck === 'Y') {
          this.$refs.multipleTable.toggleRowSelection(row);
        }
      });
      this.isSel = true
    },
    getData() {
      this.isSel = false
      this.loading = true;
      getProcessNode(this.treeData.id)
        .then(rt => {
          if (rt.status === "200") {
            this.userData = rt.data;
             this.userData.nodeList.forEach(row => {
                if (row.isdefault === 1) {
                    this.radio = row;
                }
            });
            setTimeout(()=>{
                this.toggleSelection();
            },0)
          }
        })
        .catch(() => {
          this.loading = false;
        });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="scss">
#modifyProcess {
  .el-form-item__label {
    color: $tc1;
    font-size: 12px;
  }
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
  .text-r {
    button {
      margin: 15px 10px;
    }
  }
}
</style>
<style lang="scss" scoped>
#modifyProcess {
  .select {
    width: calc(80% - 50px);
  }
}
</style>
