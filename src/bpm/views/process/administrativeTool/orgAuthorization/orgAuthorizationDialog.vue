<template>
  <el-dialog :title="$t('OrganizationsAuthorized')" :visible.sync="dialogVisible" width="50%" append-to-body>
    <el-form :model="item" v-loading="loading" :rules="rules" ref="item" label-width="180px" class="content">
      <el-form-item :label="$t('authorizer')" prop="accreditName">
        <el-input v-model="item.accreditName" readonly>
          <el-button slot="append" @click="chooseUser('accreditName',item.accreditEmpId)">{{$t('select')}}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('agent')" prop="proxyName">
        <el-input v-model="item.proxyName" readonly>
          <el-button slot="append" @click="chooseUser('proxyName',item.proxyEmpId)">{{$t('select')}}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('agentAllFlow')" prop="isAllProcess">
        <el-radio-group v-model="item.isAllProcess">
          <el-radio label="Y">{{$t('yes')}}</el-radio>
          <el-radio label="N">{{$t('no')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('agentFlow')" v-if="item.isAllProcess == 'N'">
        <el-select filterable clearable multiple v-model="item.processList"
          :placeholder="$t('placeholderText.pleaseEnterProcessNameSearch')" style="width:100%;">
          <el-option v-for="val in processList" :key="val.processId" :label="val.processNamecn" :value="val.processId">
            <span style="float: left">{{ val.processNamecn }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('agentFlow')" v-else>
        <el-select filterable clearable multiple v-model="item.processList"
          :placeholder="$t('placeholderText.pleaseEnterProcessNameSearch')" style="width:100%;">
          <el-option v-for="val in processList" :key="val.processId" :label="val.processNamecn" :value="val.processId">
            <span style="float: left">{{ val.processNamecn }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('organization3')" prop="orgnames">
        <el-input v-model="item.orgnames" readonly>
          <el-button slot="append" @click="chooseUser('orgnames',item.orgids)">{{$t('select')}}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('startTime')" prop="startDate">
        <el-date-picker type="date" :picker-options="pickerOptions0" v-model="item.startDate" />
      </el-form-item>
      <el-form-item :label="$t('endTime')" prop="endDate">
        <el-date-picker type="date" :picker-options="pickerOptions1" v-model="item.endDate" />
      </el-form-item>
      <el-form-item :label="$t('state')" prop="status">
        <el-radio-group v-model="item.status">
          <el-radio label="Y">{{$t('valid')}}</el-radio>
          <el-radio label="N">{{$t('loseEfficacy')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('remarks')">
        <el-input v-model="item.remark" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('cancel')}}</el-button>
      <el-button type="primary" @click="submit('item')">{{$t('confirm')}}</el-button>
    </span>
    <bas-organieation v-model="organieationShow" :selectedElement="selectedElement" :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false" :selectElement="selectElement" :multiple="multipleBasOrganieation"
      :showElement="showElement" :title="orgtitle" :isShowPost="true" :urlSeting="basOrganieationUrlSeting"
      :load="false" @fnCallBack="fnBasOrganieationCallBack" />
  </el-dialog>
</template>

<script>
import Vue from "vue";
import { getAllocatedProcess } from "@/bpm/api/process/administrativeTool/process_guide.js";
import { save } from "@/bpm/api/process/administrativeTool/orgAuthorization.js";

import BasComponent from "bas-component";
Vue.use(BasComponent);
import "bas-component/lib/BasComponent.css";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("app");
export default {
  name: "orgAuthorizationDialog",
  components: {},
  data () {
    return {
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ["9"],
      orgtitle: "",
      multipleBasOrganieation: false,
      dialogVisible: this.value,
      radioChecked: "",
      processVisible: false,
      loading: false,
      processList: [],
      checkType: "",
      rules: {
        accreditName: [
          { required: true, message: this.$t('placeholderText.pleaseSelectAuthorizer'), trigger: "blur" }
        ],
        proxyName: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseSelectAgent'),
            trigger: ["blur", "change"]
          }
        ],
        orgnames: [
          {
            required: true,
            message: this.$t('PleaseSelectAnOrganization1'),
            trigger: ["blur", "change"]
          }
        ],
        isAllProcess: [
          { required: true, message: this.$t('SelectWhetherToBrokerAllProcesses'), trigger: "blur" }
        ],
        startDate: [
          { required: true, message: this.$t('placeholderText.pleaseSelectStartTime'), trigger: "change" }
        ],
        endDate: [
          { required: true, message: this.$t('placeholderText.pleaseSelectEndTime'), trigger: "change" }
        ]
      },
      pickerOptions0: {
        disabledDate: time => {
          if (this.item.endDate) {
            return (
              time.getTime() >
              new Date(this.item.endDate).getTime() - 86400000 ||
              time.getTime() < Date.now() - 86400000
            );
          } else {
            return time.getTime() < Date.now() - 86400000;
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.item.startDate) {
            return time.getTime() < new Date(this.item.startDate).getTime();
          } else {
            return time.getTime() < Date.now() - 86400000;
          }
        }
      }
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters(["basOrganieationUrlSeting"]),
  },
  watch: {
    value (val) {
      this.dialogVisible = val;
      if (val) {
        this.getData();
      }
    },
    dialogVisible (val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getData () {
      getAllocatedProcess()
        .then(rt => {
          this.loading = false;
          if (rt.status === "200") {
            this.processList = rt.data;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    chooseUser (type, id) {
      this.checkType = type;
      this.selectedElement = {};
      if (type === "accreditName") {
        this.orgtitle = this.$t('placeholderText.selectAgent');
        this.multipleBasOrganieation = false;
        this.selectElement = ["9"];
        if (this.item.accreditEmpId) {
          let list = this.item.accreditName.split(",").join("&");
          let idType = [];
          this.item.accreditEmpId.split(",").forEach((item, i) => {
            idType.push(`${item}-9`);
          });
          this.selectedElement = {
            id: this.item.accreditEmpId.split(","),
            name: list,
            idType: idType.join(";")
          };
        }
      } else if (type === "proxyName") {
        this.selectElement = ["9"];
        this.multipleBasOrganieation = false;
        this.orgtitle = this.$t('placeholderText.selectAgent');
        if (this.item.proxyEmpId) {
          let list = this.item.proxyName.split(",").join("&");
          let idType = [];
          this.item.proxyEmpId.split(",").forEach((item, i) => {
            idType.push(`${item}-9`);
          });
          this.selectedElement = {
            id: this.item.proxyEmpId.split(","),
            name: list,
            idType: idType.join(";")
          };
        }
      } else {
        this.selectElement = ["0", "1", "2", "3", "4"];
        this.orgtitle = this.$t('selectGroup');
        this.multipleBasOrganieation = true;
        if (this.item.orgids) {
          let list = this.item.orgnames.split(",").join("&");
          let idType = [];
          this.item.orgids.split(",").forEach((item, i) => {
            idType.push(`${item}-9`);
          });
          this.selectedElement = {
            id: this.item.orgids.split(","),
            name: list,
            idType: idType.join(";")
          };
        }
      }
      this.organieationShow = true;
    },
    chooseProcess () {
      this.processVisible = true;
    },
    submit (formName) {
      //  	console.log('处理授权问题')
      //  	console.log(this.item.processList)
      //  	console.log(this.processList)
      //  	let subList = this.item.processList
      //  	let List
      //  	//如果是 不代办流程就转换为代办的流程提交
      //  	if(this.item.isAllProcess == 'Y') {
      //  		List = JSON.parse(JSON.stringify(this.processList))
      //  		List.forEach((k,idx) => {
      //  			subList.forEach((f,ix) => {
      //  				if(k.processId == f) {
      //  					List.splice(idx,1)
      //  					return
      //  				}
      //  			})
      //  		})
      //  		let subProcessList = []
      //  		List.forEach((g) => {
      //  			subProcessList.push(g.processId)
      //  		})
      //
      //  		this.item.processList = subProcessList
      //  	}


      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            new Date(this.item.startDate).getTime() >
            new Date(this.item.endDate).getTime()
          ) {
            this.$message.error(this.$t('hintText.startTimeShouldBeBeforeEndTime'));
            return;
          }
          this.loading = true;
          this.item.orgList = []
          this.item.orgids.split(";").forEach(item => {
            this.item.orgList.push(item.split("-")[0])
          })
          this.item.orgids = this.item.orgList.join()
          save({
            ...this.item,
            deleted: "N",
            createby: this.$store.state.app.userInfo.userid
          })
            .then(rt => {
              this.loading = false;
              if (rt.status === "200") {
                this.$message({
                  message: this.$t('hintText.saveSuccessfully'),
                  type: "success"
                });
                this.dialogVisible = false;
                this.$emit("confirm", true);
              } else {
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
    fnBasOrganieationCallBack (data) {
      if (this.checkType === "proxyName") {
        this.$set(this.item, "proxyName", data.name.split("&").join(","));
        this.$set(this.item, "proxyEmpId", data.id);
      } else if (this.checkType === "accreditName") {
        this.$set(this.item, "accreditName", data.name.split("&").join(","));
        this.$set(this.item, "accreditEmpId", data.id);
      } else {
        this.$set(this.item, "orgnames", data.name.split("&").join(","));
        this.$set(this.item, "orgids", data.idType);
      }
      this.organieationShow = false;
    },
    cancel () {
      this.dialogVisible = false;
    }
  },
};
</script>

<style scoped>
/*.content {*/
/*  height: 50vh;*/
/*  width: 60%;*/
/*  margin: 0 auto;*/
/*  overflow: auto;*/
/*  overflow-x: hidden;*/
/*}*/
</style>
