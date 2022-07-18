<template>
  <div id="backNode" v-loading="loading">
    <el-form ref="ruleForm" :model="ruleForm" label-width="120px">
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item :label="$t('selectNode') + '：'">
            <el-select v-model="ruleForm.processnodeId" clearable :placeholder="$t('placeholderText.pleaseSelect')" class="w100" @change="selectHandle">
              <el-option
                v-for="item in nodeData.nodeList"
                :key="item.id"
                :label="item.activityname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item :label="$t('approvalType') + '：'">
            <el-checkbox-group v-model="ruleForm.approval">
              <div v-for="(item,index) in typeList" :key="index">
                <el-checkbox :label="item.id" :name="item.id">
                  {{ item.name }}
                </el-checkbox>
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
import { getProcessNode, getApprovalType, getAllApprovalType, saveProcessNodeApproval } from '@/bpm/api/process/mobileConfig/mobile_process'
export default {
  name: 'BackNode',
  props: {
    treeData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      ruleForm: {
        approval: []
      },
      loading: false,
      nodeData: {},
      typeList: {}
    }
  },
  watch: {
    treeData(val) {
      this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    saveForm() {
      if (!this.ruleForm.processnodeId) {
        this.$message({
          message: this.$t('placeholderText.pleaseSelectNode'),
          type: 'error'
        })
        return
      }
      this.loading = true
      saveProcessNodeApproval(this.ruleForm).then(rt => {
        this.loading = false
        if (rt.status === '200') {
          this.$message({
            message: this.$t('hintText.saveSuccessfully'),
            type: 'success'
          })
          this.getData()
        } else {
          this.loading = false
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        }
      })
        .catch(() => {
          this.loading = false
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        })
    },
    selectHandle() {
      this.loading = true
      getApprovalType(this.ruleForm.processnodeId)
        .then(rt => {
          this.loading = false
          if (rt.status === '200') {
            this.ruleForm.approval = rt.data
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    getData() {
      this.loading = true
      getProcessNode(this.treeData.id)
        .then(rt => {
          this.loading = false
          if (rt.status === '200') {
            this.nodeData = rt.data
            return getAllApprovalType()
          }
        }).then(rt => {
          this.loading = false
          if (rt.status === '200') {
            this.typeList = rt.data
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss">
    #backNode{
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
    #backNode{
        .w100{
            width: 100%;
        }
    }
</style>
