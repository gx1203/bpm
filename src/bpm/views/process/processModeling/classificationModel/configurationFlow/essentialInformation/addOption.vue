<template>
  <el-dialog :title="$t('editOption')" :visible.sync="dialogVisible" v-loading="load">
    <el-row>
      <el-col :span="24" align="right">
        <el-button @click="add">
            {{ $t('add') }}
        </el-button>
      </el-col>
    </el-row>
    <el-table
        :data="content"
        border
        style="width:100%;margin: 10px 0;max-height:300px;overflow-y: scroll;">
        <el-table-column label="Text" align="center">
          <template slot-scope="scope">
            <el-input clearable v-model="scope.row.text" />
          </template>
        </el-table-column>
        <el-table-column label="Value" align="center">
          <template slot-scope="scope">
            <el-input clearable v-model="scope.row.value" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" align="center" width="150">
          <template slot-scope="scope">
            <el-button @click="remove(scope.$index)" type="text" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('submit') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getOptions, saveNodeOption } from '@/bpm/api/process/processModeling/classificationModel'

export default {
  data () {
    return {
      content: [],
      dialogVisible: this.value,
      load: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    optData: {
      type: Object
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.getList()
      }
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    add () {
      this.content.push({
        text: '',
        value: ''
      })
    },
    remove (i) {
      this.content.splice(i, 1)
    },
    getList () {
      this.load = true
      getOptions(this.optData.id).then(rt => {
        if (rt.status === '200') {
          this.content = rt.data
        }
        this.load = false
      }).catch(() => {
        this.load = false
      })
    },
    submit () {
      this.load = true
      saveNodeOption({
        'nodeOptions': this.content,
        'tabId': this.optData.treeId,
        'tableId': this.optData.id
      }).then((rt) => {
        this.load = false
        if (rt.status === '200') {
          this.$message.success(this.$t('hintText.editSuccessfully'))
        }
      }).catch((er) => {
        this.load = false
      })
      this.dialogVisible = false
    },
    cancel () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
</style>
