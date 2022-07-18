<template>
  <el-dialog :title="$t('goOutAuthorization')" :visible.sync="dialogVisible" append-to-body>
    <el-form
      :model="item"
      v-loading="loading"
      :rules="rules"
      ref="item"
      label-width="180px"
      class="content"
    >
      <el-form-item :label="$t('authorizer') + '：'" prop="grantor">
        <el-input clearable v-model="item.grantor" readonly>
          <el-button slot="append" @click="chooseUser('grantor',item.grantorUid)">{{ $t('placeholderText.select') }}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('agent') + '：'" prop="surrogate">
        <el-input clearable v-model="item.surrogate" readonly>
          <el-button slot="append" @click="chooseUser('surrogate',item.surrogateUid)">{{ $t('placeholderText.select') }}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('selectProcess') + '：'" required>
         <el-select
                filterable
                clearable
                multiple
                v-model="item.processIds"
                :placeholder="$t('placeholderText.pleaseEnterProcessNameSearch')"
                style="width:100%;"
              >
                <el-option
                  v-for="val in processList"
                  :key="val.processId"
                  :label="val.processNamecn"
                  :value="val.processId"
                >
                  <span style="float: left">{{ val.processNamecn }}</span>
                </el-option>
              </el-select>

      </el-form-item>
      <el-form-item :label="$t('startTime') + '：'" prop="startDate">
        <el-date-picker type="datetime" :picker-options="pickerOptions0" v-model="item.startDate" />
      </el-form-item>
      <el-form-item :label="$t('endTime') + '：'" prop="endDate">
        <el-date-picker type="datetime" :picker-options="pickerOptions1" v-model="item.endDate" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :isShowPost="true"
      :multiple = "multipleBasOrganieation"
      :showElement="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"/>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import { saveOutAuth, getOutAuthDetail } from "@/bpm/api/staging/tool/out_auth";
import { getAllocatedProcess } from "@/bpm/api/process/processBasic/process_design";
import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'
export default {
  name: "EditOutAuthDialog",
  components: {
  },
  data() {
    return {
      organieationShow:false,
      selectedElement: {},
      showElement:[],
      selectElement: ["9"],
      orgtitle:'',
      multipleBasOrganieation:false,
      dialogVisible: this.value,
      processVisible: false,
      loading: false,
      processList:[],
      checkType: "",
      rules: {
        grantor: [{ required: true, message: this.$t('placeholderText.pleaseSelectAuthorizer'), trigger: "blur" }],
         surrogate: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseSelectAgent'),
            trigger: ["blur", "change"]
          }
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
      if (!this.item.id) return;
      this.loading = true;
      getOutAuthDetail(this.item.id)
        .then(rt => {
          rt.data.processIds = rt.data.processList
            .map(item => item.id)
          this.item = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    chooseUser(type, id) {
      this.checkType = type;
      this.selectedElement = {};
      if(type==='grantor'){
        this.orgtitle= this.$t('selectAuthorizer')
        if (this.item.grantorUid) {
          let list = this.item.grantor.split(",").join("&");
          let idType = []
          this.item.grantorUid.split(",").forEach((item, i) => {
            idType.push(`${item}-9`)
          });
          this.selectedElement = {
            id: this.item.grantorUid.split(","),
            name: list,
            idType: idType.join(";"),
          }
        }
      }else{
        this.orgtitle=this.$t('placeholderText.selectAgent')
        if (this.item.surrogateUid) {
          let list = this.item.surrogate.split(",").join("&");
          let idType = []
          this.item.surrogateUid.split(",").forEach((item, i) => {
            idType.push(`${item}-9`)
          });
          this.selectedElement = {
            id: this.item.surrogateUid.split(","),
            name: list,
            idType: idType.join(";"),
          }
        }
      }
      this.organieationShow = true
    },
    chooseProcess() {
      this.processVisible = true;
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.item.processIds.length === 0) {
            this.$message.error(this.$t('placeholderText.pleaseSelectProcess'));
            return;
          }
          if(new Date(this.item.startDate).getTime() > new Date(this.item.endDate).getTime()){
          this.$message.error(this.$t('hintText.startTimeShouldBeBeforeEndTime'));
            return;
          }
          let _processList = []
           this.processList.forEach(item=>{
            this.item.processIds.forEach(val => {
              if(val === item.processId){
                _processList.push({
                  id:val,
                  processName:item.processNamecn,
                })
              }
            });
          })
          this.item.status = "";

          this.loading = true;
          saveOutAuth({
            applicationName: "BPM",
            creatorUid: this.$store.state.basuser.user.userid,
            ...this.item,
            processList: _processList,
            isdelete: "N"
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
    fnBasOrganieationCallBack(data) {
      if (this.checkType === "surrogate") {
        this.$set(this.item,"surrogate",data.name.split('&').join(","));
        this.$set(this.item,"surrogateUid",data.id);
      } else {
        this.$set(this.item,"grantor",data.name.split('&').join(","));
        this.$set(this.item,"grantorUid",data.id);
      }
      this.organieationShow = false;
    },
    cancel() {
      this.dialogVisible = false;
    }
  },
  mounted() {
  }
};
</script>

<style scoped>

</style>
