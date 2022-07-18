<template>
  <el-dialog :title="$t('RulesReplace')" append-to-body id="replaceDialog" :visible.sync="dialogVisible" width="80%"
    :close-on-click-modal="false" v-loading="loading">
    <div style="margin-bottom: 15px;color:red;">{{$t('RulesReplaceTips')}}</div>
    <el-form :model="formData" :disabled="viewId ? true :false" ref="formData" label-width="80px" size="mini">
      <el-form-item :label="$t('ReplacementInstructions')" required>
        <el-input clearable type="text" v-model="formData.remarks" :title="formData.remarks"></el-input>
      </el-form-item>
      <el-table :data="formData.nodeList" class="margin-t10" :header-cell-style="{background: '#E1EAFD !important'}">
        <el-table-column :label="$t('number')" type="index" width="50" center>
        </el-table-column>
        <el-table-column :label="$t('nodeName')" show-overflow-tooltip prop="processnodename" center>
        </el-table-column>
        <el-table-column :label="$t('operationType')" show-overflow-tooltip center>
          <template slot-scope="scope">
            <el-select v-model="scope.row.operation" @change="changeOperation(scope.$index,scope.row.operation)"
              :placeholder="$t('pleaseSelect')">
              <el-option v-for="item in operationList" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('NodeConfigurationType')" show-overflow-tooltip center>
          <template slot="header" slot-scope="scope">
            <span class="red">*</span>{{$t('NodeConfigurationType')}}
          </template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.businesstype" @change="changeBusinesstype(scope.$index)"
              :disabled="scope.row.operation === '01' || scope.row.operation === '04'"
              :placeholder="$t('pleaseSelect')">
              <el-option v-for="item in businesstypeList" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ConfigureTheContent')" show-overflow-tooltip center>
          <template slot="header" slot-scope="scope">
            <span class="red">*</span>{{$t('ConfigureTheContent')}}
          </template>
          <template slot-scope="scope">
            <div v-if="scope.row.businesstype === '03'">
              <el-select v-model="scope.row.targetids" :multiple="scope.row.businesstype === '03'"
                :disabled="scope.row.operation === '01' || scope.row.operation === '04'"
                :placeholder="$t('pleaseSelect')">
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div v-if="scope.row.businesstype==='06'">
              <el-select v-model="scope.row.targetids" :title="scope.row.targetids"
                :multiple="scope.row.businesstype === '03'"
                :disabled="scope.row.operation === '01' || scope.row.operation === '04'"
                :placeholder="$t('pleaseSelect')">
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select> <br />
              <el-select v-model="scope.row.targetnames" :title="scope.row.targetnames" style="margin-top:5px;"
                :disabled="scope.row.operation === '01' || scope.row.operation === '04'"
                :placeholder="$t('pleaseSelect')">
                <el-option v-for="item in userattrList" :key="item.fieldvalue" :label="item.fieldname"
                  :value="item.fieldvalue"></el-option>
              </el-select>
            </div>
            <div v-else>
              <el-input v-if="scope.row.businesstype === '01'" v-model="scope.row.targetnames"
                :title="scope.row.targetnames" @click.native="dialogHandle('isPostDialog', scope.$index)"
                :disabled="scope.row.operation === '01' || scope.row.operation === '04'" readonly></el-input>
              <el-input v-if="scope.row.businesstype === '02'" v-model="scope.row.targetnames"
                :title="scope.row.targetnames" @click.native="dialogHandle('isPostGroupDialog', scope.$index)"
                :disabled="scope.row.operation === '01' || scope.row.operation === '04'" readonly></el-input>
              <el-input v-if="scope.row.businesstype === '04'" v-model="scope.row.targetnames"
                :title="scope.row.targetnames" @click.native="dialogHandle('isBusinessRole', scope.$index)"
                :disabled="scope.row.operation === '01' || scope.row.operation === '04'" readonly></el-input>
              <el-input v-if="scope.row.businesstype === '05'" v-model="scope.row.targetnames"
                :title="scope.row.targetnames" @click.native="dialogHandle('peopleDialog', scope.$index)"
                :disabled="scope.row.operation === '01' || scope.row.operation === '04'" readonly></el-input>
              <el-input v-if="scope.row.businesstype === '07'" v-model="scope.row.targetnames"
                :title="scope.row.targetnames" @click.native="dialogHandle('isOrganization', scope.$index)"
                :disabled="scope.row.operation === '01' || scope.row.operation === '04'" readonly></el-input>
              <el-input v-if="scope.row.businesstype === '08'" v-model="scope.row.targetnames"
                :title="scope.row.targetnames" @click.native="dialogHandle('isProcessRoles', scope.$index)"
                :disabled="scope.row.operation === '01' || scope.row.operation === '04'" readonly></el-input>
              <el-input v-if="!scope.row.businesstype" v-model="scope.row.targetnames"
                :disabled="scope.row.operation === '01' || scope.row.operation === '04'" readonly></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('remarks')" show-overflow-tooltip center>
          <template slot-scope="scope">
            <el-input v-model="scope.row.remarks"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button v-if="!viewId" type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </span>
    <bas-organieation v-model="organieationShow" :selectedElement="orgObj" :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false" :selectElement="selectElement" :showElement="showElement" :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack" />
    <post-group-dialog v-model="isPostGroupDialog" :postGroupIds="postGroupIds" :title="$t('selectJobGroup')"
      @confirm="getPostGroupData" />
    <business-role-dialog v-model="isBusinessRole" :businessRoleIds="businessRoleIds" :title="$t('chooseABusinessRole')"
      @confirm="getBusinessRoleData" />
    <process-roles-dialog v-model="isProcessRoles" :itemList="processRolesList" @confirm="getProcessRolesData" />
  </el-dialog>
