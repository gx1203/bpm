<template>
  <el-dialog :title="$t('selectProcess')" :visible.sync="dialogVisible" width="70%">
    <el-row :gutter="10">
      <el-col :span="8">
        <tree-process-type ref="tree" type="0" @confirm="handleNodeClick"/>
      </el-col>
      <el-col :span="16">
        <el-transfer
              v-model="transferData"
              :titles="[$t('unassigned'), $t('allocated')]"
              :data="generateData"
              :props="{
                  key: 'id',
                  label: 'processname'
                }"
              @change="transferHandle"
            >
              <p slot-scope="{ option }">{{option.processnamecn}}({{ option.processname}})</p>
            </el-transfer>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import treeProcessType from '@/bpm/components/treeProcessType'
import { getProcessInfo } from '@/bpm/api/monitor/index.js'
export default {
  components: {
    treeProcessType
  },
  data () {
    return {
      dialogVisible: false,
      treeData: {},
      transferData: [],
      generateData: []
    }
  },
  props: {
    value: {
      type: Boolean
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    },
    treeData (val) {
      this.getProcess()
    }
  },
  methods: {
    getProcess () {
      getProcessInfo(this.treeData.id).then(rt => {
        if (rt.status === '200') {
          if (rt.data) {
            this.generateData = this.generateData.concat(rt.data)
            let obj = {}
            this.generateData = this.generateData.reduce((cur, next) => {
              obj[next.id] ? '' : obj[next.id] = true && cur.push(next)
              return cur
            }, [])
          }
        }
      })
    },
    handleNodeClick (data) {
      this.treeData = data
    },
    transferHandle (data, direction, keyList) {
    },
    submit () {
      this.$emit('confirm', this.transferData)
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss">
</style>
