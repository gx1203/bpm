<template>
  <div class="w100">
    <!-- 选择组织的dialog -->
    <el-dialog class="chapter" :visible.sync="chapterDialogsVisible" title="选择章节"
               :close-on-click-modal = false :close-on-press-escape = false>
      <div class="left_tree_wrapper margin-t20">
        <el-tree
          v-if="chapterDialogsVisible"
          :highlight-current="true"
          :data="chapterData"
          show-checkbox
          node-key="id"
          :default-checked-keys="checkedKeys"
          @check="handleNodeCheck"
          ref="tree"
          :check-strictly="true"
          :props="defaultProps">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-row class="footerBtns">
          <el-button type="primary" class="footerBtn" v-for="(item, index) in selectSys.selectChapterData" :key="item.id" :title="item.content"><span style="padding-right:8px">{{item.content}}</span> <i @click="delChapterData(item, index)" class="el-icon-delete-solid"></i>  </el-button>
          <el-col :span="24">
            <el-button @click="chapterDialogsVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmChoose">确 定</el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  querySectionBySystemId
} from '@/bpa/api/processDesignCenter'
export default {
  name: 'selectChapterDialogs',
  data () {
    return {
      chapterDialogsVisible: false,
      chapterData: [],
      defaultProps: {
        children: 'sectionChildrens',
        label: 'content'
      },
      checkedKeys: []
    }
  },
  computed: {
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selectSys: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.chapterDialogsVisible = val
        this.$nextTick(() => {
          this.selectSystemProcess(this.selectSys)
        })
      }
    },
    chapterDialogsVisible (val) {
      this.$emit('input', val)
    }
  },
  mounted() {
  },
  methods: {
    // 体系列表选择章节
    selectSystemProcess (system) {
      this.chapterData = []
      querySectionBySystemId(system.id).then((res) => {
        if (!!res) {
          this.$set(this.chapterData, 0, res)
          this.$nextTick(() => {
            if (system.selectChapterData && system.selectChapterData.length > 0) {
              this.checkedKeys = system.selectChapterData.map(item => item.id)
            }
          })
          // console.log(this.chapterData, system.selectChapterData.map(item => item.id))
        } else {
          // this.$set(this.chapterData, 0, [])
          this.chapterData = []
        }
      })
    },
    handleNodeCheck(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
      this.checkedKeys = checkedKeys.checkedKeys
      this.selectSys.selectChapterData = checkedKeys.checkedNodes
    },
    delChapterData (item, index) {
      this.selectSys.selectChapterData.splice(index, 1)
      this.checkedKeys.forEach((list, indexList) => {
        if (list === item.id) {
          this.checkedKeys.splice(indexList, 1)
          this.$refs.tree.setCheckedKeys(this.checkedKeys)
        }
      })
    },
    confirmChoose () {
      this.chapterDialogsVisible = false
      this.$emit('confirm', this.selectSys)
    }
  }
}
</script>

<style lang="scss">
/*附件部分*/
  .showFiles{
    span{
      line-height: 18px;
      padding: 3px 20px 3px 8px;
      border: 1px solid #519eff;
      display: inline-block;
      vertical-align: top;
      max-width: 130px;
      border-radius: 3px;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &.commonpadding span{
      padding: 3px 8px;
    }
    i{
      position: absolute;
      right: 3px;
      top: 5px;
      color: $ico;
    }
    &.processCommon i{
      top: 6px;
    }
  }
.ztree li span.button.chk.type1{
  display:none!important;
}
.chapter{
  .el-dialog__body {
    max-height: 300px;
    overflow-y: scroll;
  }
}
.footerBtns {
  padding: 10px;
  text-align: left;
  .footerBtn{
    margin: 0 0 6px 10px;
    padding: 7px 23px 7px 15px;
    max-width: 160px;
    border-radius: 3px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    i {
      position: absolute;
      top: 5px;
      right: 3px;
    }
  }
  .el-col{
    text-align: right;
  }
}
</style>
