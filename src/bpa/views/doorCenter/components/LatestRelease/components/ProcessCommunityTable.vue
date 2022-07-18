<template>
  <div>
    <ul class="card-list">
      <li v-for="(item, index) in processList" :key="index">
        <div class="card-content">
          <div class="card-detail">
            <p @click="toDetails(item)">{{ item.name }}</p>
            <span class="tag">{{ $t('version') }}：{{ item.version }}</span>
            <span v-if="item.isNew" class="tagRed">NEW</span>
          </div>
          <div class="card-tool">
            <span>{{ $t('creator') }}：{{ item.submitname }}</span>
            <span>{{ item.effectiveon | formatDateTime }}</span>
            <el-button type="primary" @click="toDetails(item)">{{ $t('viewDetails') }}</el-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  getCommunityList
} from '@/bpa/api/processModelCenter/processCommunity'

export default {
  data() {
    return {
      processList: []
    }
  },
  mounted() {
    this.getList()
    this.dayCount()
  },
  methods: {
    toDetails(row) {
      const { href } = this.$router.resolve({
        path: '/processDetails/' + row.id
      })
      window.open(href, '_blank')
    },
    // 更多
    showMoreProcess() {
      this.$router.push('/processCenter/processModelCenter/processCommunity')
    },
    getList() {
      getCommunityList({
        orderby: 'effectiveon',
        sort: 'desc',
        pageNum: 1,
        pageSize: 6,
        attr: { attr1: 'value1', attr2: 'value2' }
      }, '1').then(res => {
        if (!res) return false
        this.processList = res.list
        this.processList.forEach(item => {
          this.$set(item, 'isNew', this.dayCount(item.effectiveon) <= 3)
        })
      })
    },
    dayCount(date) {
      var date1 = new Date(date);
      var date2 = new Date();
      return (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
