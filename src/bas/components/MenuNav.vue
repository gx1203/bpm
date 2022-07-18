<template>
  <div class="nav-container">
    <!--  左侧1级菜单  -->
    <div class="nav-first">
      <div
        v-for="(item,index) in treeList"
        :key="index"
        class="nav-item"
        :class="hoverItem.id === item.id?'nav-item-hover':''"
        @mouseenter="hoverEvent(item)"
      >
        {{ item.name }}
      </div>
    </div>
    <!--  分割线  -->
    <div class="nav-line" />
    <!--  右侧2级及子级菜单  -->
    <div class="nav-second">
      <div v-for="(item,index) in secTreeList" :key="index" class="sec-nav-item">
        <!--  2级菜单名称      -->
        <span class="sec-item-title" @click="(item.subNodes&&item.subNodes.length > 0)?nodeClick(item.subNodes[0]):''">{{ item.name }} ></span>
        <!--  2级菜单的子级      -->
        <span class="sec-item-more">
          <span
            v-for="(cItem, cIndex) in item.subNodes"
            :key="index+cIndex"
            class="sec-item-btn"
            @click="nodeClick(cItem)"
          >{{
            cItem.name
          }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuNav',
  // props: {
  //   data: {
  //     type: Array,
  //     default: () => {
  //       return []
  //     }
  //   }
  // },
  data() {
    return {
      treeList: [],
      hoverItem: {},
      secTreeList: []
    }
  },
  mounted() {
    this.getTreeList()
  },
  methods: {
    getTreeList() {
      this.treeList = JSON.parse(localStorage.getItem('bpm_pc_nav_records')).app.tabList
      // console.log(this.treeList)
    },
    hoverEvent(item) {
      // console.log(item)
      this.hoverItem = item
      this.secTreeList = item.subNodes
    },
    nodeClick(data) {
      if (data.url.indexOf('/') != -1) {
        this.$router.push({
          path: data.url
        })
      } else {
        if (data.url.split('?').length > 1) {
          const pathOrName = data.url.split('?')[0]
          const queryInfo = this.getQueryString(data.url)

          if (pathOrName.indexOf('/') != -1) {
            this.$router.push({
              path: pathOrName,
              query: queryInfo
            })
          } else {
            this.$router.push({
              name: pathOrName,
              query: queryInfo
            })
          }
        } else {
          this.$router.push({
            name: data.url
          })
        }
      }
      this.$emit('itemClick', {})
    },
    getQueryString(item) {
      const str = item.split('?')[1]
      const arr1 = str.split('&')
      const obj = {}
      for (let i = 0; i < arr1.length; i++) {
        obj[arr1[i].split('=')[0]] = arr1[i].split('=')[1]
      }
      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-container {
  display: flex;

  .nav-first {
    padding: 5px;

    .nav-item {
      padding: 5px;
      min-width: 100px;
    }
    .nav-item-hover {
      background-color: #eeeeee;
      border-radius: 5px;
    }
  }

  .nav-line {
    background-color: #E0E0E0;
    width: 5px;
  }

  .nav-second {
    flex: 1;
    .sec-nav-item {
      display: flex;
      padding: 5px;
      width:100%;

      .sec-item-title {
        font-weight: bold;
        flex: 1;
        text-align: right;
        padding: 2px 0 2px;
        cursor: pointer;

        &:hover {
          //background-color: #eeeeee;
          color: #2d42af;
          border-radius: 5px;
        }
      }

      .sec-item-more {
        flex: 5;
        line-height: 20px;
        flex-wrap: wrap;
        margin-left: 5px;
        display: flex;

        .sec-item-btn {
          padding: 2px 5px;
          cursor: pointer;
          &:hover {
            background-color: #eeeeee;
            color: #2d42af;
            border-radius: 5px;
          }
        }
      }
    }
  }
}
</style>
