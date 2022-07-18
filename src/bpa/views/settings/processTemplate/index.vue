<template>
  <div id="changeLegend">
    <el-row :gutter="10">
      <el-col :span="12" class="text-center" v-for="item in templateList" :key="item.id">
        <img class="example" :src="item.img" />
        <el-button type="primary" @click="preview(item)">{{$t('preview')}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getModelListTemplate } from '@/bpa/api/settings/processTemplate'
export default {
  data() {
    return {
      chooseSubject: 'white',
      templateList: []
    }
  },
  mounted() {
    this.getModelListTemplate()
  },
  methods: {
    getModelListTemplate () {
      getModelListTemplate().then(res => {
        this.templateList = res.list
      })
    },
    preview (item) {
      window.open(item.pdf)
    }
  }
}
</script>

<style lang="scss" scoped>
#changeLegend {
  img.example {
    width: 400px;
    height: 355px;
    display: block;
    margin: 0 auto;
  }
  .el-row {
    .el-col{
      padding: 20px 5px;
    }
  }
}
</style>
