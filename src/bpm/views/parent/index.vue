<template>
  <div>
    <app-header class="app-header" />
    <router-view :key="key" />
  </div>
</template>

<script>
// import AppHeader from './AppHeader'
import AppHeader from '@/bas/components/AppHeader'
// 应用vuex筛选条件
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers('app')
export default {
  components: {
    AppHeader
  },
  data () {
    return {
      key: ''
    };
  },
  computed: {
    // key() {
    //   return this.$route.matched[1].name
    // },
    ...mapGetters(['tabList', 'curModule'])
  },
  watch: {
    curModule: {
      handler: function (val) {
        this.key = val.url
      },
      deep: true,
      immediate: true
    },
    '$route': {
      handler: function (val) {
        let url = "";
        let name = "";
        if (val.name === 'projectApproval') {
          url = val.path + "?" + this.convertObj(val.query);
          name = val.name + "?" + this.convertObj(val.query);
        } else {
          url = val.path;
          name = val.name;
        }
        for (let i = 0, len = this.tabList.length; i < len; i++) {
          let item = this.tabList[i]
          let subNodes = []
          this.getPath(item.subNodes, subNodes)
          if (subNodes.map(el => el.url).includes(url) || subNodes.map(el => el.url).includes(name)) {
            this.setCurModule(item)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // if (this.tabList.length === 0) {
    //   this.refreshModuleList()
    // }
  },
  methods: {
    ...mapMutations(['setCurModule']),
    // ...mapActions(['refreshModuleList'])
    convertObj (data) {
      var _result = [];
      for (var key in data) {
        var value = data[key];
        if (value.constructor === Array) {
          value.forEach(function (_value) {
            _result.push(key + "=" + _value);
          });
        } else {
          _result.push(key + "=" + value);
        }
      }
      return _result.join("&");
    },
    getPath (list, subNodes) {
      for (let i = 0, len = list.length; i < len; i++) {
        let item = list[i]
        subNodes.push(item)
        if (item.subNodes && item.subNodes.length > 0) {
          this.getPath(item.subNodes, subNodes)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  height: 50px;
  background: $bc7;
  position: relative;
  z-index: 1100;
}
</style>
