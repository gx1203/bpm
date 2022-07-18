<template>
  <div class="w100">
    <el-dialog
      class="processCard"
      :visible.sync="isDialogsVisible"
      :before-close="closeModal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template slot="title">
        <p class="slotTitle">
          <el-button class="no-border" size="large" type="text" @click="paintChart" v-show="editableTabsValue == 0">绘图</el-button>
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
            <el-form
              label-width="110px"
              label-position="right"
              ref="attrsFormRef"
              :model="attrsForm"
              :rules="attrsRules"
            >
              <el-row :gutter="10">
                <!-- 流程名称 -->
                <el-col :span="12" v-if="existTabField('c_processName', 'refer')">
                  <el-form-item :label="existTabField('c_processName')" prop="processname">
                    <el-input v-model="attrsForm.processname" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 版本 -->
                <el-col :span="12" v-if="existTabField('c_versions', 'refer')">
                  <el-form-item :label="existTabField('c_versions')" prop="versions">
                    <el-input v-model="attrsForm.versions" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="existTabField('c_processLevel', 'refer')">
                  <el-form-item :label="existTabField('c_processLevel')" prop="level">
                    <el-input v-model="attrsForm.level" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="existTabField('c_processCoding', 'refer')">
                  <el-form-item :label="existTabField('c_processCoding')" prop="code">
                    <el-input v-model="attrsForm.code" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 生效日期 -->
                <el-col :span="12" v-if="existTabField('c_effectiveDate', 'refer')">
                  <el-form-item :label="existTabField('c_effectiveDate')" prop="effectTime">
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
                  <el-form-item :label="existTabField('nextRevisionTime')" prop="nextTime">
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
                <!-- 流程负责人 -->
                <el-col :span="12" v-if="existTabField('c_processResponsible', 'refer')">
                  <el-form-item :label="existTabField('c_processResponsible')" prop="processowner">
                    <el-input
                      v-model="attrsForm.processowner"
                      :title="attrsForm.processowner"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <!-- 流程编码 -->
                <el-col :span="12" v-if="existTabField('code_processCoding', 'refer')">
                  <el-form-item :label="existTabField('code_processCoding')">
                    <el-input v-model="processcode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 术语 -->
                <el-col :span="24" v-if="existTabField('c_terminology', 'refer')">
                  <el-form-item
                    :label="existTabField('c_terminology')"
                    class="label-height-auto"
                    prop="termlist"
                  >
                    <el-row
                      v-for="(obj, index) in attrsForm.termlist"
                      :key="index"
                      :class="{'margin-t5': index > 0}"
                    >
                      <el-col :span="5">
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
                      <el-col :span="16" class="padding-l10px">
                        <el-input v-model="obj.termdetail"></el-input>
                      </el-col>
                      <el-col :span="3" class="padding-l10px">
                        <el-button
                          class="margin-l15 float-r"
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
                <!-- 流程责任人 -->
                <el-col :span="12" v-if="existTabField('c_fictitiousPerson', 'refer')">
                  <el-form-item :label="existTabField('c_fictitiousPerson')" prop="singer">
                    <el-input v-model="attrsForm.singer" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 上级流程责任人 -->
                <el-col :span="12" v-if="existTabField('c_issuer', 'refer')">
                  <el-form-item :label="existTabField('c_issuer')" prop="upowner">
                    <el-input v-model="attrsForm.upowner" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="existTabField('c_processDescription', 'refer')">
                  <el-form-item :label="existTabField('c_processDescription')" prop="desc">
                    <el-input v-model="attrsForm.desc" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="existTabField('c_target', 'refer')">
                  <el-form-item :label="existTabField('c_target')" prop="target">
                    <el-input v-model="attrsForm.target" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="existTabField('c_scope', 'refer')">
                  <el-form-item :label="existTabField('c_scope')" prop="fitscope">
                    <el-input v-model="attrsForm.fitscope"></el-input>
                  </el-form-item>
                </el-col>
                <!-- 负责部门 -->
                <el-col :span="24" v-if="existTabField('c_organization', 'refer')">
                  <el-form-item :label="existTabField('c_organization')" prop="disScopeformat">
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
                <!-- 起点==================================================================== -->
                <el-col :span="12" v-if="existTabField('c_origin', 'refer')">
                  <el-form-item :label="existTabField('c_origin')" prop="startpoint">
                    <el-input v-model="attrsForm.startpoint" :title="attrsForm.startpoint" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- 终点================================================================================= -->
                <el-col :span="12" v-if="existTabField('c_endpoint', 'refer')">
                  <el-form-item :label="existTabField('c_endpoint')" prop="endpoint">
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
                <!-- 相关体系分类及标准条款 -->
                <el-col :span="24" v-if="existTabField('c_systemClassification', 'refer')">
                  <el-form-item :label="existTabField('c_systemClassification')" prop="systemlist">
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
                <el-col :span="8" class="systemCard margin-b10" v-for="system in syslistsRepeat" :key="system" v-show="syspart[system].show">
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
            </el-form>
          </div>
        </el-tab-pane>
        <!-- 流程支持文件 -->
        <el-tab-pane name="1" :label="existTab('1')" v-if="existTab('1','refer')">
          <div>
            <el-row class="margin-b15" v-if="existTabField('selectFile', 'refer')">
              <el-col :span="4" :offset="20" class="clear-fix">
                <el-button
                  class="float-r"
                  @click="resetsupport();isFileVisible = true"
                  type="primary"
                  icon="el-icon-plus"
                  plain
                >{{existTabField('selectFile','', true)}}</el-button>
              </el-col>
            </el-row>
            <el-table :data="supfilelist" class="main_tab">
              <el-table-column
                v-if="existTabField('number', 'refer')"
                :label="existTabField('ordinal','', true)"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('fileName', 'refer')"
                :label="existTabField('fileName','', true)"
              >
                <template slot-scope="scope">
                  <a :href="viewFile(scope.row.docid)" target="_blank">{{scope.row.name}}</a>
                  <a class="margin-l5" :href="downloadFile(scope.row.docid)" target="_blank">
                    
                  </a>
                </template>
              </el-table-column>
              <el-table-column
                v-if="existTabField('uploader', 'refer')"
                prop="createby"
                width="100"
                :label="existTabField('uploader','', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('uploadTime', 'refer')"
                prop="createon"
                width="200"
                :label="existTabField('uploadTime','', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('fileType', 'refer')"
                prop="foldername"
                width="120"
                :label="existTabField('fileType','', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('remarksDialog', 'refer')"
                prop="description"
                width="200"
                :label="existTabField('remarksDialog','', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('operation', 'refer')"
                width="80"
                :label="existTabField('operation','', true)"
              >
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.foldername === '其他流程相关文件'"
                    class="item"
                    effect="dark"
                    :content="$t('delete')"
                    placement="top"
                  >
                    <el-button
                      class="no-border"
                      icon="el-icon-delete"
                      type="text"
                      @click="delFile(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleSupportsChange"
              :current-page="supportspages.pageNum"
              layout="total, prev, pager, next, jumper"
              :total="supportspages.total"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- 流程绩效 -->
        <el-tab-pane name="2" :label="existTab('2')" v-if="existTab('2','refer')">
          <div>
            <el-row class="margin-b15">
              <el-col :span="6" :offset="18" class="clear-fix">
                <el-button
                  class="float-r margin-l10"
                  type="primary"
                  icon="el-icon-delete"
                  plain
                  :disabled="seltargetlist.length == 0"
                  @click="deltarget"
                >批量删除</el-button>
                <el-button
                  class="float-r"
                  v-if="existTabField('add', 'refer')"
                  @click="resetprocess(); isprocessVisible = true"
                  type="primary"
                  icon="el-icon-plus"
                  plain
                >{{existTabField('add', '', true)}}</el-button>
              </el-col>
            </el-row>
            <!-- 流程绩效 -->
            <el-table
              :data="processVallist"
              border
              class="main_tab"
              @selection-change="handletargetChange"
            >
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column
                v-if="existTabField('number', 'refer')"
                :label="existTabField('number', '', true)"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('kpiName', 'refer')"
                prop="name"
                width="80"
                :label="existTabField('kpiName', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('description', 'refer')"
                prop="description"
                :label="existTabField('description', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('target', 'refer')"
                prop="target"
                width="70"
                :label="existTabField('target', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('remarks', 'refer')"
                prop="remark"
                width="200"
                :label="existTabField('remarks', '', true)"
              ></el-table-column>
              <!-- <el-table-column width="120" :label="$t('operation')">
                <template slot-scope="scope">
                  <el-tooltip v-if="true" class="item" effect="dark" :content="$t('delete')" placement="top">
                    <el-button class="no-border" icon="el-icon-delete" type="text"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>-->
            </el-table>
            <el-pagination
              @current-change="handleProcessChange"
              :current-page="processpages.pageNum"
              layout="total, prev, pager, next, jumper"
              :total="processpages.total"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- 关键风险控制点 -->
        <el-tab-pane name="3" :label="existTab('3')" v-if="existTab('3','refer')">
          <div>
            <el-table :data="risklist" class="main_tab">
              <el-table-column
                v-if="existTabField('number', 'refer')"
                :label="existTabField('number', '', true)"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('riskIdentifier', 'refer')"
                prop="code"
                width="80"
                :label="existTabField('riskIdentifier', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('riskName', 'refer')"
                prop="kcpname"
                width="160"
                :label="existTabField('riskName', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('controlelement', 'refer')"
                prop="controlelement"
                :label="existTabField('controlelement', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('controlNum', 'refer')"
                prop="targetcomprate"
                width="80"
                :label="existTabField('controlNum', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('controlName', 'refer')"
                prop="processtarget"
                width="160"
                :label="existTabField('controlName', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('controlDemand', 'refer')"
                prop="risk"
                width="160"
                :label="existTabField('controlDemand', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('ownerdept', 'refer')"
                prop="sampleselect"
                width="160"
                :label="existTabField('ownerdept', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('formationAccording', 'refer')"
                prop="remark"
                width="160"
                :label="existTabField('formationAccording', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('testIvdence', 'refer')"
                prop="testprogram"
                width="160"
                :label="existTabField('testIvdence', '', true)"
              ></el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleKeyChange"
              :current-page="keypages.pageNum"
              layout="total, prev, pager, next, jumper"
              :total="keypages.total"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- 关键成功要素 -->
        <el-tab-pane name="4" :label="existTab('4')" v-if="existTab('4','refer')">
          <div>
            <el-table :data="successKeylist" class="main_tab">
              <el-table-column
                v-if="existTabField('number', 'refer')"
                :label="existTabField('number', '', true)"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('number', 'refer')"
                prop="code"
                width="80"
                :label="existTabField('number', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('ksfName', 'refer')"
                prop="kcpname"
                :label="existTabField('ksfName', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('elements', 'refer')"
                prop="controlelement"
                :label="existTabField('elements', '', true)"
              ></el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleSuccessChange"
              :current-page="successpages.pageNum"
              layout="total, prev, pager, next, jumper"
              :total="successpages.total"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- 业务规则 -->
        <el-tab-pane name="5" :label="existTab('5')" v-if="existTab('5','refer')">
          <div>
            <el-row class="margin-b15">
              <el-col :span="6" :offset="18" class="clear-fix">
                <el-button
                  class="float-r margin-l10"
                  type="primary"
                  icon="el-icon-delete"
                  plain
                  :disabled="selrulelist.length == 0"
                  @click="delRule"
                >批量删除</el-button>
                <el-button
                  class="float-r"
                  v-if="existTabField('addAttach', 'refer')"
                  @click="resetrules();isruleVisible = true"
                  type="primary"
                  icon="el-icon-plus"
                  plain
                >{{existTabField('addAttach', '', true)}}</el-button>
              </el-col>
            </el-row>
            <el-table :data="rulelist" class="main_tab" @selection-change="handleruleChange">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column
                v-if="existTabField('number', 'refer')"
                :label="existTabField('number', '', true)"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('rule', 'refer')"
                prop="rule"
                width="200"
                :label="existTabField('rule', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('file', 'refer')"
                :label="existTabField('file', '', true)"
              >
                <template slot-scope="scope">
                  <p class="showFiles commonpadding alink">
                    <span
                      class="margin-r5 margin-b5"
                      v-for="file in scope.row.attatch"
                      :key="file.id"
                    >
                      <a :href="viewFile(file.id)" target="_blank">{{file.name}}</a>
                      <a class="margin-l15" :href="downloadFile(file.id)" target="_blank">
                        
                      </a>
                    </span>
                  </p>
                </template>
              </el-table-column>
              <!-- <el-table-column width="120" :label="$t('operation')">
                <template slot-scope="scope">
                  <el-tooltip v-if="true" class="item" effect="dark" :content="$t('delete')" placement="top">
                    <el-button class="no-border" icon="el-icon-delete" type="text"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>-->
            </el-table>
            <el-pagination
              @current-change="handleRuleChange"
              :current-page="rulepages.pageNum"
              layout="total, prev, pager, next, jumper"
              :total="rulepages.total"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- 流程活动说明 -->
        <el-tab-pane name="6" :label="existTab('6')" v-if="existTab('6','refer')">
          <div>
            <el-table :data="infolist" class="main_tab">
              <el-table-column
                v-if="existTabField('number', 'refer')"
                :label="existTabField('number', '', true)"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('activityCodes', 'refer')"
                prop="index"
                width="80"
                :label="existTabField('activityCodes', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('activityName', 'refer')"
                prop="name"
                width="150"
                :label="existTabField('activityName', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('contentAndGuidance', 'refer')"
                prop="desc"
                width="200"
                :label="existTabField('contentAndGuidance', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('input', 'refer')"
                width="150"
                :label="existTabField('input', '', true)"
              >
                <template slot-scope="scope">
                  <p class="showFiles commonpadding alink">
                    <span v-for="input in scope.row.input" :key="input.id">
                      <a :href="viewFile(input.id)" target="_blank">{{input.newName}}</a>
                      <a class="margin-l15" :href="downloadFile(input.id)" target="_blank">
                        
                      </a>
                    </span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                v-if="existTabField('output', 'refer')"
                width="150"
                :label="existTabField('output', '', true)"
              >
                <template slot-scope="scope">
                  <p class="showFiles commonpadding alink">
                    <span v-for="output in scope.row.output" :key="output.id">
                      <a :href="viewFile(output.id)" target="_blank">{{output.newName}}</a>
                      <a class="margin-l15" :href="downloadFile(output.id)" target="_blank">
                        
                      </a>
                    </span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                v-if="existTabField('performingRoles', 'refer')"
                prop="SwimlaneName"
                width="150"
                :label="existTabField('performingRoles', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('positionOrganization', 'refer')"
                prop="DeptName"
                :label="existTabField('positionOrganization', '', true)"
              ></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <!-- 修订记录 -->
        <el-tab-pane name="7" :label="existTab('7')" v-if="existTab('7','refer')">
          <div>
            <el-table :data="recordlist" class="main_tab">
              <el-table-column
                v-if="existTabField('number', 'refer')"
                :label="existTabField('number', '', true)"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('theme', 'refer')"
                prop="subject"
                :label="existTabField('theme', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('processNodeName', 'refer')"
                prop="processnodename"
                width="200"
                :label="existTabField('processNodeName', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('approver', 'refer')"
                prop="username"
                width="80"
                :label="existTabField('approver', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('approvalTime', 'refer')"
                prop="approvaltime"
                width="150"
                :label="existTabField('approvalTime', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('appOperate', 'refer')"
                prop="approvaloperation"
                width="80"
                :label="existTabField('appOperate', '', true)"
              ></el-table-column>
              <el-table-column
                v-if="existTabField('remarks', 'refer')"
                prop="remark"
                width="200"
                :label="existTabField('remarks', '', true)"
              ></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 流程支持文件 -->
    <el-dialog
      class="supportDialog"
      :visible.sync="isFileVisible"
      :before-close="handlesupportClose"
    >
      <template slot="title">
        <div class="clear-fix">
          <span class="font14">添加支持文件</span>
          <el-button class="float-r" size="large" type="text" @click="savesupport">保存</el-button>
        </div>
      </template>
      <el-form
        label-width="110px"
        label-position="right"
        ref="supportRef"
        :model="supportform"
        :rules="supportsrules"
      >
        <el-form-item label="文件类型:" prop="fileType">
          <el-select v-model="supportform.fileType" :placeholder="$t('pleaseSelect')" disabled>
            <el-option
              v-for="item in filetypes"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="existTabField('comments', 'refer')"
          :label="existTabField('comments')"
          prop="remarks"
        >
          <el-input type="textarea" rows="5" resize="none" v-model="supportform.remarks"></el-input>
        </el-form-item>
        <el-form-item
          v-if="existTabField('attachmentDialog', 'refer')"
          :label="existTabField('attachmentDialog')"
          prop="supportFile"
        >
          <el-row>
            <el-col :span="20" class="minHeight28">
              <p class="showFiles processCommon">
                <span
                  class="margin-b5 margin-r5"
                  v-for="(item, index) in supportform.supportFile"
                  :key="item.docid"
                >
                  {{item.name}}
                  <i
                    class="el-icon-close cursor-pointer"
                    @click="delsupportFile(item, index)"
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

    <!-- 流程绩效 -->
    <el-dialog title="添加指标" :visible.sync="isprocessVisible">
      <el-form
        label-width="110px"
        label-position="right"
        ref="processRef"
        :model="targetform"
        :rules="targetrules"
      >
        <el-form-item
          v-if="existTabField('targetNameDialog', 'refer')"
          :label="existTabField('targetNameDialog')"
          prop="name"
        >
          <el-input v-model="targetform.name"></el-input>
        </el-form-item>
        <el-form-item
          v-if="existTabField('descDialog', 'refer')"
          :label="existTabField('descDialog')"
          prop="desc"
        >
          <el-input type="textarea" v-model="targetform.desc" rows="4" resize="none"></el-input>
        </el-form-item>
        <el-form-item
          v-if="existTabField('kpiValue', 'refer')"
          :label="existTabField('kpiValue')"
          prop="target"
        >
          <el-input type="number" v-model="targetform.target"></el-input>
        </el-form-item>
        <el-form-item
          v-if="existTabField('comments', 'refer')"
          :label="existTabField('comments')"
          prop="remarks"
        >
          <el-input type="textarea" rows="4" v-model="targetform.remarks" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isprocessVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="confirmProcess">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>

    <!-- 业务规则 -->
    <el-dialog title="添加业务规则" :visible.sync="isruleVisible">
      <el-form
        label-width="110px"
        label-position="right"
        ref="ruleRef"
        :model="ruleform"
        :rules="rulerules"
      >
        <el-form-item
          class="label-height-auto"
          v-if="existTabField('ruleDialog', 'refer')"
          :label="existTabField('ruleDialog')"
          prop="rule"
        >
          <el-input type="textarea" v-model="ruleform.rule" rows="6" resize="none"></el-input>
        </el-form-item>
        <el-form-item
          class="label-height-auto"
          v-if="existTabField('c_attachmentRule', 'refer')"
          :label="existTabField('c_attachmentRule')"
          prop="ruleFile"
        >
          <el-row>
            <el-col :span="20" class="minHeight28">
              <p class="showFiles processCommon">
                <span
                  class="margin-r10 margin-b10"
                  v-for="(item, index) in ruleform.ruleFile"
                  :key="item.id"
                >
                  {{item.name}}
                  <i
                    class="el-icon-close cursor-pointer"
                    @click="delRuleFile(item, index)"
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="isruleVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="saveRule">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>

    <!-- 添加附件 -->
    <select-file v-model="isGroupVisible" :pageId="forlderId" @confirm="handlerSelect"></select-file>

    <!-- 分发范围 -->
    <distribution :disData="distribution" v-model="isdisVisible" @confirm="confirmDistribution"></distribution>

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
  </div>
