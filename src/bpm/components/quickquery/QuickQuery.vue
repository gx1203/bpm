<template>
  <div class="QuickQuery">
    <el-select clearable v-if="isDate" v-model="dateRange.value">
      <el-option
        v-for="item in dateRangeList"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-input
      clearable
      v-model="searchKey"
      @keyup.enter.native="quickSearch"
      :title="placeholder"
      :placeholder="placeholder"
      style="width: 250px;"
    >
      <span slot="append" @click="quickSearch">{{ $t("search") }}</span>
      <i slot="prefix" class="el-input__icon iconfont icon-sousuo2"></i>
    </el-input>
  </div>
</template>

<script>
import { getDate } from "@/bpm/utils/utils";

export default {
  name: "QuickQuery",
  props: {
    placeholder: {
      type: String,
      default: ""
    },

    items: {
      type: Array,
      default() {
        return [];
      }
    },
    isDate: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dateRangeList: [
        {
          name: this.$t("all"),
          value: ""
        },
        {
          name: this.$t("NearlyAWeek"),
          value: -1
        },
        {
          name: this.$t("nearlyAMonth"),
          value: -2
        },
        {
          name: this.$t("nearlyHalfAYear"),
          value: -3
        }
      ],
      dateRange: {
        value: "",
        list: []
      },
      searchKey: ""
    };
  },
  watch: {
    "dateRange.value"(val) {
      if (val) {
        this.dateRange.list = [getDate("month", val), getDate()];
      } else {
        this.dateRange.list = [];
      }

      this.quickSearch();
    }
  },

  methods: {
    // 单个搜索
    quickSearch() {
      let data = {
        searchData: this.searchKey,
        searchDate: this.dateRange.list[0]
      };
      this.$emit("quickSearch", data);
    },
    quickReset() {
      this.dateRange = {
        value: "",
        list: []
      };
      this.searchKey = "";
    }
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
.red {
  color: #ff0f0f !important;
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
    border: 1px solid $bc4;
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
