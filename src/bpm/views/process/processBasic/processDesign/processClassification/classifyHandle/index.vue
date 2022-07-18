<template>
<!--  v-if="isProcess"-->
  <div id="processClassification" v-loading="loading">
    <!-- <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="next">
          选择
        </el-button>
      </div>
    </div>-->
    <div class="card1" ref="card1">
      <div class="header">
        <span class="title">
          {{ $t('selectProcess') }}
        </span>
      </div>
      <div class="card-info">
        <div v-loading="loading">
          <div v-if="$store.state.app.tableStyle ==='default'">
            <div class="table-header margin-t10">
              <sort-button style="flex-grow: 1" :items="headers" />
            </div>
            <div v-if="generateData && generateData.length!==0">
              <div class="tr" v-for="(item, index) in generateData" :key="index">
                <div class="tr-title">
                  <el-checkbox
                    v-model="item.checked"
                    @change="handleCheck(item)"
                    style="margin-right: 10px"
                  />
                </div>
                <el-row class="tr-body" type="flex" align="middle">
                  <el-col
                    class="td"
                    :title="item.processnamecn"
                    :span="headers[0].span"
                  >{{item.processnamecn }}</el-col>
                  <el-col style="text-align: center" :span="headers[1].span">
                    <el-tooltip :content="$t('nextStep')">
                      <el-button type="text" icon="el-icon-d-arrow-right" @click="next(item)"></el-button>
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>
          </div>
          <div v-else>
            <el-table
              :data="generateData"
              class="margin-t10"
              stripe
              :header-cell-style="{background: '#E1EAFD !important'}"
              highlight-current-row
              current-row-key="id"
            >
              <el-table-column :label="$t('processName2')" show-overflow-tooltip prop="processnamecn">
              </el-table-column>
              <el-table-column :label="$t('operation')" width="80">
                <template slot-scope="scope">
                    <el-button style="margin-left: -5px;" type="primary" icon="el-icon-d-arrow-right" @click="next(scope.row)">{{$t('nextStep')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { now } from "moment-mini";
import {
  getProcessTypeId,
  saveProcessType,
  getProcessCategoryTree,
  deleteProcessType,
  getUnLocatedInfo,
  getProcessInfo,
  updateProcessModel,
  initBpmProcess
} from "@/bpm/api/process/processModeling/process_classification";
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapGetters } = createNamespacedHelpers("processDesign");
export default {
  name: "processClassification",
  computed: {
    ...mapGetters(["processData"])
  },
  components: {},
  data() {
    return {
      ruleForm: {},
      loading: false,
      isAddChild: true,
      isProcess: false,
      generateData: [],
      leftData: [],
      headers: [
        {
          name: this.$t('processName2'),
          span: 20
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      expand: true,
      classtypeList: [],
      transferData: []
    };
  },
  props: {
    treeData: {
      type: Object
    }
  },
  watch: {
    treeData(val) {
      this.isAddChild = true;
      this.getData();
    }
    // "generateData": {
    //   handler(val,newVal) {
    //     if (this.generateData && this.generateData.length !== 0) {
    //       for (let i = 0; i < this.generateData.length; i++) {
    //         if (!this.generateData[i].id !== newVal.id) {
    //           this.generateData[i].checked = false;
    //         }
    //       }
    //     }
    //   },
    //   deep: true
    // },
  },
  methods: {
    ...mapMutations(["setProcessData", "setActive"]),
    filterMethod(query, item) {
      if (query) {
        if (item.processnamecn) {
          return (
            item.processnamecn.indexOf(query) > -1 ||
            item.processname.indexOf(query) > -1
          );
        } else {
          return item.processname.indexOf(query) > -1;
        }
      } else {
        return true;
      }
    },
    addChild() {
      this.isAddChild = false;
      this.isProcess = false;
      this.ruleForm = {
        pid: this.ruleForm.pid,
        unallocatedList: [],
        allocatedList: [],
        classtype: this.ruleForm.classtype
      };
    },
    subHandle(isBack) {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          saveProcessType(this.ruleForm)
            .then(rt => {
              this.loading = false;
              if (rt.status === "200") {
                this.$message({
                  message: this.$t('hintText.saveSuccessfully'),
                  type: "success"
                });
                this.$emit("confirm");
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
        }
      });
    },
    next(item) {
      this.setProcessData(item);
      this.setActive(1);
      this.$emit('next')
    },
    handleCheck(item) {
      this.generateData.forEach(val => {
        if (item.id !== val.id) {
          val.checked = false;
        }
      });
      if (item.checked) {
        this.setProcessData(item);
      } else {
        this.setProcessData("");
      }
    },
    getAllocation() {
      this.loading = true;
      getProcessInfo(this.treeData.id)
        .then(rt => {
          this.loading = false;
          if (rt.status === "200") {
            if (rt.data) {
              rt.data.forEach(item => {
                item.checked = false;
              });
              this.generateData = rt.data;
              if (this.generateData.length > 0) {
                this.setProcessData(this.generateData[0])
                this.$emit('next')
              } else {
                this.setProcessData({})
              }
            }
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getData() {
      if (this.treeData.grade === 1 || this.treeData.grade === 2) {
        this.isProcess = false;
      } else {
        this.isProcess = true;
      }
      this.loading = true;
      getProcessTypeId(this.treeData.id)
        .then(rt => {
          this.loading = false;
          if (rt.status === "200") {
            rt.data.pid = rt.data.pid.toString();
            this.ruleForm = rt.data;
            if (this.treeData.pid !== "0") {
              this.getAllocation();
            }
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    initBpmProcess() {
      this.loading = true;
      initBpmProcess()
        .then(rt => {
          this.loading = false;
          if (rt.status === "200") {
            this.$message({
              message: this.$t('hintText.addedSuccess'),
              type: "success"
            });
            this.getAllocation();
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            message: this.$t('hintText.operationFailure'),
            type: "error"
          });
        });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="scss">
#processClassification {
  .el-transfer-panel .el-checkbox__inner {
    display: none;
  }
  .el-transfer-panel__body {
    height: 330px;
  }
  .el-transfer-panel__list.is-filterable {
    height: 275px;
  }
  .text-r {
    button {
      margin: 15px 10px;
    }
  }

  .el-transfer {
    .el-transfer-panel {
      width: calc(50% - 110px);
    }
    .el-checkbox {
      display: block;
    }
  }
}
</style>
<style lang="scss" scoped>
#processClassification {
  .w100 {
    width: 100%;
  }
  .card1 {
    padding: 0 5px 15px 15px;
    background: white;
    overflow: hidden;
    transition-duration: 0.5s;
    box-sizing: border-box;
    height: auto;
    .header {
      margin-right: 10px;
      border-bottom: 1px solid $dc1;
      margin-bottom: 10px;
      display: flex;
      .title {
        height: 35px;
        line-height: 35px;
        color: $tc1;
        font-weight: bold;
      }
      .space {
        flex-grow: 1;
      }
    }
  }
}
</style>
