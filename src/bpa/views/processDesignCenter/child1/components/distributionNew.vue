<template>
  <div class="w100">
    <el-dialog class="distributionNew" :visible.sync="isDialogsVisible" title="选择组织" :close-on-click-modal= "false"  :close-on-press-escape = "false">
      <el-row class="margin-b15">
        <el-col :span="24">
          <el-radio-group v-model="checkRadio">
            <el-radio label="org">组织</el-radio>
            <el-radio label="department">部门</el-radio>
            <el-radio label="station">职务</el-radio>
            <el-radio label="system">系统组</el-radio>
            <el-radio label="custom">自定义组</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="9">
          <el-input class="margin-b15" placeholder="请输入内容" v-model="filterTree">
            <template slot="prepend">
              <i class="el-icon-search"></i>
            </template>
          </el-input>
          <el-tree
            :props="props"
            :data="treeData"
            show-checkbox>
          </el-tree>
        </el-col>
        <el-col :span="15">
          <el-input class="margin-b15 w200px" placeholder="请输入内容" v-model="filterTree">
            <template slot="prepend">
              <i class="el-icon-search"></i>
            </template>
          </el-input>
          <el-transfer v-model="transValue" :data="transData"></el-transfer>
        </el-col>
      </el-row>
      <!-- <el-scrollbar class="h300px">
        <ul id="chooserOrganizationTree" class="ztree left"></ul>
      </el-scrollbar> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogsVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="confirmChoose">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
const generateData = _ => {
  const data = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `备选项 ${ i }`,
      disabled: i % 4 === 0
    })
  }
  return data
}
export default {
  name: 'distributionNew',
  data () {
    return {
      isDialogsVisible: false,
      checkRadio: 'org',
      transValue: [],
      transData: generateData(),
      filterTree: '',
      treeData: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      props: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    }
  },
  mounted() {
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    disData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.isDialogsVisible = val
      }
    },
    isDialogsVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    confirmChoose () {
    }
  }
}
</script>

<style lang="scss" scoped>
.distributionNew {
  /deep/ .el-dialog{
    width: 890px;
  }
  .w200px {
    width: 200px;
  }
}

</style>
