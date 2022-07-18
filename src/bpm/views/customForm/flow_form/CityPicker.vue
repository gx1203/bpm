<template>
  <div>
    <el-popover
      trigger="manual"
      v-model="cityPanelIsShow">
      <div class="vcp-panel">
        <h5>{{ $t('citySelection') }}</h5>
        <ul class="vcp-tags">
          <li :class="{'z-on': item === tagKey}" v-for="(item, index) in tagsArr" :key="index" @click="choiceTag(item)">
            {{ item }}
          </li>
        </ul>
        <div class="vcp-list">
          <div :class="{'z-hot': initial == 'hot'}"
               v-for="(citys, initial, index) in cityList" :key="index"
               v-show="currTagIncludes(initial)">
            <h6 v-if="initial != 'hot'">{{ initial }}</h6>
            <ul>
              <li v-for="(v, index1) in citys" @click="choiceCity(v.id)" :key="index1" :title="v.name">{{ v.name }}</li>
            </ul>
          </div>
        </div>
      </div>
      <el-input clearable slot="reference" readonly :disabled="disabled" v-model="currCityName" @click.native="cityPaneClick"/>
    </el-popover>
  </div>

</template>

<script>
export default {
  name: 'CityPicker',
  props: {
    field: {
      type: String,
      default: ''
    },
    value: {
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    noInput: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 城市列表
    cityList: {
      type: Object,
      default: function () {
        return window.CITY_PICKER_LIST || {}
      }
    },
    // 没有热门城市
    noHot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let tagsArr = ['热门', 'ABCDE', 'FGHJ', 'KLMN', 'PQRST', 'WXYZ']
    let tagKey = '热门'
    let tags = {}
    if (this.noHot) {
      tagsArr = ['ABCD', 'EFGH', 'JKL', 'MNPQ', 'RSTW', 'XYZ']
      tagKey = 'ABCD'
    }
    tagsArr.forEach((item) => {
      if (item === '热门') {
        tags[item] = ['hot']
      } else {
        tags[item] = item.split('')
      }
    })
    return {
      cityPanelIsShow: false,
      isMouseOver: false,
      tagsArr,
      tags,
      tagKey
    }
  },
  computed: {
    // 当前城市名字
    currCityName() {
      let {
        value,
        cityList
      } = this
      let cityName = ''
      Object.keys(cityList).forEach((item) => {
        cityList[item].forEach((item) => {
          if (value === item.id) {
            cityName = item.name
          }
        })
      })
      return cityName
    },
    currTag() {
      let {
        tagKey,
        tags
      } = this
      return tags[tagKey]
    }
  },
  watch: {
  },
  methods: {
    cityPaneClick(event) {
      event.stopPropagation()
      if (!this.disabled) {
        this.cityPanelIsShow = !this.cityPanelIsShow
      }
    },
    // 列表是否属于当前标签
    currTagIncludes(ini) {
      let {
        currTag
      } = this
      return currTag.includes(ini)
    },
    // 选择标签
    choiceTag(key) {
      this.tagKey = key
    },
    choiceCity(id) {
      console.log(id)
      this.cityPanelIsShow = false
      this.$emit('input', id)
    }
  },
  mounted() {
    this.$nextTick(() => {
      document.onclick = () => {
        this.cityPanelIsShow = false
      }
    })
  },
  destroyed() {
    window.onclick = null
  }
}

</script>

<style type="text/scss" lang="scss" scoped>
  $grey1: #DDD;
  $grey2: #f2f2f3;
  $c1: #d0000e;
  .el-popover  {
    border-radius: 1px !important;
    border: 0 !important;
  }

  .vcp-panel {
    width: 360px;

    h5 {
      margin-bottom: 5px;
      padding-left: 2px;
      color: #aaa;
      line-height: 1.5;
      font-weight: normal;
    }

    .vcp-tags {
      overflow: hidden;
      margin: 5px 0;

      li {
        box-sizing: border-box;
        width: 60px;
        line-height: 20px;
        display: block;
        float: left;
        background-color: $grey2;
        text-align: center;
        border-left: 1px solid #fff;
        cursor: pointer;

        &:first-child {
          border-left: none;
        }

        &:hover {
          color: $c1;
        }

        &.z-on {
          background-color: $c1;
          color: #fff;
        }
      }
    }

    .vcp-list {
      overflow: hidden;
      border-bottom: 10px solid #fff;

      > div {
        margin: 1px 0 -1px;
        padding: 5px 0;
        line-height: 24px;
        border-bottom: 1px dashed #eee;
        overflow: hidden;

        h6 {
          float: left;
          font-weight: normal;
          color: $c1;
          font-size: 13px;
          width: 30px;
          padding-left: 5px;
        }

        ul {
          overflow: hidden;

          li {
            float: left;
            width: 60px;
            padding-left: 4px;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:hover {
              background-color: $grey2;
              color: $c1;
            }
          }
        }

        &.z-hot {
          padding-left: 10px;

          ul {
            li {
              padding-left: 6px;
            }
          }
        }
      }
    }
  }

</style>
