<template>
  <el-dialog :title="$t('OrganizationsAuthorized')" :visible.sync="dialogVisible" append-to-body>
    <el-form
      :model="item"
      v-loading="loading"
      :rules="rules"
      ref="item"
      label-width="180px"
      class="content"
    >
      <el-form-item :label="$t('authorizer')" prop="accreditName">
        <el-input v-model="item.accreditName" readonly>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('agent')" prop="proxyName">
        <el-input v-model="item.proxyName" readonly>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('agentAllFlow')" prop="isAllProcess">
        <el-radio-group v-model="item.isAllProcess" disabled>
          <el-radio label="Y">{{$t('yes')}}</el-radio>
          <el-radio label="N">{{$t('no')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('agentFlow')" v-if="item.isAllProcess == 'N'">
        <!-- <el-select
          filterable
          clearable
          multiple
          v-model="item.processList"
          :placeholder="$t('placeholderText.pleaseEnterProcessNameSearch')"
          style="width:100%;"
          disabled
        > -->
        <span v-for="(item,key) in processLists" :key="key">{{item+'；'}}</span>
          <!-- <el-option
            v-for="val in processList"
            :key="val.processId"  
            :label="val.processNamecn"
            :value="val.processId"
          >
            <span style="float: left">{{ val.processId }}</span>
          </el-option> -->
        <!-- </el-select> -->
      </el-form-item>
      <el-form-item :label="$t('NoagentAllFlow')" v-else>
                <span v-for="(item,key) in processLists" :key="key">{{item+'；'}}</span>

        <!-- <el-select
          filterable
          clearable
          multiple
          v-model="item.processList"
          :placeholder="$t('placeholderText.pleaseEnterProcessNameSearch')"
          style="width:100%;"
          disabled
        >
          <el-option
            v-for="val in processList"
            :key="val.processId"
            :label="val.modelName"
            :value="val.processId"
          >
            <span style="float: left">{{ val.modelName }}</span>
          </el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item :label="$t('organization3')" prop="orgnames">
        <el-input disabled v-model="item.orgnames" readonly>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('startTime')" prop="startDate"  >
        <span>{{item.startDate | dateformat('YYYY-MM-DD')}}</span>  
      </el-form-item>
      <!-- <el-form-item :label="$t('startTime')" prop="startDate"  v-else>
        <el-date-picker type="date"  disabled v-model="item.startDate" />
      </el-form-item> -->
      <el-form-item :label="$t('endTime')"  prop="endDate"  >
        <span>{{item.startDate | dateformat('YYYY-MM-DD')}}</span>  
      </el-form-item>
      <!-- <el-form-item :label="$t('endTime')"  prop="endDate" v-else>
        <el-date-picker type="date" disabled v-model="item.endDate" />
      </el-form-item> -->
      <el-form-item :label="$t('state')" prop="status">
        <el-radio-group v-model="item.status" disabled>
          <el-radio label="Y">{{$t('valid')}}</el-radio>
          <el-radio label="N">{{$t('loseEfficacy')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('remarks')">
        <el-input v-model="item.remark" type="textarea" readonly></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('cancel')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from "vue";
import { getAllocatedProcess } from "@/bpm/api/process/administrativeTool/process_guide.js";
import { save } from "@/bpm/api/process/administrativeTool/orgAuthorization.js";
import moment from "moment"
import BasComponent from "bas-component";
Vue.filter('dateformat', (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') =>{
    return moment(dataStr).format(pattern)
})
Vue.use(BasComponent);
import "bas-component/lib/BasComponent.css";
export default {
  name: "orgAuthorizationDialog",
  components: {},
  data() {
    return {
      time:null,
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
      processLists: [],
      checkType: "",
      rules: {
        accreditName: [
          { required: true, message: this.$t('placeholderText.pleaseSelectAuthorizer'), trigger: "blur" }
        ],
        proxyName: [
          {
            required: true,
            message:this.$t('placeholderText.pleaseSelectAgent'),
            trigger: ["blur", "change"]
          }
        ],
        orgnames: [
          {
            required: true,
            message: this.$t('PleaseSelectAnOrganization'),
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
    getData() {
      this.processLists=[]
      getAllocatedProcess()
        .then(rt => {
          this.loading = false;
          if (rt.status === "200") {
             console.log(rt.data);
             console.log(this.item.processList);
            this.processList = rt.data;
            rt.data.forEach(i => {
              this.item.processList[0].split(";").forEach(j=>{
                 if(i.processId==j){
                    this.processLists.push(i.modelName )  
              }
              })
            });
            console.log(this.processLists);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    cancel() {
      this.dialogVisible = false;
    }
  },
};
</script>

<style scoped>
/* .content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
  overflow-x: hidden;
} */
</style>
