<template>
  <div>
    <div style="width:88%" class="ip-tree float-l">
      <el-input clearable v-model="filterText" placeholder="输入关键字进行过滤" size="small" />
      <el-tree
        ref="tree"
        :data="protaltree"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node="true"
        class="filter-tree"
        show-checkbox
        node-key="id"
        @check-change="handleCheckChange"
      />
    </div>
    <div class="msg-but">
      <el-button type="primary" size="small" @click="getCheckedNodes">确定</el-button>
    </div>
    <!-- <div>{{ datalist }}</div> -->
  </div>
</template>

<script>
export default {
  name: 'ProtalTree',
  props: {},
  data() {
    return {
      datalist: '',
      filterText: '',
      checkedlist: [],
      protaltree: [
        {
          id: 10000001,
          pid: 1,
          dataid: 1,
          companycode: '101',
          name: '旺旺集团有限公司1',
          pcode: '201',
          treecode: '001001003001',
          type: '1',
          children: [
            {
              id: 20000001,
              pid: 2,
              dataid: 2,
              companycode: '102',
              name: '财务部',
              pcode: '202',
              treecode: '001001003001',
              type: '2',
              children: [
                {
                  id: 30000001,
                  pid: 3,
                  dataid: 3,
                  companycode: '103',
                  name: '小强1',
                  pcode: '203',
                  treecode: '001001003001',
                  type: '3'
                },
                {
                  id: 30000002,
                  pid: 4,
                  dataid: 4,
                  companycode: '104',
                  name: '小强2',
                  pcode: '204',
                  treecode: '001001003001',
                  type: '3'
                }
              ]
            }
          ]
        },
        {
          id: 10000002,
          pid: 1,
          dataid: 1,
          companycode: '101',
          name: '旺旺集团有限公司2',
          pcode: '201',
          treecode: '001001003001',
          type: '1',
          children: [
            {
              id: 20000002,
              pid: 2,
              dataid: 2,
              companycode: '102',
              name: '财务部',
              pcode: '202',
              treecode: '001001003001',
              type: '2',
              children: [
                {
                  id: 30000002,
                  pid: 3,
                  dataid: 3,
                  companycode: '103',
                  name: '小强',
                  pcode: '203',
                  treecode: '001001003001',
                  type: '3'
                }
              ]
            }
          ]
        },
        {
          id: 10000003,
          pid: 1,
          dataid: 1,
          companycode: '101',
          name: '旺旺集团有限公司3',
          pcode: '201',
          treecode: '001001003001',
          type: '1',
          children: [
            {
              id: 20000003,
              pid: 2,
              dataid: 2,
              companycode: '102',
              name: '财务部',
              pcode: '202',
              treecode: '001001003001',
              type: '2',
              children: [
                {
                  id: 30000003,
                  pid: 3,
                  dataid: 3,
                  companycode: '103',
                  name: '小强',
                  pcode: '203',
                  treecode: '001001003001',
                  type: '3'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 过滤
    filterNode(value, data) {
      console.log(value, data)
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 获取树的勾选数据
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
      // if (checked) {
      //   this.checkedlist.push(data)
      // } else {
      //   this.checkedlist.splice(1, 1)
      // }
      // console.log(this.checkedlist)
      // this.$emit('func', this.checkedlist)
    },
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes())
      this.datalist = this.$refs.tree.getCheckedNodes()
      console.log(this.datalist)
      this.$emit('func', this.datalist)
    }
  }
}
</script>
<style scoped>
.ip-tree {
  border: 1px solid #e4e7ed;
  padding: 10px;
  font-size: 14px;
  max-height: 400px;
  overflow: auto;
  margin-top: 20px;
}
.filter-tree {
  margin-top: 5px;
}
.msg-but {
  /* margin-top: 20px; */
}
</style>
