<template>
  <el-dialog :title="$t('configurationOptions')" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" label-width="80px" class="content">
      <el-button @click="addList">{{ $t('add') }}</el-button>
      <el-table
        :data="item.List"
        border
        tooltip-effect="dark"
        style="width:100%;margin:15px 0;">
        <el-table-column label="Text" prop="name" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <el-input clearable v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Value" prop="name" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <el-input clearable v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('sort')" prop="name" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <el-input clearable v-model="scope.row.name" type="number"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')" show-overflow-tooltip align="center"  width="120">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" @click="delData(scope.$index)">{{ $t('deleteAndSave') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: this.value
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
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    submit(formName) {

    },
    cancel() {
      this.dialogVisible = false
    },
    delData(index) {
      this.item.List.splice(index, 1)
    },
    addList() {
      this.item.List.push({
        name: ''
      })
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
  /*.content {*/
    /*height: 50vh;*/
    /*width: 60%;*/
    /*margin: 0 auto;*/
    /*overflow: auto;*/
  /*}*/

</style>
