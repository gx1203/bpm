<template>
  <div id="childNodes" v-loading="load">
    <el-form ref="ruleForm">
      <el-row type="flex" class="header" align="middle">
<!--        <el-col :span="2">
          {{ $t('operation') }}
        </el-col>-->
        <el-col :span="3">
          {{ $t('tabPageID') }}
        </el-col>
        <el-col :span="3">
          {{ $t('sort') }}
        </el-col>
        <el-col :span="3">
          {{ $t('tabPageTitle') }}
        </el-col>
        <el-col :span="3">
          {{ $t('containerType') }}
        </el-col>
        <!-- <el-col :span="3">版本号</el-col> -->
        <el-col :span="3">
          <span class="col-red">*</span> {{ $t('showSeveralColumnsPerRow') }}
        </el-col>
        <el-col :span="2">
          {{ $t('areaAt') }}
        </el-col>
        <el-col :span="3">
          {{ $t('includePagePath') }}
        </el-col>
        <el-col :span="2">
          {{ $t('operation') }}
        </el-col>
      </el-row>
      <el-row v-for="(item, index) in ruleForm.nodeTabs" :key="item.key" type="flex" align="middle">
<!--        <el-col :span="2" class="center">
          <el-form-item>
            <el-button type="text" :title="$t('delete')" icon="el-icon-delete" @click="handleDeleteOne(item,index)" />
            <el-button v-if="item.id" type="text" title="添加子tab" icon="el-icon-edit" @click="getNodeTab(item.id)" />
          </el-form-item>
        </el-col>-->
        <el-col :span="3">
          <el-form-item>
            <el-input v-model="item.id" clearable type="type" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-input v-model="item.sort" clearable min="1" type="number"
              on-keypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-input v-model="item.tabname" clearable type="type" />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="item.istab" clearable :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="3">
                  <el-form-item>
                    <el-select clearable v-model="item.processversion" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                    <el-option
                      v-for="item in versions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col> -->
        <el-col :span="3">
          <el-form-item>
            <!-- <el-input v-model="item.fieldcol" clearable min="1"
              on-keypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" /> -->
             <el-select v-model="item.fieldcol" clearable :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
              <el-option v-for="item in fieldcolList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-input v-model="item.tips" @click.native="tipsDialogShow(index)" :disabled="item.istab === '1'" clearable
              type="text" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-input v-model="item.containpage" clearable type="type" />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="text" :title="$t('delete')" icon="el-icon-delete" @click="handleDeleteOne(item,index)" />
            <el-button v-if="item.id" type="text" title="添加子tab" icon="el-icon-edit" @click="getNodeTab(item.id)" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="text-r">
      <el-button @click="add">
        {{ $t('addTab') }}
      </el-button>
      <el-button type="primary" @click="submit">
        {{ $t('submit') }}
      </el-button>
    </div>
    <AddtipsDialog v-model="tipsDialog" :content="tipsContent" :title="$t('areaAt')" @confirm="getTipsContent" />
  </div>
