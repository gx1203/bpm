<template>
  <div id="process">
    <iframe
      class="w100  iframeProcess"
      id="iframeUrlId"
      :src="iframeSrc"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iframeSrc: ''
    }
  },
  created() {
    let self = this
    // 全屏
    window.onFullScreen = () => {
      if (self.$refs.iFrame.getAttribute('class').indexOf('fullEditor') > -1) {
        self.$refs.iFrame.classList.remove('fullEditor')
      } else {
        self.$refs.iFrame.classList.add('fullEditor')
      }
    }
    let username = localStorage.getItem('portalCurrentUserInfo')
      ? JSON.parse(localStorage.getItem('portalCurrentUserInfo')).cnname
      : ''
    //  this.iframeSrc = `http://localhost:8080/designer/BaseNewPage.html?id=${this.$route.query.id}&listid=${this.$route.query.listid}&treeId=${this.$route.query.modelid}&processName=${this.$route.query.name
    //     }&username=${username}&processNum=${this.$route.query.code}&state=${this.$route.query.state}&isRead=no`;
    if (this.$route.query.listid) {
      this.iframeSrc = `./leftMenu/BaseNewPage.html?id=${this.$route.query.id}&listid=${this.$route.query.listid}&treeId=${this.$route.query.modelid}&processName=${this.$route.query.name}&username=${username}&processNum=${this.$route.query.code}&state=${this.$route.query.state}&isRead=no`
    } else {
      this.iframeSrc = `./leftMenu/BaseNewPage.html`
    }
  },
  computed: {},

  mounted() {
    this.iframesrcNmae()
  },
  methods: {
    iframesrcNmae() {
      // id: i.bpmid,
      //     listid: i.id,
      // this.$route.query
      // let data = { type: "paint", data: i.bpmid + "," + i.id };
      // this.selectedItem = JSON.parse(JSON.stringify(i));
      // console.log("datadatadatadata", data);
      //   let count = 0;
      //   this.lisdata.forEach((item, idx) => {
      //     if (item.id === this.$route.query.id) {
      //       count++;
      //       this.chartmodel = item.id;
      //     }
      //   });
      //   if (!count) {
      //     this.lisdata.push({
      //       name: this.selectedItem.name,
      //       id: this.$route.query.id,
      //       listid:  this.$route.query.listid,
      //       treeId: this.modelid,
      //       state: this.selectedItem.state,
      //       processNum: this.selectedItem.code,
      //     });
      //     console.log("this.selectedItem", this.selectedItem);
      //     this.chartmodel =  this.$route.query.id;
      //   }
      // this.iframeSrc = `http://localhost:8080/designer/BaseNewPage.html?id=${this.$route.query.id}&listid=${this.$route.query.listid}&treeId=${this.$route.query.modelid}&processName=${this.$route.query.name
      // }&username=${username}&processNum=${this.$route.query.code}&state=${this.$route.query.state}&isRead=no`;
    }
  }
}
</script>
<style lang="scss" scoped>
#process {
  width: 100%;
  margin-top: -60px;
  iframe {
    margin-top: -30px;
    height: calc(100vh) !important;
  }
}
/*流程设计器全屏*/
.fullEditor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
}
.iframeProcess {
  /*height: calc(100% - 46px);*/
  height: calc(100vh - 0px);
}
</style>
