<template>
  <div id="bpaAll" class="w100 bpaAll">
    <div style="width:100%">
      <el-row class="bg-margin process-system">
        <!-- 流程制度 -->
        <el-col :span="24" class="bpaAll-lczd">
          <el-row>
            <el-col :span="24" class="bpaAll-title">
              | 流程制度
              <el-tooltip placement="bottom">
                <div slot="content">
                  已发布的制度和流程<br />公式：环比增减率：（系统现在已发布的制度流程-上月系统已发布的制度流程）/上月系统运行的制度流程*100%
                </div>
                <i class="el-icon-question bpaAll-icon" />
              </el-tooltip>
            </el-col>
            <el-col :span="24" class="bpaAll-lczd-bottom">
              <div class="bpaAll-lczd-l">
                <el-row style="width:45%;">
                  <el-col :span="24" class="bpaAll-lczd-word"
                    >已发布制度</el-col
                  >
                  <el-col :span="24" class="bpaAll-lczd-boder" />
                  <div class="bpaAll-lczd-line" />
                  <el-col :span="24" class="bpaAll-lczd-addbg">
                    <div class="addbg-float-l">
                      <div class="add-radius add-float-l" />
                      <div class="add-float-l">本月新增</div>
                    </div>
                    <div
                      :class="
                        getColor(spList.system.newDocumentOfCurrentMonthCount)
                      "
                      class="addbg-float-r"
                    >
                      {{ spList.system.newDocumentOfCurrentMonthCount }}
                    </div>
                  </el-col>
                  <el-col :span="24" class="bpaAll-lczd-addbg add-margin-top">
                    <div class="addbg-float-l">
                      <div class="add-radius add-float-l" />
                      <div class="add-float-l">本月环比增减率</div>
                    </div>
                    <div
                      :class="
                        getColor(
                          spList.system.documentIncreaseDecreasePercentum
                        )
                      "
                      class="addbg-float-r"
                    >
                      {{ spList.system.documentIncreaseDecreasePercentum }}
                    </div>
                  </el-col>
                </el-row>
                <echarts-Qiu :number="spList.system.allDocumentCount" />
              </div>
              <div class="bpaAll-lczd-z">
                <el-row>
                  <el-col :span="24" class="bpaAll-lczd-z-num">{{
                    spList.process.allProcessCount +
                      spList.system.allDocumentCount
                  }}</el-col>
                  <el-col :span="24" class="bpaAll-lczd-z-word"
                    >制度流程总数</el-col
                  >
                </el-row>
              </div>
              <div class="bpaAll-lczd-r">
                <el-row style="width:45%;float:right">
                  <el-col :span="24" class="bpaAll-lczd-word"
                    >已发布流程</el-col
                  >
                  <el-col :span="24" class="bpaAll-lczd-boder" />
                  <div class="bpaAll-lczd-lines" />
                  <el-col :span="24" class="bpaAll-lczd-addbg">
                    <div class="addbg-float-l">
                      <div class="add-radius add-float-l" />
                      <div class="add-float-l">本月新增</div>
                    </div>
                    <div
                      :class="
                        getColor(spList.process.newProcessOfCurrentMonthCount)
                      "
                      class="addbg-float-r"
                    >
                      {{ spList.process.newProcessOfCurrentMonthCount }}
                    </div>
                  </el-col>
                  <el-col :span="24" class="bpaAll-lczd-addbg add-margin-top">
                    <div class="addbg-float-l">
                      <div class="add-radius add-float-l" />
                      <div class="add-float-l">本月环比增减率</div>
                    </div>
                    <div
                      :class="
                        getColor(
                          spList.process.processIncreaseDecreasePercentum
                        )
                      "
                      class="addbg-float-r"
                    >
                      {{ spList.process.processIncreaseDecreasePercentum }}
                    </div>
                  </el-col>
                </el-row>
                <echarts-Qiu-Right :number="spList.process.allProcessCount" />
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" class="bpaAll-zdlcbzh">
          <el-row>
            <el-col :span="24" class="bpaAll-title">
              | 制度流程标准化
              <el-tooltip placement="bottom">
                <div slot="content">
                  制度流程化程度：制度关联至流程占比总计发布制度程度。<br />
                  制度流程化程度计算公式：（已经关联流程的制度数/已发布制度数总数）*100%<br />
                  制度流程化程度环比增减率计算公式：（本月制度流程化程度-上月制度流程化程度）/上月制度化程度*100%<br />
                  流程信息化程度：已发布流程数中信息化流程占比已发布流程数<br />
                  流程信息化程度公式：（已发布流程数中包含信息化系统的流程/已发布的流程数）*100%<br />
                  流程信息化程度环比增减率计算公式：（本月流程信息化程度-上月流程信息化程度）/上月流程信息化程度*100<br />
                  制度流程标准化程度：通用类自由流程占比越高，则企业流程的标准化、规范化越低。通过每月分析，旨在减少通用类自由流程，提升制度流程标准化程度。<br />
                  制度流程标准化程度公式：（固化流程/单据流程总数）*100%。<br />
                  制度流程标准化程度环比增减率:（本月制度流程标准化程度-上月制度流程标准化程度）/上月制度流程标准化程度*100%
                </div>
                <i class="el-icon-question bpaAll-icon" />
              </el-tooltip>
            </el-col>
            <el-col :span="24">
              <div class="bpaAll-zdlcbzh-box">
                <echarts-Bin
                  :id="'Bin'"
                  :color="getColor(processOriented.nowMatchedPercentum)"
                  :number="processOriented.nowMatchedPercentum"
                  class="bpaAll-zdlcbzh-left"
                />
                <div class="bpaAll-zdlcbzh-right">
                  <el-row>
                    <el-col :span="24" class="bpaAll-zdlcbzh-right-word"
                      >制度流程化程度</el-col
                    >
                    <el-col :span="24">
                      <span class="bpaAll-zdlcbzh-right-left">环比增减率:</span>
                      <span
                        :class="getColor(processOriented.NLMatchedPercentum)"
                        class="bpaAll-zdlcbzh-right-right"
                        >{{ processOriented.NLMatchedPercentum }}</span
                      >
                    </el-col>
                  </el-row>
                </div>
              </div>
              <!-- <div class="bpaAll-zdlcbzh-box">
                <echarts-Bin :id="'Bin1'" :color="getColor(processOriented.nowPIPercentum)" :number="processOriented.nowPIPercentum" class="bpaAll-zdlcbzh-left"/>
                <div class="bpaAll-zdlcbzh-right">
                  <el-row>
                    <el-col :span="24" class="bpaAll-zdlcbzh-right-word">流程信息化程度</el-col>
                    <el-col :span="24">
                      <span class="bpaAll-zdlcbzh-right-left">环比增减率:</span>
                      <span :class="getColor(processOriented.increaseDecreasePercentum)" class="bpaAll-zdlcbzh-right-right">{{ processOriented.increaseDecreasePercentum }}</span>
                    </el-col>
                  </el-row>
                </div>
              </div> -->
              <!-- <div class="bpaAll-zdlcbzh-box">
                <echarts-Bin
                  :id="'Bin2'"
                  :color="
                    getColor(
                      processOriented.nowDocumentProcessnewStandardizationPercentum
                    )
                  "
                  :number="
                    processOriented.nowDocumentProcessnewStandardizationPercentum
                  "
                  class="bpaAll-zdlcbzh-left"
                />
                <div class="bpaAll-zdlcbzh-right">
                  <el-row>
                    <el-col :span="24" class="bpaAll-zdlcbzh-right-word"
                      >制度流程标准化程度</el-col
                    >
                    <el-col :span="24">
                      <span class="bpaAll-zdlcbzh-right-left">环比增减率:</span>
                      <span
                        :class="
                          getColor(processOriented.increaseDecreasePercentums)
                        "
                        class="bpaAll-zdlcbzh-right-right"
                        >{{ processOriented.increaseDecreasePercentums }}</span
                      >
                    </el-col>
                  </el-row>
                </div>
              </div> -->
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="bpaAll-zdlcbzh-b" />
    <div style="width:100%" class="bg-more">
      <el-row class="bg-margin">
        <!-- <el-col :span="24" class="bpaAll-zdlcbzhs">
          <el-row>
            <el-col :span="24" class="bpaAll-title" style="margin-bottom: 24px;">
              <el-row>
                <el-col :span="12">
                  | 流程制度总览
                  <el-tooltip placement="bottom">
                    <div slot="content">
                      制度流程化程度：制度关联至流程占比总计发布制度程度。<br>
                      制度流程化程度计算公式：（该制度框架下已发布已经关联流程制度数/该制度框架下已发布已经关联流程制度总数）*100%<br>
                      制度流程化程度环比增减率计算公式：（本月该制度框架下制度流程程度-上月该制度框架下制度流程化程度）/上月该制度框架下制度流程化程度*100%<br>
                      流程信息化程度：流程信息化程度，已发布流程数占比与已发布流程数中信息化流程<br>
                      流程信息化程度公式：（已发布并关联至该制度框架下流程存在信息化系统流程数/已发布并关联至该制度框架下流程总数）*100%<br>
                      流程信息化程度环比增减率计算公式：本月流程信息化程度-上月流程信息化程度）/上月流程信息化程度*100%<br>
                      制度流程标准化程度：通用类自由流程占比越高，则企业流程的标准化、规范化越低。通过每月分析，旨在减少通用类自由流程，提升制度流程标准化程度。<br>
                      制度流程标准化程度公式：（固化流程/单据流程总数）*100%。<br>
                    </div>
                    <i class="el-icon-question bpaAll-icon"/>
                  </el-tooltip>
                </el-col>
                <el-col :span="12">
                  <div class="bpaAll-title-r"><div class="title-right"/>高于平均值</div>
                  <div class="bpaAll-title-r" style="margin-right:12px"><div class="title-left"/>低于平均值</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <div v-for="(item, index) in detailsList" :key="item.id" :class="index % 3 == 2 ? 'bpaAll-zdlcbzhs-boxs' : 'bpaAll-zdlcbzhs-box'">
            <el-row style="padding: 20px;">
              <el-col :span="24" class="bpaAll-zdlcbzhs-title">
                {{ item.foldername }}
              </el-col>
              <el-col :span="24">
                <el-row>
                  <el-col :span="16">
                    <el-row>
                      <el-col :span="24">
                        <echarts-Pan :id="'Pan' + index" :number="item.nowMatchedPercentums"/>
                      </el-col>
                      <el-col :span="24" class="bpaAll-zdlcbzhs-word">
                        制度流程标准化程度
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="8">
                    <el-row>
                      <el-col :span="24" style="margin-top: 24px;">
                        <echarts-Bins :id="'Bin9' + index" :color="getColors(item.lNowMatchedPercentums, 'lc')" :number="item.lNowMatchedPercentums"/>
                        <div class="bpaAll-zdlcbzhs-bin-title">制度流程化程度</div>
                      </el-col>
                      <el-col :span="24">
                        <echarts-Bins :id="'Bin8' + index" :color="getColors(item.nowMatchedPercentum, 'xx')" :number="item.nowMatchedPercentum"/>
                        <div class="bpaAll-zdlcbzhs-bin-title">流程信息化程度</div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="22" :offset="1" class="bpaAll-zdlcbzhs-bottom">
                <el-row>
                  <el-col :span="24">
                    <div class="addbg-float-l">
                      <div class="add-radius add-float-l"/>
                      <div class="add-float-l">制度流程化环比增减率</div>
                    </div>
                    <div :class="getColors(item.lNowAndLastMonthContrastPercentum, 'lc') === 'up' ? 'add-color' : 'red-color'" class="addbg-float-r">{{ item.lNowAndLastMonthContrastPercentum }}</div>
                  </el-col>
                  <el-col :span="24" style="margin-top:5px">
                    <div class="addbg-float-l">
                      <div class="add-radius add-float-l"/>
                      <div class="add-float-l">流程信息化环比增减率</div>
                    </div>
                    <div :class="getColors(item.nowAndLastMonthContrastPercentum, 'xx') === 'up' ? 'add-color' : 'red-color'" class="addbg-float-r">{{ item.nowAndLastMonthContrastPercentum }}</div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-col> -->
        <!-- <el-col :span="24" class="bpaAll-zdlcbzh-zx">
          <el-row>
            <el-col :span="24" class="bpaAll-title">
              | 制度流程化标准程度
              <el-tooltip placement="bottom">
                <div slot="content">
                  制度流程标准化程度,通用类自由流程占比越高，则企业流程的标准化、规范化越低。通过每月分析，旨在减少通用类自由流程，提升制度流程标准化程度。<br>
                  公式：（固化流程/单据流程总数）*100%<br>
                  同比：（本期-同期）/同期*100%<br>
                  同比：（本期-同期）/同期*100%<br>
                </div>
                <i class="el-icon-question bpaAll-icon"/>
              </el-tooltip>
            </el-col>
            <el-col :span="24">
              <el-row>
                <el-col :span="24">
                  <el-select v-model="searchForm.systemId" placeholder="制度总览" clearable style="float: right;" @change="nodeClick()">
                    <el-option
                      v-for="item in treeList"
                      :key="item.id"
                      :label="item.foldername"
                      :value="item.id"/>
                  </el-select>
                </el-col>
                <el-col :span="24">
                  <echarts-Zx :zx-list="zxList" :id="'Zx'"/>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col> -->
        <el-col :span="24" class="bpaAll-zdlcbzh-xx">
          <el-row>
            <el-col :span="24" class="bpaAll-title">
              | 制度流程化程度
              <el-tooltip placement="bottom">
                <div slot="content">
                  各制度框架下制度流程化程度，已经发布的制度已经绘制了相关流程，并进行了关联。<br />
                  公式：（当前制度框架下已发布关联流程制度数/当前制度框架下总已发布制度数）*100%<br />
                  同比：（本期-同期）/同期*100%<br />
                  环比增减率：（本月-上月）/上月*100%<br />
                </div>
                <i class="el-icon-question bpaAll-icon" />
              </el-tooltip>
            </el-col>
            <el-col :span="24">
              <echarts-Z :data-list="detailsList" :id="'Z'" />
            </el-col>
          </el-row>
        </el-col>
        <!-- <el-col :span="24" class="bpaAll-zdlcbzh-xx">
          <el-row>
            <el-col :span="24" class="bpaAll-title">
              | 流程信息化程度
              <el-tooltip placement="bottom">
                <div slot="content">
                  各业务线流程信息化程度，已经发布的流程上存在信息系统支撑。<br />
                  公式：（当前已发布并关联至该制度框架下流程存在信息化系统流程数/当前已发布并关联至该制度框架下流程总数）*100%<br />
                  环比增减率：（本月-上月）/上月*100%<br />
                </div>
                <i class="el-icon-question bpaAll-icon" />
              </el-tooltip>
            </el-col>
            <el-col :span="24">
              <echarts-Z :data-list="detailsList" :id="'XXH'" />
            </el-col>
          </el-row>
        </el-col> -->
        <el-col :span="24" class="bpaAll-zdlcbzh-xx">
          <el-row>
            <el-col :span="24" class="bpaAll-title">
              | 制度落地执行效率
              <el-tooltip placement="bottom">
                <div slot="content">
                  各制度框架已经关联的落地执行流程审批效率<br />
                  公式：总审批时长/业务单据流程总数<br />
                  环比增减率：（本月-上月）/上月*100%<br />
                </div>
                <i class="el-icon-question bpaAll-icon" />
              </el-tooltip>
            </el-col>
            <el-col :span="24">
              <echarts-Zs :data-list="efficiencyList" :id="'ZXXL'" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" class="bpaAll-zdlcbzh-xx" ref="scrollOne">
          <el-row>
            <el-col :span="24" class="bpaAll-title">
              | 流程覆盖岗位程度
              <el-tooltip placement="bottom">
                <div slot="content">
                  各业制度框架下覆盖岗位程度，绘制业务流程中所选的岗位数量<br />
                  公式：（当前制度框架下关联流程所用岗位个数/总岗位）*100%/业务单据流程总数<br />
                  环比增减率：（本月-上月）/上月*100%<br />
                </div>
                <i class="el-icon-question bpaAll-icon" />
              </el-tooltip>
            </el-col>
            <el-col :span="24">
              <echarts-Z :data-list="jobCoverage" :id="'GWFG'" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" class="bpaAll-zdlcbzh-bottom">
          <!-- 岗位 -->
          <div class="bottom-bg margin-l">
            <div class="bottom-box">
              <el-row>
                <el-col :span="24" class="bpaAll-title">
                  | 岗位
                  <el-tooltip placement="bottom">
                    <div slot="content">
                      当月农牧板块总岗位，匹配到流程岗位，未匹配到流程岗位，共计匹配到节点个数<br />
                      环比增减率：（本月-上月）/上月*100%<br />
                    </div>
                    <i class="el-icon-question bpaAll-icon" />
                  </el-tooltip>
                </el-col>
                <el-col :span="24" class="bottom-qiu-bg">
                  <echarts-Qiub
                    :id="'Qiub1'"
                    :number="postInfo.postCount"
                    class="bottom-qiu-l"
                  />
                  <div class="bottom-qiu-l">
                    <div class="qiu-l-x" />
                    <el-row>
                      <el-col :span="22" :offset="1" class="qiu-l-word"
                        >实际岗位(个)</el-col
                      >
                      <el-col :span="22" :offset="1">
                        <div class="out-rect">
                          <div class="in-rect">
                            <el-row class="in-rect-word">
                              <el-col :span="24">
                                匹配到流程：<span class="rect-word-num">{{
                                  postInfo.postToProcessMatchedCount
                                }}</span>
                                （ 环比<span class="rect-word-add">{{
                                  postInfo.postToProcessMatchedPercentum
                                }}</span>
                                ）
                              </el-col>
                              <el-col :span="24">
                                <el-progress
                                  :text-inside="true"
                                  :color="'#4387c5'"
                                  :stroke-width="20"
                                  :percentage="postInfo.proportion"
                                />
                              </el-col>
                              <el-col :span="24">
                                未匹配到流程：<span class="rect-word-num">{{
                                  postInfo.postToProcessNotMatchCount
                                }}</span>
                                （ 环比<span class="rect-word-add">{{
                                  postInfo.postToProcessNotMatchPercentum
                                }}</span>
                                ）
                              </el-col>
                              <el-col :span="24">
                                <el-progress
                                  :text-inside="true"
                                  :color="'#4387c5'"
                                  :stroke-width="20"
                                  :percentage="postInfo.proportion1"
                                />
                              </el-col>
                              <el-col :span="24">
                                匹配流程节点数：<span class="rect-word-num">{{
                                  postInfo.postMatchedProcessNodeCount
                                }}</span>
                                （ 环比<span class="rect-word-add">{{
                                  postInfo.postMatchedProcessNodePercentum
                                }}</span>
                                ）
                              </el-col>
                              <el-col :span="24">
                                <el-progress
                                  :text-inside="true"
                                  :color="'#4387c5'"
                                  :stroke-width="20"
                                  :percentage="postInfo.proportion2"
                                />
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- 制度 -->
          <div class="bottom-bg">
            <div class="bottom-box">
              <el-row>
                <el-col :span="24" class="bpaAll-title">
                  | 制度
                  <el-tooltip placement="bottom">
                    <div slot="content">
                      当月运行发布的制度，关联流程制度数量，未关联流程制度数量，失效制度数量<br />
                      环比增减率：（本月-上月）/上月*100%<br />
                    </div>
                    <i class="el-icon-question bpaAll-icon" />
                  </el-tooltip>
                </el-col>
                <el-col :span="24" class="bottom-qiu-bg">
                  <echarts-Qiub
                    :id="'Qiub2'"
                    :number="systemInfo.nowDocumentCount"
                    class="bottom-qiu-l"
                  />
                  <div class="bottom-qiu-l">
                    <div class="qiu-l-x" />
                    <el-row>
                      <el-col :span="22" :offset="1" class="qiu-l-word"
                        >已发布制度(支)</el-col
                      >
                      <el-col :span="22" :offset="1">
                        <div class="out-rect">
                          <div class="in-rect">
                            <el-row class="in-rect-word">
                              <el-col :span="24">
                                匹配到流程：<span class="rect-word-num">{{
                                  systemInfo.nowMatchedCount
                                }}</span>
                                （ 环比<span class="rect-word-add">{{
                                  systemInfo.NLMatchedPercentum
                                }}</span>
                                ）
                              </el-col>
                              <el-col :span="24">
                                <el-progress
                                  :text-inside="true"
                                  :color="'#4387c5'"
                                  :stroke-width="20"
                                  :percentage="systemInfo.proportion"
                                />
                              </el-col>
                              <el-col :span="24">
                                未匹配到流程：<span class="rect-word-num">{{
                                  systemInfo.nowNotMatchCount
                                }}</span>
                                （ 环比<span class="rect-word-add">{{
                                  systemInfo.NLNotMatchPercentum
                                }}</span>
                                ）
                              </el-col>
                              <el-col :span="24">
                                <el-progress
                                  :text-inside="true"
                                  :color="'#4387c5'"
                                  :stroke-width="20"
                                  :percentage="systemInfo.proportion1"
                                />
                              </el-col>
                              <el-col :span="24">
                                失效制度：<span class="rect-word-num">{{
                                  systemInfo.delDocument
                                }}</span>
                                （ 环比<span class="rect-word-add">{{
                                  systemInfo.delDocumentPercentum
                                }}</span>
                                ）
                              </el-col>
                              <el-col :span="24">
                                <el-progress
                                  :text-inside="true"
                                  :color="'#4387c5'"
                                  :stroke-width="20"
                                  :percentage="systemInfo.proportion2"
                                />
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import $ from 'jquery'
import 'echarts-liquidfill'
import echartsQiu from './components/echartsQiu.vue'
import echartsBin from './components/echartsBin.vue'
import echartsBins from './components/echartsBins.vue'
import echartsPan from './components/echartsPan.vue'
import echartsZx from './components/echartsZx.vue'
import echartsZs from './components/echartsZs.vue'
import echartsZ from './components/echartsZ.vue'
import echartsQiuRight from './components/echartsQiuRight.vue'
import echartsQiub from './components/echartsQiub.vue'
import { getRuleIframeTree } from '@/bpa/api/rulesCenter/handbookFiles'
import { formatDate, getMonthDays } from '@/bpa/utils/common.js' // 接口请求部分
import {
  queryRegulationProcessInformation,
  queryRegulationCount,
  queryPostToProcessMatchedCondition,
  queryDocumentOfProcessCondition,
  queryDocumentProcessizeDegree,
  queryProcessInformatizationDegree,
  queryRegulationDocumentInformation,
  queryProcessExecutionEfficiency,
  queryProcessCoverPostCondition,
  queryDocumentProcessizeDegreeLineChart
} from '@/bpa/api/analyseWatchCenter'

