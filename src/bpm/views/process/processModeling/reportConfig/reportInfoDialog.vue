<template>
  <el-dialog :title="title" v-loading="loading" width="80%" :visible.sync="dialogVisible" append-to-body>
    <div>
      <el-form ref="item">
        <el-row>
          <el-col :span="24">
            <el-table
              :data="content"
              stripe
              :header-cell-style="{background: '#E1EAFD !important'}"
              highlight-current-row
              style="width: 100%; margin-bottom: 10px"
              ref="multipleTable"
              height="400"
            >
              <el-table-column type="index" align="center" width="50"></el-table-column>
              <el-table-column prop="fieldname" align="center" :label="$t('fieldName')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="showname" align="center" :label="$t('chineseName2')" show-overflow-tooltip>
              <template slot-scope="scope">
                  <el-input :disabled="getDisabledAction(scope.row)" clearable v-model="scope.row.showname"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="shownameen" align="center" :label="$t('englishName')">
                <template slot-scope="scope">
                  <el-input :disabled="getDisabledAction(scope.row)" clearable v-model="scope.row.shownameen"></el-input>
                </template>
              </el-table-column>
              <!-- 列表显示 -->
              <el-table-column align="center" label show-overflow-tooltip>
                <template slot="header">
                  <el-checkbox
                    :indeterminate="isIndeterminateAction(content,'listshow')"
                    true-label="Y"
                    @change="checkHandle('listshow')"
                    v-model="listshow"
                  >
                    {{ $t('listDisplay') }}
                  </el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox
                    :checked="scope.row.listshow==='Y'"
                    true-label="Y"
                    false-labe="N"
                    :disabled="getDisabledAction(scope.row)"
                    @change="changeAction"
                    v-model="scope.row.listshow"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <!-- 可以导出 -->
              <el-table-column align="center">
                <template slot="header">
                  <el-checkbox
                  :indeterminate="isIndeterminateAction(content,'exportshow')"
                    true-label="Y"
                    false-labe="N"
                    @change="checkHandle('exportshow')"
                    v-model="exportshow"
                  >
                    {{ $t('canExport') }}
                  </el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox
                    :checked="scope.row.exportshow==='Y'"
                    true-label="Y"
                    false-labe="N"
                    :disabled="getDisabledAction(scope.row)"
                    @change="changeAction"
                    v-model="scope.row.exportshow"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column align="center">
                <template slot="header">
                  <el-checkbox
                  :indeterminate="isIndeterminateAction(content,'linkshow')"
                    true-label="Y"
                    false-labe="N"
                    @change="checkHandle('linkshow')"
                    v-model="linkshow"
                  >
                    {{ $t('whetherLink') }}
                  </el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox
                    :checked="scope.row.linkshow==='Y'"
                    true-label="Y"
                    false-labe="N"
                    :disabled="getDisabledAction(scope.row)"
                    @change="changeAction"
                    v-model="scope.row.linkshow"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column align="center">
                <template slot="header">
                  <el-checkbox
                  :indeterminate="isIndeterminateAction(content,'searchshow')"
                    true-label="Y"
                    false-labe="N"
                    @change="checkHandle('searchshow')"
                    v-model="searchshow"
                  >
                    {{ $t('queryConditions') }}
                  </el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox
                    :checked="scope.row.searchshow==='Y'"
                    true-label="Y"
                    false-labe="N"
                    :disabled="getDisabledAction(scope.row)"
                    @change="changeAction"
                    v-model="scope.row.searchshow"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column align="center">
                <template slot="header">
                  <el-checkbox
                  :indeterminate="isIndeterminateAction(content,'multiplesearch')"
                    true-label="Y"
                    false-labe="N"
                    @change="checkHandle('multiplesearch')"
                    v-model="multiplesearch"
                  >
                    {{ $t('multipleQueries') }}
                  </el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox
                    :checked="scope.row.multiplesearch==='Y'"
                    true-label="Y"
                    false-labe="N"
                    :disabled="getDisabledAction(scope.row)"
                    @change="changeAction"
                    v-model="scope.row.multiplesearch"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('sort')" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input :disabled="getDisabledAction(scope.row)" clearable
                    v-model="scope.row.sortid"
                    type="number"
                    min="0"
                    onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"

                  />
                </template>
              </el-table-column>
                <el-table-column align="center" :label="$t('dataSource')">
                <template slot-scope="scope">
                  <el-input :disabled="getDisabledAction(scope.row)" clearable v-model="scope.row.datasource" @clear.native.stop="clearHandle"  @focus="showDdialog(scope.$index)"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <dictionaryDialog :item='selectDictionary' v-model="dialogShow" @confirm="getDictionary" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" :disabled="content.length == 0" @click="submit">{{ $t('save') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dictionaryDialog from '@/bpm/components/dictionaryDialog'
