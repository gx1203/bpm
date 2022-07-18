<template>
  <div class="w100">
    <el-dialog
      class="processCard"
      width="80%"
      :visible.sync="isDialogsVisible"
      :before-close="closeModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template slot="title">
        <p class="slotTitle">
          <el-button
            class="no-border"
            size="large"
            type="text"
            @click="paintChart"
            v-show="editableTabsValue == 0"
          >绘图</el-button>
          <el-button
            class="no-border"
            size="large"
            type="text"
            v-show="editableTabsValue == 0"
            @click="saveProcessCard('save')"
          >保存</el-button>
          <el-button
            class="no-border"
            size="large"
            type="text"
            v-show="editableTabsValue == 0"
            @click="resetCard"
          >重置</el-button>
        </p>
      </template>
      <el-tabs v-model="editableTabsValue" type="border-card" @tab-click="tabsClick">
        <!-- 流程基本属性 -->
        <el-tab-pane name="0" :label="existTab('0')" v-if="existTab('0','refer')">
          <div>
            <!-- <el-form
              label-width="110px"
              label-position="right"
              ref="attrsFormRef"
              :model="attrsForm"
              :rules="attrsRules"
            >-->
            <el-form
              label-width="110px"
              label-position="right"
              ref="attrsFormRef"
              :model="attrsForm"
            >
              <!---------------------------------------------- 基本信息---------------------->
              <h5
                class="subTitle"
                v-if="existTabField('baseInfo', 'refer')"
              >{{existTabField('baseInfo')}}</h5>
              <el-row :gutter="10">
                <!-- 拟制人 -->
                <el-col :span="12" v-if="existTabField('c_fictitiousPerson', 'refer')">
                  <el-form-item
                    :label="existTabField('c_fictitiousPerson')"
                    prop="singer"
                    :rules="[
                    { required: existTabField('c_fictitiousPerson', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.singer" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 版本 -->
                <el-col :span="12" v-if="existTabField('c_versions', 'refer')">
                  <el-form-item
                    :label="existTabField('c_versions')"
                    prop="versions"
                    :rules="[
                    { required: existTabField('c_versions', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.versions" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 层级 -->
                <el-col :span="12" v-if="existTabField('c_processLevel', 'refer')">
                  <el-form-item
                    :label="existTabField('c_processLevel')"
                    prop="level"
                    :rules="[
                    { required: existTabField('c_processLevel', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.level" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 流程框架编码 -->
                <el-col :span="12" v-if="existTabField('c_processCoding', 'refer')">
                  <el-form-item
                    :label="existTabField('c_processCoding')"
                    prop="code"
                    :rules="[
                    { required: existTabField('c_processCoding', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.code" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 生效日期 -->
                <el-col :span="12" v-if="existTabField('c_effectiveDate', 'refer')">
                  <el-form-item
                    :label="existTabField('c_effectiveDate')"
                    prop="effectTime"
                    :rules="[
                    { required: existTabField('c_effectiveDate', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-date-picker
                      type="date"
                      :picker-options="pickerOptions"
                      v-model="attrsForm.effectTime"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      @change="changeEffectTime"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <!-- 下次修改时间 -->
                <el-col :span="12" v-if="existTabField('nextRevisionTime', 'refer')">
                  <el-form-item
                    :label="existTabField('nextRevisionTime')"
                    prop="nextTime"
                    :rules="[
                    { required: existTabField('nextRevisionTime', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-date-picker
                      type="date"
                      :picker-options="pickerOptions"
                      v-model="attrsForm.nextTime"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <!-- 术语 -->
                <el-col :span="24" v-if="existTabField('c_terminology', 'refer')">
                  <el-form-item
                    :label="existTabField('c_terminology')"
                    class="label-height-auto"
                    prop="termlist"
                    :rules="[
                      { required: existTabField('c_terminology', 'necessary'), message: ' ', trigger: 'blur' }
                    ]"
                  >
                    <el-row
                      v-for="(obj, index) in attrsForm.termlist"
                      :key="index"
                      :class="{'margin-t5': index > 0}"
                    >
                      <el-col :span="6">
                        <el-dropdown
                          class="w100"
                          trigger="click"
                          placement="bottom-start"
                          @command="handleCommand"
                          @visible-change="reuqireDownData"
                          :split-button="true"
                          :hide-on-click="true"
                        >
                          <span class="el-dropdown-link">
                            <el-input v-model.lazy="obj.term"></el-input>
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              v-for="item in termlists"
                              :key="item.id"
                              :command="{value: item, pindex: index}"
                            >{{item.term}}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </el-col>
                      <el-col :span="14" class="padding-l10px">
                        <el-input v-model="obj.termdetail"></el-input>
                      </el-col>
                      <el-col :span="3" class="padding-l10px">
                        <el-button
                          class="margin-l10 float-r"
                          size="mini"
                          icon="el-icon-minus"
                          @click="minusTerm(index)"
                        ></el-button>
                        <el-button
                          class="float-r"
                          size="mini"
                          icon="el-icon-plus"
                          v-if="index === 0"
                          @click="plusTerm()"
                        ></el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <!-- 适用范围 -->
                <el-col :span="24" v-if="existTabField('c_scope', 'refer')">
                  <el-form-item
                    :label="existTabField('c_scope')"
                    prop="fitscope"
                    :rules="[
                    { required: existTabField('c_scope', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.fitscope"></el-input>
                  </el-form-item>
                </el-col>
                <!-- 负责部门 -->
                <el-col :span="12" v-if="existTabField('c_organization', 'refer')">
                  <el-form-item
                    :label="existTabField('c_organization')"
                    prop="disScopeformat"
                    :rules="[
                    { required: existTabField('c_organization', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input
                      class="search_component remove-margin-b"
                      v-model="attrsForm.disScopeformat"
                      :title="attrsForm.disScopeformat"
                      disabled
                    >
                      <el-button @click="distributeClick" slot="append">选择</el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <!-- 配合部门 -->
                <el-col :span="12" v-if="existTabField('c_codept', 'refer')">
                  <el-form-item
                    :label="existTabField('c_codept')"
                    prop="codisScopeformat"
                    :rules="[
                    { required: existTabField('c_codept', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input
                      class="search_component remove-margin-b"
                      v-model="attrsForm.codisScopeformat"
                      :title="attrsForm.codisScopeformat"
                      disabled
                    >
                      <el-button @click="codistributeClick" slot="append">选择</el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <!-- 相关体系分类及标准条款 -->
                <el-col :span="24" v-if="existTabField('c_systemClassification', 'refer')">
                  <el-form-item
                    :label="existTabField('c_systemClassification')"
                    prop="systemlist"
                    :rules="[
                    { required: existTabField('c_systemClassification', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <span
                      class="syslist"
                      :class="{'active': attrsForm.systemlist.indexOf(item) > -1}"
                      v-for="item in syslistsRepeat"
                      :key="item"
                      @click="selectSysItem(item)"
                    >
                      <span
                        :title="syslistsname[item].cnname + ' ' + syslistsname[item].enname"
                      >{{item}}</span>
                      <el-tooltip
                        v-show="attrsForm.systemlist.indexOf(item) > -1"
                        class="item"
                        effect="dark"
                        content="清除"
                        placement="top"
                      >
                        <i class="margin-l5 el-icon-close" @click.prevent="delSyslist(item)"></i>
                      </el-tooltip>
                    </span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10" v-if="existTabField('c_systemClassification', 'refer')">
                <el-col
                  :span="8"
                  class="systemCard margin-b10"
                  v-for="system in syslistsRepeat"
                  :key="system"
                  v-show="syspart[system].show"
                >
                  <el-card class="box-card" :body-style="{ padding: '0px' }">
                    <div slot="header" class="clearfix header">
                      <span>{{system}}</span>
                      <el-button
                        class="float-r margin-l5"
                        type="text"
                        icon="el-icon-close"
                        @click="syspart[system].show = false"
                      ></el-button>
                      <el-button
                        class="float-r margin-l10"
                        type="text"
                        @click.prevent="delSyslist(system)"
                      >清除</el-button>
                      <el-button class="float-r" type="text" @click="confirmSyslist(system)">确定</el-button>
                      <el-button class="float-r" type="text" @click="selectSysFile(system)">选择附件</el-button>
                    </div>
                    <div class="pad-10px h220px">
                      <h6 class="margin-b5">标准条款描述:</h6>
                      <el-input
                        type="textarea"
                        v-model="syspart[system].desc"
                        @blur.native.stop="referSyslist(system)"
                      ></el-input>
                      <h6 class="margin-b5 margin-t15">已选择附件:</h6>
                      <p class="showFiles alink">
                        <span
                          class="margin-r5 margin-b5"
                          v-for="(item, index) in syspart[system].selected"
                          :key="item.id"
                        >
                          <a
                            class="font-link"
                            :href="viewFile(item.docid)"
                            target="_blank"
                          >{{item.name}}</a>
                          <a
                            class="margin-l5 font-link"
                            :href="downloadFile(item.docid)"
                            target="_blank"
                          >
                            <b class="el-icon-download"></b>
                          </a>
                          <i class="el-icon-close" @click="delsys(system, 'selected', index)"></i>
                        </span>
                      </p>
                      <h6 class="margin-b5 margin-t15">已上传附件:</h6>
                      <p class="showFiles alink">
                        <span
                          class="margin-r5 margin-b5"
                          v-for="(item, index) in syspart[system].uploaded"
                          :key="item.id"
                        >
                          <a
                            class="font-link"
                            :href="viewFile(item.docid)"
                            target="_blank"
                          >{{item.name}}</a>
                          <a
                            class="margin-l5 font-link"
                            :href="downloadFile(item.docid)"
                            target="_blank"
                          >
                            <b class="el-icon-download"></b>
                          </a>
                          <i class="el-icon-close" @click="delsys(system, 'uploaded', index)"></i>
                        </span>
                      </p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>

              <!---------------------------------------------- 制度相关信息---------------------->
              <h5
                class="subTitle"
                v-if="existTabField('ruleInfo', 'refer')"
              >{{existTabField('ruleInfo')}}</h5>
              <el-row :gutter="10">
                <!-- 制度名称 -->
                <el-col :span="12" v-if="existTabField('c_ruleName', 'refer')">
                  <el-form-item
                    :label="existTabField('c_ruleName')"
                    prop="rulename"
                    :rules="[
                    { required: existTabField('c_ruleName', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.rulename" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 制度编码 -->
                <el-col :span="12" v-if="existTabField('c_ruleCode', 'refer')">
                  <el-form-item
                    :label="existTabField('c_ruleCode')"
                    prop="rulecode"
                    :rules="[
                    { required: existTabField('c_ruleCode', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.rulecode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 制度编写人 -->
                <el-col :span="12" v-if="existTabField('c_ruleperson', 'refer')">
                  <el-form-item
                    :label="existTabField('c_ruleperson')"
                    prop="ruleperson"
                    :rules="[
                    { required: existTabField('c_ruleperson', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input
                      :value="!attrsForm.ruleperson ? '':attrsForm.ruleperson.map(item => item.value).join(',')"
                      :title="!attrsForm.ruleperson ? '':attrsForm.ruleperson.map(item => item.value).join(',')"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <!-- 制度联络人 -->
                <el-col :span="12" v-if="existTabField('c_ruler', 'refer')">
                  <el-form-item
                    :label="existTabField('c_ruler')"
                    prop="ruler"
                    :rules="[
                    { required: existTabField('c_ruler', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input
                      class="search_component remove-margin-b"
                      :value="!attrsForm.ruler ? '':attrsForm.ruler.map(item => item.value).join(',')"
                      :title="!attrsForm.ruler ? '':attrsForm.ruler.map(item => item.value).join(',')"
                      disabled
                    >
                      <el-button @click="chooseRuler" slot="append">选择</el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
                <!-- 制度简介 -->
                <el-col :span="12" v-if="existTabField('c_ruledes', 'refer')">
                  <el-form-item
                    :label="existTabField('c_ruledes')"
                    prop="ruledesc"
                    :rules="[
                    { required: existTabField('c_ruledes', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.ruledesc" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
                <!-- 制度原因 -->
                <el-col :span="12" v-if="existTabField('c_rulereason', 'refer')">
                  <el-form-item
                    :label="existTabField('c_rulereason')"
                    prop="rulereason"
                    :rules="[
                    { required: existTabField('c_rulereason', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.rulereason" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <!---------------------------------------------- 流程相关信息---------------------->
              <h5
                class="subTitle"
                v-if="existTabField('processInfo', 'refer')"
              >{{existTabField('processInfo')}}</h5>
              <el-row :gutter="10">
                <!-- 流程名称 -->
                <el-col :span="12" v-if="existTabField('c_processName', 'refer')">
                  <el-form-item
                    :label="existTabField('c_processName')"
                    prop="processname"
                    :rules="[
                    { required: existTabField('c_processName', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.processname" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 流程编码 -->
                <el-col :span="12" v-if="existTabField('code_processCoding', 'refer')">
                  <el-form-item
                    :label="existTabField('code_processCoding')"
                    :rules="[
                    { required: existTabField('code_processCoding', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="processcode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 流程负责人 -->
                <el-col :span="12" v-if="existTabField('c_processResponsible', 'refer')">
                  <el-form-item
                    :label="existTabField('c_processResponsible')"
                    prop="processowner"
                    :rules="[
                    { required: existTabField('c_processResponsible', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input
                      v-model="attrsForm.processowner"
                      :title="attrsForm.processowner"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <!-- 上级流程责任人 -->
                <el-col :span="12" v-if="existTabField('c_issuer', 'refer')">
                  <el-form-item
                    :label="existTabField('c_issuer')"
                    prop="upowner"
                    :rules="[
                    { required: existTabField('c_issuer', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.upowner" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 流程描述 -->
                <el-col :span="12" v-if="existTabField('c_processDescription', 'refer')">
                  <el-form-item
                    :label="existTabField('c_processDescription')"
                    prop="desc"
                    :rules="[
                    { required: existTabField('c_processDescription', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.desc" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
                <!-- 流程目的 -->
                <el-col :span="12" v-if="existTabField('c_target', 'refer')">
                  <el-form-item
                    :label="existTabField('c_target')"
                    prop="target"
                    :rules="[
                    { required: existTabField('c_target', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.target" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
                <!-- 起点==================================================================== -->
                <el-col :span="12" v-if="existTabField('c_origin', 'refer')">
                  <el-form-item
                    :label="existTabField('c_origin')"
                    prop="startpoint"
                    :rules="[
                    { required: existTabField('c_origin', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.startpoint" :title="attrsForm.startpoint" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 终点================================================================================= -->
                <el-col :span="12" v-if="existTabField('c_endpoint', 'refer')">
                  <el-form-item
                    :label="existTabField('c_endpoint')"
                    prop="endpoint"
                    :rules="[
                    { required: existTabField('c_endpoint', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-input v-model="attrsForm.endpoint" :title="attrsForm.endpoint" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12" v-if="existTabField('c_superiorProcess', 'refer')">
                  <el-form-item
                    class="label-height-auto"
                    :label="existTabField('c_superiorProcess')"
                    prop="upStream"
                    :rules="[
                    { required: existTabField('c_superiorProcess', 'necessary'), message: ' ', trigger: 'blur' }
                  ]"
                  >
                    <el-row>
                      <el-col :span="20">
                        <p class="showFiles minHeight28">
                          <span
                            class="margin-r5 margin-b5"
                            v-for="item in attrsForm.upStream"
                            :key="item.id"
                          >
                            {{item.name.indexOf(item.code) > -1 ? item.name:(item.code + item.name)}}
                            <i
                              class="el-icon-close cursor-pointer"
                              @click="delProcess('upStream', item)"
                            ></i>
                          </span>
                        </p>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          class="float-r"
                          @click="refertype = 'upstream';processlists = attrsForm.upStream;isSelectVisible = true"
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="existTabField('c_subordinateProcess', 'refer')">
                  <el-form-item
                    class="label-height-auto"
                    :label="existTabField('c_subordinateProcess')"
                    prop="downStream"
                    :rules="[
                      { required: existTabField('c_subordinateProcess', 'necessary'), message: ' ', trigger: 'blur' }
                    ]"
                  >
                    <el-row>
                      <el-col :span="20">
                        <p class="showFiles minHeight28">
                          <span
                            class="margin-r5 margin-b5"
                            v-for="item in attrsForm.downStream"
                            :key="item.id"
                          >
                            {{item.name.indexOf(item.code) > -1 ? item.name:(item.code + item.name)}}
                            <i
                              class="el-icon-close cursor-pointer"
                              @click="delProcess('downStream', item)"
                            ></i>
                          </span>
                        </p>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          class="float-r"
                          @click="refertype = 'downstream';processlists = attrsForm.downStream;isSelectVisible = true"
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12" v-if="existTabField('c_processInput', 'refer')">
                  <el-form-item
                    class="label-height-auto"
                    :label="existTabField('c_processInput')"
                    prop="processInput"
                    :rules="[
                      { required: existTabField('c_processInput', 'necessary'), message: ' ', trigger: 'blur' }
                    ]"
                  >
                    <el-row>
                      <el-col :span="20">
                        <h6>描述 :</h6>
                        <p class="showFiles processCommon">{{attrsForm.processInputDesc}}</p>
                        <h6 class="margin-t5">本地上传附件 :</h6>
                        <p class="showFiles processCommon alink">
                          <span
                            class="margin-r5 margin-b5"
                            v-for="item in attrsForm.processFileInput"
                            :key="item.id"
                          >
                            <a
                              class="font-link"
                              :href="viewFile(item.docid)"
                              target="_blank"
                            >{{item.name || item.newName}}</a>
                            <a
                              class="margin-l5 font-link"
                              :href="downloadFile(item.docid)"
                              target="_blank"
                            >
                              <b class="el-icon-download"></b>
                            </a>
                            <!-- <i class="el-icon-close" @click="delProcess('processFileInput', item)"></i> -->
                          </span>
                        </p>
                        <h6 class="margin-t5">上游流程带出输入文件 :</h6>
                        <p class="showFiles processCommon alink">
                          <span
                            class="margin-r5 margin-b5"
                            v-for="item in attrsForm.processUpInput"
                            :key="item.id"
                          >
                            <a
                              class="font-link"
                              :href="viewFile(item.docid)"
                              target="_blank"
                            >{{item.name || item.newName}}</a>
                            <a
                              class="margin-l5 font-link"
                              :href="downloadFile(item.docid)"
                              target="_blank"
                            >
                              <b class="el-icon-download"></b>
                            </a>
                          </span>
                        </p>
                      </el-col>
                      <el-col :span="4">
                        <el-button class="float-r" @click="selectprocessfile('processInput')">编辑</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="existTabField('c_processOutput', 'refer')">
                  <el-form-item
                    class="label-height-auto"
                    :label="existTabField('c_processOutput')"
                    prop="processOutput"
                    :rules="[
                      { required: existTabField('c_processOutput', 'necessary'), message: ' ', trigger: 'blur' }
                    ]"
                  >
                    <el-row>
                      <el-col :span="20">
                        <h6>描述 :</h6>
                        <p class="showFiles processCommon">{{attrsForm.processOutputDesc}}</p>
                        <h6 class="margin-t5">本地上传附件 :</h6>
                        <p class="showFiles processCommon alink">
                          <span
                            class="margin-r5 margin-b5"
                            v-for="item in attrsForm.processFileOutput"
                            :key="item.id"
                          >
                            <a
                              class="font-link"
                              :href="viewFile(item.docid)"
                              target="_blank"
                            >{{item.name || item.newName}}</a>
                            <a
                              class="margin-l5 font-link"
                              :href="downloadFile(item.docid)"
                              target="_blank"
                            >
                              <b class="el-icon-download"></b>
                            </a>
                            <!-- <i class="el-icon-close" @click="delProcess('processFileOutput', item)"></i> -->
                          </span>
                        </p>
                        <h6 class="margin-t5">流程图带出输出文件 :</h6>
                        <p class="showFiles processCommon alink">
                          <span
                            class="margin-r5 margin-b5"
                            v-for="item in attrsForm.processchartOutput"
                            :key="item.id"
                          >
                            <a
                              class="font-link"
                              :href="viewFile(item.docid)"
                              target="_blank"
                            >{{item.name || item.newName}}</a>
                            <a
                              class="margin-l5 font-link"
                              :href="downloadFile(item.docid)"
                              target="_blank"
                            >
                              <b class="el-icon-download"></b>
                            </a>
                          </span>
                        </p>
                      </el-col>
                      <el-col :span="4">
                        <el-button class="float-r" @click="selectprocessfile('processOutput')">编辑</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-tab-pane>
        <!-- 制度管理办法内容 -->
        <el-tab-pane name="8" :label="existTab('8')" v-if="existTab('8','refer')">
          <manage :treeId="treeId" v-if="editableTabsValue == 8" :listid="modelid"></manage>
        </el-tab-pane>
        <!-- 流程支持文件 -->
        <el-tab-pane name="1" :label="existTab('1')" v-if="existTab('1','refer')">
          <processInsit :showtabfiled="showtabfiled" :modelid="modelid" />
        </el-tab-pane>
        <!-- 流程绩效 -->
        <el-tab-pane name="2" :label="existTab('2')" v-if="existTab('2','refer')">
          <processPerformance :showtabfiled="showtabfiled" :modelid="modelid" />
        </el-tab-pane>
        <!-- 关键风险控制点 -->
        <el-tab-pane name="3" :label="existTab('3')" v-if="existTab('3','refer')">
          <riskNecessary :showtabfiled="showtabfiled" :modelid="modelid" />
        </el-tab-pane>
        <!-- 关键成功要素 -->
        <el-tab-pane name="4" :label="existTab('4')" v-if="existTab('4','refer')">
          <keyElement :showtabfiled="showtabfiled" :modelid="modelid" />
        </el-tab-pane>
        <!-- 权限执行表 -->
        <el-tab-pane name="9" :label="existTab('9')" v-if="existTab('9','refer')">
          <author :treeId="treeId" :modelid="modelid" v-if="editableTabsValue == 9"></author>
        </el-tab-pane>
        <!-- 相关性支撑内容 -->
        <el-tab-pane name="11" :label="existTab('11')" v-if="existTab('11','refer')">
          <correlation-support
            :modelid="modelid"
            :bpmid="bpmid"
            :treeId="treeId"
            :version="version"
            v-if="editableTabsValue == 11"
          ></correlation-support>
        </el-tab-pane>
        <!-- 业务规则 -->
        <el-tab-pane name="5" :label="existTab('5')" v-if="existTab('5','refer')">
          <busRule :showtabfiled="showtabfiled" :modelid="modelid" v-if="editableTabsValue == 5" />
        </el-tab-pane>
        <!-- 修订内容 -->
        <el-tab-pane name="10" :label="existTab('10')" v-if="existTab('10','refer')">
          <modify-record :modelid="modelid" :version="version" v-if="editableTabsValue == 10"></modify-record>
        </el-tab-pane>
        <!-- 流程活动说明 -->
        <el-tab-pane name="6" :label="existTab('6')" v-if="existTab('6','refer')">
          <processInfo :showtabfiled="showtabfiled" :bpmid="bpmid" />
        </el-tab-pane>
        <!-- 修订记录 -->
        <el-tab-pane name="7" :label="existTab('7')" v-if="existTab('7','refer')">
          <appovalRecord :showtabfiled="showtabfiled" :modelid="modelid" />
        </el-tab-pane>
        <!-- 风险控制 -->
        <el-tab-pane name="12" :label="existTab('12')" v-if="existTab('12','refer')">
          <risk-control :showtabfiled="showtabfiled" :modelid="modelid" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 添加附件 -->
    <select-file v-model="isGroupVisible" :pageId="forlderId" @confirm="handlerSelect"></select-file>

    <!-- 分发范围 -->
    <distribution :disData="distribution" v-model="isdisVisible" @confirm="confirmDistribution"></distribution>

    <!-- 配合部门 -->
    <codistribution
      :disData="codistribution"
      v-model="iscodisVisible"
      @confirm="confirmCoDistribution"
    ></codistribution>
    <!-- 新的分发范围 -->
    <!-- <distribution-new :disData="distribution" v-model="isdisVisible" @confirm="confirmDistribution"></distribution-new> -->

    <!-- 选择流程 -->
    <select-process
      v-model="isSelectVisible"
      :processlists="processlists"
      :modelId="treeId"
      @confirm="confirmprocess"
    ></select-process>

    <!-- 流程输入输出的dialog -->
    <el-dialog
      class="supportDialog"
      :visible.sync="isinoutVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template slot="title">
        <div class="clear-fix">
          <span class="font14">选择附件</span>
          <el-button class="float-r" size="large" type="text" @click="saveInoutFiles">保存</el-button>
        </div>
      </template>
      <el-form
        label-width="110px"
        label-position="right"
        ref="selectProcessRef"
        :model="selectInoutform"
      >
        <el-form-item class="label-height-auto" label="描述:" prop="desc">
          <el-input type="textarea" v-model="selectInoutform.desc" rows="4" resize="none"></el-input>
        </el-form-item>
        <el-form-item
          class="label-height-auto"
          :label="selectReferType === 'processInput' ? '上游流程带出输出文件:' : '流程图带出输出文件:'"
          prop="disabledfiles"
        >
          <p class="showFiles processCommon minHeight35">
            <span
              class="margin-r5 margin-b5"
              v-for="item in selectInoutform.disabledfiles"
              :key="item.id"
            >{{item.name || item.newName}}</span>
          </p>
        </el-form-item>
        <el-form-item class="label-height-auto" label="本地上传附件:" prop="files">
          <el-row>
            <el-col :span="20" class="minHeight28">
              <p class="showFiles processCommon">
                <span
                  class="margin-r10 margin-b10"
                  v-for="(item) in selectInoutform.files"
                  :key="item.id"
                >
                  {{item.name || item.newName}}
                  <i
                    class="el-icon-close cursor-pointer"
                    @click="delSelectFiles(item)"
                  ></i>
                </span>
              </p>
            </el-col>
            <el-col :span="4">
              <el-button class="float-r" @click="isGroupVisible = true">选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 制度联络人 -->
    <select-group
      v-model="isGroupDialogVisible"
      :selectTree="['3']"
      :showTree="'1,2,3,4'"
      :selected="selectedID"
      @confirm="handlerGroupSelect"
    ></select-group>
  </div>
</template>
<script>
import distribution from './distribution.vue'
import codistribution from './codistribution.vue'
import selectProcess from './selectProcess.vue'
import distributionNew from './distributionNew.vue'
import manage from './manage.vue'
import author from './author.vue'
import correlationSupport from './correlationSupport.vue'
import modifyRecord from './modifyRecord.vue'
import riskControl from './riskControl.vue'
import {
  processattrs,
  processStartOrEnd,
  processSaveAttr,
  saveFile,
  controlField,
  tabField,
  getSystemList
} from '@/bpa/api/processDesignCenter'
import { deluploadFile } from '@/bpa/api/common'
import { getTerminologyList } from '@/bpa/api/processModelCenter/terminology'
import fileOperation from '@/bpa/mixins/fileDownView'

const syslists = ['QMS', 'EMS', 'OHSAS', 'ISMS', 'RMS', 'EnMs']
const syslistsname = {
  QMS: {
    cnname: '质量管理体系',
    enname: 'Quality Management System'
  },
  EMS: {
    cnname: '环境管理体系',
    enname: 'Environment Management System'
  },
  OHSAS: {
    cnname: '职业健康安全管理体系',
    enname: 'Occupation Health Safety Management System'
  },
  ISMS: {
    cnname: '信息安全管理体系',
    enname: 'Information Security Management System'
  },
  RMS: {
    cnname: '风险管理体系',
    enname: 'Risk Management System'
  },
  EnMs: {
    cnname: '能源管理体系',
    enname: 'Energy Management System'
  }
}

export default {
  name: 'processCard',
  components: {
    distribution,
    selectProcess,
    distributionNew,
    codistribution,
    manage,
    author,
    modifyRecord,
    correlationSupport,
    riskControl,
    processInsit: () => import('./processInsit.vue'),
    processPerformance: () => import('./processPerformance.vue'),
    riskNecessary: () => import('./riskNecessary.vue'),
    keyElement: () => import('./keyElement.vue'),
    busRule: () => import('./busRule.vue'),
    processInfo: () => import('./processInfo.vue'),
    appovalRecord: () => import('./appovalRecord.vue')
  },
  data() {
    return {
      selectedID: [],
      isGroupDialogVisible: false,
      referClose: false,
      // 暂存后台返回的流程基本属性的数据
      rebackDataOther: {},
      rebackData: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      syslistsname: syslistsname,
      isDialogsVisible: false,
      isGroupVisible: false,
      isdisVisible: false,
      iscodisVisible: false,
      isSelectVisible: false,
      isinoutVisible: false,
      refertype: 'upstream',
      processlists: [],
      distribution: {},
      codistribution: {},
      attrsForm: {
        effectTime: '',
        nextTime: '',
        desc: '',
        target: '',
        fitscope: '',
        disScope: '',
        systemlist: [],
        ruleperson: [],
        ruler: [],
        termlist: [
          {
            term: '',
            termdetail: ''
          }
        ]
      },
      // 术语
      termlists: [],
      attrsRules: {
        effectTime: [{ required: true, message: ' ', trigger: 'blur' }],
        desc: [{ required: true, message: ' ', trigger: 'blur' }],
        target: [{ required: true, message: ' ', trigger: 'blur' }],
        fitscope: [{ required: true, message: ' ', trigger: 'blur' }],
        disScopeformat: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      editableTabsValue: 0,
      editableTabs: [],
      selectProcessform: {},
      // 流程输入、流程输出部分
      selectReferType: '',
      selectInoutform: {},
      syslists: JSON.parse(JSON.stringify(syslists)),
      syspart: [],
      // 流程基本属性
      storeDeletefile: {
        document: [],
        modeldoc: []
      },
      // 体系分类
      syslistsRepeat: '',
      // 组件附件的调用参数
      // 显示tablist
      showtabfiled: [],
      forlderId: ''
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    download() {
      return this.host + '/attach/download/'
    },
    viewfile() {
      return this.host + '/document/print/'
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    modelid: {
      type: String,
      default: ''
    },
    treeId: {
      type: String,
      default: ''
    },
    bpmid: {
      type: String,
      default: ''
    },
    processcode: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: ''
    }
  },
  async mounted() {
    let res = await this.getSystemList()
    let { syslists, obj, syslistsname } = res
    this.syslistsRepeat = syslists
    this.syslistsname = syslistsname
    this.syspart = obj
    console.log(this.syslists, this.syslistsname, this.syspart)
  },
  mixins: [fileOperation],
  watch: {
    value(val) {
      if (val) {
        this.referClose = false
        this.isDialogsVisible = val
        this.editableTabsValue = '0'
        this.getShowTablist().then(() => {
          this.tabsClick()
        })
      }
    },
    isDialogsVisible(val) {
      this.$emit('input', val)
    },
    'attrsForm.distribution'(val) {
      val = !val ? [] : JSON.parse(val).orglist
      this.$set(
        this.attrsForm,
        'disScopeformat',
        val
          .map(item => {
            return item.name
          })
          .join(',')
      )
      if (!this.referClose) {
        console.log(111)
        this.rebackDataOther.disScopeformat = val
          .map(item => {
            return item.name
          })
          .join(',')
      }
    },
    'attrsForm.codistribution'(val) {
      console.log(val, 222)
      val = !val ? [] : JSON.parse(val).orglist
      this.$set(
        this.attrsForm,
        'codisScopeformat',
        val
          .map(item => {
            return item.name
          })
          .join(',')
      )
      if (!this.referClose) {
        this.rebackDataOther.codisScopeformat = val
          .map(item => {
            return item.name
          })
          .join(',')
      }
    }
  },
  methods: {
    // 获取体系标准文件
    async getSystemList() {
      let res = await getSystemList({
        filters: [
          {
            key: 'process_design_is_visible',
            opt: 'EQ',
            type: 'S',
            value: 'Y'
          }
        ]
      })
      if (!res) return
      let obj = {}
      let objName = {}
      res = res.map(item => {
        obj[item.system_name] = {
          show: false,
          desc: '',
          selected: [],
          uploaded: []
        }
        objName[item.system_name] = {
          cnname: item.system_cnname,
          enname: item.system_enname
        }
        return item.system_name
      })
      console.log(res)
      return new Promise(resolve => {
        resolve({ syslists: res, obj, syslistsname: objName })
      })
    },
    // tab切换
    tabsClick() {
      // console.log(this.editableTabsValue);
      switch (true) {
        // 获取流程基本属性
        case this.editableTabsValue === '0':
          if (!this.referClose) {
            this.getProcessAttr()
          }
          this.editableTabs.forEach(item => {
            if (item.index == 0) {
              this.getShowTabField(item.id, 0)
              return false
            }
          })
          break
        // 获取流程支持文件
        case this.editableTabsValue === '1':
          this.referClose = true
          this.forlderId = '7A88EC3856C446EBE053BF1A13ACC390'
          this.editableTabs.forEach(item => {
            if (item.index == 1) {
              this.getShowTabField(item.id, 1)
              return false
            }
          })
          break
        // 获取流程绩效
        case this.editableTabsValue === '2':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 2) {
              this.getShowTabField(item.id, 2)
              return false
            }
          })
          break
        // 获取关键风险控制点
        case this.editableTabsValue === '3':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 3) {
              this.getShowTabField(item.id, 3)
              return false
            }
          })
          break
        // 关键成功要素
        case this.editableTabsValue === '4':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 4) {
              this.getShowTabField(item.id, 4)
              return false
            }
          })
          break
        // 业务规则
        case this.editableTabsValue === '5':
          this.referClose = true
          this.forlderId = '7BC636EDF11967C0E0530701A8C06A7D'
          this.editableTabs.forEach(item => {
            if (item.index === 5) {
              this.getShowTabField(item.id, 5)
              return false
            }
          })
          break
        // 流程活动说明
        case this.editableTabsValue === '6':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 6) {
              this.getShowTabField(item.id, 6)
              return false
            }
          })
          break
        // 修订记录
        case this.editableTabsValue === '7':
          this.referClose = true
          this.editableTabs.forEach(item => {
            if (item.index == 7) {
              this.getShowTabField(item.id, 7)
              return false
            }
          })
          break
        // 相关支撑性内容
        case this.editableTabsValue === '11':
          this.referClose = true
          this.getCorrelationSupport()
          this.editableTabs.forEach(item => {
            if (item.index == 7) {
              this.getShowTabField(item.id, 7)
              return false
            }
          })
          break
      }
    },
    // 获取Tab栏标题的显示字段的名称
    async getShowTablist() {
      let res = await controlField({
        attr: {},
        filters: [],
        logic: 'and',
        orderby: 'createon',
        pageNum: 1,
        pageSize: 100,
        sort: 'desc'
      })
      this.editableTabs = []
      res.list.forEach(item => {
        if (item.state == '1') {
          this.editableTabs.push({
            index: parseInt(item.sort),
            name: item.name,
            id: item.id
          })
          console.log(this.editableTabs)
        }
      })
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    // 获取显示Tab字段的名称/表格内容
    async getShowTabField(id, type) {
      let res = await tabField({
        attr: {},
        filters: [{ key: 'sheetid', opt: 'LIKE', type: 'S', value: id }],
        logic: 'and',
        orderby: 'createon',
        pageNum: 1,
        pageSize: 100,
        sort: 'desc'
      })
      this.showtabfiled = []
      console.log(res)
      console.log(res.list)
      res.list.forEach(item => {
        if (item.state == '1') {
          this.showtabfiled.push({
            name: item.name,
            pname: item.pname,
            necessary: item.necessary
          })
        }
      })
      console.log(this.showtabfiled)
      if (type == 0) {
        this.syslists.forEach(item => {
          if (!this.showtabfiled.some((value, index) => value.pname == item)) {
            this.syslists.splice(this.syslists.indexOf(item), 1)
          }
        })
      }
    },
    existTab(index, type) {
      let obj = {}
      console.log(this.editableTabs)
      this.editableTabs.forEach(item => {
        if (item.index === parseInt(index)) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      if (type == 'refer') {
        return !obj.index ? obj.index === 0 : true
      } else {
        return !obj.index ? (obj.index === 0 ? obj.name : '') : obj.name
      }
    },
    existTabField(pname, type, bool) {
      let obj = {}
      // console.log(this.showtabfiled)
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      let lang = localStorage.getItem("language")
      if (type == 'refer') {
        return !!obj.pname
      } else if (type == 'necessary') {
        return obj.necessary == '1'
      } else {
        return obj.pname && lang === 'cn' ? obj.name + (!bool ? ':' : '') : obj.pname && lang === 'en' ? obj.enname + (!bool ? ':' : '') : obj.enname + (!bool ? ":" : "")
      }
    },
    // 点击选择事件
    distributeClick() {
      this.isdisVisible = true
    },
    // 点击选择事件
    codistributeClick() {
      this.iscodisVisible = true
    },
    chooseRuler() {
      this.selectedID = []
      console.log(this.attrsForm.ruler)
      this.isGroupDialogVisible = true
      if (!this.attrsForm.ruler) return false
      this.attrsForm.ruler.forEach(item => {
        this.selectedID.push({
          ID: parseInt(item.empuid),
          NAME: item.value,
          TYPE: item.TYPE,
          PID: item.PID,
          person: {
            cnname: item.cnname,
            empid: item.userid
          }
        })
      })
    },
    handlerGroupSelect(list) {
      console.log(list)
      let arr = []
      for (let i = 0; i < list.length; i++) {
        let managerList = {
          cnname: '',
          empuid: '',
          loadChildren: '',
          modelid: '',
          pid: '',
          sort: 0,
          type: '',
          userid: '',
          value: ''
        }
        managerList.cnname = list[i].person.cnname
        managerList.empuid = list[i].ID
        managerList.pid = list[i].PID
        managerList.type = list[i].TYPE
        managerList.userid = list[i].person.empid
        managerList.value = list[i].NAME
        arr.push(managerList)
      }
      this.attrsForm.ruler = arr
    },
    // 术语部分
    reuqireDownData(bool) {
      if (bool) {
        getTerminologyList({
          filters: [{ key: 'term', opt: 'LIKE', type: 'S', value: null }],
          orderby: 'createon',
          pageNum: 1,
          pageSize: 999,
          sort: 'desc'
        }).then(res => {
          this.termlists = res.list
        })
      }
    },
    // 清除术语
    minusTerm(index) {
      this.attrsForm.termlist.splice(index, 1)
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    },
    // 添加术语
    plusTerm() {
      this.attrsForm.termlist.push({
        term: '',
        termdetail: ''
      })
    },
    handleCommand(data) {
      this.$set(
        this.attrsForm.termlist,
        data.pindex,
        Object.assign({}, this.attrsForm.termlist[data.pindex], {
          term: data.value.term,
          termdetail: data.value.termdetail
        })
      )
    },
    // 修改生效时间影响下次修改时间的
    changeEffectTime() {
      if (!this.attrsForm.nextTime) {
        let effectTime = new Date(this.attrsForm.effectTime)
        let nextTime =
          effectTime.getFullYear() +
          3 +
          '-' +
          (effectTime.getMonth() + 1) +
          '-' +
          effectTime.getDate()
        this.$set(this.attrsForm, 'nextTime', nextTime)
      }
    },
    // 获取流程基本属性表格属性字段
    getProcessAttr() {
      let self = this
      Promise.all([
        processattrs(self.modelid),
        processStartOrEnd(self.bpmid)
      ]).then(res => {
        console.log(res)
        let resAttr = res[0]
        let response = res[1]
        console.log(resAttr)
        console.log(response)
        this.distribution = resAttr
        this.codistribution = resAttr
        // -------------------起点&&终点------------开始
        let result = !response
          ? []
          : !response.json
            ? []
            : JSON.parse(response.json).controls
        console.log(result)
        let lines = !response
          ? []
          : !response.json
            ? []
            : JSON.parse(response.json).lines
        // 起点部分
        let startprocessId = []
        let startprocess = []
        // 终点部分
        let endprocessId = []
        let endprocess = []
        if (result) {
          result.forEach(function(obj) {
            if (obj.type == 'processStart') {
              lines.forEach(function(line) {
                if (line.from === obj.id) {
                  startprocessId.push(line.to)
                }
              })
            }
            if (obj.type == 'processEnd') {
              lines.forEach(function(line) {
                if (line.to === obj.id) {
                  endprocessId.push(line.from)
                }
              })
            }
          })
          for (var i = 0; i < startprocessId.length; i++) {
            for (var j = 0; j < result.length; j++) {
              var obj = result[j]
              if (startprocessId[i] == obj.id) {
                startprocess.push(obj.name)
              }
            }
          }
          for (var i = 0; i < endprocessId.length; i++) {
            for (var j = 0; j < result.length; j++) {
              var obj = result[j]
              if (endprocessId[i] == obj.id) {
                endprocess.push(obj.name)
              }
            }
          }
        }
        // -------------------起点&&终点------------结束

        // 清除体系分类数据
        for (let obj of Object.entries(this.syspart)) {
          this.syspart[obj[0]] = Object.assign({}, this.syspart[obj[0]], {
            show: false,
            desc: '',
            selected: [],
            uploaded: []
          })
        }
        let syslist = []
        resAttr.bpmDto.syslist.forEach(item => {
          console.log(this.syslistsRepeat)
          if (this.syslistsRepeat.includes(item.typename)) {
            if (syslist.indexOf(item.typename) === -1) {
              syslist.push(item.typename)
            }
            this.syspart[item.typename].show = true
            this.syspart[item.typename].desc = item.description
            this.syspart[item.typename].selectedList = []
            if (item.docid) {
              this.syspart[item.typename].uploaded.push(item)
            }
          }
        })
        // 对象合并
        let nextTime = ''
        if (resAttr.bpmDto.effectiveon) {
          let effectTime = new Date(resAttr.bpmDto.effectiveon)
          nextTime =
            effectTime.getFullYear() +
            3 +
            '-' +
            (effectTime.getMonth() + 1) +
            '-' +
            effectTime.getDate()
        }
        this.attrsForm = Object.assign({}, this.attrsForm, {
          id: resAttr.bpmDto.id,
          processowner: resAttr.bpmDto.bponame,
          processid: resAttr.bpmDto.bpo,
          processname: resAttr.bpmDto.name,
          versions: resAttr.bpmDto.version,
          level: resAttr.bpmDto.hierarchy,
          code: resAttr.bpmDto.code,
          // 生效时间
          effectTime: resAttr.bpmDto.effectiveon,
          // 下次修改时间
          nextTime: !resAttr.bpmDto.effectiveon ? '' : nextTime,
          processowner: resAttr.bpmDto.managerList
            .map(item => {
              return item.value
            })
            .join(','),
          // 流程编码
          processcode: this.processcode,
          // 流程责任人
          singer: resAttr.bpmDto.signername,
          // 上级流程责任人
          upowner: resAttr.bpmDto.upmanagerList
            .map(item => {
              return item.value
            })
            .join(','),
          desc: resAttr.bpmDto.description,
          target: resAttr.bpmDto.purpose,
          fitscope: resAttr.bpmDto.scope,
          distribution: resAttr.bpmDto.distribution,
          codistribution: resAttr.bpmDto.codistribution,
          startpoint: startprocess.join(','),
          endpoint: endprocess.join(','),
          upStream: !resAttr.bpmDto.inputnamelist
            ? []
            : resAttr.bpmDto.inputnamelist,
          downStream: !resAttr.bpmDto.outputnamelist
            ? []
            : resAttr.bpmDto.outputnamelist,
          processInput: !!(
            !!resAttr.bpmDto.input || !!resAttr.bpmDto.inputlist
          ),
          processInputDesc: resAttr.bpmDto.input,
          processUpInput: resAttr.bpmDto.inlist,
          processFileInput: resAttr.bpmDto.inputlist,
          processOutput: !!(
            !!resAttr.bpmDto.output || !!resAttr.bpmDto.outputlist
          ),
          processOutputDesc: resAttr.bpmDto.output,
          processchartOutput: resAttr.bpmDto.outlist,
          processFileOutput: resAttr.bpmDto.outputlist,
          systemlist: syslist,
          termlist:
            resAttr.bpmDto.termlist.length > 0
              ? resAttr.bpmDto.termlist
              : [{ term: '', termdetail: '' }],
          rulename: !resAttr.bpmDto.modelInstitution
            ? ''
            : resAttr.bpmDto.modelInstitution.name,
          rulecode: !resAttr.bpmDto.modelInstitution
            ? ''
            : resAttr.bpmDto.modelInstitution.code,
          ruleperson: !resAttr.bpmDto.modelInstitution
            ? []
            : resAttr.bpmDto.modelInstitution.editor,
          ruler: !resAttr.bpmDto.modelInstitution
            ? []
            : resAttr.bpmDto.modelInstitution.liaisons,
          ruledesc: !resAttr.bpmDto.modelInstitution
            ? ''
            : resAttr.bpmDto.modelInstitution.description,
          rulereason: !resAttr.bpmDto.modelInstitution
            ? ''
            : resAttr.bpmDto.modelInstitution.reason,
          ruleid: !resAttr.bpmDto.modelInstitution
            ? ''
            : resAttr.bpmDto.modelInstitution.id
        })
        this.rebackDataOther = JSON.parse(
          JSON.stringify(
            Object.assign({}, this.rebackDataOther, this.attrsForm)
          )
        )
        this.rebackData = JSON.parse(
          JSON.stringify(Object.assign({}, this.rebackData, this.syspart))
        )
        console.log(this.attrsForm)
      })
    },
    // 重置表单
    resetCard() {
      this.$confirm('确认要重置已填写的一些信息吗?', this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          this.attrsForm = Object.assign({}, this.attrsForm, {
            effectTime: '',
            nextTime: '',
            desc: '',
            target: '',
            fitscope: '',
            termlist: [
              {
                term: '',
                termdetail: ''
              }
            ]
          })
          this.processcode = ''
        })
        .catch(err => {
          console.log('重置')
        })
    },
    // 保存流程卡片
    saveProcessCard(type, fn) {
      let self = this
      let syslist = []
      this.$refs.attrsFormRef.validate(async valid => {
        if (valid) {
          if (!!this.attrsForm.nextTime && !!this.attrsForm.effectTime) {
            if (
              new Date(this.attrsForm.nextTime) <
              new Date(this.attrsForm.effectTime)
            ) {
              this.$message({
                message: '下次修改时间不得小于生效日期!',
                type: 'warning'
              })
              return false
            }
          }
          // 处理体系分类的数据--------------------------------开始
          for (let obj of Object.entries(this.syspart)) {
            if (obj[1].show) {
              console.log(11121212)
              for (let i = 0; i < obj[1].selected.length; i++) {
                syslist.push(
                  Object.assign({}, obj[1].selected[i], {
                    description: obj[1].desc
                  })
                )
              }
              for (let i = 0; i < obj[1].uploaded.length; i++) {
                syslist.push(
                  Object.assign({}, obj[1].uploaded[i], {
                    description: obj[1].desc
                  })
                )
              }
              let count = 0
              syslist.forEach(item => {
                if (item.typename === obj[0]) {
                  count++
                }
              })
              if (!count) {
                syslist.push({
                  attatchid: null,
                  description: obj[1].desc,
                  docid: null,
                  id: null,
                  listid: self.modelid,
                  name: null,
                  typename: obj[0]
                })
              }
            }
          }
          for (let i = 0; i < syslist.length; i++) {
            if (syslist[i].type) {
              delete syslist[i].type
            }
          }

          // 处理体系分类的数据--------------------------------结束

          // 处理流程卡片的文件保存到流程支持文件--------------------------------开始
          // let storeSupport = []
          // for (let i = 0; i < filetypes.length; i++) {
          //   if (!!this.syspart[filetypes[i].label] && (!!this.syspart[filetypes[i].label].selected.length || !!this.syspart[filetypes[i].label].uploaded.length)) {
          //     let selected = []
          //     this.syspart[filetypes[i].label].selected.forEach(item => {
          //       if (item.filetype === "new") {
          //         selected.push(item)
          //       }
          //     })
          //     let uploaded = []
          //     this.syspart[filetypes[i].label].uploaded.forEach(item => {
          //       if (item.filetype === "new") {
          //         uploaded.push(item)
          //       }
          //     })
          //     if (!!selected.length || !!uploaded.length) {
          //       storeSupport.push({
          //         description: '',
          //         docs: selected.concat(uploaded).map(item => { return {name: !item.newName ? item.name:item.newName, docid: item.docid}}),
          //         folderid: filetypes[i].id,
          //         modelid: this.modelid
          //       })
          //     }
          //   }
          // }
          // // 保存新增的流程输入文件
          // let newaddinputFile = []
          // this.attrsForm.processFileInput.forEach(item => {
          //   if (item.filetype === "new") {
          //     newaddinputFile.push(item)
          //   }
          // })
          // // 保存新增的流程输出文件
          // let newaddoutputFile = []
          // this.attrsForm.processFileOutput.forEach(item => {
          //   if (item.filetype === "new") {
          //     newaddoutputFile.push(item)
          //   }
          // })

          // for (let i = 0; i < filetypes.length; i ++) {
          //   if (filetypes[i].label === "流程输入文件" && !!newaddinputFile.length) {
          //     storeSupport.push({
          //       description: '',
          //       docs: newaddinputFile.map(item => { return {name: !item.newName ? item.name:item.newName, docid: item.docid}}),
          //       folderid: filetypes[i].id,
          //       modelid: this.modelid
          //     })
          //   } else if (filetypes[i].label === "流程输出文件" && !!newaddoutputFile.length) {
          //     storeSupport.push({
          //       description: '',
          //       docs: newaddoutputFile.map(item => { return {name: !item.newName ? item.name:item.newName, docid: item.docid}}),
          //       folderid: filetypes[i].id,
          //       modelid: this.modelid
          //     })
          //   }
          // }
          // if (storeSupport.length > 0) {
          //   this.savesupportsfile(storeSupport)
          // }
          // 处理流程卡片的文件保存到流程支持文件--------------------------------结束
          // 保存卡片的信息功能=========保存
          console.log(this.attrsForm)
          console.log(this.attrsForm.effectTime)
          console.log(this.attrsForm.nextTime)
          console.log(JSON.parse(this.attrsForm.distribution))
          let res = await processSaveAttr({
            bpo: this.attrsForm.processid,
            bponame: this.attrsForm.processowner,
            code: this.attrsForm.code,
            description: this.attrsForm.desc,
            effectiveon: this.attrsForm.effectTime,
            id: this.attrsForm.id,
            input: this.attrsForm.processInputDesc,
            inputlist: this.attrsForm.processFileInput.concat(
              this.attrsForm.processUpInput
            ),
            inputname: this.attrsForm.upStream
              .map(item => {
                return item.id
              })
              .join(','),
            invalidon: this.attrsForm.nextTime,
            listid: self.modelid,
            modelid: self.modelid,
            name: this.attrsForm.processname,
            organization: (JSON.parse(this.attrsForm.distribution) && JSON.parse(this.attrsForm.distribution)
              .orglist.length > 0) ? JSON.parse(this.attrsForm.distribution)
                .orglist.map(item => {
                  return item.id
                })
                .join(',') : '',
            orgname: (JSON.parse(this.attrsForm.distribution) && JSON.parse(this.attrsForm.distribution)
              .orglist.length > 0) ? JSON.parse(this.attrsForm.distribution)
                .orglist.map(item => {
                  return item.name
                })
                .join(',') : '',
            distribution: this.attrsForm.distribution,
            orgstate: this.attrsForm.orgstate,
            codistribution: this.attrsForm.codistribution,
            coorgstate: this.attrsForm.coorgstate,
            output: this.attrsForm.processOutputDesc,
            outputlist: this.attrsForm.processFileOutput.concat(
              this.attrsForm.processchartOutput
            ),
            outputname: this.attrsForm.downStream
              .map(item => {
                return item.id
              })
              .join(','),
            purpose: this.attrsForm.target,
            scope: this.attrsForm.fitscope,
            signer: this.userid,
            signername: this.username,
            syslist: syslist,
            termlist: this.attrsForm.termlist,
            version: this.attrsForm.versions,
            modelInstitution: {
              id: this.attrsForm.ruleid,
              name: this.attrsForm.rulename,
              code: this.attrsForm.rulecode,
              editor: this.attrsForm.ruleperson,
              liaisons: this.attrsForm.ruler,
              description: this.attrsForm.ruledesc,
              reason: this.attrsForm.rulereason,
              listid: self.modelid
            }
          })
          console.log(res)
          if (!res) return false
          if (type === 'save') {
            this.$message({
              message: '保存成功!',
              type: 'success'
            })
            this.rebackDataOther = JSON.parse(
              JSON.stringify(
                Object.assign({}, this.rebackDataOther, this.attrsForm)
              )
            )
            this.rebackData = JSON.parse(
              JSON.stringify(Object.assign({}, this.rebackData, this.syspart))
            )
          } else {
            if (fn) {
              fn({ type: true, value: res })
            }
          }
        } else {
          this.$message({
            message: '流程基本属性必填字段不能为空!',
            type: 'warning'
          })
          if (fn) {
            fn({ type: false })
          }
          return false
        }
      })
    },
    closeModal(done) {
      if (
        JSON.stringify(this.rebackData) === JSON.stringify(this.syspart) &&
        JSON.stringify(this.rebackDataOther) === JSON.stringify(this.attrsForm)
      ) {
        this.$emit('close', {
          type: 'close',
          data: ''
        })
        done()
      } else {
        this.$confirm(
          '您编辑的流程基本属性的信息未保存, 确定要关闭弹出框吗?',
          this.$t('hintText.hint'),
          {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          }
        )
          .then(() => {
            this.$emit('close', {
              type: 'close',
              data: ''
            })
            done()
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 绘图
    async paintChart() {
      let self = this
      console.log(this.bpmid)
      console.log(this.modelid)
      this.$confirm('是否保存?', this.$t('hintText.hint'), {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })
        .then(() => {
          this.saveProcessCard('paint', res => {
            console.log(res)
            if (res.type) {
              self.isDialogsVisible = false
              self.$emit('close', {
                type: 'paint',
                data: res.value
              })
            }
          })
        })
        .catch(() => {
          if (!this.bpmid) {
            this.saveProcessCard('paint', res => {
              console.log(res)
              if (res.type) {
                self.isDialogsVisible = false
                self.$emit('close', {
                  type: 'paint',
                  data: res.value
                })
              }
            })
          } else {
            self.isDialogsVisible = false
            self.$emit('close', {
              type: 'paint',
              data: [this.bpmid, this.modelid].join(',')
            })
          }
        })
    },
    handleCurrentChange(value) {
      console.log(value)
      this.processlistpage = value
      this.getList()
    },
    confirmDistribution(obj) {
      console.log(obj)
      this.distribution.bpmDto.orgstate = obj.sendState
      this.distribution.bpmDto.distribution = obj.orginalChecktion
      this.attrsForm.distribution = obj.orginalChecktion
      this.attrsForm.orgstate = obj.sendState
    },
    confirmCoDistribution(obj) {
      console.log(obj)
      this.codistribution.bpmDto.coorgstate = obj.sendState
      this.codistribution.bpmDto.codistribution = obj.orginalChecktion
      this.attrsForm.codistribution = obj.orginalChecktion
      this.attrsForm.coorgstate = obj.sendState
    },
    confirmprocess(arr) {
      if (this.refertype === 'upstream') {
        this.attrsForm.upStream = JSON.parse(JSON.stringify(arr))
      } else {
        this.attrsForm.downStream = JSON.parse(JSON.stringify(arr))
      }
    },
    delProcess(str, item) {
      for (let i = 0; i < this.attrsForm[str].length; i++) {
        if (this.attrsForm[str][i].id === item.id) {
          this.attrsForm[str].splice(i, 1)
          break
        }
      }
      console.log(this.attrsForm[str])
    },
    selectprocessfile(type) {
      this.isinoutVisible = true
      this.selectReferType = type
      this.selectInoutform = {
        desc: '',
        disabledfiles: [],
        files: []
      }
      let attrsForm = JSON.parse(JSON.stringify(this.attrsForm))
      if (type === 'processInput') {
        this.selectInoutform = {
          desc: attrsForm.processInputDesc,
          disabledfiles: attrsForm.processUpInput,
          files: attrsForm.processFileInput
        }
      } else if (type === 'processOutput') {
        this.selectInoutform = {
          desc: attrsForm.processOutputDesc,
          disabledfiles: attrsForm.processchartOutput,
          files: attrsForm.processFileOutput
        }
      }
    },
    saveInoutFiles() {
      let selectInoutform = JSON.parse(JSON.stringify(this.selectInoutform))
      if (this.selectReferType === 'processInput') {
        this.attrsForm.processInputDesc = selectInoutform.desc
        this.attrsForm.processUpInput = selectInoutform.disabledfiles
        this.attrsForm.processFileInput = selectInoutform.files
      } else if (this.selectReferType === 'processOutput') {
        this.attrsForm.processOutputDesc = selectInoutform.desc
        this.attrsForm.processchartOutput = selectInoutform.disabledfiles
        this.attrsForm.processFileOutput = selectInoutform.files
      }
      this.isinoutVisible = false
    },
    delSelectFiles(item) {
      for (let i = 0; i < this.selectInoutform.files.length; i++) {
        if (this.selectInoutform.files[i].id === item.id) {
          this.selectInoutform.files.splice(i, 1)
          break
        }
      }
    },
    // 体系分类的点击事件
    selectSysItem(item, index) {
      this.syspart[item].show = true
    },
    selectSysFile(item) {
      this.isGroupVisible = true
      this.selectReferType = item
    },
    confirmSyslist(item) {
      if (
        !this.syspart[item].desc &&
        this.syspart[item].selected.length === 0 &&
        this.syspart[item].uploaded.length === 0
      ) {
        this.$message({
          type: 'warning',
          message: '请填写描述或者上传一个附件!'
        })
        for (let i = 0; i < this.attrsForm.systemlist.length; i++) {
          if (this.attrsForm.systemlist[i] === item) {
            this.attrsForm.systemlist.splice(i, 1)
            break
          }
        }
        return false
      }
      if (this.attrsForm.systemlist.indexOf(item) > -1) return false
      this.attrsForm.systemlist.push(item)
      this.$set(this.syspart[item], 'show', true)
    },
    // 判断体系分类是否为空
    referSyslist(item) {
      if (
        !this.syspart[item].desc &&
        !this.syspart[item].selected.length &&
        !this.syspart[item].uploaded.length
      ) {
        for (let i = 0; i < this.attrsForm.systemlist.length; i++) {
          if (this.attrsForm.systemlist[i] === item) {
            this.attrsForm.systemlist.splice(i, 1)
            break
          }
        }
      }
    },
    // 清除
    delSyslist(item) {
      this.$confirm('确认要清除该体系分类信息?', this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$set(
            this.syspart,
            item,
            Object.assign({}, this.syspart[item], {
              show: false,
              desc: '',
              selected: [],
              uploaded: []
            })
          )
          for (let i = 0; i < this.attrsForm.systemlist.length; i++) {
            if (this.attrsForm.systemlist[i] === item) {
              this.attrsForm.systemlist.splice(i, 1)
              break
            }
          }
          this.$message({
            type: 'success',
            message: '清除成功!'
          })
        })
        .catch(() => {})
    },
    // 删除文件
    delsys(str, item, index) {
      this.syspart[str][item].splice(index, 1)
      this.referSyslist(str)
      this.requireDelFile([item], item)
    },
    // 保存到流程支持文件中
    savesupportsfile(lists) {
      saveFile({
        doclist: lists
      }).then(res => {
        console.log('保存流程支持文件成功')
      })
    },
    savesupport() {
      let self = this
      this.$refs.supportRef.validate(valid => {
        if (valid) {
          saveFile({
            doclist: [
              {
                description: this.supportform.remarks,
                docs: this.supportform.supportFile,
                folderid: this.supportform.fileType,
                modelid: this.modelid
              }
            ]
          }).then(res => {
            console.log(res)
            this.$message({
              message: '添加成功!',
              type: 'success'
            })
            this.getSupportFile(1)
            self.isFileVisible = false
          })
        } else {
          this.$message({
            message: '备注或者附件不能为空!',
            type: 'warning'
          })
          return false
        }
      })
    },
    // 相关性支撑内容
    getCorrelationSupport() {},
    handlerSelect(obj) {
      let self = this
      console.log(111)
      obj.uploadfiles.map(item => {
        if (
          this.selectReferType === 'processInput' ||
          this.selectReferType === 'processOutput'
        ) {
          this.selectInoutform.files.push({
            attatchid: item.id,
            description: self.selectInoutform.desc,
            docid: item.id,
            id: item.id,
            inouttype: '卡片',
            listid: self.modelid,
            name: item.newName,
            newName: item.newName,
            typename: self.selectReferType === 'processInput' ? '输入' : '输出',
            type: 'upload',
            filetype: 'new'
          })
        } else {
          this.syspart[self.selectReferType].selected.push({
            attatchid: item.id,
            description: self.syspart[self.selectReferType].desc,
            docid: item.id,
            id: item.id,
            listid: self.modelid,
            name: item.newName,
            typename: self.selectReferType,
            type: 'upload',
            filetype: 'new'
          })
        }
      })
      obj.selectedList.map(item => {
        if (
          this.selectReferType === 'processInput' ||
          this.selectReferType === 'processOutput'
        ) {
          let count = 0
          for (let i = 0; i < this.selectInoutform.files.length; i++) {
            let temp = this.selectInoutform.files[i]
            if (temp.id === item.id) {
              count++
            }
          }
          if (!count) {
            this.selectInoutform.files.push({
              attatchid: item.docid,
              description: self.selectInoutform.desc,
              docid: item.docid,
              id: item.id,
              inouttype: '卡片',
              listid: self.modelid,
              newName: item.name,
              name: item.name,
              typename:
                self.selectReferType === 'processInput' ? '输入' : '输出',
              filetype: 'new'
            })
          }
        } else {
          let count = 0
          for (
            let i = 0;
            i < this.syspart[self.selectReferType].selected.length;
            i++
          ) {
            let temp = this.syspart[self.selectReferType].selected[i]
            if (temp.id === item.id) {
              count++
            }
          }
          if (!count) {
            this.syspart[self.selectReferType].selected.push({
              attatchid: item.docid,
              description: self.syspart[self.selectReferType].desc,
              docid: item.docid,
              id: item.id,
              listid: self.modelid,
              name: item.name,
              typename: self.selectReferType,
              filetype: 'new'
            })
          }
        }
      })
    },
    // 获取需要调用删除接口的文件
    requireDelFile(arr, type) {
      arr.forEach(item => {
        if (type === 'selected') {
          let count = 0
          for (let i = 0; i < this.storeDeletefile.document.length; i++) {
            let temp = this.storeDeletefile.document[i]
            if (temp.id == item.id) {
              count++
              break
            }
          }
          if (!count) {
            this.storeDeletefile.document.push(item)
          }
        } else {
          let count = 0
          for (let i = 0; i < this.storeDeletefile.modeldoc.length; i++) {
            let temp = this.storeDeletefile.modeldoc[i]
            if (temp.id == item.id) {
              count++
              break
            }
          }
          if (!count) {
            this.storeDeletefile.modeldoc.push(item)
          }
        }
      })
    },
    // 删除document接口的文件
    async deletefile(ids) {
      let res = await deluploadFile(ids)
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.subTitle {
  width: 110px;
  text-align: right;
  margin-bottom: 10px;
  font-size: 16px;
}
/*附件部分*/
.showFiles {
  span {
    line-height: 18px;
    padding: 3px 20px 3px 8px;
    border: 1px solid #519eff;
    display: inline-block;
    vertical-align: top;
    max-width: 130px;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &.alink span {
    padding-right: 35px;
  }
  &.commonpadding span {
    padding: 3px 8px;
  }
  &.commonpadding.alink span {
    padding-right: 20px;
  }
  a:nth-of-type(2) {
    position: absolute;
    right: 17px;
    top: 5px;
  }
  &.commonpadding.alink a:nth-of-type(2) {
    position: absolute;
    right: 5px;
    top: 3px;
  }
  i {
    position: absolute;
    right: 3px;
    top: 5px;
    color: $ico;
  }
  &.processCommon i {
    top: 6px;
  }
}

.minHeight28 {
  min-height: 28px;
}
.minHeight35 {
  min-height: 35px;
}

/*流程卡片*/
.processCard {
  /deep/ .el-input {
    height: 28px;
    vertical-align: top;
  }
  .slotTitle {
    position: absolute;
    top: 13px;
    right: 35px;
    z-index: 999;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-tabs.el-tabs--top {
    box-shadow: none;
    border: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .systemCard {
    float: left;
    .el-card__header {
      .el-button {
        padding: 3px 0;
      }
    }
    .header {
      height: 18px;
      overflow: hidden;
    }
    .h220px {
      height: 220px;
      overflow: auto;
    }
  }
  .syslist {
    display: inline-block;
    border: 1px solid #dcdfe6;
    vertical-align: top;
    padding: 0 8px;
    margin-left: -1px;
    cursor: pointer;
  }
  .syslist:hover {
    color: #409eff;
  }
  .syslist.active {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    border-left: 1px solid #dcdfe6;
  }
  .syslist.active:hover {
    color: #fff;
  }
  span.syslist:nth-of-type(1) {
    border-radius: 4px 0 0 4px;
  }
  span.syslist:nth-last-of-type(1) {
    border-radius: 0 4px 4px 0;
  }
}

/*流程支持文件*/
.supportDialog {
  .el-dialog__header {
    .el-button {
      padding: 0 8px;
      margin-right: 15px;
    }
  }
}
</style>
