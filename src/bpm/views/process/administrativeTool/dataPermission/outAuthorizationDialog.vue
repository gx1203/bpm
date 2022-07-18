<template>
  <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" class="outAuthorizationDialog" @close="closeDialog" width="60%">
    <el-form :model="dataAuthority" ref="dataAuthority" label-width="auto" :rules="rules" class="content padding-right">
      <el-form-item :label="$t('menuName') + '：'" prop="menuname" >
        <el-input clearable v-model="dataAuthority.menuname"   @click.native="fnBasNavigation()" />
      </el-form-item>
      <el-form-item :label="$t('authorizedOrganization') + '：'" prop="grantorgname" >
        <el-input clearable v-model="dataAuthority.grantorgname"   @click.native="fnBasOrganieation('grantorg')" type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('authority') + '：'">
        <el-checkbox-group v-model="checkedMenumethod">
          <template v-for="method in dataAuthority.menumethod">
            <el-checkbox v-if="method.isdefault === '0'" disabled checked :label="method.name" :key="method.id"></el-checkbox>
            <el-checkbox v-else-if="method.selected" checked :label="method.name" @change="fnCheckMenumethod(method)" :key="method.id"></el-checkbox>
            <el-checkbox v-else :label="method.name" @change="fnCheckMenumethod(method)" :key="method.id"></el-checkbox>
          </template>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :label="$t('conditionType') + '：'" prop="conditiontype">
        <el-radio-group v-model="dataAuthority.conditiontype">
          <el-radio label="0">{{ $t('byOrganizationalScope') }}</el-radio>
          <el-radio label="1">{{ $t('customCondition') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dataAuthority.conditiontype === '1'" :label="$t('judgmentLogic') + '：'">
        <el-radio-group v-model="dataAuthority.conditionmethod">
          <el-radio label="0">
            {{ $t('satisfy') }}
            <span>
              <span class="required">{{ $t('allHave') }}</span> {{ $t('conditionsAndSubCombinations') }}
            </span>
          </el-radio>
          <el-radio label="1">
            {{ $t('satisfy') }}
            <span class="required">{{ $t('either') }}</span> {{ $t('conditionOrSubCombination') }}
          </el-radio>
        </el-radio-group>
        <el-button type="primary" @click="addList" class="float-r">
          {{ $t('addRule') }}
        </el-button>
      </el-form-item>
      <el-table
        v-if="dataAuthority.conditiontype === '1'"
        :data="conditionsList"
        stripe
        :header-cell-style="{background: '#E1EAFD !important'}"
        highlight-current-row
        style="width:100%;margin:15px 0;">
        <el-table-column min-width="140" align="center">
          <template slot="header">
            <span class="required">*</span>
            {{ $t('fieldNames') }}
          </template>
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.field"
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')">
              <el-option
                v-for="item in fieldList"
                :key="item.fieldname"
                :label="item.showname"
                :value="item.fieldname">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column min-width="140" align="center">
          <template slot="header">
            <span class="required">*</span>
            {{ $t('conditionType') }}
          </template>
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.conditioninfo"
              clearable
              class="w100"
              :placeholder="$t('placeholderText.pleaseSelect')">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="180">
          <template slot="header">
            <span class="required">*</span>
            {{ $t('conditionalResult') }}
          </template>
          <template slot-scope="scope">
            <div v-show="scope.row.conditioninfo === '5' || scope.row.conditioninfo === '6' || scope.row.conditioninfo === '7' || scope.row.conditioninfo === '8'">
              <el-input v-model="scope.row.result" maxlength="100" clearable show-word-limit>
              </el-input>
            </div>
            <div v-show="scope.row.conditioninfo === '1' || scope.row.conditioninfo === '2' || scope.row.conditioninfo === '3' || scope.row.conditioninfo === '4'" style="text-align: right;">
              <p>
                {{ $t('max') }}：
                <el-input :min="scope.row.minval" v-model="scope.row.maxval" clearable maxlength="10" show-word-limit oninput="value = value.replace(/[^\d.-]/g,'')" style="width: 50%; min-width: 100px;"></el-input>
              </p>
              <p>
                {{ $t('min') }}：
                <el-input :max="scope.row.maxval" maxlength="10" show-word-limit clearable v-model="scope.row.minval" oninput="value = value.replace(/[^\d.-]/g,'')" style="width: 50%; min-width: 100px;"></el-input>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" align="center" width="60">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" @click="deleteList(scope.$index)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item v-if="dataAuthority.conditiontype === '0'" :label="$t('dataRange') + '：'" prop="datascope">
        <el-radio-group v-model="dataAuthority.datascope">
          <el-radio label="ALL">{{ $t('all') }}</el-radio>
          <el-radio label="COMPANY">{{ $t('ourCompany') }}</el-radio>
          <el-radio label="DEPT">{{ $t('ourDepartment') }}</el-radio>
          <el-radio label="POSTORG">{{ $t('ourPost') }}</el-radio>
          <el-radio label="OTHER">{{ $t('other') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dataAuthority.conditiontype === '0' && dataAuthority.datascope === 'OTHER'" prop="orgscopename" :label="$t('organizationalScope') + '：'" >
        <el-input clearable v-model="dataAuthority.orgscopename"  @click.native="fnBasOrganieation('orgscope')" type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('remarks') + '：'">
        <el-input clearable type="textarea" v-model="dataAuthority.comments" />
      </el-form-item>
      <el-form-item :label="$t('state') + '：'" prop="status">
        <el-radio-group v-model="dataAuthority.status">
          <el-radio label="0">{{ $t('enable') }}</el-radio>
          <el-radio label="1">{{ $t('disable') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('dataAuthority')">{{ $t('confirm') }}</el-button>
    </span>
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="orgtitle"
      :multiple="basOrganieationMultiple"
      @fnCallBack="fnBasOrganieationCallBack"/>
    <bas-navigation-select v-model="basNavigationSelectShow" :multiple="basNavigationSelectShowMultiple" @callBack="fnBasNavigationCallBack"></bas-navigation-select>
  </el-dialog>
</template>
<script>
import Vue from 'vue'
import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'
import { saveDataAuthority, get, getMenuMethod, getFieldListByReportId } from '@/bpm/api/process/administrativeTool/dataPermission'
import BasNavigationSelect from '../../../../components/basComponents/BasNavigation/BasNavigationSelect'
import {
  getDictionaryOption
} from '@/bpm/api/process/processModeling/classificationModel'
export default {
  data() {
    return {
      dialogVisible: this.value,
      dataScope: 0,
      checkedMenumethod: [],
      dataAuthority: {
        status: '0',
        datascope: 'ALL',
        conditiontype: '0',
        conditionmethod: '0',
        menuname: '',
        grantorgname: '',
        orgscopename: ''
      },
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ["9"],
      orgtitle: '',
      basOrganieationMultiple: true,
      orgtype: '',
      basNavigationSelectShow: false,
      basNavigationSelectShowMultiple: false,
      conditionsList: [],
      judgingList: [],
      fieldList: [],
      conditionalResultList: [],
      typeList: [],
      rules: {
        menuname: [
          { required: true, message: this.$t('placeholderText.pleaseSelectMenu'), trigger: 'change' }
        ],
        grantorgname: [
          { required: true, message: this.$t('placeholderText.pleaseSelectAuthorizedOrganization'), trigger: 'change' }
        ],
        conditiontype: [
          { required: true, message: this.$t('placeholderText.pleaseSelectConditionType'), trigger: 'change' }
        ],
        datascope: [
          { required: true, message: this.$t('placeholderText.pleaseSelectDataRange'), trigger: 'change' }
        ],
        orgscopename:[
          { required: true, message: this.$t('placeholderText.pleaseSelectAnOrganization'), trigger: 'change' }
        ],
        status:[
          { required: true, message: this.$t('placeholderText.pleaseSelectStatus'), trigger: 'change' }
        ]
      }
    };
  },
  components: {
    BasNavigationSelect
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
    },
    title: {
      type: String,
      default: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.dataAuthority = {
          status: '0',
          datascope: 'ALL',
          conditiontype: '0',
          conditionmethod: '0',
          menuname: '',
          grantorgname: '',
          orgscopename: ''
        }
        this.fnGet(this.item)
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getDictionaryOption () {
      getDictionaryOption({
        dictionaryen: 'dataAuthorityConditionType'
      }).then(rt => {
        this.typeList = rt.data || []
      })
    },
    closeDialog () {
      // this.$nextTick(() => {
      //   this.conditionsList = []
      //   this.fieldList = []
      //   this.$refs['dataAuthority'].resetFields();
      // })
    },
    addList (type) {
      this.conditionsList.push({
        field: '',
        fieldname: '',
        conditioninfo: "",
        result: "",
        maxval: 0,
        minval: 0
      });
    },
    deleteList (index) {
      this.conditionsList.splice(index, 1);
    },
    fnGet(item){
      if(item && item.id){
        get(item.id)
        .then(rt => {
          if (rt.status === "200") {
            this.checkedMenumethod = []
            this.dataAuthority = rt.data
            if (this.dataAuthority.grantorg) {
              let namelist = []
              this.dataAuthority.grantorg.forEach((item2, i) => {
                namelist.push(item2.orgname)
              });
              this.dataAuthority.grantorgname= namelist.join('&')
            }
            if (this.dataAuthority.orgscope) {
              let namelist=[]
              this.dataAuthority.orgscope.forEach((item2, i) => {
                namelist.push(item2.orgname)
              });
              this.$set(this.dataAuthority, 'orgscopename', namelist.join('&'))
            }
            if (!this.dataAuthority.conditionmethod) {
              this.$set(this.dataAuthority, 'conditionmethod', '0')
            }
            this.conditionsList = this.dataAuthority.conditionDtos || []
            if (this.dataAuthority.reportId) {
              this.getFieldListByReportId(this.dataAuthority.reportId)
            }
          }
        }).catch(() => {
        });
      }
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.dataAuthority.conditionDtos = this.conditionsList
          for (let i = 0, len = this.dataAuthority.conditionDtos.length; i < len; i++) {
            let item = this.dataAuthority.conditionDtos[i]
            if (!item.field) {
              this.$message.error(this.$t('placeholderText.pleaseSelectFieldName'))
              return
            }
            if (!item.conditioninfo) {
              this.$message.error(this.$t('placeholderText.pleaseSelectConditionType'))
              return
            } else {
              if (item.conditioninfo === '1' || item.conditioninfo === '2' || item.conditioninfo === '3' || item.conditioninfo === '4') {
                if (!item.minval) {
                  this.$message.error(this.$t('placeholderText.pleaseEnterMinValue'))
                  return
                }
                if (!item.maxval) {
                  this.$message.error(this.$t('placeholderText.pleaseEnterMaxValue'))
                  return
                }
              }
              if ((item.conditioninfo === '5' || item.conditioninfo === '6' || item.conditioninfo === '7' || item.conditioninfo === '8')) {
                if (!item.result) {
                  this.$message.error(this.$t('placeholderText.pleaseEnterConditionalResult'))
                  return
                }
              }
            }
          }
          saveDataAuthority(this.dataAuthority)
            .then(rt => {
              this.loading = false
              if (rt.status === '200') {
                this.$message.success(this.$t('hintText.saveSuccessfully'))
                this.$emit("confirm", this.dataAuthority);
                this.dialogVisible = false;
              }else{
                this.$message.success(this.$t('hintText.failToSave'))
              }
          }).catch(() => {
            this.loading = false
          });
        }
      })
    },
    cancel() {
      this.dialogVisible = false;
    },
    fnCheckMenumethod(method){
      if(method.selected){
        method.selected = null
      }else{
        method.selected = method.id
      }
    },
    fnBasNavigation(){
      this.basNavigationSelectShow = true;
    },
    fnBasOrganieation(type){
      this.orgtype = type
      this.selectedElement = {};
      if(type === 'grantorg'){
        this.selectElement = ["0","1","2","3","4","5","9"]
        this.orgtitle = this.$t('selectAuthorizedOrganization')
        if (this.dataAuthority.grantorg) {
          let list = '';
          let idType = []
          let idlist=[]
          let namelist=[]
          this.dataAuthority.grantorg.forEach((item2, i) => {
            idType.push(`${item2.orgid}-${item2.orgtype}`)
            idlist.push(item2.orgid)
            namelist.push(item2.orgname)
          });
          if (idlist.length > 0) {
            this.selectedElement = {
              id: idlist,
              name: namelist.join("&"),
              idType: idType.join(";"),
            }
          }
        }
        this.organieationShow = true
      } else {
        this.selectElement=["0","1","2","3","4","5"]
        this.orgtitle = this.$t('selectTheOrganizationScope')
        if (this.dataAuthority.orgscope) {
          let list = '';
          let idType = []
          let idlist=[]
          let namelist=[]
          this.dataAuthority.orgscope.forEach((item2, i) => {
            idType.push(`${item2.orgid}-${item2.orgtype}`)
            idlist.push(item2.orgid)
            namelist.push(item2.orgname)
          });
          if (idlist.length > 0) {
            this.selectedElement = {
              id: idlist,
              name: namelist.join("&"),
              idType: idType.join(";"),
            }
          }
        }
        this.organieationShow = true
      }

    },
    fnBasOrganieationCallBack(data) {
      let org = []
      if (data.idType && data.idType.length > 0) {
        let idTypes = data.idType.split(";")
        let names = data.name.split("&")
        for(let i = 0 ; i < idTypes.length ; i++ ){
          org.push({
            orgid:idTypes[i].split('-')[0],
            orgtype:idTypes[i].split('-')[1],
            orgname:names[i],
            type:this.orgtype
          })
        }
      }
      if(this.orgtype==='grantorg'){
        this.dataAuthority.grantorgname = data.name
        this.dataAuthority.grantorg = [...org]
      }else{
        this.$set(this.dataAuthority, 'orgscopename', data.name)
        this.dataAuthority.orgscope = [...org]
      }
      this.organieationShow = false;
    },
    fnBasNavigationCallBack(data){
      if(data.length > 0){
        this.fieldList = []
        this.dataAuthority.menuid = data[0].id
        this.dataAuthority.menuname = data[0].name
        let url = data[0].url
        getMenuMethod({
          menuid:data[0].id,
          dataauthorityid:this.dataAuthority.id
        }).then(rt => {
          if (rt.status === "200") {
            this.checkedMenumethod = []
            this.dataAuthority.menumethod = rt.data
          }
        }).catch(() => {
        });
        if (url && url.indexOf("?") !== -1 && url.split("?")[0] === 'projectApproval') {
          let query = this.getQueryString(url)
          if (query.id) {
            this.getFieldListByReportId(query.id)
          }
        }
      } else {
        this.dataAuthority.menuid = ''
        this.dataAuthority.menuname = ''
      }
    },
    getQueryString (item) {
      let str = item.split("?")[1];
      let arr1 = str.split("&");
      let obj = {};
      for (let i = 0; i < arr1.length; i++) {
        obj[arr1[i].split("=")[0]] = arr1[i].split("=")[1];
      }
      return obj;
    },
    getFieldListByReportId(reportId) {
      getFieldListByReportId(reportId).then(rt => {
        if (rt.status === "200") {
          this.fieldList = rt.data || []
          this.fieldList.forEach(item => {
            item.showname = item.showname ? item.showname : item.fieldname
          })
        }
      }).catch(() => {
      })
    }
  },
  mounted() {
    this.getDictionaryOption()
  }
};
</script>

<style lang="scss" scoped>
.outAuthorizationDialog {
  /deep/ .el-dialog {
    margin-top: 6vh !important;
    .el-dialog__body {
      height: 450px;
      overflow: auto;
      .content {
        width: 90%;
        margin: 0 auto;
        .el-input__inner {
          // border: none;
          border-bottom: 1px solid #e5e5e5;
        }
      }
    }
  }
}
.w100 {
  width: 100%;
}
</style>
