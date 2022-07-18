<template>
  <div class="inline-block">
    <div v-for="(item, index) in children" :key="index" class="labelContent">
      <div
        class="w200px h100 label"
        :class="{
          level2: item.rank == 2,
          level3: item.rank == 3,
          level4: item.rank == 4,
          level5: item.rank == 5,
          level6: item.rank >= 6
        }"
      >
        <p
          class="cursor-pointer"
          :title="item.code + item.name"
          @dblclick="topage(item.id)"
        >
          {{ item.code ? item.code + item.name : item.name }}
        </p>
      </div>
      <frame-child
        v-if="!!item.children && item.children.length > 0"
        :children="item.children"
      />
    </div>
  </div>
</template>

<script>
// import frameChild from './frameChild.vue'
import { getCommunityList } from '@/bpa/api/processModelCenter/processCommunity'
export default {
  name: 'Frame',
  components: {
    frameChild: () => import('./frameChild.vue')
  },
  props: {
    children: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    topage(id) {
      console.log(id)
      getCommunityList(
        {
          filters: [
            {
              key: 'modelid',
              value: id
            }
          ],
          orderby: 'createon',
          sort: 'desc',
          pageNum: 1,
          pageSize: 5
        },
        1
      ).then(res => {
        console.log(res)
        if (!!res.list && res.list.length > 0) {
          this.$confirm(
            this.$t('hintText.WhetherToViewTheProcessCommunity'),
            this.$t('hintText.hint'),
            {
              confirmButtonText: this.$t('confirm'),
              cancelButtonText: this.$t('cancel'),
              type: 'warning'
            }
          )
            .then(() => {
              this.$router.push('/processDetails/' + res.list[0].id)
            })
            .catch(err => {})
        } else {
          this.$message({
            message: this.$t('hintText.notBeenPublishedAndCannotBeAccessed'),
            type: 'warining'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inline-block {
  display: inline-block;
  vertical-align: top;
}
.text-center {
  text-align: center;
}
.w200px {
  width: 200px;
}
.labelContent {
  min-height: 30px;
  line-height: 24px;
  padding-left: 200px;
  position: relative;
  .label {
    color: #fff;
    font-size: 12px;
    box-sizing: border-box;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
    position: absolute;
    top: 0;
    left: 0;
    p {
      width: 85%;
      line-height: 16px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
.level2 {
  background-color: #499c12;
}
.level3 {
  background-color: #92196a;
}
.level4 {
  background-color: #e26627;
}
.level5 {
  background-color: #0023a1;
}
.level6 {
  background-color: #00819e;
}
.level7 {
  background-color: orangered;
}
</style>
