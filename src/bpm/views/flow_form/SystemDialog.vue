<template>
  <el-dialog :title="system" :visible.sync="dialogVisible" append-to-body  width="60%">
      <ul class="system-data" v-if="systemData.length">
        <li v-for="(item, index) in systemData" :key="index">
         <div class="head">
           <span style="width:100px;">{{index+1}}、{{systemFile +"："}}</span> 
           {{item.zhiduName}}
          </div>
         <div class="title" v-for="(itm,idx) in item.zhangjieList" :key="idx">
           <span style="width:100px;">{{(index+1)+"-"+(1 + idx++)}}、{{systemChapter +"："}}</span> 
            {{item.zhiduName}}-{{itm.zhangjieName +"："}}<span v-html="itm.zhangjieContent"></span><br/>
          </div>
        </li>
      </ul>
      <div v-else style="text-align:center;margin:20px 0;">{{noData}} ~</div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: this.value,
      noData:this.$t('noData'),
      system:this.$t('system'),
      systemFile:this.$t('systemFile'),
      systemChapter:this.$t('systemChapter'),
      chapterTitle:this.$t('chapterTitle'),
      chapterContent:this.$t('chapterContent'),
    };
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    systemData:{
      type: Array,
      default: () => [],
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
  }
};
</script>
<style  type="text/scss" lang="scss" scoped>
  .system-data{
    li{
      margin-bottom:20px;
    }
  }
</style>
