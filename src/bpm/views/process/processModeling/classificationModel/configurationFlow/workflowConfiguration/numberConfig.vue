<template>
  <div id="subjectConfig" v-loading="load">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
      <el-row class="hint" align="left">
        <el-col :span="24">
          {{ $t('dragAndDropSort') }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item :label="$t('setDigits') + '：'" style="margin-bottom:0;display: flex;align-items: center;" prop="length">
            <el-input-number v-model.number="ruleForm.length" :step="1" step-strictly :min="3" style="width:80%;" />
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item :label="$t('resetCycle') + '：'" style="margin-bottom:0;display: flex;align-items: center;" prop="rule">
            <el-select v-model="ruleForm.rule" clearable :placeholder="$t('placeholderText.pleaseSelect')" style="width:80%;">
              <el-option
                v-for="item in restList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="header" align="middle">
<!--        删除操作按钮重复-->
<!--        <el-col :span="2">
          {{ $t('operation') }}
        </el-col>-->
        <el-col :span="9">
          {{ $t('type') }}
        </el-col>
        <el-col :span="9">
          {{ $t('numberingRules') }}
        </el-col>
        <el-col :span="2">
          {{ $t('operation') }}
        </el-col>
      </el-row>
      <draggable v-model="ruleForm.nodeTabs" dragable="true">
        <el-row
          v-for="(item, index) in ruleForm.nodeTabs"
          :key="item.key"
          type="flex"
          align="middle"
        >
<!--          删除操作按钮重复-->
<!--          <el-col :span="2" class="center">
            <el-form-item>
              <el-button
                type="text"
                :title="$t('delete')"
                icon="el-icon-delete"
                @click="handleDeleteOne(item,index)"
              />
            </el-form-item>
          </el-col>-->
          <el-col :span="9">
            <el-form-item>
              <el-select v-model="item.type" clearable :placeholder="$t('placeholderText.pleaseSelect')" @change="changType(index)">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-select
                v-if="item.type ==='1'"
                v-model="item.value"
                clearable
                :placeholder="$t('placeholderText.pleaseSelect')"
                class="w100"
              >
                <el-option
                  v-for="item in tiemList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-if="item.type ==='2'"
                v-model="item.value"
                clearable
                :placeholder="$t('placeholderText.pleaseSelect')"
                class="w100"
              >
                <el-option
                  v-for="item in formList"
                  :key="item.fieldName"
                  :label="item.fieldShowName"
                  :value="item.fieldName"
                />
              </el-select>
              <el-input v-if="item.type ==='3'" v-model="item.value" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button
                type="text"
                :title="$t('delete')"
                icon="el-icon-delete"
                @click="handleDeleteOne(item,index)"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </draggable>
    </el-form>
    <div class="text-r">
      <el-button @click="add">
        {{ $t('addRule') }}

      </el-button>
      <el-button type="primary" @click="submit('ruleForm')">
        {{ $t('submit') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { getFieldList } from '@/bpm/api/process/processModeling/subject_config'
import { saveReqNoRule, deleteReqNoRule } from '@/bpm/api/process/processModeling/number_config'
import draggable from 'vuedraggable'

export default {
  name: 'SubjectConfig',
  components: {
    draggable
  },
  props: {
    content: {
      type: Array
    },
    treeData: {
      type: Object
    },
    formList: {
      type: Array
    }
  },
  data() {
    return {
      load: false,
      ruleForm: {
        rule: '',
        length: '3',
        nodeTabs: []
      },
      rules: {
        rule: [{ required: true, message: this.$t('hintText.theNumberOfDigitsCannotBeEmpty'), trigger: 'blur' }],
        length: [{ required: true, message: this.$t('hintText.theResetPeriodCannotBeEmpty'), trigger: 'blur' }]
      },
      restList: [{
        value: '1',
        label: this.$t('everyDay')
      }, {
        value: '30',
        label: this.$t('everyMonth')
      }, {
        value: '365',
        label: this.$t('everyYear')
      }],
      tiemList: [{
        value: 'yyyy',
        label: this.$t('year')
      }, {
        value: 'yyyyMM',
        label: this.$t('yearMonth')
      }, {
        value: 'yyyyMMdd',
        label: this.$t('yearMonthDay')
      }],
      typeList: [{
        value: '1',
        label: this.$t('date')
      }, {
        value: '2',
        label: this.$t('field')
      }, {
        value: '3',
        label: this.$t('text')
      }],
      value: '',
      subjectruleList: []
    }
  },
  computed: {},
  watch: {
    content(val) {
      if (val && val.length > 0) {
        this.ruleForm.rule = val[val.length - 1].rule
        this.ruleForm.length = val[val.length - 1].length ? val[val.length - 1].length : '3'
      } else {
        this.ruleForm.rule = ''
        this.ruleForm.length = '3'
      }
      this.ruleForm.nodeTabs = val
    }
  },
  mounted() {

  },
  methods: {
    changType(i) {
      this.$set(this.ruleForm.nodeTabs[i], 'value', '')
    },
    // 删除字段
    handleDeleteOne(item, index) {
      if (item.id) {
        this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
          type: 'warning'
        })
          .then(() => {
            this.load = true
            deleteReqNoRule(item.id)
              .then(rt => {
                this.load = false
                if (rt.status === '200') {
                  this.$message({
                    message: this.$t('hintText.successfullyDelete'),
                    type: 'success'
                  })
                  this.$emit('confirm', true)
                }
              })
              .catch(er => {
                this.load = false
              })
          })
          .catch(_ => {})
      } else {
        this.ruleForm.nodeTabs.splice(index, 1)
      }
    },
    // 添加字段
    add() {
      this.ruleForm.nodeTabs.push({
        rule: this.ruleForm.rule,
        length: this.ruleForm.length,
        type: '3'
      })
    },
    submit(formName) {
      if (this.ruleForm.nodeTabs && this.ruleForm.nodeTabs.length > 0) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const nodeTabs = JSON.parse(JSON.stringify(this.ruleForm.nodeTabs))
            nodeTabs.forEach((element, index) => {
              element.sort = index + 1
              element.processid = this.treeData.id
              element.length = this.ruleForm.length
              element.rule = this.ruleForm.rule
              element.version = this.treeData.version
            })
            this.load = true
            saveReqNoRule(nodeTabs).then(rt => {
              this.load = false
              if (rt.status === '200') {
                this.$message.success(this.$t('hintText.submittedSuccessfully'))
                this.$emit('confirm', true)
              }
            }).catch(er => {
              this.load = false
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
#subjectConfig {
  .hint {
    color: $active-color;
  }
  .el-form-item--mini .el-form-item__label{
    min-width: 120px;
  }
  .w100 {
    width: 100%;
  }
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
#subjectConfig {
  .header {
    font-size: 12px;
    font-weight: bold;
    color: $tc1;
    background: #E1EAFD;
    margin-top: 20px;
    .el-col {
      padding: 10px;
    }
  }
  .col-red {
    color: $tc4;
  }
}
</style>
