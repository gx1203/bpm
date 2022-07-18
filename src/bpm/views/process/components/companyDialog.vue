<template>
  <el-dialog title="选择组织机构" :visible.sync="dialogVisible" append-to-body>
     <el-tree class="elTree"
        style="height: 300px; overflow: auto;"
        :props="props"
        :data="treeData"
        :load="loadNode"
        lazy
        node-key="ID"
        @node-click='handleNodeClick'
        :filter-node-method="filterNode"
        ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data}">
          <span>{{ node.label }}</span>
          <span v-if="data.TYPE === '0'">({{ $t('organization') }})</span>
          <span v-else-if="data.TYPE === '1'">({{ $t('company') }})</span>
          <span v-else-if="data.TYPE === '2'">({{ $t('department') }})</span>
          <span v-else>({{ $t('post') }})</span>
        </span>
      </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit()">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getFirstOrg, getTotalOrg1 } from '@/bpm/api/flow/index'
  export default {
    data() {
      return {
        dialogVisible: this.value,
        checkedData: {},
        props: {
          label: 'NAME',
          isLeaf: 'isParent'
        },
        treeData: [],
        filterText: ''
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
    },
    watch: {
      value(val) {
        this.dialogVisible = val
      this.getDepartment()
      },
      dialogVisible(val) {
        this.$emit('input', val)
      },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
    },
    methods: {
      clickRadioNode(event) {
      if(event) event.preventDefault()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.NAME.indexOf(value) !== -1
    },
    getDepartment() {
      getFirstOrg().then((rt) => {
        rt.data.forEach(item => {
          item.isParent = false
        });
        this.treeData = rt.data
      }).catch((er) => {
        console.log(er)
      })
    },
    toBoolean(val){
    　　switch (val.toLowerCase()){
    　　　　case "true": case 1: case "yes": return true;
    　　　　case "false": case 0: case "no": case null: return false;
    　　　　default:return Boolean(val);
    　　}
    },
    loadNode(node, resolve) {
      if (node.level > 0) {
        getTotalOrg1({
          pid: node.data.ID,
          type: '0,1'
        }).then((rt) => {
        rt.data.forEach(item => {
          item.isParent = !this.toBoolean(item.isParent)
        });
          resolve(rt.data)
        }).catch((er) => {
          console.log(er)
        })
      }
    },
      submit() {
        this.$emit('confirm', this.checkedData)
      },
      cancel() {
        this.dialogVisible = false
      },
      handleNodeClick (data) {
        this.checkedData = data
      }
    }
  }
</script>

<style scoped>
  .content {
    height: 50vh;
    width: 60%;
    margin: 0 auto;
    overflow: auto;
  }

</style>
