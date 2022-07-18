<template>
  <div class="wrap">
    <div v-for="(item, index) in treeData" :key="index" class="content">
      <div class="center">
        <span :class="{'level2': treeData[0].folderlevel == '2', 'level3': treeData[0].folderlevel == '3'}" class="analysis">{{ item.area }}</span>
        <span v-if="allshow" class="node" @click="changeShow">-</span>
        <span v-else class="node" @click="changeShow">+</span>
      </div>
      <div v-show="allshow" class="border-wrap">
        <div class="handle-border">
          <div v-for="(item, index) in treeData[0].childList" :key="index" class="margins">
            <label-card :get-lab-data="item" :car-name="item.area" :label-color="item.color" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LabelCard from './labelCard.vue'

export default {
  name: 'Test',
  components: { LabelCard },
  props: {
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      // treeData: {},
      allshow: true,
      loading: true
    }
  },
  // 监听数据
  watch: {
    treeData: {
      handler: function(val) {
        console.log('treeData-我变化了', val)
        this.treeData = val
        this.$set(this.treeData[0], 'changeTime', Date.parse(new Date())) // 刷新数据
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    changeShow() {
      this.allshow = !this.allshow
    }
  }
}
</script>

<style scoped lang="scss">
.active {
  color: red;
}

.margins {
  margin-top: 40px;
}

/* 超出后隐藏，显示.... */
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.img-width {
  width: 30px;
  height: 15px;
}

/* 点击的节点 */
.node {
  text-align: center;
  border-radius: 50%;
  border: 1px solid #2d42af;
  color: #2d42af;
  cursor: pointer;
  width: 18px;
  height: 18px;
  line-height: 19px;
  margin-left: 10px;
  margin-right: 10px;
}

.box-shows {
  box-shadow: 1px 1px 8px #888888;
}

.wrap {
  width: 100%;
  padding: 10px 0;
  height: 100%;
  // overflow: scroll;
  .content {
    background: #fff;
    display: flex;
    justify-content: flex-start;
    width: 100%;
    height: 100%;

    .border-wrap {
      .handle-border {
        // min-height: 100vh;
        border-left: 1px solid #ddd;
        border-image: -webkit-linear-gradient(#2d42af, #2d42af) 20 20;
        border-image: -moz-linear-gradient(#2d42af, #2d42af) 20 20;
        border-image: -o-linear-gradient(#2d42af, #2d42af) 20 20;
        border-image: linear-gradient(#2d42af, #2d42af) 20 20;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .handle-border:after {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        height: 100%;
        width: 20px;
        content: '';
        border-top: solid #2d42af 1px;
        border-bottom: solid #2d42af 1px;
      }
    }

    .handle-border > div:first-child {
      margin-top: 0;
    }

    .right-img {
      width: 28px;
      height: 20px;
    }

    .center {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: justify;
      // padding-top: 20px;

      .analysis {
        box-shadow: 2px 2px 12px 0px rgba(147, 163, 198, 0.45);
        padding: 10px 5px;
        // background: #43b984;
        font-weight: bold;
        color: #fffdef;
        display: block;
        text-align: center;
        width: 100px;
      }
      .level2 {
        background-color: #43b984;
        cursor: pointer;
      }
      .level3{
        background-color:  #2d42af;
        cursor: pointer;
      }
    }

    .wrap-boders {
      border-left: 1px solid #ddd;
      border-image: -webkit-linear-gradient(#2d42af, #2d42af) 20 20;
      border-image: -moz-linear-gradient(#2d42af, #2d42af) 20 20;
      border-image: -o-linear-gradient(#2d42af, #2d42af) 20 20;
      border-image: linear-gradient(#2d42af, #2d42af) 20 20;
      position: relative;
      height: 100%;
      /* display: flex;
      flex-direction: column;
      justify-content: space-between;*/
      .box-wrap {
        .test-title-wrap {
          display: flex;
          justify-content: flex-start;
          width: 120px;

          .test-text {
            background: #00b0f0;
            padding: 0 10px;
            color: #fff;
            height: 30px;
            line-height: 30px;
          }

          .node {
            margin: 5px 5px;
          }
        }

        .quality {
          .test-text {
            background: #f4b183;
          }

          .node {
            border-color: #f4b183;
            color: #f4b183;
          }
        }

        .tecgnical {
          .test-text {
            background: #004488;
          }

          .node {
            border-color: #004488;
            color: #004488;
          }
        }

        .run {
          .test-text {
            background: #005737;
          }

          .node {
            border-color: #005737;
            color: #005737;
          }
        }

        .test-cost {
          text-align: left;
          display: flex;
          justify-content: flex-start;
          margin-top: -7px;
          margin-left: -5px;

          .test-last-child {
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: space-between;

            .test-consumtpion {
              margin: -7px -2px;
              margin-left: 25px;

              .test-father-tab {
                display: flex;
                justify-content: flex-start;

                .test-get-left-tab {
                  height: 60px;
                  display: flex;
                  justify-content: flex-start;

                  .node {
                    margin-top: 15px;
                    margin-left: 5px;
                    border-color: #00fefe;
                    color: #00fefe;
                  }

                  .test-tab-left {
                    background: #00fefe;
                    padding: 5px 3px;
                    text-align: center;

                    p {
                      padding: 10px 10px;
                    }
                  }

                  .test-child-tab {
                    .test-item-tab {
                      display: flex;
                      justify-content: space-between;

                      span {
                        padding: 5px;
                      }
                    }

                    .test-item-tab-title {
                      background: #cbffff;
                    }

                    .test-item-tab-data {
                      border: 1px solid #cbffff;
                      border-top: none;
                      border-left: none;

                      span {
                        border: 1px solid #cbffff;
                        border-left: none;
                        border-top: none;
                        border-bottom: none;
                      }

                      span:last-child {
                        border: none;
                      }
                    }
                  }
                }
              }
            }
          }

          .get-child-border {
            border-left: 1px solid #ddd;
            border-image: -webkit-linear-gradient(#00b0f0, #2d42af) 20 20;
            border-image: -moz-linear-gradient(#00b0f0, #2d42af) 20 20;
            border-image: -o-linear-gradient(#00b0f0, #2d42af) 20 20;
            border-image: linear-gradient(#00b0f0, #2d42af) 20 20;
            position: relative;
          }

          .get-child-border:after {
            position: absolute;
            top: 0;
            height: 100%;
            left: 0;
            width: 20px;
            content: '';
            border-top: solid #00b0f0 1px;
            border-bottom: solid #2d42af 1px;
          }

          .quality-border {
            border-left: 1px solid #ddd;
            border-image: -webkit-linear-gradient(#f4b183, #2d42af) 20 20;
            border-image: -moz-linear-gradient(#f4b183, #2d42af) 20 20;
            border-image: -o-linear-gradient(#f4b183, #2d42af) 20 20;
            border-image: linear-gradient(#f4b183, #2d42af) 20 20;
            position: relative;
          }

          .quality-border:after {
            position: absolute;
            top: 0;
            height: 100%;
            left: 0;
            width: 20px;
            content: '';
            border-top: solid #f4b183 1px;
            border-bottom: solid #2d42af 1px;
          }

          .technical-border {
            border-left: 1px solid #ddd;
            border-image: -webkit-linear-gradient(#004488, #2d42af) 20 20;
            border-image: -moz-linear-gradient(#004488, #2d42af) 20 20;
            border-image: -o-linear-gradient(#004488, #2d42af) 20 20;
            border-image: linear-gradient(#004488, #2d42af) 20 20;
            position: relative;
          }

          .technical-border:after {
            position: absolute;
            top: 0;
            height: 100%;
            left: 0;
            width: 20px;
            content: '';
            border-top: solid #004488 1px;
            border-bottom: solid #2d42af 1px;
          }

          .run-borders {
            border-left: 1px solid #c5e0b3;
            border-image: -webkit-linear-gradient(#005737, #2d42af) 20 20;
            border-image: -moz-linear-gradient(#005737, #2d42af) 20 20;
            border-image: -o-linear-gradient(#005737, #2d42af) 20 20;
            border-image: linear-gradient(#005737, #2d42af) 20 20;
            position: relative;
          }

          .run-borders:after {
            position: absolute;
            top: 0;
            height: 100%;
            left: 0;
            width: 20px;
            content: '';
            border-top: solid #005737 1px;
            border-bottom: solid #2d42af 1px;
          }
        }

        .test-quality {
          width: 100%;
          text-align: left;
          margin-top: 50px;
        }
      }
    }

    .wrap-boders:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 100%;
      content: '';
      border-top: solid #2d42af 1px;
      border-bottom: solid #2d42af 1px;
    }
  }
}
</style>
