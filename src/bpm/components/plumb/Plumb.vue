<template>
  <div class="diagramContainer">
    <div class="diagram-wrap left-diagram">
      <p style="margin-left: 10px; margin-bottom: 6px;">本流程字段</p>
      <plumb-tree :list="leftList" />
    </div>
    <div class="diagram-wrap right-diagram">
      <p style="margin-left: 10px; margin-bottom: 6px;">外部接口字段</p>
      <plumb-tree :list="rightList" />
    </div>
  </div>
</template>

<script>
import { jsPlumb } from 'jsplumb'
import $ from 'jquery'
import PlumbTree from "@/bpm/components/plumb/PlumbTree";
export default {
  name: 'Plumb',
  components: {
    PlumbTree
  },
  props: {
    leftList: {
      type: Array,
      default () {
        return []
      }
    },
    rightList: {
      type: Array,
      default () {
        return []
      }
    },
    connectData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      common: {
        isSource: true,
        isTarget: true,
        connector: 'Straight',
        endpoint: 'Dot',
        maxConnections: -1,
        anchor: 'Continuous',
        paintStyle: {
          fill: '#4caf50',
          radius: 4
        },
        hoverPaintStyle: {
          fill: 'red'
        },
        connectorStyle: {
          lineWidth: 2,
          outlineStroke: '#4caf50'
        },
        connectorHoverStyle: {
          lineWidth: 2,
          outlineStroke: 'red'
        }
      },
      connectionsList: [],
      plumbIns: null,
      allList: []
    }
  },
  computed: {
    plumbData() {
      return {
        leftList: this.leftList,
        rightList: this.rightList
      }
    }
  },
  watch: {
    plumbData: {
      handler: function(val) {
        this.$nextTick(() => {
          let that = this
          // that.plumbIns = jsPlumb.getInstance()
          if (that.plumbIns) {
            that.plumbIns.ready(function () {
              console.log(JSON.parse(JSON.stringify(val)))
              that.createPlumb(val.leftList)
              that.createPlumb(val.rightList)
              setTimeout(() => {
                that.plumbIns.deleteEveryConnection()
                that.connectData.forEach(item => {
                  Object.keys(item).forEach(key => {
                    let form = that.allList.find(el => key && key === el.fieldName)
                    let to = that.allList.find(el => item[key] && item[key] === el.fieldName)
                    console.log(form, to)
                    if (form && to) {
                      let flag = true
                      that.connectionsList.forEach(el => {
                        if (el.sourceId === form.id && el.targetId === to.id) {
                          flag = false
                        }
                      })
                      if (flag) {
                        that.connectEndpoint(form.id, to.id)
                      }
                    }
                  })
                })
              }, 1000)
              console.log(that.connectData)
            })
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    let that = this
    that.plumbIns = null
    that.$nextTick(() => {
      that.plumbIns = jsPlumb.getInstance()
      that.plumbIns.bind('click', function (conn, event) {
        console.log(conn)
        event.stopPropagation();
        that.$confirm(that.$t('hintText.areYouSureDelete'), that.$t('hintText.hint'), {
          confirmButtonText: that.$t('confirm'),
          cancelButtonText: that.$t('cancel'),
          type: 'warning'
        }).then(() => {
          that.plumbIns.deleteConnection(conn)
          that.connectionsList = that.plumbIns.getAllConnections() || []
          that.$emit('confirm', that.connectionsList, that.allList)
        }).catch(() => {})
      })
      that.plumbIns.bind('endpointClick', function (endpoint, event) {
        console.log(endpoint)
        event.stopPropagation();
        that.$confirm(that.$t('hintText.areYouSureDelete'), that.$t('hintText.hint'), {
          confirmButtonText: that.$t('confirm'),
          cancelButtonText: that.$t('cancel'),
          type: 'warning'
        }).then(() => {
          that.plumbIns.deleteConnection(endpoint.connections[0])
          that.connectionsList = that.plumbIns.getAllConnections() || []
          that.$emit('confirm', that.connectionsList, that.allList)
        }).catch(() => {})
      })
      that.plumbIns.bind("connection", function (info) {
        that.connectionsList = that.plumbIns.getAllConnections() || []
        console.log(that.connectionsList)
        that.$emit('confirm', that.connectionsList, that.allList)
      })
      that.plumbIns.bind('beforeDrop', function (info) {
        console.log(info)
        let source = that.allList.find(item => item.id === info.sourceId)
        let target = that.allList.find(item => item.id === info.targetId)
        return source.type !== target.type
      })
    })
  },
  methods: {
    initData() {

    },
    connectEndpoint(from, to) {
      this.plumbIns.connect({
        source: from,
        target: to,
        anchor: 'Continuous',
        connector: 'Straight',
        endpoint: 'Dot'
      })
    },
    createPlumb(list) {
      if (Object.prototype.toString.call(list) === '[object Array]') {
        list.forEach(item => {
          this.$nextTick(() => {
            if (!(this.allList.map(val => val.id).includes(item.id))) {
              this.allList.push(item)
            }
            if (item.isPlumb !== false) {
              if (item.type === 'source') {
                this.plumbIns.makeSource(item.id, {
                  anchor: 'Continuous',
                  uuid: item.id
                }, this.common)
              } else {
                this.plumbIns.makeTarget(item.id, {
                  anchor: 'Continuous',
                  uuid: item.id
                }, this.common)
              }
            }
          })
          if(item.child) {
            this.createPlumb(item.child)
          }
        })
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.diagramContainer {
  width: 100%;
  overflow: hidden;
  position: relative;
  .diagram-wrap {
    float: left;
    width: 50%;
    font-size: 12px;
  }
}
</style>
