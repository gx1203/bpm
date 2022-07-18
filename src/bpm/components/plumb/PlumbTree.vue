<template>
  <div class="diagram-content">
    <div v-for="(item, index) in list" :key="index" class="diagram-item">
      <span :id="item.id">{{ item.fieldShowName }} ({{ item.fieldType }})</span>
      <plumb-tree v-if="item.child" :list="item.child" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlumbTree',
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.diagram-content {
  padding-left: 10px;
  .diagram-item {
    span {
      display: inline-block;
      width: 160px;
      line-height: 20px;
      padding: 0 6px;
      margin: 2px 0;
      border-radius: 2px;
      border: 1px solid #2d42af;
    }
  }
}

</style>
