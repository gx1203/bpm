<template>
  <el-card shadow="never" class="card-reset">
    <report :data="data" />
  </el-card>
</template>
<script>
import report from '@/bpm/components/report'
import { loadSearchForm } from '@/bpm/api/monitor/report'

export default {
  components: {
    report
  },
  data() {
    return {
      data: {},
      pjtid: ''
    }
  },
  watch: {
    $route() {
      this.pjtid = this.$route.query.id
    },
    pjtid() {
      this.getLoadSearchForm()
    }
  },
  mounted() {
    this.getLoadSearchForm()
  },
  methods: {
    getLoadSearchForm() {
      loadSearchForm(this.$route.query.id).then(rt => {
        this.data = rt.data
      })
    }
  }
}
</script>
