<template>
  <el-select clearable v-bind="$attrs" v-on="$listeners">
    <option
      v-for="(item, index) in nodeData.nodeoptions"
      :key="index" :label="item.text" :value="item.value"/>
  </el-select>
</template>

<script>
export default {
  name: 'FlowSelect',
  props: {
    nodeData: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>

</style>
