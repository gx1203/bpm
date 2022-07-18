<template>
  <div id="home" style="width:100%;color:white;min-width: 1280px;">
    <div class="header_b" style="height:100%">
      <el-row style="padding:10px">
        <el-col :span="6" class="header_left">
          <div class="logo_wrap">
            <img src="../../assets/img/qietu1/logo.png" alt />
          </div>
        </el-col>
        <el-col :span="6" class="header_center">
          <div class="map">
            <img src="../../assets/img/qietu1/map.png" alt />
            <div class="location">成都</div>
          </div>
          <div>
            <p>今天 阵雨 17-22C</p>
            <p>今天 阵雨 17-22C</p>
          </div>
        </el-col>
        <el-col :span="6" class="header_center">
          <div>
            <img src="../../assets/img/qietu1/形状3.png" alt />
            <span>在线咨询：</span>
            <p style="font-size:20px">028-6265260</p>
          </div>
        </el-col>
        <el-col :span="6" class="header_center">
          <div>
            <img
              style="width:30px;height:30px; border-radius: 30px;"
              src="../../assets/img/qietu1/name.png"
              alt
            />
            张三欢迎您
            <span class="logout">退出</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <div class="menu">
          <div>
            <img
              style="width:100%;position:absolute;right:0;left:0;margin:auto"
              src="../../assets/img/qietu1/hengxian.png"
              alt
            />
          </div>
          <el-col :span="18">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
              <el-menu-item index="1">首页</el-menu-item>
              <el-menu-item index="2">个人中心</el-menu-item>
              <el-menu-item index="3">管理驾驶舱</el-menu-item>
              <el-menu-item index="4">流程中心</el-menu-item>
              <el-menu-item index="5">知识中心</el-menu-item>
              <el-menu-item index="6">应用中心</el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="6">
            <!-- <img src="../../assets/img/qietu1/hengxian.png" alt=""> -->
            <input
              placeholder="请输入关键字搜索"
              style="padding:2px 30px; background:#FF000000;border:1px solid grey; border-radius: 6px;height:20px;margin-top:10px"
              type="text"
            />
          </el-col>
        </div>
      </el-row>
      <el-row style="margin:9% auto 1% auto;height:220px;width:80%">
        <el-col :span="17" style="margin-top:50px;width:70%">
          <!-- style="font-size:30px; background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#FFFFFFFF), to(#00f));