</template>
<script>
import { getOrgTree } from "@/bpm/api/app";
import { getProcessNodeInfo, replace, getControlField, getReplace } from "../../api/confinBusinessRule";
import { getDictionaryOption } from '@/bpm/api/process/processModeling/classificationModel'
import { getBusinessAttributeList } from "@/bpm/api/process/business/service_attribute";
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapGetters } = createNamespacedHelpers("processDesign");

import postGroupDialog from "./postGroupDialog";
import businessRoleDialog from "./businessRoleDialog";
import processRolesDialog from "./processRolesDialog";
export default {
  components: {
    postGroupDialog,
    businessRoleDialog,
    processRolesDialog
  },
  data () {
    return {
      loading: false,
      processRolesList: [],
      isProcessRoles: false,
      isBusinessRole: false,
      isPostGroupDialog: false,
      postGroupIds: '',
      businessRoleIds: '',
      dialogVisible: this.value,
      formData: {
        remarks: '',
        nodeList: []
      },
      operationList: [],
      businesstypeList: [],
      tabIndex: '',
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ["9"],
      orgtitle: this.$t('selectPersonnel'),
      orgObj: {},
      orgType: '',
      options: [],
      userattrList: []
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    ruleList: {
      type: Array,
      default () {
        return []
      }
    },
    viewId: {
      type: String
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.formData = {
          remarks: '',
          nodeList: []
        }
        this.viewId ? this.getData() : this.getNodeInfo()
      }
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  computed: {
    ...mapGetters(["processData"])
  },
  mounted () {
    getDictionaryOption({
      dictionaryen: 'businessType'
    }).then(rt => {
      this.businesstypeList = rt.data
    })
    getDictionaryOption({
      dictionaryen: 'operationType'
    }).then(rt => {
      this.operationList = rt.data
    })
    getBusinessAttributeList({
      logic: "and",
      filters: [{ key: "type", opt: "LIKE", type: "S", value: "1" }]
    }).then(rt => {
      if (rt.status === "200") {
        this.userattrList = rt.data.list
      }
    })
    getControlField(this.$route.query.processId || this.processData.id, {
      version: this.$route.query.version || this.$route.query.version === '' ? this.$route.query.version : this.processData.version
    }).then(rt => {
      this.options = rt.data
    })
  },
  methods: {
    getData () {
      this.loading = true
      getReplace(this.viewId).then(rt => {
        this.loading = false
        rt.data.nodeList.forEach(element => {
          if (element.businesstype === '03') {
            element.targetids = element.targetids.split(',')
          }
        })
        this.formData = rt.data
      })
    },
    getProcessRolesData (data) {
      this.formData.nodeList[this.tabIndex].targetnames = data
        .map(item => item.people)
        .join(",");
      this.formData.nodeList[this.tabIndex].targetids = data
        .map(item => item.id)
        .join(",");
      this.isProcessRoles = false;
    },
    getBusinessRoleData (data) {
      let _ids = data
        .filter(item => {
          return item.tablevalue && item.tablevalue !== "";
        })
        .map(item => {
          return {
            id: item.id,
            _id: item.id,
            name: item.name
          };
        });
      _ids.forEach(item => {
        data.forEach(val => {
          if (val.pid != "" && item._id === val.pid) {
            if (item.id.indexOf("_") === -1) {
              item.id = item.id + "_" + val.fieldvalue;
              item.name = item.name + "_" + val.fieldname;
            } else {
              item.id = item.id + "-" + val.fieldvalue;
              item.name = item.name + "-" + val.fieldname;
            }
          }
        });
      });
      let targetnames = _ids.map(item => item.name).join(",");
      let targetids = _ids.map(item => item.id).join(",");
      if (targetnames.length > 200 || targetids.length > 200) {
        this.$message.error(this.$t('hintText.tooManyBusinessRolesSelected'));
      } else {
        this.isBusinessRole = false;
        this.formData.nodeList[this.tabIndex].targetnames = targetnames;
        this.formData.nodeList[this.tabIndex].targetids = targetids;
      }
    },
    getPostGroupData (data) {
      let _ids = data
        .filter(item => {
          return item.org && item.org !== "";
        })
        .map(item => {
          return {
            id: item.id,
            _id: item.id,
            name: item.name
          };
        });
      _ids.forEach(item => {
        data.forEach(val => {
          if (val.pid != "" && item._id === val.pid) {
            if (item.id.indexOf("_") === -1) {
              item.id = item.id + "_" + val.fieldvalue;
              item.name = item.name + "_" + val.fieldname;
            } else {
              item.id = item.id + "-" + val.fieldvalue;
              item.name = item.name + "-" + val.fieldname;
            }
          }
        });
      });
      let targetnames = _ids.map(item => item.name).join(",");
      let targetids = _ids.map(item => item.id).join(",");
      if (targetnames.length > 200 || targetids.length > 200) {
        this.$message.error(this.$t('hintText.tooManyJobGroupsSelected'));
      } else {
        this.isPostGroupDialog = false;
        this.formData.nodeList[this.tabIndex].targetnames = targetnames;
        this.formData.nodeList[this.tabIndex].targetids = targetids;
      }
    },
    fnBasOrganieationCallBack (data) {
      console.log(data)
      if (this.orgType === "isOrganization") {
        this.formData.nodeList[this.tabIndex].targetnames = data.name
          .split("&")
          .join(",");
        this.formData.nodeList[this.tabIndex].targetids = data.id;
        this.organieationShow = false;
      } else if (this.orgType === "org") {
        this.ruleForm.br.orgnames = data.name.split("&").join(",");
        this.ruleForm.br.orgids = data.id;
        this.organieationShow = false;
      } else if (this.orgType === "peopleDialog") {
        this.formData.nodeList[this.tabIndex].targetnames = data.name
          .split("&")
          .join(",");
        this.formData.nodeList[this.tabIndex].targetids = data.id;
        this.organieationShow = false;
      } else if (this.orgType === "isPostDialog") {
        this.formData.nodeList[this.tabIndex].targetnames = data.name
          .split("&")
          .join(",");
        this.formData.nodeList[this.tabIndex].targetids = data.id;
        this.organieationShow = false;
      }
    },
    dialogHandle (el, index) {
      if (this.viewId) return
      this.tabIndex = index;
      if (el === "isPostDialog") {
        this.selectElement = ["3"];
        this.orgtitle = this.$t('chooseAPosition')
        this.orgType = "isPostDialog";
        this.orgObj = {};
        if (this.formData.nodeList[index].targetids) {
          let list = this.formData.nodeList[index].targetnames
            .split(",")
            .join("&");
          let idType = [];
          this.formData.nodeList[index].targetids.split(",").forEach((item, i) => {
            idType.push(`${item}-3`);
          });
          this.orgObj = {
            id: this.formData.nodeList[index].targetids.split(","),
            name: list,
            idType: idType.join(";")
          };
        }
        this.organieationShow = true;
      } else if (el === "isPostGroupDialog") {
        this.postGroupIds = this.formData.nodeList[index].targetids;
        this[el] = true;
      } else if (el === "isBusinessRole") {
        this.businessRoleIds = this.formData.nodeList[index].targetids;
        this[el] = true;
      } else if (el === "isProcessRoles") {
        this.processRolesList = []
        if (this.formData.nodeList[index].targetids) {
          this.processRolesList = this.formData.nodeList[index].targetids.split(",");
        }
        this[el] = true;
      } else if (el === "peopleDialog") {
        this.selectElement = ["9"];
        this.orgtitle = this.$t('chooseASpecificPerson')
        this.orgType = "peopleDialog";
        this.orgObj = {};
        if (this.formData.nodeList[index].targetids) {
          let list = this.formData.nodeList[index].targetnames
            .split(",")
            .join("&");
          let idType = [];
          this.formData.nodeList[index].targetids
            .split(",")
            .forEach((item, i) => {
              idType.push(`${item}-9`);
            });
          this.orgObj = {
            id: this.formData.nodeList[index].targetids.split(","),
            name: list,
            idType: idType.join(";")
          };
        }
        this.organieationShow = true;
      } else if (el === "isOrganization") {
        this.selectElement = ["0", "1", "2", "3", "4", "5"];
        this.orgType = "isOrganization";
        this.orgtitle = this.$t('chooseAnOrganization')
        this.orgObj = {};
        if (this.formData.nodeList[index].targetnames) {
          let list = this.formData.nodeList[index].targetnames
            .split(",")
            .join("&");
          let idType = [];

          this.getOrgTree(this.formData.nodeList[index].targetids);
          // this.formData.nodeList[index].targetids
          //   .split(",")
          //   .forEach((item, i) => {
          //     idType.push(`${item}-0`);
          //   });
          // this.orgObj = {
          //   id: this.formData.nodeList[index].targetids.split(","),
          //   name: list,
          //   idType: idType.join(";")
          // };
        } else {
          this.organieationShow = true;
        }
      }
    },
    getOrgTree (ids) {
      getOrgTree({
        logic: "and",
        filters: [{ key: "id", opt: "IN", type: "S", value: ids }],
        pageNum: 1,
        pageSize: 10000,
      })
        .then(rt => {
          if (rt.status === "200") {
            this.orgObj = {
              id: rt.data.list.map(item => item.id).join(","),
              name: rt.data.list.map(item => item.name).join("&"),
              idType: rt.data.list
                .map(item => {
                  return `${item.id}-${item.type}`;
                })
                .join(";")
            };
            this.organieationShow = true;
          }
        })
        .catch(er => { });
    },
    changeOperation (i, val) {
      if (val === '01' || val === '04') {
        this.$set(this.formData.nodeList[i], 'targetids', '')
        this.$set(this.formData.nodeList[i], 'targetnames', '')
        this.$set(this.formData.nodeList[i], 'businesstype', '')
      }
    },
    changeBusinesstype (i) {
      this.$set(this.formData.nodeList[i], 'targetids', '')
      this.$set(this.formData.nodeList[i], 'targetnames', '')
      console.log(this.formData.nodeList[i])
    },
    getNodeInfo () {
      this.loading = true
      getProcessNodeInfo(this.$route.query.processId || this.processData.id).then(rt => {
        this.loading = false
        if (rt.status === '200') {
          this.formData.nodeList = []
          rt.data.forEach(element => {
            this.formData.nodeList.push({
              processnodeid: element.id,
              processnodename: element.activityname
            })
          })
        }
      }).catch(er => {
        this.loading = false
      })
    },
    cancel () {
      this.dialogVisible = false
    },

    submit (data) {
      let obj = Object.assign({}, this.formData)
      obj.bridList = this.ruleList.map(x => x.id)
      if (!obj.remarks) {
        this.$message('请填写替换说明！')
        return
      }
      let flag = true
      for (let index = 0; index < obj.nodeList.length; index++) {
        const element = obj.nodeList[index]
        if (element.businesstype === '03') {
          element.targetids = element.targetids.join(',')
        }
        if (element.operation || element.businesstype || element.targetids) {
          flag = false
        }
        if (element.operation && element.operation !== '01' && element.operation !== '04') {
          if (!element.businesstype) {
            this.$message(`请选择第${index + 1}行节点配置类型！`)
            return
          }
          if (!element.targetids) {
            this.$message(`请选择第${index + 1}行配置内容！`)
            return
          }
        }
      }
      if (flag) {
        this.$message(`请至少填写一行！`)
        return
      }
      console.log(obj)
      this.loading = true
      replace(obj).then(rt => {
        this.loading = false
        if (rt.status === '200') {
          this.$message.success(this.$t('hintText.operateSuccessfully'))
          this.$emit('confirm', 'true')
          this.dialogVisible = false
        }
      }).catch(er => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
#replaceDialog {
  .el-table th,
  .el-table td {
    text-align: center;
  }
}
</style>
