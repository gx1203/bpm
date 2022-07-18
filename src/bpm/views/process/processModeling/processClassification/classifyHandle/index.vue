<template>
  <div id="classifyHandle" v-if="isProcess" v-loading="loading">
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="refresh">
           {{ $t('refresh') }}
          
        </el-button>
      </div>
    </div>
    <!-- <div class="card1" ref="card1">
      <div class="header">
        <span class="title">修改信息</span>
      </div>
      <div class="card-info">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="10" :offset="2">
              <el-form-item :label="$t('name2') + '：'" prop="modelname">
                <el-input clearable v-model="ruleForm.modelname"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <el-form-item :label="$t('sort') + '：'" prop="sort">
                <el-input clearable type="number" v-model="ruleForm.sort"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :offset="2">
              <el-form-item label="上级：" prop="pid">
                 <el-cascader
                  :options="selectList"
                  class="w100"
                   v-model="ruleForm.pid"
                  :show-all-levels="false"
                  :props="{ checkStrictly: true ,value:'id',label:'modelname',children:'child',emitPath:false}"
                  >
                  </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="text-r">
            <el-button @click="handleDeleteOne" v-if="isAddChild">删除该模型</el-button>
            <el-button type="primary" @click="subHandle">提交</el-button>
            <el-button type="primary" @click="addChild" v-if="isAddChild">添加子数据</el-button>
          </div>
        </el-form>
      </div>
    </div> -->
    <div class="card1" ref="card1">
      <div class="header">
        <span class="title">
          {{ $t('allocationProcess') }}
        </span>
      </div>
      <div class="card-info">
        <el-row>
          <el-col :span="20" :offset="2">
            <el-transfer
              v-model="transferData"
              filterable
              :filter-method="filterMethod"
              :titles="[$t('unassigned'), $t('allocated')]"
              :data="generateData"
              :props="{
                  key: 'id',
                  label: 'processname'
                }"
              @change="transferHandle"
            >
              <p slot-scope="{ option }" :title="option.processnamecn+'('+option.processname+')'">{{option.processnamecn}}({{ option.processname}})</p>
            </el-transfer>
          </el-col>
        </el-row>
        <div class="text-r" v-show="false">
          <el-button type="primary" @click="initBpmProcess">
            {{ $t('synchronizationProcess') }}
          </el-button>
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
export default {
  name: "classifyHandle",
  computed: {},
  components: {},
  data() {
    return {
      ruleForm: {},
      loading: false,
      isAddChild: true,
      isProcess: false,
      generateData: [],
      expand: true,
      classtypeList: [],
      selectList: [
        {
          modelname: "顶级",
          id: 0
        }
      ],
      rules: {
        modelname: [
          { required: true, message: this.$t('placeholderText.pleaseEnterName'), trigger: "blur" },
          { min: 3, max: 5, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        sort: [{ required: true, message: this.$t('placeholderText.pleaseInputSort'), trigger: "blur" }],
        // classtype: [
        //   { required: true, message: "请选择样式类型", trigger: "blur" }
        // ],
        pid: [{ required: true, message: this.$t('placeholderText.pleaseChooseSuperior'), trigger: "blur" }]
      },
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
  },
  methods: {
     filterMethod(query, item) {
       if(query){
         if(item.processnamecn){
          return item.processnamecn.indexOf(query) > -1 || item.processname.indexOf(query) > -1;
         } else {
          return  item.processname.indexOf(query) > -1;
         }
       }else{
         return true
       }
    },
    addChild() {
      this.isAddChild = false;
      this.isProcess = false
      this.ruleForm = {
        pid: this.ruleForm.pid,
        unallocatedList: [],
        allocatedList: [],
        classtype: this.ruleForm.classtype
      };
    },

    classtypeHandle() {
      this.classtypeList = [];
      if (this.treeData.grade === 1) {
        this.classtypeList = [
          {
            value: "A1",
            label: "A1"
          },
          {
            value: "A2",
            label: "A2"
          },
          {
            value: "A3",
            label: "A3"
          }
        ];
      } else if (this.treeData.grade === 2) {
        this.classtypeList = [
          {
            value: "B1",
            label: "B1"
          }
        ];
        this.ruleForm.classtype = "B1";
      } else if (this.treeData.grade === 3) {
        this.classtypeList = [
          {
            value: "C1",
            label: "C1"
          }
        ];
        this.ruleForm.classtype = "C1";
      }
    },
    refresh() {
      this.getData()
      // this.$emit("confirm");

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
    // printValue(arr) {
    //   let _this = this;
    //   arr.forEach(item => {
    //     if (item.child) {
    //       this.printValue(item.child);
    //     } else {

    //     }
    //   });
    // },
    transferHandle(data, direction, keyList) {
      this.loading = true;
      updateProcessModel({
        proceesIds: keyList,
        type: direction === "left" ? "del" : "add",
        modelId: this.treeData.id
      })
        .then(rt => {
          this.loading = false;
          if (rt.status === "200") {
            this.$message({
              message: this.$t('hintText.addedSuccess'),
              type: "success"
            });
            this.getAllocation()
          } else {
            this.loading = false;
            this.$message({
              message: this.$t('hintText.operationFailure'),
              type: "error"
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            message: this.$t('hintText.operationFailure'),
            type: "error"
          });
        });
    },
    getAllocation() {
      this.loading = true;
      getUnLocatedInfo()
        .then(rt => {
          this.loading = false;
          if (rt.status === "200") {
            if (rt.data) {
              this.generateData = rt.data;
            }
            return getProcessInfo(this.treeData.id);
          }
        })
        .then(rt => {
          this.loading = false;
          if (rt.status === "200") {
            if (rt.data) {
              this.generateData = this.generateData.concat(rt.data);
              this.transferData = rt.data.map(item => item.id);
            }
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // getData() {
    //   this.isProcess = this.treeData.pid===0? false : true
    //   this.classtypeHandle();
    //   this.loading = true;
    //   getProcessCategoryTree({
    //     pid: 0,
    //     type: 0
    //   })
    //     .then(rt => {
    //       this.loading = false;
    //       if (rt.status === "200") {
    //         this.selectList = [
    //           {
    //             modelname: "顶级",
    //             id: '0',
    //             child: rt.data
    //           }
    //         ];
    //         if (this.treeData.pid !== '0') {
    //           this.getAllocation();
    //         }
    //         return getProcessTypeId(this.treeData.id)
    //       }
    //     }).then(rt => {
    //       this.loading = false;
    //       if (rt.status === "200") {
    //         rt.data.pid = rt.data.pid.toString()
    //         this.ruleForm = rt.data
    //         // this.printValue(this.selectList)
    //       }
    //     })
    //     .catch(() => {
    //       this.loading = false;
    //     });
    // },
    getData() {
      // this.isProcess = this.treeData.grade===1? false : true
      // if(this.treeData.grade===1 || this.treeData.grade===2){
      //   this.isProcess = false
      // }else{
      //   this.isProcess = true
      // }
      this.isProcess = true
      // this.isProcess = true
      this.loading = true;
      getProcessTypeId(this.treeData.id)
        .then(rt => {
          this.loading = false;
          if (rt.status === "200") {
            rt.data.pid = rt.data.pid.toString()
            this.ruleForm = rt.data
            if (this.treeData.pid !== '0') {
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
            this.getAllocation()
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
    this.classtypeHandle();
    this.getData();
  }
};
</script>
<style lang="scss">
#classifyHandle {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
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
#classifyHandle {
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
