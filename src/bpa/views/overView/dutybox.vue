<template>
  <div class="dutybox">
    <div class="conbox">
      <div class="title">
        <p class="left_t">
          <span class="tit">{{ data.title ? data.title : "" }}</span>
          <span class="num">({{ data.num ? data.num : "0" }})</span>
        </p>
        <p class="right_t" @click="Suk_jump">
          <span>{{ $t("toMore") }}</span>
          <i class="el-icon-arrow-right"></i>
        </p>
      </div>
      <div
        class="t_con"
        v-if="data.list.length > 0"
        v-for="(item, index) in data.list"
        :key="index + 2"
      >
        <div class="t_con_left" @click="Suk_tojump(item)">
          <p :class="data.click ? 'click' : ''">{{ item[data.prop] }}</p>
        </div>
      </div>
      <div v-else class="t_con">
        <div class="imgbox">
          <img class="noimg" src="./img/no.png" alt="" />
          <p>暂时没有数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
    };
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    // this.title = this.data.title
    // this.num = this.data.num
    // this.list = this.data.list
    // this.text = this.data.text
    // console.log(this.data,'this.data')
  },
  methods: {
    Suk_tojump(item) {
      console.log(item);
      if (this.data.detailname == "processDetails") {
        this.$router.push("/processDetails/" + item.id);
      }
      if (this.data.detailname == "rulesDetail") {
        this.$router.push("/rulesDetail/" + item.docId + "/" + item.revId);
      }
    },
    Suk_jump() {
      console.log(this.data);
      if (this.data.moreurl) {
        this.$router.push({
          path: this.data.moreurl,
        });
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.conbox {
  // min-width: 313px;
  width: 100%;
  height: 342px;
  border-radius: 4px;
  background: #fff;
  margin-top: 20px;
  overflow: hidden;
  .t_con {
    display: flex;
    justify-content: space-between;
    padding: 7px 17px;
    .t_con_left {
      font-size: 14px;
      color: #666666;
      .click {
        color: #333333;
      }
      .click:hover {
        text-decoration: underline;
        color: #2d42af;
        cursor: pointer;
      }
    }
    .t_con_right {
      font-size: 14px;
      color: #666666;
    }
  }
  .imgbox {
    width: 100%;
    text-align: center;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 17px;
    letter-spacing: 0px;
    color: #999999;
    .noimg {
      margin: 60px;
    }
  }
  .con {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 159px;
    .con_right {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      width: 201px;
      .m {
        width: 85px;
        display: inline-block;
        font-size: 14px;
        margin: 0 10px;
        color: #333333;
        text-align: left;
      }
      .tag {
        font-size: 12px;
        letter-spacing: 0px;
        color: #298aff;
        padding: 2px 8px;
        background: #e5efff;
        border-radius: 10px;
      }
    }
    .con_left {
      width: 138px;
      display: flex;
      align-items: center;
      flex-direction: column;
      .tag1 {
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 17px;
        letter-spacing: 0px;
        color: #2d42af;
        padding: 2px 8px;
        border-radius: 10px;
        background: #e5eaff;
        margin-top: 5px;
      }
      .zg {
        margin-top: 5px;
        font-size: 14px;
        font-weight: 600;
        line-height: 17px;
        letter-spacing: 0px;
        color: #333333;
      }
      img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .con_right {
      border-left: 2px solid #f5f5f5;
      text-align: center;
      height: 100px;
      justify-content: space-around;
    }
  }
  .title {
    height: 47px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebebeb;
    padding: 0 10px;

    .right_t {
      font-size: 12px;
      color: #999999;
      &:hover {
        cursor: pointer;
        color: #666666;
      }
    }
    .left_t {
      font-weight: 600;
      &::before {
        content: "";
        border-left: 4px solid #2d42af;
      }
    }

    .tit {
      font-size: 15px;
      color: #333333;
      margin-left: 10px;
    }
  }
}
</style>