</template>
<script>
import distribution from "./distribution.vue";
import selectProcess from "./selectProcess.vue";
import distributionNew from "./distributionNew.vue"
import {
  processattrs,
  processStartOrEnd,
  processSaveAttr,
  getsupportFile,
  saveFile,
  delSupport,
  getprocessValue,
  saveTarget,
  delTarget,
  getRisk,
  getSuccessElement,
  getRulelist,
  saveRulefile,
  delRuleFile,
  getProcessInfo,
  getRecordlist,
  controlField,
  tabField,
  getSystemList
} from "@/bpa/api/processDesignCenter";
import { deluploadFile } from "@/bpa/api/common";
import { getTerminologyList } from "@/bpa/api/processModelCenter/terminology";
import fileOperation from "@/bpa/mixins/fileDownView";
import axios from "axios";

const filetypes = [
  {
    label: "流程输出文件",
    id: "7A88687D266A3D7CE053BF1A13ACD2C3"
  },
  {
    label: "其他流程相关文件",
    id: "7A88EC3856C446EBE053BF1A13ACC390"
  },
  {
    label: "输入",
    id: "7B4DBBED904B1C5DE053BF1A13AC64F1"
  },
  {
    label: "输出",
    id: "7B4DBBED904E1C5DE053BF1A13AC64F1"
  },
  {
    label: "QMS",
    id: "7B000C586A5D3A31E053BF1A13AC8D0A"
  },
  {
    label: "EMS",
    id: "7B000D65C18D3A0DE053BF1A13AC5F6B"
  },
  {
    label: "OHSAS",
    id: "7B000C586A603A31E053BF1A13AC8D0A"
  },
  {
    label: "EnMs",
    id: "7B3D9B5F12664172E053BF1A13AC131E"
  },
  {
    label: "业务规则",
    id: "7BC636EDF11967C0E0530701A8C06A7D"
  },
  {
    label: "流程输入文件",
    id: "6CCAFE3781CA4875E053BF1A13AC0E97"
  }
];

