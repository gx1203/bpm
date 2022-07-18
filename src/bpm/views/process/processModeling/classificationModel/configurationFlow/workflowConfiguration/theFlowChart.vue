<template>
    <div id="theFlowChart" v-loading="load">
        <el-form label-width="120px">
            <el-row>
                <el-col :span="10" :offset="2">
                     <el-form-item :label="$t('nodeName') + '：'">
                        <el-select clearable @change="changOption" v-model="value" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                            <el-option
                            v-for="item in ruleForm"
                            :key="item.id"
                            :label="item.activityname"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="10" :offset="2">
                     <el-form-item :label="$t('nextNode') + '：'">
                        <el-checkbox-group v-model="check">
                            <div v-for="item in ruleForm" :key="item.id">
                                <el-checkbox :label="item.id">{{item.activityname}}</el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row>
            <el-col :span="10" :offset="2">
                <div class="text-r">
                    <el-button type="primary" @click="saveForm">
                        {{ $t('submit') }}
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { saveNextNodeId, getProcessNextNodeId } from '@/bpm/api/process/processModeling/classificationModel'

export default {
  name: 'theFlowChart',
  props: {
    content: {
      type: Array
    },
    treeData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      ruleForm: [],
      value: '',
      check: [],
      load: false
    }
  },
  watch: {
    content(val) {
      this.ruleForm = val
    }
  },
  methods: {
    changOption() {
      this.load = true
      getProcessNextNodeId({
        processNodeId: this.value,
        version: this.treeData.version
      }).then((rt) => {
        this.load = false
        if (rt.status === '200') {
          this.check = rt.data
        }
      }).catch((er) => {
        this.load = false
      })
    },
    saveForm () {
      if (!this.value) {
        this.$message(this.$t('hintText.pleaseSelectProcessNode'))
        return
      }
      this.load = true
      saveNextNodeId({
        nextNodeId: this.check,
        processNodeId: this.value,
        version: this.treeData.version
      }).then((rt) => {
        this.load = false
        if (rt.status === '200') {
          this.$message.success(this.$t('hintText.submittedSuccessfully'))
        }
      }).catch((er) => {
        this.load = false
      })
    }
  }
}
</script>
<style lang="scss">
    #theFlowChart{
        .el-form-item__label{
            color: $tc1;
            font-size: 12px;
        }
        .el-input__inner{
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
    #theFlowChart{
        .w100{
            width: 100%;
        }
    }
</style>
