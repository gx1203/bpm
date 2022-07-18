<template>
  <el-dialog title="选择用户" class="dialogClass" :visible.sync="adminDialogVisible" append-to-body>
    <el-row  :gutter="10">
      <el-col :span="8">
        <el-input clearable
          :placeholder="$t('placeholderText.enterKeywordsFiltering')"
          v-model="filterText">
        </el-input>
        <el-tree class="elTree" :data="flowList" :props="defaultProps" :filter-node-method="filterNode" ref = 'tree'></el-tree>
      </el-col>
      <el-col :span="16">
        <el-transfer :titles="['公司人员','已选择人员']" v-model="transferData"  :data="generateData">
           <p slot-scope="{ option }">{{ option.key }} - {{ option.label }}</p>
        </el-transfer>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit()">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `备选项 ${ i }`,
            disabled: i % 4 === 0
          });
        }
        return data;
      };
      return {
        adminDialogVisible: this.value,
        checkedData: '',
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        flowList:[{
          label: '一级 1',
          index: '1',
          children: [{
          label: '二级 1-1',
          index: '2',
          children: [{
            index: '3',
            label: '三级 1-1-1'
          }]
          }]
          }, {
          label: '一级 2',
          index: '1',
          children: [{
            label: '二级 2-1',
            index: '2',
            children: [{
              index: '3',
              label: '三级 2-1-1'
            }]
          }, {
          label: '二级 2-2',
          index: '2',
          children: [{
            index: '3',
            label: '三级 2-2-1'
          }]
          }]
          }, {
          label: '一级 3',
          index: '1',
          children: [{
          label: '二级 3-1',
          index: '2',
          children: [{
            index: '3',
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          index: '2',
          children: [{
            index: '3',
            label: '三级 3-2-1'
          }]
         }]
        }],
        generateData: generateData(),
        transferData:[]
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
        this.adminDialogVisible = val
      },
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      adminDialogVisible(val) {
        this.$emit('input', val)
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      submit() {
        let _list = []
        this.transferData.forEach(item => {
          this.generateData.forEach(v=>{
            if (item === v.key) {
              _list.push(v)
            }
          })
        });
        this.$emit('confirm', _list)
      },
      cancel() {
        this.adminDialogVisible = false
      }
    },
    mounted() {
    }
  }
</script>
<style lang="scss">
  .dialogClass{
    .el-input__inner{
      border: none;
      border-bottom: 1px solid $dc1
    }
  }
</style>