const syslists = ["QMS", "EMS", "OHSAS", "ISMS", "RMS", "EnMs"];
const syslistsname = {
  QMS: {
    cnname: "质量管理体系",
    enname: "Quality Management System"
  },
  EMS: {
    cnname: "环境管理体系",
    enname: "Environment Management System"
  },
  OHSAS: {
    cnname: "职业健康安全管理体系",
    enname: "Occupation Health Safety Management System"
  },
  ISMS: {
    cnname: "信息安全管理体系",
    enname: "Information Security Management System"
  },
  RMS: {
    cnname: "风险管理体系",
    enname: "Risk Management System"
  },
  EnMs: {
    cnname: "能源管理体系",
    enname: "Energy Management System"
  }
};

export default {
  name: "processCard",
  components: {
    distribution,
    selectProcess,
    distributionNew
  },
  data () {
    return {
      referClose: false,
      // 暂存后台返回的流程基本属性的数据
      rebackDataOther: {},
      rebackData: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      syslistsname: syslistsname,
      isDialogsVisible: false,
      isGroupVisible: false,
      isdisVisible: false,
      isSelectVisible: false,
      isinoutVisible: false,
      refertype: "upstream",
      processlists: [],
      distribution: {},
      attrsForm: {
        effectTime: "",
        nextTime: "",
        desc: "",
        target: "",
        fitscope: "",
        disScope: "",
        systemlist: [],
        termlist: [
          {
            term: "",
            termdetail: ""
          }
        ]
      },
      // 术语
      termlists: [],
      attrsRules: {
        effectTime: [{ required: true, message: " ", trigger: "blur" }],
        desc: [{ required: true, message: " ", trigger: "blur" }],
        target: [{ required: true, message: " ", trigger: "blur" }],
        fitscope: [{ required: true, message: " ", trigger: "blur" }],
        disScopeformat: [{ required: true, message: " ", trigger: "blur" }]
      },
      editableTabsValue: 0,
      editableTabs: [],
      selectProcessform: {},
      // 流程输入、流程输出部分
      selectReferType: "",
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
      forlderId: "",
      // 流程支持文件
      isFileVisible: false,
      supfilelist: [],
      supportspages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      supportDelFile: [],
      supportform: {
        fileType: "7A88EC3856C446EBE053BF1A13ACC390",
        remarks: "",
        supportFile: []
      },
      supportsrules: {
        fileType: [{ required: true, message: " ", trigger: "blur" }],
        remarks: [{ required: true, message: " ", trigger: "blur" }],
        supportFile: [{ required: true, message: " ", trigger: "blur" }]
      },
      // 文件类型
      filetypes,
      // 流程绩效
      isprocessVisible: false,
      processVallist: [],
      processpages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      targetform: {
        name: "",
        desc: "",
        target: "",
        remarks: ""
      },
      targetrules: {
        name: [{ required: true, message: " ", trigger: "blur" }],
        desc: [{ required: true, message: " ", trigger: "blur" }],
        target: [{ required: true, message: " ", trigger: "blur" }]
      },
      seltargetlist: [],
      // 关键风险控制点
      risklist: [],
      keypages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 关键成功要素
      successKeylist: [],
      successpages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 业务规则
      isruleVisible: false,
      rulelist: [],
      rulepages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      ruleform: {
        rule: "",
        ruleFile: []
      },
      rulerules: {
        rule: [{ required: true, message: " ", trigger: "blur" }],
        ruleFile: [{ required: true, message: " ", trigger: "blur" }]
      },
      selrulelist: [],
      // 流程活动说明
      infolist: [],
      // 修订记录
      recordlist: [],
      // 显示tablist
      showtabfiled: [],
      classificationSystem: []
    };
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    download() {
      return this.host + "/attach/download/";
    },
    viewfile() {
      return this.host + "/document/print/";
    },
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .name;
    },
    username() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .cnname;
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    modelid: {
      type: String,
      default: ""
    },
    treeId: {
      type: String,
      default: ""
    },
    bpmid: {
      type: String,
      default: ""
    },
    processcode:{
      type: String,
      default: ""
    }
  },
  async mounted () {
    let res = await this.getSystemList()
    let {syslists, obj, syslistsname} = res
    this.syslistsRepeat = syslists
    this.syslistsname = syslistsname
    this.syspart = obj
    console.log(this.syslists, this.syslistsname, this.syspart)
  },
  mixins: [fileOperation],
  watch: {
    value(val) {
      if (val) {
        this.referClose = false;
        this.isDialogsVisible = val;
        this.editableTabsValue = "0";
        this.getShowTablist().then(() => {
          this.tabsClick();
        });
      }
    },
    isDialogsVisible(val) {
      this.$emit("input", val);
    },
    "attrsForm.distribution"(val) {
      val = !val ? [] : JSON.parse(val).orglist;
      this.$set(
        this.attrsForm,
        "disScopeformat",
        val
          .map(item => {
            return item.name;
          })
          .join(",")
      );
      if (!this.referClose) {
        this.rebackDataOther.disScopeformat = val
          .map(item => {
            return item.name;
          })
          .join(",");
      }
    }
  },
  methods: {
    // 获取体系标准文件
    async getSystemList () {
      let res = await getSystemList({
        filters: [
          {
            key: "process_design_is_visible",
            opt: "EQ",
            type: "S",
            value: "Y"
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
        resolve({syslists: res, obj, syslistsname: objName})
      })
    },
    // tab切换
    tabsClick() {
      // console.log(this.editableTabsValue);
      switch (true) {
        // 获取流程基本属性
        case this.editableTabsValue === "0":
          if (!this.referClose) {
            this.getProcessAttr();
          }
          this.editableTabs.forEach(item => {
            if (item.index == 0) {
              this.getShowTabField(item.id, 0);
              return false;
            }
          });
          break;
        // 获取流程支持文件
        case this.editableTabsValue === "1":
          this.referClose = true;
          this.forlderId = "7A88EC3856C446EBE053BF1A13ACC390";
          this.getSupportFile();
          this.editableTabs.forEach(item => {
            if (item.index == 1) {
              this.getShowTabField(item.id, 1);
              return false;
            }
          });
          break;
        // 获取流程绩效
        case this.editableTabsValue === "2":
          this.referClose = true;
          this.getValuelist();
          this.editableTabs.forEach(item => {
            if (item.index == 2) {
              this.getShowTabField(item.id, 2);
              return false;
            }
          });
          break;
        // 获取关键风险控制点
        case this.editableTabsValue === "3":
          this.referClose = true;
          this.getRisklist();
          this.editableTabs.forEach(item => {
            if (item.index == 3) {
              this.getShowTabField(item.id, 3);
              return false;
            }
          });
          break;
        // 关键成功要素
        case this.editableTabsValue === "4":
          this.referClose = true;
          this.getSuccesslist();
          this.editableTabs.forEach(item => {
            if (item.index == 4) {
              this.getShowTabField(item.id, 4);
              return false;
            }
          });
          break;
        // 业务规则
        case this.editableTabsValue === "5":
          this.referClose = true;
          this.forlderId = "7BC636EDF11967C0E0530701A8C06A7D";
          this.getRule();
          this.editableTabs.forEach(item => {
            if (item.index === 5) {
              this.getShowTabField(item.id, 5);
              return false;
            }
          });
          break;
        // 流程活动说明
        case this.editableTabsValue === "6":
          this.referClose = true;
          this.getInfo();
          this.editableTabs.forEach(item => {
            if (item.index == 6) {
              this.getShowTabField(item.id, 6);
              return false;
            }
          });
          break;
        // 修订记录
        case this.editableTabsValue === "7":
          this.referClose = true;
          this.getRecord();
          this.editableTabs.forEach(item => {
            if (item.index == 7) {
              this.getShowTabField(item.id, 7);
              return false;
            }
          });
          break;
      }
    },
    // 获取Tab栏标题的显示字段的名称
    async getShowTablist() {
      let res = await controlField({
        attr: {},
        filters: [],
        logic: "and",
        orderby: "createon",
        pageNum: 1,
        pageSize: 100,
        sort: "desc"
      });
      this.editableTabs = [];
      res.list.forEach(item => {
        if (item.state == "1") {
          this.editableTabs.push({
            index: parseInt(item.sort),
            name: item.name,
            id: item.id
          });
          // console.log(this.editableTabs);
        }
      });
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    // 获取显示Tab字段的名称/表格内容
    async getShowTabField(id, type) {
      let res = await tabField({
        attr: {},
        filters: [{ key: "sheetid", opt: "LIKE", type: "S", value: id }],
        logic: "and",
        orderby: "createon",
        pageNum: 1,
        pageSize: 100,
        sort: "desc"
      });
      this.showtabfiled = [];
      res.list.forEach(item => {
        if (item.state == "1") {
          this.showtabfiled.push({
            name: item.name,
            pname: item.pname
          });
        }
      });
      if (type == 0) {
        this.syslists.forEach(item => {
          if (!this.showtabfiled.some((value, index) => value.pname == item)) {
            this.syslists.splice(this.syslists.indexOf(item), 1);
          }
        });
      }
    },
    existTab(index, type) {
      let obj = {};
      this.editableTabs.forEach(item => {
        if (item.index === parseInt(index)) {
          obj = JSON.parse(JSON.stringify(item));
          return false;
        }
      });
      if (type == "refer") {
        return !obj.index ? (obj.index === 0 ? true : false) : true;
      } else {
        return !obj.index ? (obj.index === 0 ? obj.name : "") : obj.name;
      }
    },
    existTabField(pname, type, bool) {
      let obj = {};
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item));
          return false;
        }
      });
      if (type == "refer") {
        return !obj.pname ? false : true;
      } else {
        return !obj.pname ? "" : obj.name + (!bool ? ":" : "");
      }
    },
    // 点击选择事件
    distributeClick() {
      this.isdisVisible = true;
    },
    // 术语部分
    reuqireDownData(bool) {
      if (bool) {
        getTerminologyList({
          filters: [{ key: "term", opt: "LIKE", type: "S", value: null }],
          orderby: "createon",
          pageNum: 1,
          pageSize: 999,
          sort: "desc"
        }).then(res => {
          this.termlists = res.list;
        });
      }
    },
    // 清除术语
    minusTerm(index) {
      this.attrsForm.termlist.splice(index, 1);
      this.$message({
        type: "success",
        message: "删除成功"
      });
    },
    // 添加术语
    plusTerm() {
      this.attrsForm.termlist.push({
        term: "",
        termdetail: ""
      });
    },
    handleCommand(data) {
      this.$set(
        this.attrsForm.termlist,
        data.pindex,
        Object.assign({}, this.attrsForm.termlist[data.pindex], {
          term: data.value.term,
          termdetail: data.value.termdetail
        })
      );
    },
    // 修改生效时间影响下次修改时间的
    changeEffectTime() {
      if (!this.attrsForm.nextTime) {
        let effectTime = new Date(this.attrsForm.effectTime);
        let nextTime =
          effectTime.getFullYear() +
          3 +
          "-" +
          (effectTime.getMonth() + 1) +
          "-" +
          effectTime.getDate();
        this.$set(this.attrsForm, "nextTime", nextTime);
      }
    },
    // 获取流程基本属性表格属性字段
    getProcessAttr() {
      let self = this;
      Promise.all([
        processattrs(self.modelid),
        processStartOrEnd(self.bpmid)
      ]).then(res => {
        console.log(res);
        let resAttr = res[0];
        let response = res[1];
        console.log(resAttr);
        console.log(response);
        this.distribution = resAttr;
        // -------------------起点&&终点------------开始
        let result = !response ? []:(!response.json ? [] : JSON.parse(response.json).controls);
        console.log(result)
        let lines = !response ? []:(!response.json ? [] : JSON.parse(response.json).lines);
        // 起点部分
        let startprocessId = [];
        let startprocess = [];
        // 终点部分
        let endprocessId = [];
        let endprocess = [];
        if (result) {
          result.forEach(function(obj) {
            if (obj.type == "processStart") {
              lines.forEach(function(line) {
                if (line.from === obj.id) {
                  startprocessId.push(line.to);
                }
              });
            }
            if (obj.type == "processEnd") {
              lines.forEach(function(line) {
                if (line.to === obj.id) {
                  endprocessId.push(line.from);
                }
              });
            }
          });
          for (var i = 0; i < startprocessId.length; i++) {
            for (var j = 0; j < result.length; j++) {
              var obj = result[j];
              if (startprocessId[i] == obj.id) {
                startprocess.push(obj.name);
              }
            }
          }
          for (var i = 0; i < endprocessId.length; i++) {
            for (var j = 0; j < result.length; j++) {
              var obj = result[j];
              if (endprocessId[i] == obj.id) {
                endprocess.push(obj.name);
              }
            }
          }
        }
        // -------------------起点&&终点------------结束

        // 清除体系分类数据
        for (let obj of Object.entries(this.syspart)) {
          this.syspart[obj[0]] = Object.assign({}, this.syspart[obj[0]], {
            show: false,
            desc: "",
            selected: [],
            uploaded: []
          });
        }
        let syslist = [];
        resAttr.bpmDto.syslist.forEach(item => {
          console.log(this.syslistsRepeat)
          if (this.syslistsRepeat.includes(item.typename)) {
            if (syslist.indexOf(item.typename) === -1) {
              syslist.push(item.typename);
            }
            this.syspart[item.typename].show = true;
            this.syspart[item.typename].desc = item.description;
            this.syspart[item.typename].selectedList = [];
            if (!!item.docid) {
              this.syspart[item.typename].uploaded.push(item);
            }
          }

        });
        // 对象合并
        let nextTime = "";
        if (!!resAttr.bpmDto.effectiveon) {
          let effectTime = new Date(resAttr.bpmDto.effectiveon);
          nextTime =
            effectTime.getFullYear() +
            3 +
            "-" +
            (effectTime.getMonth() + 1) +
            "-" +
            effectTime.getDate();
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
          nextTime: !resAttr.bpmDto.effectiveon ? "" : nextTime,
          processowner: resAttr.bpmDto.managerList
            .map(item => {
              return item.value;
            })
            .join(","),
          // 流程编码
          processcode: this.processcode,
          // 流程责任人
          singer: resAttr.bpmDto.signername,
          // 上级流程责任人
          upowner: resAttr.bpmDto.upmanagerList
            .map(item => {
              return item.value;
            })
            .join(","),
          desc: resAttr.bpmDto.description,
          target: resAttr.bpmDto.purpose,
          fitscope: resAttr.bpmDto.scope,
          distribution: resAttr.bpmDto.distribution,
          startpoint: startprocess.join(","),
          endpoint: endprocess.join(","),
          upStream: !resAttr.bpmDto.inputnamelist
            ? []
            : resAttr.bpmDto.inputnamelist,
          downStream: !resAttr.bpmDto.outputnamelist
            ? []
            : resAttr.bpmDto.outputnamelist,
          processInput:
            !!resAttr.bpmDto.input || !!resAttr.bpmDto.inputlist ? true : false,
          processInputDesc: resAttr.bpmDto.input,
          processUpInput: resAttr.bpmDto.inlist,
          processFileInput: resAttr.bpmDto.inputlist,
          processOutput:
            !!resAttr.bpmDto.output || !!resAttr.bpmDto.outputlist
              ? true
              : false,
          processOutputDesc: resAttr.bpmDto.output,
          processchartOutput: resAttr.bpmDto.outlist,
          processFileOutput: resAttr.bpmDto.outputlist,
          systemlist: syslist,
          termlist:
            resAttr.bpmDto.termlist.length > 0
              ? resAttr.bpmDto.termlist
              : [{ term: "", termdetail: "" }]
        });
        this.rebackDataOther = JSON.parse(
          JSON.stringify(
            Object.assign({}, this.rebackDataOther, this.attrsForm)
          )
        );
        this.rebackData = JSON.parse(
          JSON.stringify(Object.assign({}, this.rebackData, this.syspart))
        );
        console.log(this.attrsForm);
      });
    },
    // 重置表单
    resetCard() {
      this.$confirm("确认要重置已填写的一些信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.attrsForm = Object.assign({}, this.attrsForm, {
            effectTime: "",
            nextTime: "",
            desc: "",
            target: "",
            fitscope: "",
            termlist: [
              {
                term: "",
                termdetail: ""
              }
            ]
          });
          this.processcode = ''
        })
        .catch(err => {
          console.log("重置");
        });
    },
    // 保存流程卡片
    saveProcessCard(type, fn) {
      let self = this;
      let syslist = [];
      this.$refs.attrsFormRef.validate(async valid => {
        if (valid) {
          if (!!this.attrsForm.nextTime && !!this.attrsForm.effectTime) {
            if (
              new Date(this.attrsForm.nextTime) <
              new Date(this.attrsForm.effectTime)
            ) {
              this.$message({
                message: "下次修改时间不得小于生效日期!",
                type: "warning"
              });
              return false;
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
                );
              }
              for (let i = 0; i < obj[1].uploaded.length; i++) {
                syslist.push(
                  Object.assign({}, obj[1].uploaded[i], {
                    description: obj[1].desc
                  })
                );
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
            if (!!syslist[i].type) {
              delete syslist[i].type;
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
          console.log(this.attrsForm);
          console.log(this.attrsForm.effectTime);
          console.log(this.attrsForm.nextTime);
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
                return item.id;
              })
              .join(","),
            invalidon: this.attrsForm.nextTime,
            listid: self.modelid,
            modelid: self.modelid,
            name: this.attrsForm.processname,
            organization: JSON.parse(this.attrsForm.distribution)
              .orglist.map(item => {
                return item.id;
              })
              .join(","),
            orgname: JSON.parse(this.attrsForm.distribution)
              .orglist.map(item => {
                return item.name;
              })
              .join(","),
            distribution: this.attrsForm.distribution,
            orgstate: this.attrsForm.orgstate,
            output: this.attrsForm.processOutputDesc,
            outputlist: this.attrsForm.processFileOutput.concat(
              this.attrsForm.processchartOutput
            ),
            outputname: this.attrsForm.downStream
              .map(item => {
                return item.id;
              })
              .join(","),
            purpose: this.attrsForm.target,
            scope: this.attrsForm.fitscope,
            signer: this.userid,
            signername: this.username,
            syslist: syslist,
            termlist: this.attrsForm.termlist,
            version: this.attrsForm.versions
          });
          console.log(res);
          if (!res) return false
          if (type === "save") {
            this.$message({
              message: "保存成功!",
              type: "success"
            });
            this.rebackDataOther = JSON.parse(
              JSON.stringify(
                Object.assign({}, this.rebackDataOther, this.attrsForm)
              )
            );
            this.rebackData = JSON.parse(
              JSON.stringify(Object.assign({}, this.rebackData, this.syspart))
            );
          } else {
            if (fn) {
              fn({ type: true, value: res });
            }
          }
        } else {
          this.$message({
            message: "流程基本属性必填字段不能为空!",
            type: "warning"
          });
          if (fn) {
            fn({ type: false });
          }
          return false;
        }
      });
    },
    closeModal(done) {
      if (
        JSON.stringify(this.rebackData) === JSON.stringify(this.syspart) &&
        JSON.stringify(this.rebackDataOther) === JSON.stringify(this.attrsForm)
      ) {
        this.$emit("close", {
          type: "close",
          data: ""
        });
        done();
      } else {
        this.$confirm(
          "您编辑的流程基本属性的信息未保存, 确定要关闭弹出框吗?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.$emit("close", {
              type: "close",
              data: ""
            });
            done();
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 绘图
    async paintChart() {
      let self = this;
      this.saveProcessCard("paint", res => {
        console.log(res);
        if (res.type) {
          self.isDialogsVisible = false;
          self.$emit("close", {
            type: "paint",
            data: res.value
          });
        }
      });
    },
    handleCurrentChange(value) {
      console.log(value);
      this.processlistpage = value;
      this.getList();
    },
    confirmDistribution(obj) {
      console.log(obj);
      this.distribution.bpmDto.orgstate = obj.sendState;
      this.distribution.bpmDto.distribution = obj.orginalChecktion;
      this.attrsForm.distribution = obj.orginalChecktion;
      this.attrsForm.orgstate = obj.sendState;
    },
    confirmprocess(arr) {
      if (this.refertype === "upstream") {
        this.attrsForm.upStream = JSON.parse(JSON.stringify(arr));
      } else {
        this.attrsForm.downStream = JSON.parse(JSON.stringify(arr));
      }
    },
    delProcess(str, item) {
      for (let i = 0; i < this.attrsForm[str].length; i++) {
        if (this.attrsForm[str][i].id === item.id) {
          this.attrsForm[str].splice(i, 1)
          break
        }
      }
      console.log(this.attrsForm[str]);
    },
    selectprocessfile(type) {
      this.isinoutVisible = true;
      this.selectReferType = type;
      this.selectInoutform = {
        desc: "",
        disabledfiles: [],
        files: []
      };
      let attrsForm = JSON.parse(JSON.stringify(this.attrsForm));
      if (type === "processInput") {
        this.selectInoutform = {
          desc: attrsForm.processInputDesc,
          disabledfiles: attrsForm.processUpInput,
          files: attrsForm.processFileInput
        };
      } else if (type === "processOutput") {
        this.selectInoutform = {
          desc: attrsForm.processOutputDesc,
          disabledfiles: attrsForm.processchartOutput,
          files: attrsForm.processFileOutput
        };
      }
    },
    saveInoutFiles() {
      let selectInoutform = JSON.parse(JSON.stringify(this.selectInoutform));
      if (this.selectReferType === "processInput") {
        this.attrsForm.processInputDesc = selectInoutform.desc;
        this.attrsForm.processUpInput = selectInoutform.disabledfiles;
        this.attrsForm.processFileInput = selectInoutform.files;
      } else if (this.selectReferType === "processOutput") {
        this.attrsForm.processOutputDesc = selectInoutform.desc;
        this.attrsForm.processchartOutput = selectInoutform.disabledfiles;
        this.attrsForm.processFileOutput = selectInoutform.files;
      }
      this.isinoutVisible = false;
    },
    delSelectFiles(item) {
      for (let i = 0; i < this.selectInoutform.files.length; i++) {
        if (this.selectInoutform.files[i].id === item.id) {
          this.selectInoutform.files.splice(i, 1);
          break;
        }
      }
    },
    // 体系分类的点击事件
    selectSysItem(item, index) {
      this.syspart[item].show = true;
    },
    selectSysFile(item) {
      this.isGroupVisible = true;
      this.selectReferType = item;
    },
    confirmSyslist(item) {
      if (
        !this.syspart[item].desc &&
        this.syspart[item].selected.length === 0 &&
        this.syspart[item].uploaded.length === 0
      ) {
        this.$message({
          type: "warning",
          message: "请填写描述或者上传一个附件!"
        });
        for (let i = 0; i < this.attrsForm.systemlist.length; i++) {
          if (this.attrsForm.systemlist[i] === item) {
            this.attrsForm.systemlist.splice(i, 1);
            break;
          }
        }
        return false;
      }
      if (this.attrsForm.systemlist.indexOf(item) > -1) return false;
      this.attrsForm.systemlist.push(item);
      this.$set(this.syspart[item], "show", true);
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
            this.attrsForm.systemlist.splice(i, 1);
            break;
          }
        }
      }
    },
    // 清除
    delSyslist(item) {
      this.$confirm("确认要清除该体系分类信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$set(
            this.syspart,
            item,
            Object.assign({}, this.syspart[item], {
              show: false,
              desc: "",
              selected: [],
              uploaded: []
            })
          );
          for (let i = 0; i < this.attrsForm.systemlist.length; i++) {
            if (this.attrsForm.systemlist[i] === item) {
              this.attrsForm.systemlist.splice(i, 1);
              break;
            }
          }
          this.$message({
            type: "success",
            message: "清除成功!"
          });
        })
        .catch(() => {});
    },
    // 删除文件
    delsys(str, item, index) {
      this.syspart[str][item].splice(index, 1);
      this.referSyslist(str);
      this.requireDelFile([item], item);
    },
    // 获取流程支持文件
    getSupportFile(pageNum) {
      getsupportFile({
        attr: {},
        filters: [{ key: "modelid", value: this.modelid }],
        orderby: "createon",
        pageNum: !pageNum ? 1 : pageNum,
        pageSize: 10,
        sort: "desc"
      }).then(res => {
        console.log(res);
        this.supfilelist = res.list;
        this.supportspages.total = res.total;
      });
    },
    handleSupportsChange(val) {
      this.supportspages.pageNum = val;
      this.getSupportFile(val);
    },
    delsupportFile(item, index) {
      this.supportform.supportFile.splice(index, 1);
      if (!!item.type && item.type === "upload") {
        this.supportDelFile.push(item.docid);
      }
    },
    // 保存到流程支持文件中
    savesupportsfile(lists) {
      saveFile({
        doclist: lists
      }).then(res => {
        console.log("保存流程支持文件成功");
      });
    },
    // 弹出框关闭
    async handlesupportClose(done) {
      let self = this;
      if (self.supportDelFile.length > 0) {
        let res = await this.deletefile(self.supportDelFile.join(","));
      }
      done();
    },
    savesupport() {
      let self = this;
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
            console.log(res);
            this.$message({
              message: "添加成功!",
              type: "success"
            });
            this.getSupportFile(1);
            self.isFileVisible = false;
          });
        } else {
          this.$message({
            message: "备注或者附件不能为空!",
            type: "warning"
          });
          return false;
        }
      });
    },
    delFile(item) {
      console.log(item);
      this.$confirm("确认要删除该文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await delSupport(item.id);
          let res2 = await deluploadFile(item.docid);
          this.getSupportFile(this.supportspages.pageNum);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    resetsupport() {
      this.supportform = {
        fileType: "7A88EC3856C446EBE053BF1A13ACC390",
        remarks: "",
        supportFile: []
      };
    },
    // 获取流程绩效
    getValuelist(pageNum) {
      getprocessValue({
        filters: [{ key: "listid", value: this.modelid }],
        orderby: "createon",
        pageNum: !pageNum ? 1 : pageNum,
        pageSize: 10,
        sort: "desc"
      }).then(res => {
        console.log(res);
        this.processVallist = res.list;
        this.processpages.total = res.total;
      });
    },
    handleProcessChange(val) {
      this.processpages.pageNum = val;
      this.getValuelist(val);
    },
    confirmProcess() {
      let self = this;
      this.$refs.processRef.validate(async valid => {
        if (valid) {
          let res = await saveTarget({
            description: this.targetform.desc,
            listid: this.modelid,
            name: this.targetform.name,
            remark: this.targetform.remarks,
            target: this.targetform.target
          });
          console.log(res);
          if (res) {
            self.isprocessVisible = false;
            this.$message({
              message: "添加成功!",
              type: "success"
            });
            this.getValuelist(1);
          }
        } else {
          this.$message({
            message: "必填项不能为空!",
            type: "warning"
          });
        }
      });
    },
    resetprocess() {
      this.targetform = {
        name: "",
        desc: "",
        target: "",
        remarks: ""
      };
    },
    handletargetChange(val) {
      this.seltargetlist = val;
    },
    deltarget() {
      let arr = this.seltargetlist.map(item => {
        return item.id;
      });
      this.$confirm("确认要删除选中的绩效吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await delTarget(arr.join(","));
          this.getValuelist(this.processpages.pageNum);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    // 获取关键风险控制点
    getRisklist(pageNum) {
      getRisk({
        filters: [{ key: "listid", value: this.modelid }],
        orderby: "code",
        pageNum: !pageNum ? 1 : pageNum,
        pageSize: 10,
        sort: "asc"
      }).then(res => {
        console.log(res);
        this.risklist = res.list;
        this.keypages.total = res.total;
      });
    },
    handleKeyChange(val) {
      this.keypages.pageNum = val;
      this.getRisklist(val);
    },
    // 获取关键成功要素
    getSuccesslist(pageNum) {
      getSuccessElement({
        filters: [{ key: "listid", value: this.modelid }],
        orderby: "code",
        pageNum: !pageNum ? 1 : pageNum,
        pageSize: 10,
        sort: "asc"
      }).then(res => {
        console.log(res);
        this.successKeylist = res.list;
        this.successpages.total = res.total;
      });
    },
    handleSuccessChange(val) {
      this.successpages.pageNum = val;
      this.getSuccesslist(val);
    },
    // 获取业务规则
    getRule(pageNum) {
      getRulelist({
        filters: [{ key: "listid", value: this.modelid }],
        orderby: "createon",
        pageNum: !pageNum ? 1 : pageNum,
        pageSize: 10,
        sort: "desc"
      }).then(res => {
        console.log(res);
        this.rulelist = res.list;
        this.rulepages.total = res.total;
      });
    },
    handleRuleChange(val) {
      this.rulepages.pageNum = val;
      this.getRule(val);
    },
    delRuleFile(item, index) {
      this.ruleform.ruleFile.splice(index, 1);
      if (!!item.type && item.type === "upload") {
        this.deletefile(item.docid);
      }
    },
    saveRule() {
      let self = this;
      this.$refs.ruleRef.validate(valid => {
        if (valid) {
          saveRulefile({
            attatch: this.ruleform.ruleFile,
            bpo: "diq",
            listid: this.modelid,
            param1: "翟青/一汽-大众汽车有限公司",
            rule: this.ruleform.rule
          }).then(res => {
            console.log(res);
            self.isruleVisible = false;
            this.$message({
              message: "添加成功!",
              type: "success"
            });
            this.getRule(1);
          });
        } else {
          this.$message({
            message: "规则或者附件不能为空!",
            type: "warning"
          });
          return false;
        }
      });
    },
    resetrules() {
      this.ruleform = {
        rule: "",
        ruleFile: []
      };
    },
    handleruleChange(val) {
      this.selrulelist = val;
    },
    delRule() {
      let arr = this.selrulelist.map(item => {
        return item.id;
      });
      this.$confirm("确认要删除选中的规则吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await delRuleFile(arr.join(","));
          this.getRule(this.rulepages.pageNum);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    // 获取流程活动说明
    getInfo() {
      getProcessInfo(this.bpmid).then(res => {
        let tempinfo = !res.activityname
          ? []
          : JSON.parse(res.activityname).name;
        tempinfo.sort(function(a, b) {
          return a.index > b.index ? 1 : a.index === b.index ? 0 : -1;
        });
        this.infolist = tempinfo;
      });
    },
    // 修订记录
    getRecord() {
      getRecordlist(this.modelid).then(res => {
        console.log(res);
        this.recordlist = res;
      });
    },
    handlerSelect(obj) {
      let self = this;
      console.log(111)
      obj.uploadfiles.map(item => {
        switch (true) {
          case this.editableTabsValue == "0":
            if (
              this.selectReferType === "processInput" ||
              this.selectReferType === "processOutput"
            ) {
              this.selectInoutform.files.push({
                attatchid: item.id,
                description: self.selectInoutform.desc,
                docid: item.id,
                id: item.id,
                inouttype: "卡片",
                listid: self.modelid,
                name: item.newName,
                newName: item.newName,
                typename:
                  self.selectReferType === "processInput" ? "输入" : "输出",
                type: "upload",
                filetype: "new"
              });
            } else {
              this.syspart[self.selectReferType].selected.push({
                attatchid: item.id,
                description: self.syspart[self.selectReferType].desc,
                docid: item.id,
                id: item.id,
                listid: self.modelid,
                name: item.newName,
                typename: self.selectReferType,
                type: "upload",
                filetype: "new"
              });
            }

            break;
          case this.editableTabsValue == "1":
            this.supportform.supportFile.push({
              docid: item.id,
              name: item.newName,
              type: "upload"
            });
            break;
          case this.editableTabsValue == "5":
            this.ruleform.ruleFile.push({
              attatchid: item.id,
              docid: item.id,
              id: item.id,
              name: item.newName,
              url: this.host + item.downloadUrl,
              type: "upload"
            });
            break;
        }
      });
      obj.selectedList.map(item => {
        switch (true) {
          case this.editableTabsValue == "0":
            if (
              this.selectReferType === "processInput" ||
              this.selectReferType === "processOutput"
            ) {
              let count = 0;
              for (let i = 0; i < this.selectInoutform.files.length; i++) {
                let temp = this.selectInoutform.files[i];
                if (temp.id === item.id) {
                  count++;
                }
              }
              if (!count) {
                this.selectInoutform.files.push({
                  attatchid: item.docid,
                  description: self.selectInoutform.desc,
                  docid: item.docid,
                  id: item.id,
                  inouttype: "卡片",
                  listid: self.modelid,
                  newName: item.name,
                  name: item.name,
                  typename:
                    self.selectReferType === "processInput" ? "输入" : "输出",
                  filetype: "new"
                });
              }
            } else {
              let count = 0;
              for (
                let i = 0;
                i < this.syspart[self.selectReferType].selected.length;
                i++
              ) {
                let temp = this.syspart[self.selectReferType].selected[i];
                if (temp.id === item.id) {
                  count++;
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
                  filetype: "new"
                });
              }
            }
            break;
          case this.editableTabsValue == "1":
            let count = 0;
            for (let i = 0; i < this.supportform.supportFile.length; i++) {
              let temp = this.supportform.supportFile[i];
              if (temp.docid === item.docid) {
                count++;
              }
            }
            if (!count) {
              this.supportform.supportFile.push({
                docid: item.docid,
                name: item.name
              });
            }
            break;
          case this.editableTabsValue == "5":
            let rulecount = 0;
            for (let i = 0; i < this.ruleform.ruleFile.length; i++) {
              let temp = this.ruleform.ruleFile[i];
              if (temp.id === item.id) {
                rulecount++;
              }
            }
            if (!rulecount) {
              this.ruleform.ruleFile.push({
                attatchid: item.docid,
                docid: item.docid,
                id: item.id,
                name: item.name,
                url: this.host + "/attach/download/" + item.docid
              });
            }
            break;
        }
      });
    },
    // 获取需要调用删除接口的文件
    requireDelFile(arr, type) {
      arr.forEach(item => {
        if (type === "selected") {
          let count = 0;
          for (let i = 0; i < this.storeDeletefile.document.length; i++) {
            let temp = this.storeDeletefile.document[i];
            if (temp.id == item.id) {
              count++;
              break;
            }
          }
          if (!count) {
            this.storeDeletefile.document.push(item);
          }
        } else {
          let count = 0;
          for (let i = 0; i < this.storeDeletefile.modeldoc.length; i++) {
            let temp = this.storeDeletefile.modeldoc[i];
            if (temp.id == item.id) {
              count++;
              break;
            }
          }
          if (!count) {
            this.storeDeletefile.modeldoc.push(item);
          }
        }
      });
    },
    // 删除document接口的文件
    async deletefile(ids) {
      let res = await deluploadFile(ids);
      return new Promise((resolve, reject) => {
        resolve();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
    .header{
      height: 18px;
      overflow: hidden;
    }
    .h220px{
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