import {
  queryDetailList,
  saveDetail
} from "@/bpm/api/process/processModeling/report_config";
export default {
  components:{
    dictionaryDialog,
  },
  data() {
    return {
      dialogVisible: this.value,
      content: [],
      selectDictionary:'',
      dialogShow: false,
      listshow: false,
      exportshow: false,
      linkshow: false,
      searchshow: false,
      multiplesearch: false,
      checkIndex: -1,
      loading: false
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
    },
    title: {
      type: String,
      default: false
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.getData();
      }
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    // 是否禁用             
    getDisabledAction (item) {
      if (item.fieldname === 'REQDATE' || item.fieldname === 'REQUSERID' || item.fieldname === 'REQDEPT' || item.fieldname === 'REQUSER') {
        return true
      }
      return false
    },
    // 设置组织是否全部
    setOrdAllTrueAction(list) {
      this.listshow = this.isAllTrueAction(list,'listshow')
      this.exportshow = this.isAllTrueAction(list,'exportshow')
      this.linkshow = this.isAllTrueAction(list,'linkshow')
      this.searchshow = this.isAllTrueAction(list,'searchshow')
      this.multiplesearch = this.isAllTrueAction(list,'multiplesearch')
    },
    // 判断是否全部为true和false
    isAllTrueAction(list,type){
      let trueFalseList = this.getTrueFalseListTAction(list,type)
      if (trueFalseList.indexOf('N') === -1)  {
        return true
      } else if (trueFalseList.indexOf('Y') === -1) {
        return false
      } else {
        return false
      }
    },
    checkHandle(key) {
      let _this = this
      _this.content.forEach(item => {
        if (item.fieldname === 'REQDATE' || item.fieldname === 'REQUSERID' || item.fieldname === 'REQDEPT' || item.fieldname === 'REQUSER') {
          _this.$set(item,key,'Y')
        } else {
          _this.$set(item,key,_this[key]?_this[key]:'N')
        }
      });
    },
    changeAction(info) {
      this.setOrdAllTrueAction(this.content)
    },
    // 判断是否为中间状态
    isIndeterminateAction(list,type) {
      let trueFalseList = this.getTrueFalseListTAction(list,type)
      if (list.length === 1) {
        return false
      }
      if (trueFalseList.indexOf('Y') !== -1 && trueFalseList.indexOf('N') !== -1) {
        return true
      } else {
        return false
      }
    },
    /// 获取对应的状态数组
    getTrueFalseListTAction(list,type) {
      let trueFalseList = []
      list.forEach((item) => {
        if (type === 'listshow') {
          trueFalseList.push(this.isJudgeStrNull(item.listshow))
        }
        if (type === 'exportshow') {
          trueFalseList.push(this.isJudgeStrNull(item.exportshow))
        }
        if (type === 'linkshow') {
          trueFalseList.push(this.isJudgeStrNull(item.linkshow))
        }
        if (type === 'searchshow') {
          trueFalseList.push(this.isJudgeStrNull(item.searchshow))
        }
        if (type === 'multiplesearch') {
          trueFalseList.push(this.isJudgeStrNull(item.multiplesearch))
        }
      })
      return trueFalseList
    },
    isJudgeStrNull(val) {
      if (val !== null && val !== undefined && val !== '') {
        return val
      }
      return 'N'
    },
      clearHandle(){
       this.content[this.checkIndex].datasource = ''
    },
    getDictionary (data) {
      this.$set( this.content[this.checkIndex],'datasource',data.dictionaryen)
    },
    showDdialog (i) {
      this.checkIndex = i
      this.selectDictionary = this.content[this.checkIndex].datasource
      this.dialogShow = true
    },
    getData() {
      this.loading = true;
      queryDetailList(this.item.id)
        .then(rt => {
          if (rt.status === "200") {
            // this.content = rt.data.map(item=>item)
            // this.content = this.initList
            this.content = []
            for (let index = 0; index < rt.data.length; index ++) {
              let item = rt.data[index]
              if (item.fieldname !== 'ID') {
                this.content.push(item)
              }
            }
            this.setOrdAllTrueAction(this.content)
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    submit(formName) {
      this.loading = true;
      this.content.forEach(item=>{
        if(!item.listshow){
          item.listshow = "N"
        }
        if(!item.exportshow){
          item.exportshow = "N"
        }
        if(!item.searchshow){
          item.searchshow = "N"
        }
        if(!item.linkshow){
          item.linkshow = "N"
        }
        if(!item.multiplesearch){
          item.multiplesearch = "N"
        }
      })
      saveDetail({
        reportId: this.item.id,
        data: this.content
      })
        .then(rt => {
          if (rt.status === "200") {
            this.loading = false;
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: "success"
            });
            this.dialogVisible = false;
            this.$emit("confirm", true);
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
    cancel() {
      this.dialogVisible = false;
    }
  },
  mounted() {}
};
</script>

<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
}
</style>
