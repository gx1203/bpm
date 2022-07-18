<template>
  <el-button
    :loading="downloadLoading"
    size="mini"
    type="primary"
    icon="el-icon-download"
    @click="Excelexport"
  >{{ $t('export') }}</el-button>
</template>

<script>
export default {
  name: 'Portalimgupload',
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          tHeader: ['组织名称', '维度', '维度查看', '知识上传'],
          filterVal: ['title', 'applyusername', 'accepttime', 'creaton'],
          exportdata: [
            { title: 1, applyusername: 2, accepttime: 3, creaton: 4 },
            { title: 11, applyusername: 22, accepttime: 33, creaton: 44 }
          ],
          filename: ''
        }
      }
    }
  },
  data() {
    return {
      downloadLoading: false
    }
  },
  watch: {},
  created() {},
  mounted() {},
  updated() {},
  methods: {
    // 导出excel
    Excelexport() {
      console.log(this.options.exportdata)
      this.downloadLoading = true
      // import('../../../../static/vendor/Export2Excel').then(excel => {
      //   const tHeader = this.options.tHeader
      //   const filterVal = this.options.filterVal
      //   const data = this.formatJson(filterVal, this.options.exportdata)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   setTimeout(() => {
      //     this.downloadLoading = false
      //   }, 2 * 1000)
      // })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    }
  }
}
</script>

<style scoped>
</style>
