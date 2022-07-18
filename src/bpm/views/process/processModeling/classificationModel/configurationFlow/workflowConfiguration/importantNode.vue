<template>
    <div id="importantNode" v-loading="load">
        <el-form label-width="120px">
            <el-row class="red">
              <el-form-item>
                {{$t('NoteApprovalRecordsConfiguredAsImportantNodesWillBedisplayedSeparatelyInTheProcessForm')}}
              </el-form-item>
            </el-row>
             <el-row>
                <el-col :span="10" :offset="2">
                     <el-form-item :label="$t('importantNode') + '：'">
                        <el-checkbox-group v-model="check">
                            <div v-for="item in ruleForm" :key="item.processNodeId">
                                <el-checkbox :label="item.processNodeId">{{item.activityname}}</el-checkbox>
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
import { updateProcessImportantNode } from '@/bpm/api/process/processModeling/classificationModel'
export default {
  name: 'backNode',
  props: {
    content: {
      type: Array
    },
    treeData: {
      type: Object
    }
  },
  data () {
    return {
      ruleForm: [],
      check: [],
      load: false
    }
  },
  watch: {
    content(val) {
      val.forEach(element => {
        if (element.isimportant === 'Y') {
          this.check.push(element.processNodeId)
        }
      })
      this.ruleForm = val
    }
  },
  methods: {
    saveForm () {
      this.load = true
      let ruleForm = this.ruleForm.map(item => {
        return {
          processNodeId: item.processNodeId,
          isimportant: this.check.includes(item.processNodeId) ? 'Y' : 'N',
          version: this.treeData.version
        }
      })
      updateProcessImportantNode(ruleForm).then((rt) => {
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
    #importantNode{
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
    #importantNode{
        .w100{
            width: 100%;
        }
    }
</style>