-webkit-background-clip: text;
          -webkit-text-fill-color: transparent;"-->
          <h1>打造世界级绿色能源和绿色食品供应商</h1>
          <p class="section1_title">索比光伏网：到2035年光伏发电将是世界第一发电</p>
          <div
            style="padding:12px; text-align:center;width:200px;background:#0E2139;border:1px solid #2F678B"
          >查看详情</div>
        </el-col>
        <el-col :span="7">
          <div style=" position: absolute;width:35%">
            <div style=" position: absolute;right:40px;top:10px;color:black">公告</div>
            <img style="width:100%" src="../../assets/img/qietu1/形状6.png" alt />
            <div class="gonggao">
              <p>通威集团关于2019国庆节放假安排的通知</p>
              <p>通威集团关于2019国庆节放假安排的通知</p>
              <p>通威集团关于2019国庆节放假安排的通知</p>
              <p>通威集团关于2019国庆节放假安排的通知</p>
            </div>
            <div class="more">更多公告></div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:18%;">
        <div class="list">
          <div class="list_1">
            <img src="../../assets/img/qietu1/daiban.png" alt />
            <div class="list_2">
              代办（22）
              <img class="listimg" src="../../assets/img/qietu1/形状7.png" alt />
            </div>
          </div>
          <div class="list_1">
            <img src="../../assets/img/qietu1/矩形9.png" alt />
            <div class="list_2_1">
              抄送（2）
              <img class="listimg" src="../../assets/img/qietu1/形状7.png" alt />
            </div>
          </div>
          <div class="list_1">
            <img src="../../assets/img/qietu1/矩形9.png" alt />
            <div class="list_2_2">
              流程跟踪（1）
              <img class="listimg" src="../../assets/img/qietu1/形状7.png" alt />
            </div>
          </div>
          <div class="list_1">
            <img src="../../assets/img/qietu1/矩形9.png" alt />
            <div class="list_2_3">
              邮箱（12）
              <img class="listimg" src="../../assets/img/qietu1/形状7.png" alt />
            </div>
          </div>
        </div>
      </el-row>
      <el-row style="width:100%;background:rgba(8, 25, 40, 0.8)">
        <div style="width:90%;margin:0 auto;display:flex;">
          <div class="new new1">
            <h1>新闻</h1>
            <h2>
              更多
              <img src="../../assets/img/qietu1/jiantou.png" alt />
            </h2>
          </div>
          <div class="new">
            <h3>关于同为国际文明停车........</h3>
            <p>关于同为国际文明停车........</p>
            <p>2019-9-25</p>
          </div>
          <div class="new">
            <h3>关于同为关于同为国际文明停车........</h3>
            <p>关于同为国际文明停车........</p>
            <p>2019-9-25</p>
          </div>
          <div class="new">
            <h3>关于同为国际文明停车........</h3>
            <p>关于同为国际文明停车........</p>
            <p>2019-9-25</p>
          </div>
          <div class="new">
            <h3>关于同为国际文明停车........</h3>
            <p>关于同为国际文明停车........</p>
            <p>2019-9-25</p>
          </div>
        </div>
      </el-row>
    </div>
    <div class="body_b">
      <el-row style="text-align:center;margin-top:140px;">
        <div style="text-align:center;position:relative">
          <img src="../../assets/img/qietu1/xiantiaozhaoxing.png" alt />
          <h1 style="position:absolute;right:45%;font-size:36px;top:20px">快捷办公</h1>
          <img
            style="position:absolute;width:100%;left:0;top:0px"
            src="../../assets/img/qietu1/图层616.png"
            alt
          />
        </div>
        <div style="text-align:center;margin-top:40px;width:86%;margin:40px auto">
          <img style="width:100%" src="../../assets/img/qietu1/bangong1.png" alt />
          <div class="dolist">
            <div class="dolist_1">
              <img src="../../assets/img/qietu1/zonghe.png" alt />
              <p>综合办公系统</p>
            </div>
            <div class="dolist_1">
              <img src="../../assets/img/qietu1/zonghe.png" alt />
              <p>综合办公系统</p>
            </div>
            <div class="dolist_1">
              <img src="../../assets/img/qietu1/zonghe.png" alt />
              <p>综合办公系统</p>
            </div>
            <div class="dolist_1">
              <img src="../../assets/img/qietu1/zonghe.png" alt />
              <p>综合办公系统</p>
            </div>
            <div class="dolist_1">
              <img src="../../assets/img/qietu1/zonghe.png" alt />
              <p>综合办公系统</p>
            </div>
            <div class="dolist_1">
              <img src="../../assets/img/qietu1/zonghe.png" alt />
              <p>综合办公系统</p>
            </div>
            <div class="dolist_1">
              <img src="../../assets/img/qietu1/zonghe.png" alt />
              <p>综合办公系统</p>
            </div>
            <div class="dolist_1">
              <img src="../../assets/img/qietu1/zonghe.png" alt />
              <p>综合办公系统</p>
            </div>
          </div>
        </div>
      </el-row>
      <el-row style="text-align:center;height:740px;margin-top:100px;">
        <div style="text-align:center;position:relative">
          <img
            style="position:absolute;width:100%;left:0;top:-20px"
            src="../../assets/img/qietu1/xiantiaozhaoxing.png"
            alt
          />
          <h1 style="position:absolute;right:45%;font-size:36px">日程待办</h1>
          <img src="../../assets/img/qietu1/图层616.png" alt />
        </div>
        <div style="text-align:center;position:absolute;width:86%;left:0;right:0;margin:20px auto">
          <img
            style="width:100%;position:absolute;left:0"
            src="../../assets/img/qietu1/形状15.png"
            alt
          />
          <div class="rili_1 rili">
            <img src="../../assets/img/qietu1/椭圆4.png" alt />
          </div>
          <div class="rili_2 rili">
            <img src="../../assets/img/qietu1/椭圆4.png" alt />
          </div>
          <el-col :span="9">
            <div>
              <div>
                <label for="visibility" class="left" style="position:relative">
                  <span>{{getFormateDate(value2, 'yyyy 年')}}</span>
                  <i class="icon iconfont icon-xiangxia"></i>
                </label>
                <el-date-picker clearable
                  id="visibility"
                  class="visibility"
                  style="width:0;padding: 0; margin-left: 200px;"
                  v-model="value2"
                  align="right"
                  type="year"
                ></el-date-picker>
                <!-- <el-date-picker clearable v-model="value2" type="month" placeholder="选择月"></el-date-picker> -->
                <calendar :date="value2" :checkedDate="checkedDate" @click="handlerDateClick"></calendar>
              </div>
              <div class="order">
                <div class="order_1">
                  <img src="../../assets/img/qietu1/形状17.png" alt />
                  <span>8:00-10:00</span>
                  <span>RPA项目工作计划安排</span>
                </div>
                <div class="order_1">
                  <img src="../../assets/img/qietu1/形状17.png" alt />
                  <span>8:00-10:00</span>
                  <span>RPA项目工作计划安排</span>
                </div>
                <div class="order_1">
                  <img src="../../assets/img/qietu1/形状17.png" alt />
                  <span>8:00-10:00</span>
                  <span>RPA项目工作计划安排</span>
                </div>
                <div class="order_1">查看更多></div>
              </div>
            </div>
          </el-col>
          <el-col :span="15">
            <div class="daiban">
              <div class="daiban_head">
                <h1>待办任务</h1>
                <div>查看更多></div>
              </div>
              <div class="daiban_body">
                <el-row>
                  <el-col :span="18">企业在线考试应用问卷星产品服务合同请示报告</el-col>
                  <el-col :span="2">王图</el-col>
                  <el-col :span="4">2019-9-30 17:54</el-col>
                </el-row>
                <el-row>
                  <el-col :span="18">企业在线考试应用问卷星产品服务合同请示报告</el-col>
                  <el-col :span="2">王图</el-col>
                  <el-col :span="4">2019-9-30 17:54</el-col>
                </el-row>
                <el-row>
                  <el-col :span="18">企业在线考试应用问卷星产品服务合同请示报告</el-col>
                  <el-col :span="2">王图</el-col>
                  <el-col :span="4">2019-9-30 17:54</el-col>
                </el-row>
                <el-row>
                  <el-col :span="18">企业在线考试应用问卷星产品服务合同请示报告</el-col>
                  <el-col :span="2">王图</el-col>
                  <el-col :span="4">2019-9-30 17:54</el-col>
                </el-row>
                <el-row>
                  <el-col :span="18">企业在线考试应用问卷星产品服务合同请示报告</el-col>
                  <el-col :span="2">王图</el-col>
                  <el-col :span="4">2019-9-30 17:54</el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </div>
      </el-row>
      <el-row style="text-align:center;height:700px;margin-top:100px;">
        <div style="text-align:center;position:relative">
          <img
            style="position:absolute;width:100%;left:0;top:-20px"
            src="../../assets/img/qietu1/xiantiaozhaoxing.png"
            alt
          />
          <h1 style="position:absolute;right:45%;font-size:36px">业务模块</h1>
          <img src="../../assets/img/qietu1/图层616.png" alt />
        </div>
        <div style="text-align:center;position:absolute;width:86%;left:0;right:0;margin:20px auto">
          <img
            style="width:100%;position:absolute;left:0;top:-10px"
            src="../../assets/img/qietu1/业务模块.png"
            alt
          />
        </div>

        <div class="mode">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1">人事</el-menu-item>
            <el-menu-item index="2">行政</el-menu-item>
            <el-menu-item index="3">财务</el-menu-item>
            <el-menu-item index="4">市场</el-menu-item>
          </el-menu>
        </div>

        <div class="mode_yewu">
          <div class="mode_1">
            <img src="../../assets/img/qietu1/图片2.png" alt />
            <div class="mode_2">
              <h1>共享中心功能</h1>
              <p>更快 更好</p>
            </div>
            <div class="mode_3">
              <p>最新功能之一上线啦，点击查看教程</p>
              <div class="mode_4">
                <div>
                  上传者：
                  <span>何志良</span>
                </div>
                <div>2019-09-22</div>
              </div>
            </div>
          </div>
          <div class="mode_1">
            <img src="../../assets/img/qietu1/图片2.png" alt />
            <div class="mode_2">
              <h1>共享中心功能</h1>
              <p>更快更好</p>
            </div>
            <div class="mode_3">
              <p>最新功能之一上线啦，点击查看教程</p>
              <div class="mode_4">
                <div>
                  上传者：
                  <span>何志良</span>
                </div>
                <div>2019-09-22</div>
              </div>
            </div>
          </div>
          <div class="mode_1">
            <img src="../../assets/img/qietu1/图片2.png" alt />
            <div class="mode_2">
              <h1>共享中心功能</h1>
              <p>更快更好</p>
            </div>
            <div class="mode_3">
              <p>最新功能之一上线啦，点击查看教程</p>
              <div class="mode_4">
                <div>
                  上传者：
                  <span>何志良</span>
                </div>
                <div>2019-09-22</div>
              </div>
            </div>
          </div>
          <div class="mode_1">
            <img src="../../assets/img/qietu1/图片2.png" alt />
            <div class="mode_2">
              <h1>共享中心功能</h1>
              <p>更快更好</p>
            </div>
            <div class="mode_3">
              <p>最新功能之一上线啦，点击查看教程</p>
              <div class="mode_4">
                <div>
                  上传者：
                  <span>何志良</span>
                </div>
                <div>2019-09-22</div>
              </div>
            </div>
          </div>
          <div class="mode_1 system">
            <img src="../../assets/img/qietu1/图片1.png" alt />
            <div class="mode_2">
              <h1>会计实训系统</h1>
              <p>仿真五十工作场景，流程，采用全真务实单据，让您体会真实业务流程仿真五十工作场景，流程，采用全真务实单据，让您体会真实业务流程</p>
            </div>
            <div class="detail">
              <div class="detail_1">点击查看</div>
            </div>
          </div>
          <div class="mode_1 system">
            <img src="../../assets/img/qietu1/图片6.png" alt />
            <div class="mode_2">
              <h1>会计实训系统</h1>
              <p>仿真五十工作场景，流程，采用全真务实单据，让您体会真实业务流程仿真五十工作场景，流程，采用全真务实单据，让您体会真实业务流程</p>
            </div>
            <div class="detail">
              <div class="detail_1">点击查看</div>
            </div>
          </div>
        </div>
      </el-row>
      <el-row style="text-align:center;height:800px;margin-top:100px;">
        <div style="text-align:center;position:relative">
          <img
            style="position:absolute;width:100%;left:0;top:-20px"
            src="../../assets/img/qietu1/xiantiaozhaoxing.png"
            alt
          />
          <h1 style="position:absolute;right:45%;font-size:36px">知识中心</h1>
          <img src="../../assets/img/qietu1/图层616.png" alt />
        </div>
        <div style="position:absolute;width:86%;left:0;right:0;margin:20px auto">
          <img
            style="width:100%;position:absolute;left:0"
            src="../../assets/img/qietu1/bangong.png"
            alt
          />
        </div>
        <div class="knowlege">
          <div class="knowlege_1">
            <img class="knowlegeImg" src="../../assets/img/qietu1/矩形6.png" alt />
            <div class="knowlege_2">
              <p>书籍推荐</p>
            </div>
            <div class="book">
              <div class="bookimg">
                <img src="../../assets/img/qietu1/形状19.png" alt />
              </div>
              <!-- <div class="book"> -->
              <div class="book_2">
                <div class="book_1">
                  <p>大咖推荐</p>
                  <img src="../../assets/img/qietu1/图层14.png" alt />
                </div>
                <div class="bookname">创变者逻辑</div>
              </div>
              <div class="book_2">
                <div class="book_1">
                  <p>大咖推荐</p>
                  <img src="../../assets/img/qietu1/图层14.png" alt />
                </div>
                <div class="bookname">创变者逻辑</div>
              </div>
              <div class="book_2">
                <div class="book_1">
                  <p>大咖推荐</p>
                  <img src="../../assets/img/qietu1/图层14.png" alt />
                </div>
                <div class="bookname">创变者逻辑</div>
              </div>
              <div class="bookimg_2">
                <img src="../../assets/img/qietu1/形状19.png" alt />
              </div>
              <!-- </div> -->
            </div>
          </div>
          <div class="knowlege_1">
            <img class="knowlegeImg" src="../../assets/img/qietu1/矩形6.png" alt />
            <div class="knowlege_2">
              <p>杂志刊物</p>
            </div>
            <div class="baozhi">
              <div class="baozhi_1">
                <div class="baozhi_2">
                  <p>通威农牧杂志</p>
                  <div class="baozhi_4">
                    <img src="../../assets/img/qietu1/图层14.png" alt />
                    <div class="baozhi_3">通威农牧报纸</div>
                  </div>
                  <div class="baozhi_4">
                    <img src="../../assets/img/qietu1/图层14.png" alt />
                    <div class="baozhi_3">通威农牧报纸</div>
                  </div>
                </div>
              </div>
              <div class="baozhi_1">
                <div class="baozhi_2">
                  <p>通威农牧杂志</p>
                  <div class="baozhi_4">
                    <img src="../../assets/img/qietu1/图层14.png" alt />
                    <div class="baozhi_3">通威农牧报纸</div>
                  </div>
                  <div class="baozhi_4">
                    <img src="../../assets/img/qietu1/图层14.png" alt />
                    <div class="baozhi_3">通威农牧报纸</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="knowlege_1">
            <img class="knowlegeImg" src="../../assets/img/qietu1/矩形6.png" alt />
            <div class="knowlege_2">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="热门阅读" name="first">
                  <div class="read">
                    <div class="read_1">
                      <span class="read_2">1</span> 通威股份信息化月度考核评信息化月度考核评
                    </div>
                    <div class="read_1">
                      <span class="read_2">2</span> 通威股份信息化月度考核评信息化月度考核评
                    </div>
                    <div class="read_1">
                      <span class="read_2">3</span> 通威股份信息化月度考核评信息化月度考核评
                    </div>
                    <div class="read_1">
                      <span class="read_2">4</span> 通威股份信息化月度考核评信息化月度考核评
                    </div>
                    <div class="read_1">
                      <span class="read_2">5</span> 通威股份信息化月度考核评信息化月度考核评
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
                <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div class="knowlege_1">
            <img class="knowlegeImg" src="../../assets/img/qietu1/矩形6.png" alt />
            <div class="knowlege_2">
              <p>知识分类</p>
            </div>
            <div class="wendan">
              <div class="wendang">
                <img src="../../assets/img/qietu1/文档库.png" alt />
                <div class="baozhi_3">文档库</div>
              </div>
              <div class="wendang">
                <img src="../../assets/img/qietu1/文档库.png" alt />
                <div class="baozhi_3">文档库</div>
              </div>
              <div class="wendang">
                <img src="../../assets/img/qietu1/文档库.png" alt />
                <div class="baozhi_3">文档库</div>
              </div>
              <div class="wendang">
                <img src="../../assets/img/qietu1/文档库.png" alt />
                <div class="baozhi_3">文档库</div>
              </div>
              <div class="wendang">
                <img src="../../assets/img/qietu1/文档库.png" alt />
                <div class="baozhi_3">文档库</div>
              </div>
              <div class="wendang">
                <img src="../../assets/img/qietu1/文档库.png" alt />
                <div class="baozhi_3">文档库</div>
              </div>
            </div>
          </div>
        </div>
      </el-row>
      <el-row style="text-align:center;height:1000px;margin-top:100px;">
        <div style="text-align:center;position:relative">
          <img
            style="position:absolute;width:100%;left:0;top:-20px"
            src="../../assets/img/qietu1/xiantiaozhaoxing.png"
            alt
          />
          <h1 style="position:absolute;right:45%;font-size:36px">通威产业</h1>
          <img src="../../assets/img/qietu1/图层616.png" alt />
        </div>
        <div style="height:520px;">
          <div
            style="text-align:center;position:absolute;width:86%;left:0;right:0;margin:20px auto"
          >
            <img
              style="width:100%;position:absolute;left:0;top:-20px"
              src="../../assets/img/qietu1/nongye.png"
              alt
            />
          </div>
          <div class="mode" style="font-size:16px">通威现在农牧产业链</div>
          <div class="canye">
            <div class="canye_1">
              <img src="../../assets/img/qietu1/canye1.png" alt />
              <div class="canye_2">
                <h3>良种繁育</h3>
                <p>通威种苗已形成在鲤鱼，鲫鱼，南美白对虾，罗非鱼，斑点叉尾洄等经济品种以及南方鲇</p>
              </div>
            </div>
            <div class="canye_1">
              <img src="../../assets/img/qietu1/canye1.png" alt />
              <div class="canye_2">
                <h3>良种繁育</h3>
                <p>通威种苗已形成在鲤鱼，鲫鱼，南美白对虾，罗非鱼，斑点叉尾洄等经济品种以及南方鲇</p>
              </div>
            </div>
            <div class="canye_1">
              <img src="../../assets/img/qietu1/canye1.png" alt />
              <div class="canye_2">
                <h3>良种繁育</h3>
                <p>通威种苗已形成在鲤鱼，鲫鱼，南美白对虾，罗非鱼，斑点叉尾洄等经济品种以及南方鲇</p>
              </div>
            </div>
            <div class="canye_1">
              <img src="../../assets/img/qietu1/canye1.png" alt />
              <div class="canye_2">
                <h3>良种繁育</h3>
                <p>通威种苗已形成在鲤鱼，鲫鱼，南美白对虾，罗非鱼，斑点叉尾洄等经济品种以及南方鲇</p>
              </div>
            </div>
          </div>
        </div>
        <div style="position:relative;margin-top:60px;">
          <div
            style=" text-align:center;position:absolute;width:86%;left:0;right:0;margin:20px auto"
          >
            <img
              style="width:100%;position:absolute;left:0;top:-20px"
              src="../../assets/img/qietu1/greencanye.png"
              alt
            />
          </div>
          <div class="mode" style="font-size:16px;margin-top:0px">通威现在农牧产业链</div>
          <div class="gufen">
            <div class="gufen_1">
              <img src="../../assets/img/qietu1/gufen.png" alt />
              <div class="gufen_2">永祥股份</div>
            </div>
            <div class="gufen_1">
              <img src="../../assets/img/qietu1/gufen.png" alt />
              <div class="gufen_2">永祥股份</div>
            </div>
            <div class="gufen_1">
              <img src="../../assets/img/qietu1/gufen.png" alt />
              <div class="gufen_2">永祥股份</div>
            </div>
          </div>
        </div>
      </el-row>
      <el-row
        style="text-align:center;height:340px;margin-top:100px;background:rgba(4, 16, 26, 0.8)"
      >
        <div>
          <el-row style="width:90%;border-bottom:1px solid grey;margin:20px auto;padding:20px;">
            <el-col :span="16">
              <div class="footer">
                <p>我是展位</p>
                <p>我是展位</p>
                <p>我是展位</p>
                <p>我是展位</p>
                <p>我是展位</p>
                <p>我是展位</p>
                <p>我是展位</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="footer_right">
                <div class="footer_right_1">
                  <p>
                    <img src="../../assets/img/qietu1/形状3.png" alt />咨询电话：028-26520325
                  </p>
                  <p>
                    <img src="../../assets/img/qietu1/形状3.png" alt />咨询电话：028-26520325
                  </p>
                  <p>
                    <img src="../../assets/img/qietu1/形状3.png" alt />咨询电话：028-26520325
                  </p>
                </div>
                <div>
                  <img src="../../assets/img/qietu1/tongwei.png" alt />
                  <p>下载i通威</p>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="footer_bottom">
            <ul>
              <li>相关链接</li>
              <li>集团官网</li>
              <li>股份官网</li>
              <li>通威太阳能</li>
              <li>永翔股份</li>
              <li>通威食品</li>
            </ul>
            <div>
              <p>
                地址：四川省成都市高新区天府大道中段588号
                <span>服务支持：信息部</span>
                <span>服务电话：028-5215311</span>
              </p>
              <p>
                版权：通威股份有限公司版权所有
                <span>版本：v2.0</span>
              </p>
            </div>
          </div>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getFormateDate } from '../../utils/common'