export default {
  //  name:"All",
  components: {
    echartsQiu,
    echartsQiuRight,
    echartsQiub,
    echartsBin,
    echartsBins,
    echartsZx,
    echartsZs,
    echartsZ,
    echartsPan
  },
  data() {
    return {
      qiuState: false,
      spList: {
        system: {
          allDocumentCount: 0
        },
        process: {
          allProcessCount: 0
        }
      },
      searchForm: {
        // systemId: process.env.NODE_ENV !== 'production' ? '10603' : '10561',
        systemId: '5',
        name: ''
      },
      treeList: [],
      zxList: {},
      detailsList: [],
      efficiencyList: [], // 落地执行效率
      jobCoverage: [], // 岗位覆盖
      processOriented: {
        nowMatchedPercentum: '0',
        NLMatchedPercentum: '0',
        nowPIPercentum: '0',
        increaseDecreasePercentum: '0',
        increaseDecreasePercentums: '0',
        nowDocumentProcessnewStandardizationPercentum: '0'
      },
      postInfo: {
        postCount: 0,
        postMatchedProcessNodeCount: 0,
        postMatchedProcessNodePercentum: '0.0%',
        postToProcessMatchedCount: 0,
        postToProcessMatchedPercentum: '0.0%',
        postToProcessNotMatchCount: 0,
        postToProcessNotMatchPercentum: '0.0%'
      }, // 岗位信息
      systemInfo: {
        NLMatchedPercentum: '',
        NLNotMatchPercentum: '',
        delDocument: 0,
        delDocumentPercentum: '',
        nowDocumentCount: 0,
        nowMatchedCount: 0,
        nowNotMatchCount: 0
      } // 制度信息
    }
  },
  computed: {
    pId() {
      // return process.env.NODE_ENV !== 'production' ? '10603' : '10561'
      return '5'
    }
  },
  destroyed() {
    // document.removeEventListener('scroll', this.handleScroll)
  },
  mounted() {
    this.queryRegulationProcessInformation() // 制度流程总数
    this.queryRegulationCount() // 制度流程标准化
    this.queryPostToProcessMatchedCondition() // 查询岗位到流程匹配情况接口
    this.queryDocumentOfProcessCondition() // 制度标准化
    this.queryProcessInformatizationDegree()
    this.queryProcessExecutionEfficiency() // 落地执行效率
    this.queryProcessCoverPostCondition() // 岗位覆盖程度
    this.queryDocumentProcessizeDegreeLineChart() // 制度流程标准化程度
    this.getFilterTreeList()
    // window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      // 获取滚动时的高度
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
        console.log(scrollTop)
      // if (scrollTop > 5100) {
      if (scrollTop > 308) {
        //这是滑动到scrollTwo的距离要做的操作
        this.qiuState = true
      } else {
        this.qiuState = false
      }
    },
    // 获取进度条
    getPercentage(a, b) {
      return parseFloat((parseFloat(a / b) * 100).toFixed(2))
    },
    // 树点击节点事件
    nodeClick() {
      this.queryDocumentProcessizeDegreeLineChart()
    },
    // 获取全部的制度框架
    getFilterTreeList() {
      getRuleIframeTree(this.pId).then(res => {
        this.treeList = res
        this.treeList.splice(0, 0, { id: this.pId, foldername: '制度总览' })
      })
    },
    // 判断增减
    getColor(val) {
      if (val !== undefined) {
        var newV = val + ''
        if (newV.indexOf('-') === -1) {
          return 'add-color'
        } else {
          return 'red-color'
        }
      }
    },
    // 判断增减
    getColors(val, type) {
      if (val !== undefined) {
        var reg = new RegExp('%', 'g')
        var number = parseFloat(val.replace(reg, ''))
        if (type === 'lc') {
          if (
            number >
            parseFloat(
              this.processOriented.nowMatchedPercentum.replace(reg, '')
            )
          ) {
            return 'up'
          } else {
            return 'down'
          }
        }
        if (type === 'xx') {
          if (
            number >
            parseFloat(this.processOriented.nowPIPercentum.replace(reg, ''))
          ) {
            return 'up'
          } else {
            return 'down'
          }
        }
      }
    },
    // 获取制度流程总数
    queryRegulationProcessInformation() {
      queryRegulationProcessInformation({
        attr: { folderid: this.pId },
        pageSize: '99999'
      }).then(res => {
        if (!res) return false
        this.spList.system = res[0].documentMap
        this.spList.process = res[1].processMap
      })
    },
    // 制度流程标准化
    queryRegulationCount() {
      queryRegulationCount({
        attr: { folderid: this.pId },
        pageSize: '99999'
      }).then(res => {})
    },
    // 查询岗位到流程匹配情况接口
    queryPostToProcessMatchedCondition() {
      queryPostToProcessMatchedCondition({ attr: { postId: '51' } }).then(
        res => {
          if (res.length > 0) {
            this.postInfo = res[0]
            this.$set(this.postInfo, 'postCount', res[0].postCount)
            this.$set(
              this.postInfo,
              'proportion',
              this.getPercentage(
                res[0].postToProcessMatchedCount,
                res[0].postCount
              )
            )
            this.$set(
              this.postInfo,
              'proportion1',
              this.getPercentage(
                res[0].postToProcessNotMatchCount,
                res[0].postCount
              )
            )
            this.$set(
              this.postInfo,
              'proportion2',
              this.getPercentage(
                res[0].postMatchedProcessNodeCount,
                res[0].postCount
              )
            )
          }
        }
      )
    },
    // 制度流程标准化
    queryDocumentOfProcessCondition() {
      queryDocumentOfProcessCondition({
        attr: { folderid: this.pId },
        pageSize: '99999'
      }).then(res => {
        if (!res) return false
        if (res.length > 0) {
          this.systemInfo = res[0]
          this.$set(
            this.systemInfo,
            'nowDocumentCount',
            res[0].nowDocumentCount
          )
          this.$set(
            this.systemInfo,
            'proportion',
            this.getPercentage(res[0].nowMatchedCount, res[0].nowDocumentCount)
          )
          this.$set(
            this.systemInfo,
            'proportion1',
            this.getPercentage(res[0].nowNotMatchCount, res[0].nowDocumentCount)
          )
          this.$set(
            this.systemInfo,
            'proportion2',
            this.getPercentage(res[0].delDocument, res[0].nowDocumentCount)
          )
          this.$set(
            this.processOriented,
            'nowMatchedPercentum',
            res[1].nowMatchedPercentum
          )
          this.$set(
            this.processOriented,
            'NLMatchedPercentum',
            res[1].NLMatchedPercentum
          )
        }
      })
    },
    // 标准化
    queryDocumentProcessizeDegree() {
      queryDocumentProcessizeDegree({ attr: { folderid: this.pId } }).then(
        res => {
          if (!res) return false
          this.$set(
            this.processOriented,
            'increaseDecreasePercentums',
            res.increaseDecreasePercentum
          )
          this.$set(
            this.processOriented,
            'nowDocumentProcessnewStandardizationPercentum',
            res.nowDocumentProcessnewStandardizationPercentum
          )
          res.resultList.map(item => {
            this.detailsList.map((items, index) => {
              if (item.id === items.id) {
                this.$set(
                  this.detailsList[index],
                  'nowMatchedPercentums',
                  item.nowMatchedPercentum
                )
              }
            })
          })
        }
      )
    },
    // 流程信息化接口
    queryProcessInformatizationDegree() {
      queryProcessInformatizationDegree({ attr: { folderid: this.pId } }).then(
        res => {
          if (!res) return false
          this.$set(
            this.processOriented,
            'increaseDecreasePercentum',
            res.increaseDecreasePercentum
          )
          this.$set(this.processOriented, 'nowPIPercentum', res.nowPIPercentum)
          // 详情数据遍历
          res.resultList.map((item, index) => {
            this.detailsList.push({
              foldername: item.foldername,
              id: item.id,
              nowMatchedPercentum: item.nowMatchedPercentum,
              nowAndLastMonthContrastPercentum:
                item.nowAndLastMonthContrastPercentum,
              lastMonthMatchedPercentum: item.lastMonthMatchedPercentum
            })
          })
          this.queryDocumentProcessizeDegree()
          this.queryRegulationDocumentInformation() // 流程化
        }
      )
    },
    // 落地执行效率
    queryProcessExecutionEfficiency() {
      queryProcessExecutionEfficiency({ attr: { folderid: this.pId } }).then(
        res => {
          if (!res) return false
          res.map(item => {
            this.efficiencyList.push({
              foldername: item.foldername,
              id: item.id,
              nowMatchedPercentum: item.nowMatchedPercentum,
              nowAndLastMonthContrastPercentum:
                item.nowAndLastMonthContrastPercentum,
              lastMonthMatchedPercentum: item.lastMonthMatchedPercentum
            })
          })
        }
      )
    },
    // 覆盖岗位程度
    queryProcessCoverPostCondition() {
      queryProcessCoverPostCondition({
        attr: { folderid: this.pId },
        postId: '51'
      }).then(res => {
        if (!res) return false
        res.map(item => {
          this.jobCoverage.push({
            foldername: item.foldername,
            id: item.id,
            nowMatchedPercentum: item.nowMatchedPercentum,
            nowAndLastMonthContrastPercentum:
              item.nowAndLastMonthContrastPercentum,
            lastMonthMatchedPercentum: item.lastMonthMatchedPercentum
          })
        })
      })
    },
    // 流程化
    queryRegulationDocumentInformation() {
      queryRegulationDocumentInformation({ attr: { folderid: this.pId } }).then(
        res => {
          if (!res) return false
          res.map(item => {
            this.detailsList.map((items, index) => {
              if (item.id === items.id) {
                this.$set(
                  this.detailsList[index],
                  'lNowMatchedPercentums',
                  item.nowMatchedPercentum
                )
                this.$set(
                  this.detailsList[index],
                  'lLastMonthMatchedPercentum',
                  item.lastMonthMatchedPercentum
                )
                this.$set(
                  this.detailsList[index],
                  'lNowAndLastMonthContrastPercentum',
                  item.nowAndLastMonthContrastPercentum
                )
              }
            })
          })
        }
      )
    },
    // 制度流程标准化程度
    queryDocumentProcessizeDegreeLineChart() {
      queryDocumentProcessizeDegreeLineChart({
        attr: { folderid: this.searchForm.systemId, type: 'ZDLCHBZCD' }
      }).then(res => {
        if (!res) return false
        this.$set(this.zxList, 'percentumDto', res)
      })
    }
  }
}
</script>

