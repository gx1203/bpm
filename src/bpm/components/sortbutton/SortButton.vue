<template>
  <el-row class="SortButton" type="flex">
    <el-col
      :span="item.span" @click.native="handleClick(item)"
      class="btn"
      :key="index" v-for="(item, index) in datas">
      <div style="margin: 0 auto" class="display-flex">
        <span class="name">{{item.name}}</span>
        <div v-if="item.key" class="icons">
          <i v-if="!item.sort" class="el-icon-caret-top"></i>
          <i v-if="!item.sort" class="el-icon-caret-bottom"></i>

          <i v-if="item.sort === 'asc'" class="el-icon-caret-top red"></i>
          <i v-if="item.sort === 'asc'" class="el-icon-caret-bottom"></i>

          <i v-if="item.sort === 'desc'" class="el-icon-caret-top"></i>
          <i v-if="item.sort === 'desc'" class="el-icon-caret-bottom red"></i>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'SortButton',

  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      datas: []
    }
  },

  watch: {
    items: {
      handler (datas) {
        this.datas = datas
      },
      immediate: true
    }
  },

  methods: {
    handleClick (item) {
      if (!item.key) {
        return
      }
      const tempData = {}
      this.datas.forEach(element => {
        if (item.key === element.key) {
          if (!element.sort) {
            this.$set(element, 'sort', 'asc')
          } else if (element.sort === 'desc') {
            this.$delete(element, 'sort')
          } else {
            this.$set(element, 'sort', 'desc')
          }
          tempData['orderby'] = element.key
          tempData['sort'] = element.sort
        } else if (element.key) {
          this.$delete(element, 'sort')
        }
      })
      this.$emit('sort', tempData)
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  .red {
    color: $tc4 !important;
  }

  .SortButton {
    font-size: 12px;
    color: $tc1;
    background: $bc2;
    margin-top: 20px;
    .btn {
      display: flex;
      padding: 10px;
      cursor: pointer;
    }
    .selected {
      border: 1px solid #ff0f0f;
      border-right: 1px solid #ff0f0f !important;
    }
    .name {
      display: inline;
      padding-right: 5px;
    }
    .icons {
      display: flex;
      flex-direction: column;
      padding: 0 5px;
      i {
        display: inline-block;
        height: 6px;
        width: 8px;
        color: #999;
      }
    }
  }
</style>
