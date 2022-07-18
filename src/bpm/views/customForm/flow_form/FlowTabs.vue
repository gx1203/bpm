<template>
     
  <el-tabs v-model="activeName" @tab-click="tabsForm" type="card">
    <el-tab-pane
      v-for="(item, index) in dataList"
      :key="item.key"
      :label="item.tabname"
      :name="item.tabname"
      :disabled="isPrint"
    >
      <span slot="label" class="pos-relative">
        {{item.tabname}}
        <el-button type="text" class="red delete-but" @click.stop="handleDelete(item)">
          <i class="el-icon-delete" />
        </el-button>
      </span>
      <draggable v-model="item.nodeTabLists" :options="dragOptions2" style="min-height:60px">
        <flow-card
          v-for="item2 in item.nodeTabLists.filter(el => el.istab === '0')"
          :class="{'bg-outline':bgClick === item2.key}"
          :bgClick="bgClick"
          @handleDelete="handleDelete"
          @click.native.stop="formHandle(item2)"
          @formHandle="formHandle"
          :data="item2"
          :key="item2.key"  
        />
        <flow-tabs
          v-for="item2 in tabsList[index]"
          :data="item2"
          :key="item2.key"
          v-if="item.istab === '1'"
        />
      </draggable>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import FlowCard from "./FlowCard";
export default {
  name: "FlowTabs",
  components: {
    FlowCard
  },
  data() {
    return {
      tabsList: [],
      activeName: "",
      dataList: []
    };
  },
  computed: {
    dragOptions2() {
      return {
        animation: 0,
        ghostClass: "ghost",
        filter: ".tab",
        group: {
          // 只允许放置shared的控件,禁止pull
          put: ["shared1"]
        }
      };
    },
    isLRShow (){
      return this.$store.state.custom.isLRShow;
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    bgClick: {
      type: [Number,String],
      default: () => -1
    },
    isPrint: {
      type: Boolean
    }
  },
  watch: {
    data: {
      handler(val) {
        this.tabsList = [];
        let _list = [];
        val.forEach((item, index) => {
          this.tabsList.push([]);
          this.tabsList[index] = item.nodeTabLists.filter(el => {
            return el.istab === "1";
          });
          if (item.visible !== "H") {
            _list.push(item);
          }
        });
        if (_list.length > 0) {
          this.activeName = _list[0].tabname;
        }
        this.dataList = _list;
      },
      immediate: true
    },
    expand(val) {
      this.slideToggle(val);
    }
  },
  methods: {
    tabsForm(){
      let data = this.dataList.find(item=> item.tabname === this.activeName)
      this.formHandle(data)
    },
    formHandle(data,i) {
      if(i || i=== 0 ){
        this.$emit("formHandle",data,i)
      }else{
        this.$emit("formHandle",data)
      }
    },
    handleDelete(data) {
      this.$emit("handleDelete",data)
    },
    slideToggle(show) {
      const parent = this.$refs["card"];
      if (show) {
        parent.style.overflow = "hidden";
        parent.style.height = 40 + parent.lastElementChild.offsetHeight + "px";
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          parent.style.overflow = "auto";
          parent.style.height = "auto";
        }, 500);
      } else {
        parent.style.overflow = "hidden";
        parent.style.height = 40 + parent.lastElementChild.offsetHeight + "px";
        setTimeout(() => {
          parent.style.overflow = "hidden";
          parent.style.height = "35px";
        }, 10);
      }
    }
  },
  mounted() {}
};
</script>

<style type="text/scss" lang="scss" scoped>
.el-tabs {
  padding-left: 15px;
  margin-top: 20px;
  .el-tab-pane {
    .card {
      border-bottom: none;
    }
  }
  .delete-but {
    position: absolute;
    top: -15px;
    opacity: 0;
    right: -15px;
  }
  .red {
    color: red;
  }
  .el-tabs__item:hover .delete-but{
    opacity: 1;
  }
}
</style>