<style scoped lang="scss">
#bpaAll {
  // background: url(../../../assets/img/qietu/bgIndexs.jpg) no-repeat;
  // background-size: 100% 100%;
  /deep/ .el-select .el-input__inner {
    color: #426193;
    border-radius: 0;
    background-color: #082c62;
    border-color: #009499;
  }
  min-height: 1600px;
  .bg-margin {
    width: 86%;
    margin: auto;
  }
  .process-system {
    margin-top: 25px;
    background: url("~@/bpa/assets/img/process-system-bg.jpg") center center no-repeat;
    background-size: 100% 100%;
  }
  @media screen and (max-width: 1400px) {
    .bg-margin {
      width: 96%;
      margin: auto;
    }
  }
  .add-color {
    color: #00cf8a;
  }
  .red-color {
    color: #f93598;
  }
  .bg-more {
    // background: url(../../../assets/img/qietu/bgIndexs.jpg) no-repeat;
    // background-size: 100% 100%;
  }
  .bpaAll-title {
    font-weight: bold;
    color: #09eef5;
    font-size: 16px;
    padding: 0px 24px;
    .bpaAll-title-r {
      float: right;
      font-size: 14px;
      font-weight: 300;
      color: #ffffff;
      line-height: 25px;
      .title-left {
        float: left;
        width: 17px;
        height: 12px;
        background: #f93598;
        margin-top: 6px;
        margin-right: 8px;
      }
      .title-right {
        float: left;
        width: 17px;
        height: 12px;
        background: #0dde87;
        margin-top: 6px;
        margin-right: 8px;
      }
    }
  }
  .bpaAll-icon {
    width: 16px;
    height: 16px;
    color: #23aaae;
  }
  .add-float-l {
    float: left;
  }
  .bpaAll-lczd {
    margin-top: 32px;
    .bpaAll-lczd-bottom {
      .bpaAll-lczd-l {
        width: 38%;
        float: left;
        height: 432px;
        position: relative;
      }
      @media screen and (max-width: 1400px) {
        .bpaAll-lczd-l {
          height: 284px;
        }
      }
      .bpaAll-lczd-z {
        width: 24%;
        float: left;
        .bpaAll-lczd-z-num {
          margin-top: 80%;
          font-size: 80px;
          font-family: Arial;
          font-weight: bold;
          color: #09eef5;
          line-height: 108px;
          background: linear-gradient(0deg, #2cf4d1 0%, #22d0e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }
        @media screen and (max-width: 1540px) {
          .bpaAll-lczd-z-num {
            margin-top: 72%;
            font-size: 74px;
            line-height: 98px;
          }
        }
        @media screen and (max-width: 1400px) {
          .bpaAll-lczd-z-num {
            margin-top: 170px;
            font-size: 64px;
            line-height: 98px;
          }
        }
        .bpaAll-lczd-z-word {
          font-size: 26px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #ffffff;
          line-height: 29px;
          text-align: center;
        }
      }
      .bpaAll-lczd-r {
        width: 38%;
        float: left;
        height: 432px;
        position: relative;
      }
      @media screen and (max-width: 1400px) {
        .bpaAll-lczd-r {
          height: 284px;
        }
      }
      .bpaAll-lczd-word {
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        background: linear-gradient(
          90deg,
          rgba(9, 238, 245, 0.17) 23%,
          rgba(9, 238, 245, 0.4) 48%,
          rgba(9, 238, 245, 0.18) 75%
        );
        line-height: 30px;
        text-align: center;
        margin-top: 194px;
      }
      @media screen and (max-width: 1540px) {
        .bpaAll-lczd-word {
          margin-top: 96px;
        }
      }
      @media screen and (max-width: 1400px) {
        .bpaAll-lczd-word {
          margin-top: 56px;
        }
      }
      .bpaAll-lczd-addbg {
        background: url(../../../assets/img/qietu/byxz.png) no-repeat;
        background-size: 100% 100%;
        padding: 14px 0px;
        font-weight: 300;
        font-size: 12px;
        color: #fff;
      }
      .add-margin-top {
        margin-top: 12px;
      }
      .addbg-float-l {
        float: left;
        margin-left: 13px;
        .add-radius {
          width: 5px;
          height: 5px;
          background: #09eef5;
          border-radius: 50%;
          margin-top: 5px;
          margin-right: 6px;
        }
      }
      .addbg-float-r {
        float: right;
        font-size: 14px;
        font-weight: bold;
        margin-right: 16px;
      }
      .bpaAll-lczd-boder {
        border-top: 1px solid #00deff;
        margin: 12px 0px;
      }
      .bpaAll-lczd-line {
        width: 24%;
        float: left;
        border-top: 1px solid #00deff;
        transform: rotate(21deg);
        -webkit-transform: rotate(21deg);
        -moz-transform: rotate(21deg);
        margin-left: 99%;
        margin-top: -0.5%;
      }
      @media screen and (max-width: 1540px) {
        .bpaAll-lczd-line {
          margin-top: -1.5%;
        }
      }
      @media screen and (min-width: 1930px) {
        .bpaAll-lczd-line {
          margin-top: -0.8%;
        }
      }
      @media screen and (max-width: 1400px) {
        .bpaAll-lczd-line {
          width: 17%;
          float: left;
          border-top: 1px solid #00deff;
          transform: rotate(21deg);
          -webkit-transform: rotate(21deg);
          -moz-transform: rotate(21deg);
          margin-left: 99%;
          margin-top: -2.9%;
        }
      }
      .bpaAll-lczd-lines {
        width: 27.5%;
        border-top: 1px solid #00deff;
        transform: rotate(338deg);
        -webkit-transform: rotate(338deg);
        -moz-transform: rotate(338deg);
        position: absolute;
        top: 71.5%;
        left: -26.5%;
      }
      @media screen and (max-width: 1540px) {
        .bpaAll-lczd-lines {
          width: 28%;
          position: absolute;
          top: 59.5%;
          left: -26.5%;
        }
      }
      @media screen and (min-width: 1930px) {
        .bpaAll-lczd-lines {
          position: absolute;
          top: 71%;
          left: -26%;
        }
      }
      @media screen and (max-width: 1400px) {
        .bpaAll-lczd-lines {
          transform: rotate(325deg);
          -webkit-transform: rotate(325deg);
          -moz-transform: rotate(325deg);
          width: 28%;
          position: absolute;
          top: 55%;
          left: -25%;
        }
      }
    }
  }
  .bpaAll-zdlcbzh {
    height: 198px;
    margin-top: 92px;
    background: linear-gradient(
      0deg,
      rgba(23, 164, 255, 0.1),
      rgba(0, 41, 84, 0.1)
    );
    .bpaAll-zdlcbzh-box {
      width: 33%;
      float: left;
      position: relative;
      .bpaAll-zdlcbzh-left {
        margin-top: 13%;
        margin-left: 5%;
      }
      .bpaAll-zdlcbzh-right {
        background: url(../../../assets/img/qietu/right-bg.png) no-repeat center
          bottom;
        height: 75px;
        width: 248px;
        position: absolute;
        top: 30%;
        left: 20.5%;
        .bpaAll-zdlcbzh-right-word {
          color: #09eef5;
          font-size: 16px;
          padding: 9px 32px;
        }
        .bpaAll-zdlcbzh-right-left {
          font-size: 14px;
          color: #ffffff;
          float: left;
          padding: 0px 32px;
        }
        .bpaAll-zdlcbzh-right-right {
          font-size: 14px;
          float: left;
        }
      }
      @media screen and (max-width: 1540px) {
        .bpaAll-zdlcbzh-right {
          position: absolute;
          top: 26%;
          left: 24.5%;
        }
      }
      @media screen and (max-width: 1400px) {
        .bpaAll-zdlcbzh-right {
          position: absolute;
          top: 26%;
          left: 24%;
        }
      }
    }
  }
  @media screen and (max-width: 1540px) {
    .bpaAll-zdlcbzh {
      margin-top: -52px;
    }
  }
  @media screen and (max-width: 1400px) {
    .bpaAll-zdlcbzh {
      margin-top: 58px;
    }
  }
  .bpaAll-zdlcbzh-b {
    background: linear-gradient(
      90deg,
      rgba(1, 36, 77, 0.67),
      rgba(23, 164, 255, 0.67),
      rgba(0, 41, 84, 0.67)
    );
    height: 4px;
    width: 82.75%;
    margin: 0 8.625%;
    float: left;
  }
  @media screen and (max-width: 1400px) {
    .bpaAll-zdlcbzh-b {
      width: 93.75%;
      margin: 0 3.125%;
    }
  }
  .bpaAll-zdlcbzhs {
    background: url(../../../assets/img/qietu/zdlcbzh.png) no-repeat center
      bottom;
    background-size: 100% 100%;
    // min-height: 2330px;
    min-height: 1000px;
    margin-top: 48px;
    padding: 30px 24px 24px 36px;
    .bpaAll-zdlcbzhs-box {
      width: 32%;
      margin-right: 1.5%;
      float: left;
      height: 423px;
      background: linear-gradient(145deg, transparent 14px, #022661 0);
      opacity: 1;
      margin-bottom: 24px;
    }
    .bpaAll-zdlcbzhs-boxs {
      width: 32%;
      float: left;
      height: 423px;
      background: linear-gradient(145deg, transparent 14px, #022661 0);
      opacity: 1;
      margin-bottom: 24px;
    }
    .bpaAll-zdlcbzhs-title {
      background: linear-gradient(
        90deg,
        rgba(9, 238, 245, 0.4) 0%,
        rgba(9, 238, 245, 0.09) 75%
      );
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
      padding: 9px 17px;
    }
    .bpaAll-zdlcbzhs-word {
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      color: #ffffff;
      margin-bottom: 18px;
    }
    .bpaAll-zdlcbzhs-bottom {
      background: url(../../../assets/img/qietu/byxz.png) no-repeat center
        bottom;
      padding: 14px 0px;
      background-size: 100% 100%;
      // height: 62px;
      .addbg-float-l {
        float: left;
        margin-left: 32px;
        color: #ffffff;
        .add-radius {
          width: 5px;
          height: 5px;
          background: #09eef5;
          border-radius: 50%;
          margin-top: 5px;
          margin-right: 6px;
        }
      }
      .addbg-float-r {
        float: right;
        font-size: 14px;
        font-weight: bold;
        margin-right: 24px;
      }
    }
    .bpaAll-zdlcbzhs-bin-title {
      text-align: center;
      color: #9fceff;
      font-weight: 400;
      font-size: 14px;
    }
  }
  .bpaAll-zdlcbzh-zx {
    background: url(../../../assets/img/qietu/zdlcbzh-cd.png) no-repeat center
      bottom;
    background-size: 100% 100%;
    height: 539px;
    margin-top: 24px;
    padding: 30px 24px 24px 36px;
  }
  .bpaAll-zdlcbzh-xx {
    background: url(../../../assets/img/qietu/zdlc-cd.png) no-repeat center
      bottom;
    background-size: 100% 100%;
    height: 408px;
    margin-top: 24px;
    padding: 30px 24px 24px 36px;
  }
  .bpaAll-zdlcbzh-bottom {
    height: 331px;
    margin-top: 24px;
    margin-bottom: 24px;
    .bottom-bg {
      background: url(../../../assets/img/qietu/gangwei.png) no-repeat center
        bottom;
      background-size: 100% 100%;
      height: 100%;
      width: 48.5%;
      float: left;
    }
    .margin-l {
      margin-right: 3%;
    }
    .bottom-box {
      width: 94%;
      height: 94%;
      margin: 3%;
    }
    .bottom-qiu-bg {
      margin-top: 12px;
      position: relative;
      .bottom-qiu-l {
        width: 50%;
        float: left;
        .qiu-l-x {
          position: absolute;
          top: 32.5%;
          left: 28%;
          width: 26%;
          border-top: 2px solid #079cdb;
          transform: rotate(-30deg);
        }
        @media screen and (min-width: 1930px) {
          .qiu-l-x {
            position: absolute;
            top: 28.5%;
            left: 31%;
            width: 23%;
          }
        }
        @media screen and (max-width: 1540px) {
          .qiu-l-x {
            position: absolute;
            top: 25%;
            left: 34.5%;
            width: 19.5%;
          }
        }
        @media screen and (max-width: 1400px) {
          .qiu-l-x {
            position: absolute;
            top: 24.5%;
            left: 34.5%;
            width: 19%;
          }
        }
        .qiu-l-word {
          color: #fff;
          font-size: 16px;
        }
        .out-rect {
          border-top: 1px solid #079cdb;
          margin-top: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 200px;
          padding: 1px;
          background: linear-gradient(-45deg, transparent 8.4px, #079cdb 0) top
            right;
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .in-rect {
          width: 100%;
          height: 100%;
          background: linear-gradient(-45deg, transparent 8px, #0a2a5f 0) top
            right;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          .in-rect-word {
            color: #ffffff;
            font-size: 12px;
            line-height: 36px;
            padding: 12px;
            .rect-word-num {
              color: #77eff5;
              font-size: 14px;
            }
            .rect-word-add {
              color: #5ec0ac;
              font-size: 14px;
            }
            .rect-word-down {
              color: #e73197;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
<style>
#bpaAll .el-progress-bar .el-progress-bar__outer {
  background-color: #054f8c !important;
}
</style>
