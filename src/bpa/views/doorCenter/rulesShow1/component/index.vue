<template>
  <div :style="scroll ? 'height: calc(100vh - 192px);' : 'margin:24px 0px'" class="tree-wrap">
    <ProcessTree ref="tree" :data="treeData" :scroll="scroll" v-dragabled/>
  </div>
</template>

<script>
import ProcessTree from './tree.vue'
export default {
    props:{
        treeData:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    data(){
        return {
          scroll: false
        }
    },
    mounted(){
        this.$refs.tree.initDomWidth();
    },
    watch:{
        treeData(){
            if (this.treeData.length > 0) {
                this.treeData[0].area === '通威股份' ? this.scroll = true : this.scroll = false
            }
            this.$nextTick(this.$refs.tree.initDomWidth)
        }
    },
    directives:{
        dragabled:{
            bind(el, binding, vnode, oldVnode) {
                if(!binding) return
                el.onmousedown = (e) => {
                    // 鼠标按下，计算当前元素距离可视区的距离
                    let disX = e.clientX;
                    let disY = e.clientY;
                    el.style.cursor='move';

                    document.onmousemove = function (e) {
                        e.preventDefault(); // 移动时禁用默认事件

                        // 通过事件委托，计算移动的距离
                        const left = e.clientX - disX;
                        disX=e.clientX;
                        el.scrollLeft+=-left;

                        const top = e.clientY - disY;
                        disY=e.clientY;
                        el.scrollTop+=-top;
                    };

                    document.onmouseup = function (e) {
                        el.style.cursor='auto';
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                }
            }
        }
    },
    components:{
        ProcessTree
    }
}
</script>

<style scoped>
.tree-wrap{
    /* position: absolute; */
    /* overflow: hidden; */
    width:100%;
    top:0;
    left:0
}
.tree-wrap>div{
    width:calc(100% + 17px);
    height: 100%;
}
</style>
