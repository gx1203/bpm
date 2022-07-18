<template>
  <el-dialog :title="$t('processSelection')" :visible.sync="dialogVisible" width="70%" append-to-body>
    <el-row :gutter="20" align="center">
      <el-col :span="8">
        <treeProcess num="3" @confirm="handleNodeClick"/>
      </el-col>
      <el-col :span="16" class="right">
        <el-transfer
          filterable
          :props="{
            key: 'value',
            label: 'desc'
          }"
          v-model="list"
          :filter-method="filterMethod"
          :titles="[$t('processList'), $t('selectedProcess')]"
          :filter-placeholder="$t('placeholderText.pleaseEnterSearchContent')"
          @left-check-change="handleChange"
          :data="data">
        </el-transfer>
        <p style="padding: 10px 0;color: red;">
          {{ $t('onlyOneProcessCanBeSelected') }}
        </p>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">
        {{ $t('copyProcess') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import treeProcess from '@/bpm/components/treeProcess'
export default {
  components: {
    treeProcess
  },
  data () {
    return {
      dialogVisible: this.value,
      processCode: '',
      treeData: {},
      list: [],
      data: [{
        value: 1,
        desc: this.$t('alternative1')
      }, {
        value: 2,
        desc: this.$t('alternative2')
      }],
      filterMethod (query, item) {
        return item.desc.indexOf(query) > -1
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    },
    list (val) {
      if (val.length === 0) {
        this.data.forEach(element => {
          element.disabled = false
        })
      }
    }
  },
  methods: {
    handleChange (value, direction, movedKeys) {
      this.data.forEach(element => {
        if (value[0] !== element.value) {
          if (value.length > 0) {
            element.disabled = true
          } else {
            element.disabled = false
          }
        }
      })
    },
    handleNodeClick (data) {
      this.treeData = data
    },
    submit (formName) {

    },
    cancel () {
      this.dialogVisible = false
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
  .right >>> .el-transfer-panel__header{
    display: none;
  }

</style>
