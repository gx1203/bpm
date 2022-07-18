<template>
  <div class="midBreadCrumb">
    <el-card class="box-card" shadow="hover">
      <span class="position"><i class="el-icon-s-home" />当前位置</span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item
          :to="{ path: '/doorCenter' }"
        >
          首页
        </el-breadcrumb-item> -->
        <el-breadcrumb-item
          v-for="(item, index) in menuNameList"
          :key="item.id"
          :class="
            index === menuNameList.length - 1
              ? 'currentItemRouter'
              : 'itemRouter'
          "
          @click.native="toPath(item)"
        >
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const APP = createNamespacedHelpers('app')

export default {
  name: 'MidBreadCrumb',
  data() {
    return {
      menuNameList: [],
      pathUrl: {}, // 当前URL数据
      route: {}
    }
  },
  computed: {
    ...APP.mapGetters(['curModule']),
    currentParentRoutePath() {
      return this.$route.path.match(/^\/(\w+)\//)[1]
    }
  },
  watch: {
    $route: {
      handler: function(val) {
        if (val.name === 'projectApproval') {
          this.routeUrl = val.path + '?' + this.convertObj(val.query)
          this.routeName = val.name + '?' + this.convertObj(val.query)
        } else {
          this.routeUrl = val.path
          this.routeName = val.name
        }
        this.menuNameList = [
          this.curModule
        ]
        this.pathUrl = {}
        this.getPathUrl(this.curModule)
        if (this.curModule.subNodes && this.curModule.subNodes.length > 0) {
          this.curModule.subNodes.forEach(item => {
            if (item.id === this.pathUrl.pid) {
              this.menuNameList.push(item)
            }
          })
        }
        this.menuNameList.push(this.pathUrl)
        this.setActiveIndex(this.pathUrl.name)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    ...APP.mapMutations([
      'setActiveIndex'
    ]),
    toPath(item) {
      this.getToRoute(item)
      this.$router.push({
        name: this.route.url.split('?')[0],
        query: this.getQueryString(this.route.url)
      })
    },
    getToRoute(item) {
      if (!!item.subNodes && item.subNodes.length > 0) {
        this.getToRoute(item.subNodes[0])
      } else {
        this.route = item
      }
    },
    getQueryString(item) {
      if (!item.includes('?')) return {}
      const str = item.split('?')[1]
      const arr1 = str.split('&')
      const obj = {}
      for (let i = 0; i < arr1.length; i++) {
        obj[arr1[i].split('=')[0]] = arr1[i].split('=')[1]
      }
      return obj
    },
    getPathUrl(curModule, route) { // 查询当前URL的数据
      if ((curModule.url === this.routeUrl || curModule.url === this.routeName) && (!curModule.subNodes || curModule.subNodes.length === 0)) {
        this.pathUrl = curModule
      } else if (!!curModule.subNodes && curModule.subNodes.length > 0) {
        curModule.subNodes.forEach(ele => {
          this.getPathUrl(ele)
        })
      }
    },
    convertObj (data) {
      var _result = []
      for (var key in data) {
        var value = data[key]
        if (value.constructor === Array) {
          value.forEach(function (_value) {
            _result.push(key + '=' + _value)
          });
        } else {
          _result.push(key + '=' + value)
        }
      }
      return _result.join('&')
    }
  }
}
</script>

<style lang="scss" scoped>
.midBreadCrumb {
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #f8f8f8;
  /deep/.el-card {
    .el-card__body {
      .position {
        display: inline-block;
        width: 86px;
        font-size: 14px;
        i {
          margin-right: 5px;
        }
      }
      display: flex;
      padding: 6px;
      .el-breadcrumb {
        line-height: inherit;
      }
    }
  }
}
/deep/.el-breadcrumb__inner {
  // color: $active-color;
  font-weight: 400;
}
.itemRouter /deep/.el-breadcrumb__inner {
  cursor: pointer;
}
.currentItemRouter /deep/.el-breadcrumb__inner {
  color: $active-color !important;
}
</style>
