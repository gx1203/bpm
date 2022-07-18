<template>
  <div>
    <el-button type="primary" style="width: 100%" @click="open()">打开office插件</el-button>
  </div>
</template>
<script>

export default {
  methods: {
    open() {
      let datatochildcmd = 2;
      let v1 = Math.random();
      var ntkoed = ntkoBrowser.ExtensionInstalled();
      if (ntkoed) {
           ntkoBrowser.openWindow("http://localhost/newdemo/editindex.html?cmd=" + datatochildcmd +"&type=" + false+"&href=" + process.env.VUE_APP_HOST_URL+process.env.VUE_APP_BASE_URL+  "&v1=" + v1);
          // ntkoBrowser.openWindow("http://localhost/newdemo/editindex.html?cmd=" + datatochildcmd + "&v1=" + v1);
      } else {
          var iTop = ntkoBrowser.NtkoiTop(); //获得窗口的垂直位置;
          var iLeft = ntkoBrowser.NtkoiLeft(); //获得窗口的水平位置;
          window.open("http://localhost/newdemo/exeindex.html", "", "height=200px,width=500px,top=" + iTop + "px,left=" + iLeft + "px,titlebar=no,toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no");
      }
      window.ntkoCloseEvent = function() {
        // alert("跨浏览器插件应用程序窗口已关闭!");
      };
    },
  }
};
</script>