import { newSche, getEvents } from '@/bpa/api/doorCenter'
import { getStudyList } from '@/bpa/api/settings/processStudyManage'
import { getNoticeList } from '@/bpa/api/settings/noticeManage'

const warningType = [
  {
    label: '正点',
    value: '1'
  },
  {
    label: '提前15分钟',
    value: '2'
  },
  {
    label: '提前30分钟',
    value: '3'
  },
  {
    label: '提前1小时',
    value: '4'
  },
  {
    label: '提前2小时',
    value: '5'
  },
  {
    label: '提前1天',
    value: '6'
  },
  {
    label: '提前2天',
    value: '7'
  },
  {
    label: '不提醒',
    value: '9'
  }
]
const repeatType = [
  {
    label: '不重复',
    value: '0'
  },
  {
    label: '按天重复',
    value: '1'
  },
  {
    label: '按周重复',
    value: '2'
  },
  {
    label: '按月重复',
    value: '3'
  },
  {
    label: '按年重复',
    value: '4'
  }
]
const weeks = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
]

export default {
  data() {
    return {
      pickerOptions: {},
      value1: '',
      activeName: 'first',
      radio1: 'month',
      isSelectPersonVisible: false,
      value2: new Date(),
      eventList: [],
      checkedDate: getFormateDate(new Date(), 'yyyy 年 MM 月 dd 日'),
      checkedweek: weeks[new Date().getDay()],
      dialogVisible: false,
      warningType,
      repeatType,
      form: {
        name: 1,
        remind: 2,
        isrepeat: 0
      },
      rules: {
        content: [{ required: true, message: ' ', trigger: 'blur' }],
        enddate: [
          { type: 'date', required: true, message: ' ', trigger: 'change' }
        ],
        isallday: [{ required: true, message: ' ', trigger: 'change' }],
        isrepeat: [{ required: true, message: ' ', trigger: 'change' }],
        participantname: [{ required: true, message: ' ', trigger: 'input' }],
        remind: [{ required: true, message: ' ', trigger: 'change' }],
        remindtime: [{ required: true, message: ' ', trigger: 'change' }],
        startdate: [
          { type: 'date', required: true, message: ' ', trigger: 'change' }
        ],
        title: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      // 新闻管理
      newsmanage: {},
      // 流程学习
      studymanage: []
    }
  },

  created() {
    let _this = this
    window['toPageProcess'] = processid => {
      _this.$router.push({
        path: '/processModelCenter/processIframeCenter',
        query: { id: processid }
      })
    }
  },
  mounted() {
    this.requiredData()
  },
  methods: {
    getFormateDate,
    requiredData() {
      Promise.all([
        getStudyList({
          attr: {},
          orderby: 'createon',
          pageNum: 1,
          pageSize: 5,
          sort: 'desc',
          logic: 'or',
          filters: []
        }),
        getNoticeList({
          attr: {},
          filters: [],
          logic: 'or',
          orderby: 'createon',
          pageNum: 1,
          pageSize: 4,
          sort: 'desc'
        })
      ]).then(res => {
        console.log(res)
        this.newsmanage = res[0].list[0]
        this.studymanage = res[1].list
      })
    },
    handlerDateClick(v) {
      // console.log(v);
      this.checkedDate = getFormateDate(new Date(v), 'yyyy 年 MM 月 dd 日')
      this.checkedweek = weeks[new Date(v).getDay()]
      getEvents(v).then(res => {
        this.eventList = res
      })
    },
    handlerSelectPersonComfirm(list) {
      this.form.participantname = list
        .map(item => {
          return item.cnname
        })
        .toString()
    },
    newSche() {
      this.$refs.formRuleRef.validate(valid => {
        if (valid) {
          newSche(this.form).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '新建日程成功！'
              })
              this.dialogVisible = false
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#home {
  background: url("../../assets/img/qietu1/背景.png") no-repeat;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-size: cover;
}
.el-tabs__item.is-active {
  color: white;
}
.el-tabs__item {
  color: #cccccc;
}
.order {
  // position: relative;
  position: absolute;
  // bottom: -140px;
  left: 20px;
  .order_1 {
    margin: 10px;
  }
}
// .header_b{
//   background: url("../../assets/img/qietu1/top_bg.png") no-repeat;
//     height: 100%;
//   width: 100%;
//   overflow: hidden;
//   background-size: cover;
// }
// .body_b{
//   background: url("../../assets/img/qietu1/body_b.png") no-repeat;
//     height: 100%;
//   width: 100%;
//   overflow: hidden;
//   background-size: cover;
// }
.header_left {
  border-right: 1px solid white;
}
.el-menu {
  height: 40px;
  line-height: 40px;
  background: none;
  margin-left: 10%;
}
.logo_wrap {
  margin-left: 15%;
  img {
    width: 90%;
  }
}

.header_center {
  display: flex;
  justify-content: space-around;
  margin: 15px 0px;
  .map {
    // margin-right: 20px;
    position: relative;
    .location {
      position: absolute;
      top: 5px;
      right: 10px;
    }
  }
}
.logout {
  margin-left: 30px;
}
h1 {
  font-size: 36px;
  font-family: "HYk2gj";
  text-shadow: 5px 2px 6px #002967;
  //  background: linear-gradient(bottom,#0052A6,#FFFFFF,#FFFFFF);

  // background-clip: text;

  // color: transparent;
}

.section1_title {
  margin: 20px 0;
  font-size: 24px;
  color: #ffffffff;
}
.gonggao {
  width: 90%;
  position: absolute;
  top: 20%;
  left: 20px;
  p {
    border-bottom: 1px solid grey;
    margin: 8px;
    padding: 5px;
  }
}
.more {
  position: absolute;
  right: 40px;
  bottom: 20px;
}
.list {
  position: absolute;
  right: 1%;
  height: 60px;
  display: flex;
  top: 80px;
  .list_1 {
    margin-right: 100px;
    width: 100px;
    .list_2 {
      position: absolute;
      top: 10px;
      left: 2%;
    }
    .list_2_1 {
      position: absolute;
      top: 10px;
      left: 28%;
    }
    .list_2_2 {
      position: absolute;
      top: 10px;
      left: 52%;
    }
    .list_2_3 {
      position: absolute;
      top: 10px;
      left: 76%;
    }
  }
}
.listimg {
  position: absolute;
  top: -20px;
}
.daiban {
  margin-top: 40px;
}
.daiban_head {
  display: flex;
  width: 96%;
  justify-content: space-between;
  border-bottom: 1px solid white;
  h1 {
    margin-left: 20px;
  }
}
.daiban_body {
  width: 92%;
  text-align: left;
  margin-left: 20px;
  color: #b8bfcc;
  .el-row {
    border-bottom: 1px solid #41606c;
    // height: 60px;
    padding: 20px 0;
    vertical-align: middle;
  }
}
.rili {
  position: absolute;
  left: 35%;
}
.rili_1 {
  top: 100px;
}
.rili_2 {
  top: 420px;
}
.new1 {
  border-left: 1px solid white;
  text-align: center;
  h1 {
    font-size: 36px;
    font-weight: normal;
  }
  h2 {
    font-size: 24px;
    font-weight: normal;
    border-bottom: 1px solid gray;
    width: 100px;
    margin: 20px auto;
    padding: 5px;
    color: grey;
  }
}
.new {
  width: 20%;
  border-right: 1px solid gray;
  height: 120px;
  padding: 10px;
  h3 {
    font-size: 16px;
    font-weight: normal;
  }
  p {
    line-height: 2;
    margin: 10px 0;
  }
}
.dolist {
  width: 86%;
  margin: 20px auto;
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 80px;
  flex-wrap: wrap;
  .dolist_1 {
    margin: 40px 0px 30px 80px;
    p {
      font-size: 16px;
      margin-top: 10px;
    }
  }
}
.mode {
  .el-menu {
    background: none;
    margin-left: 0;
  }
}
.mode_yewu {
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 0 auto;
}
.mode_1 {
  position: relative;
  top: 40px;
  margin: 16px 0;
  width: 24%;
  img {
    width: 100%;
  }
  .mode_2 {
    position: absolute;
    top: 20px;
    left: 10px;
    h1 {
      text-align: left;
      font-size: 16px;
      color: #fb9153;
      line-height: 2;
      margin-bottom: 20px;
    }
    p {
      text-align: left;
      width: 70%;
    }
  }
  .mode_3 {
    text-align: left;
    width: 90%;
    line-height: 1.8;
    position: absolute;
    bottom: 10px;
    left: 10px;
    .mode_4 {
      width: 100%;
      color: grey;
      display: flex;
      justify-content: space-between;
    }
  }
}
.system {
  width: 49%;
}
.detail {
  width: 20%;
  position: absolute;
  bottom: 10px;
  left: 10px;
  .detail_1 {
    border: 1px solid #4cabce;
    padding: 10px;
    background: #194256;
  }
}
.knowlege {
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 0 auto;
}
.knowlege_1 {
  position: relative;
  top: 40px;
  margin: 16px 0;
  width: 49%;
  .knowlegeImg {
    width: 100%;
  }
  .knowlege_2 {
    position: absolute;
    top: 20px;
    left: 10px;
    width: 92%;
    p {
      text-align: left;
      font-size: 16px;
      width: 100%;
      padding: 10px;
      border-bottom: 1px solid #daecff;
    }
  }
}
.el-tabs .el-tabs--top {
  color: #daecff !important;
}
.canye {
  width: 60%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  .canye_1 {
    text-align: left;
    position: relative;
    top: 40px;
    margin: 40px 0;
    width: 49%;
    img {
      width: 80%;
    }
  }
  .canye_2 {
    position: absolute;
    top: 40%;
    left: 10%;
    width: 60%;
    font-family: "MicrosoftYaHei";
    h3 {
      line-height: 3;
      font-size: 16px;
      font-weight: normal;
    }
    p {
      font-family: "MicrosoftYaHei";
      font-size: 12px;
      letter-spacing: 1px;
      color: #98c5e3;
    }
  }
}
.book {
  display: flex;
  width: 100%;
  justify-content: space-around;
  position: absolute;
  top: 32%;
  .bookimg {
    margin-top: 4%;
  }
  .bookimg_2 {
    transform: rotate(180deg);
    // margin-top: -80px;
    // position: relative;
    img {
      // position: absolute
      margin-top: 40px;
    }
  }
  .book_2 {
    width: 25%;
  }
  .book_1 {
    display: flex;
    padding: 20px;
    background: #153b4e;
    p {
      width: 20px;
      background: #be744f;
      margin-right: 10px;
    }
  }
  .bookname {
    font-size: 12px;
    color: #81b5cf;
    font-family: "MicrosoftYaHei";
  }
}
.baozhi {
  display: flex;
  width: 100%;
  justify-content: space-around;
  position: absolute;
  top: 32%;
  flex-wrap: wrap;
  .baozhi_1 {
    width: 50%;
  }
  p {
    width: 20px;
    background: #be744f;
    padding: 10px;
    font-size: 12px;
    // margin-right: 10px;
  }
  .baozhi_2 {
    display: flex;
    padding: 20px;
    // background: #153b4e;
  }
  .baozhi_4 {
    width: 80%;
  }
  .baozhi_3 {
    margin-top: 20px;
    color: #81b5cf;
  }
}
.wendan {
  display: flex;
  width: 100%;
  position: absolute;
  top: 32%;
  flex-wrap: wrap;
}
.wendang {
  width: 20%;
  margin-bottom: 20px;
}
.read {
  text-align: left;
  .read_1 {
    color: #ffffff;
    line-height: 2.5;
    font-size: 12px;
  }
  .read_2 {
    border: 1px solid #61d3f2;
    color: #61d3f2;
    padding: 0px 3px;
    font-size: 10px;
    border-radius: 10px;
  }
}
.gufen {
  width: 70%;
  margin: 0px auto;
  display: flex;
  justify-content: space-between;
  .gufen_1 {
    position: relative;
    top: 20px;
    margin: 30px 0;
    width: 30%;
    .gufen_2 {
      position: absolute;
      top: 45%;
      right: 0;
      left: 0;
      margin: auto;
      font-size: 20px;
      font-weight: bold;
    }
  }
}
.footer {
  display: flex;
  width: 30%;
  justify-content: space-between;
  flex-wrap: wrap;
  p {
    width: 50%;
    line-height: 2;
  }
}
.footer_right {
  display: flex;
  justify-content: space-around;
  .footer_right_1 {
    img {
      margin-right: 20px;
      display: inline-block;
    }
    p {
      line-height: 3;
    }
  }
}
.footer_bottom {
  width: 50%;
  margin: 0 auto;
  ul {
    display: flex;
    justify-content: space-around;
    margin: 20px auto;
  }
  p {
    line-height: 1.5;
    color: grey;
  }
}
</style>
