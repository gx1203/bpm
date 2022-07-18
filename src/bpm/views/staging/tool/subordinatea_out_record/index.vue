<template>
  <el-card shadow="never" class="card-reset">
    <!-- 表格 -->
    <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      @currentChange="currentChange"
    >
      <!-- 搜索和高级搜索 -->
      <template #search>
        <div>
          <div class="tool-common-wrap">
            <div class="btn-wrap">
              <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                {{ $t('advancedQuery') }}
                <i
                  :class="
                    isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                  "
                />
              </el-button>
              <el-button type="primary" @click="rest">
                {{ $t('refresh') }}
                <!---->
              </el-button>
            </div>
          </div>
          <el-form
            class="power-search"
            :model="searchForm"
            @keyup.enter.native="search"
            ref="searchForm"
            label-width="120px"
            size="mini"
            v-if="isPowerSearch"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('creator') + '：'">
                  <el-input
                    clearable
                    type="text"
                    v-model="searchForm.creator"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('authorizer') + '：'">
                  <el-input
                    clearable
                    type="text"
                    v-model="searchForm.grantor"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('agent') + '：'">
                  <el-input
                    clearable
                    type="text"
                    v-model="searchForm.surrogate"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('startTime') + '：'">
                  <el-date-picker
                    v-model="searchForm.startDate"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    :range-separator="$t('placeholderText.to')"
                    :start-placeholder="$t('placeholderText.startDate')"
                    :end-placeholder="$t('placeholderText.endDate')"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('endTime') + '：'">
                  <el-date-picker
                    v-model="searchForm.endDate"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    :range-separator="$t('placeholderText.to')"
                    :start-placeholder="$t('placeholderText.startDate')"
                    :end-placeholder="$t('placeholderText.endDate')"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('takeTheTime') + '：'">
                  <el-date-picker
                    v-model="searchForm.loseEfficacyDate"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    :range-separator="$t('placeholderText.to')"
                    :start-placeholder="$t('placeholderText.startDate')"
                    :end-placeholder="$t('placeholderText.endDate')"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('state') + '：'">
                  <el-select clearable type="text" v-model="searchForm.status">
                    <el-option value :label="$t('all')" />
                    <el-option
                      v-for="(item, index) in statusArr"
                      :key="index"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="text-r">
                <el-button type="primary" @click="search">{{
                  $t('query')
                }}</el-button>
                <el-button type="primary" @click="rest">{{
                  $t('reset')
                }}</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>

      <!-- 开始时间 -->
      <template #startDate="{ row }">
        <div>{{ row.startDate | formatDateTime }}</div>
      </template>

      <!-- 结束时间 -->
      <template #endDate="{ row }">
        <div>{{ row.endDate | formatDateTime }}</div>
      </template>

      <!-- 收回时间 -->
      <template #loseEfficacyDate="{ row }">
        <div>{{ row.loseEfficacyDate | formatDateTime }}</div>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <div>{{ getStatusStr(row.status) }}</div>
      </template>
    </bas-table>
  </el-card>
</template>

<script>
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import { getOutAuthList } from '../../../../api/staging/tool/subordinatea_out_record'
export default {
  mixins: [SearchListMixin],
  inject: ['reload'],
  name: 'subordinateaOutRecord',
  components: {},
  data() {
    return {
      selections: [],
      dialogVisible: false,
      editItem: {},
      statusArr: [
        {
          label: this.$t('takeEffect'),
          value: 'VALID'
        },
        {
          label: this.$t('notActive'),
          value: 'INVALID'
        },
        {
          label: this.$t('retracted'),
          value: 'RECOVERY'
        },
        {
          label: this.$t('completed'),
          value: 'EXPIRED'
        }
      ],
      headerList: [
        {
          label: this.$t('creator'), // 创建人
          prop: 'creator',
          sortable: true
        },
        {
          label: this.$t('authorizer'), // 授权人
          prop: 'grantor',
          sortable: true
        },
        {
          label: this.$t('agent'), // 代理人
          prop: 'surrogate',
          sortable: true
        },
        {
          label: this.$t('startTime'), // 开始时间
          prop: 'startDate',
          slotName: 'startDate',
          sortable: true
        },
        {
          label: this.$t('endTime'), // 结束时间
          prop: 'endDate',
          slotName: 'endDate',
          sortable: true
        },
        {
          label: this.$t('takeTheTime'), // 收回时间
          prop: 'loseEfficacyDate',
          slotName: 'loseEfficacyDate',
          sortable: true
        },
        {
          label: this.$t('state'), // 状态
          prop: 'status',
          slotName: 'status',
          sortable: true
        },
        {
          label: this.$t('processName2'), // 流程名称
          prop: 'processNameCn',
          sortable: true
        }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      // if (this.searchType === 'power') {
      //   this.getData()
      // } else {
      //   this.quickQueryData()
      // }
      this.getData()
    },
    getStatusStr(status) {
      const result = this.statusArr.find(item => item.value === status)
      return result ? result.label : '未知'
    },
    // 获取数据
    getData() {
      this.loading = true
      this.checkAll = false
      getOutAuthList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false
            if (item.processList) {
              item.processName = item.processList
                .map(item => item.processName)
                .join(',')
              item.processNameCn = item.processList
                .map(item => item.processNameCn)
                .join(',')
            }
          })
          this.content = rt.data
          this.page.total = this.content.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 搜索
    search() {
      this.filters = []
      this.page.pageNum = 1
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: 'LIKE',
          type: 'S',
          value: this.searchForm[key]
        }
        if (filter.key === 'status') {
          filter.opt = 'EQ'
        }
        if (
          key === 'startDate' ||
          key === 'endDate' ||
          key === 'loseEfficacyDate'
        ) {
          filter.type = 'D'
          filter.opt = 'BETWEEN'
          filter.value = this.searchForm[key]
            ? this.searchForm[key].join('~')
            : ''
        }
        this.filters.push(filter)
      })
      this.getData()
    },
    // 重置
    rest() {
      this.searchForm = {}
      this.search()
    },
    handleSort(val) {
      this.sort = val
      this.getData()
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.table-header {
  position: relative;
  background: $bc2;
  display: flex;
  align-items: center;
  .all-check {
    position: absolute;
    left: 20px;
  }
}
</style>