</template>
<script>
import AddtipsDialog from './AddtipsDialog'
import { now } from 'moment-mini'
import { saveProcessNodeTab, getProcessNodeTab, deleteProcessNodeTab } from '@/bpm/api/process/processModeling/classificationModel'
export default {
  name: 'ChildNodes',
  components: {
    AddtipsDialog
  },
  props: {
    content: {
      type: Object
    },
    treeData: {
      type: Object,
    }
  },
  data () {
    return {
      tipsDialog: false,
      tipsContent: '',
      tipsIndex: '',
      load: false,
      ruleForm: {},
      options: [{
        value: '0',
        label: 'AREA'
      }, {
        value: '1',
        label: 'TAB'
      }],
      fieldcolList:[
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'},
      ],
      versions: []
    }
  },
  computed: {},
  watch: {
    content (val) {
      this.ruleForm = val
      this.versions = []
      this.versions.push({
        value: '',
        label: this.$t('noVersionNumber')
      })
      if (val.versions && val.versions.length > 0) {
        val.versions.forEach(element => {
          this.versions.push({
            value: element,
            label: element
          })
        })
      }
    }
  },
  mounted () {

  },
  methods: {
    treeRefresh() {
      this.$emit("treeRefresh");
    },
    tipsDialogShow (i) {
      let data = Object.assign({}, this.ruleForm.nodeTabs[i])
      if (data.istab === '0') {
        this.tipsContent = data.tips
        this.tipsIndex = i
        this.tipsDialog = true
      }
    },
    getTipsContent (data) {
      console.log(data)
      this.$set(this.ruleForm.nodeTabs[this.tipsIndex], 'tips', data)
    },
    // 删除字段
    handleDeleteOne (item, index) {
      if (item.id) {
        deleteProcessNodeTab({
          'nodeTabId': item.id
        }).then((rt) => {
          this.load = false
          if (rt.status === '200') {
            this.treeRefresh()
            this.ruleForm.nodeTabs.splice(index, 1)
          }
        }).catch((er) => {
          this.load = false
        })
      } else {
        this.ruleForm.nodeTabs.splice(index, 1)
      }
    },
    // 添加字段
    add () {
      this.ruleForm.nodeTabs.push({
        processversion: null,
        istab: '0',
        sort: (this.ruleForm.nodeTabs.length + 1) * 10
      })
    },
    getNodeTab (id) {
      this.versions = []
      this.versions.push({
        value: null,
        label: this.$t('noVersionNumber')
      })
      this.load = true
      getProcessNodeTab({
        'processNodeId': this.ruleForm.processNodeId,
        'tabpid': id,
        'version': this.treeData.version
      }).then((rt) => {
        this.load = false
        this.ruleForm = rt.data
        if (rt.data.versions && rt.data.versions.length > 0) {
          rt.data.versions.forEach(element => {
            this.versions.push({
              value: element,
              label: element
            })
          })
        }
      }).catch((er) => {
        this.load = false
      })
    },
    submit () {
      let flag = false
      const nodeTabs = JSON.parse(JSON.stringify(this.ruleForm.nodeTabs))
      nodeTabs.forEach(element => {
        element.processversion = element.processversion === null ? '' : element.processversion
        if (!element.fieldcol) {
          flag = true
        }
      })
      if (flag) {
        this.$message(this.$t('hintText.requiredFieldsCannotBeEmpty'))
        return false
      }
      for (let index = 0; index < nodeTabs.length; index++) {
        if (nodeTabs[index].sort.length > 10) {
          this.$message.error(`第${index + 1}行排序超长！！`)
          return false
        } else if (nodeTabs[index].tabname.length > 100) {
          this.$message.error(`第${index + 1}行Tab页标题超长！！`)
          return false
        } else if (nodeTabs[index].fieldcol.length > 10) {
          this.$message.error(`第${index + 1}行每行展示几列超长！！`)
          return false
        }
      }

      this.load = true
      saveProcessNodeTab({
        'formid': this.ruleForm.formid,
        'nodeTabs': nodeTabs,
        'processNodeId': this.ruleForm.processNodeId,
        'tabpid': this.ruleForm.tabpid
      }).then((rt) => {
        this.load = false
        if (rt.status === '200') {
          this.$message.success(this.$t('hintText.submittedSuccessfully'))
          this.treeRefresh()
          this.getNodeTab(this.ruleForm.tabpid)
        }
      }).catch((er) => {
        this.load = false
      })
    }
  }
}
</script>
<style lang="scss">
#childNodes {
  .el-form-item__content {
    padding: 7px;
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
#childNodes {
  .header {
    font-size: 12px;
    font-weight: bold;
    color: $tc1;
    background: #e1eafd;
    margin-top: 20px;
    .el-col {
      padding: 10px;
    }
  }
  .col-red {
    color: $tc4;
  }
  .center {
    // text-align: center;
  }
}
</style>
