<template>
  <el-card shadow="always" id="ruleChecking" v-loading="loading">
    <div class="ruleChecking-main" v-html="html"></div>
  </el-card>
</template>
<script>
import { previewBrs } from "@/bpm/api/ruleChecking";
export default {
  data() {
    return {
      html: "",
      loading: false
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
        this.loading = true;
      let params = JSON.parse(localStorage.getItem('ruleCheckingData')) 
      previewBrs(params)
        .then(rt => {
          this.html = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  },
  beforeDestroy(){
    sessionStorage.removeItem('ruleCheckingData')
  }
};
</script>
<style lang="scss">
#ruleChecking {
  .ruleChecking-main {
    height: calc(100vh - 40px);
    width:  calc(100vw - 40px);
    overflow: auto;
  }
}
</style>
