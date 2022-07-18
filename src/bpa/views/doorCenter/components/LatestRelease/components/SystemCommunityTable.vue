<template>
  <div>
    <ul class="card-list">
      <li v-for="(item, index) in tableList" :key="index">
        <div class="card-content">
          <div class="card-detail">
            <p @click="toDetails(item)">{{ item.title }}</p>
            <span class="tag">{{ $t('version') }}：{{ item.version }}</span>
            <span v-if="item.isNew" class="tagRed">NEW</span>
          </div>
          <div class="card-tool">
            <span>{{ $t('releasePeople') }}：{{ item.provideruser }}</span>
            <span>{{ item.effectiveion | formatDateTime }}</span>
            <el-button type="primary" @click="toDetails(item)">{{ $t('viewDetails') }}</el-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  queryReleasedCopy
} from '@/bpa/api/rulesCenter/handbookFiles'
import { getFormateDate } from '@/bpa/utils/common'

export default {
  data() {
    return {
      tableList: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    toDetails(row) {
      const { href } = this.$router.resolve({
        path: '/rulesDetail/' + row.docId + '/' + row.revId
      })
      window.open(href, '_blank')
    },
    async getList() {
      await queryReleasedCopy({
        pageNum: 1,
        pageSize: 6,
        orderby: 'effectivedate',
        sort: 'desc',
        filters: [
          { key: 'status', opt: 'EQ', type: 'S', value: '' }
        ],
        logic: 'and'
      }).then(res => {
        if (!res) return false
        this.tableList = res.list
        this.tableList.forEach(item => {
          this.$set(item, 'isNew', this.dayCount(item.effectiveion) <= 3)
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
