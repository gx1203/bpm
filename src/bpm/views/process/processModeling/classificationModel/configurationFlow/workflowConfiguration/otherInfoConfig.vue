<template>
  <div id="otherInfoConfig" v-loading="load">
    <el-form ref="ruleForm">
      <el-row class="hint">
        <p>{{ $t('dragAndDropSort') }}</p>
      </el-row>
      <el-row type="flex" class="header" align="middle">
        <el-col :span="2">
          {{ $t('operation') }}
        </el-col>
        <el-col :span="9">
          {{ $t('isItText') }}
        </el-col>
        <el-col :span="9">
          {{ $t('themeRules') }}
        </el-col>
        <!-- <el-col :span="2">排序</el-col> -->
        <el-col :span="2">
          {{ $t('operation') }}
        </el-col>
      </el-row>
      <draggable v-model="ruleForm.nodeTabs" dragable="true">
        <el-row
          v-for="(item, index) in ruleForm.nodeTabs"
          :key="index"
          type="flex"
          align="middle"
        >
          <el-col :span="2" class="center">
            <el-form-item>
              <el-button
                type="text"
                :title="$t('delete')"
                icon="el-icon-delete"
                @click="handleDeleteOne(item,index)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-switch :key="'sw'+item+index" v-model="item.type" active-value="text" inactive-value="field" />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-select
                v-if="item.type ==='field'"
                :key="'sel'+item+index"
                v-model="item.ruletext"
                clearable
                :placeholder="$t('placeholderText.pleaseSelect')"
                class="w100"
              >
                <el-option
                  v-for="val in formList"
                  :key="val.fieldName"
                  :label="val.fieldShowName"
                  :value="val.fieldName"
                />
              </el-select>

              <el-input v-else :key="'inp'+item+index" v-model="item.ruletext" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="2">
            <el-form-item>
              <el-input clearable type="number" v-model="item.sortid"></el-input>
            </el-form-item>
          </el-col>-->
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
      <el-button type="primary" @click="submit">
        {{ $t('submit') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { now } from 'moment-mini'
import {
  getSubjectrule,
  deletesubjectrule,
  batchSave
} from '@/bpm/api/process/processModeling/subject_config'
import draggable from 'vuedraggable'
export default {
  name: 'OtherInfoConfig',
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
        nodeTabs: [{}]
      }
    }
  },
  computed: {},
  watch: {
    content(val) {
      this.ruleForm.nodeTabs = val
    }
  },
  methods: {
    // 删除字段
    handleDeleteOne(item, index) {
      if (item.id) {
        this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
          type: 'warning'
        })
          .then(() => {
            deletesubjectrule(item.id)
              .then(rt => {
                this.load = false
                if (rt.status === '200') {
                  this.$message({
                    message: this.$t('hintText.successfullyDelete'),
                    type: 'success'
                  })
                  this.ruleForm.nodeTabs.splice(index, 1)
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
    typeHandle(i) {
      this.ruleForm.nodeTabs[i].ruletext = ''
    },
    // 添加字段
    add() {
      this.ruleForm.nodeTabs.push({})
    },
    submit() {
      const flag = false
      const nodeTabs = JSON.parse(JSON.stringify(this.ruleForm.nodeTabs))
      nodeTabs.forEach((element, index) => {
        element.sortid = index + 1
        element.generatetype = '2'
        element.processid = this.treeData.id
        element.version = this.treeData.version
      })
      this.load = true
      batchSave(nodeTabs)
        .then(rt => {
          this.load = false
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.submittedSuccessfully'))
            this.$emit('confirm')
          }
        })
        .catch(er => {
          this.load = false
        })
    }
  }
}
</script>
<style lang="scss">
#otherInfoConfig {
  .hint {
    color: $active-color;
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
#otherInfoConfig {
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
