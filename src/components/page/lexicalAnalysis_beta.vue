<template>
  <div class="page">
    <el-row :gutter="50">
      <el-col :span="7" :offset="1">
        <div style="width: 80%">
          <el-row>
            <el-col :span="24">
              <p style="font-size: 50px;">{{title}}</p>
            </el-col>
            <el-col :span="24" style="margin-top:5%;">
              <el-form ref="REForm" :rules="rulesRE" :model="REForm" label-width="0px">
                <el-form-item prop="RE">
                  <el-input style="font-size:20px;" placeholder="请输入词法规则：" type="textarea" :autosize="{ minRows: 14, maxRows: 14}" v-model="REForm.RE" :disabled="false" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="generateFA('REForm')" :loading="loading" :disabled="false">构建状态机</el-button>
                  <el-button type="primary" :disabled="false">清空</el-button>
                  <el-button type="primary">保存</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="15">
        <div class="tab">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="NFA生成" name="NFAGeneration">
              <div style="background-color: #dddddd; height: 100%">
                <el-row>
                  <div class="graph">
                    <span style="font-size: 35px;">NFA</span>
                    <div style="float: right">
                      <el-button @click="layoutChange('NFAGeneration', NFA)">{{NFA.layoutText}}</el-button>
                      <el-button @click="fitAnimated(NFA)">鹰眼</el-button>
                    </div>
                    <div style="height:350px; " id="NFAvis"></div>
                  </div>
                </el-row>
                <div v-if="NFA.tokenChange === true" class="token">
                  <el-row>
                    <el-input style="font-size:20px;" placeholder="请输入待分析的的源码：" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" v-model="NFA.TokenForm.Token" clearable></el-input>
                  </el-row>
                </div>
                <div v-else class="token">
                  <el-row>
                    <el-col :span="24">
                      <p class="p" v-html="NFA.Token"></p>
                    </el-col>
                  </el-row>
                </div>
                <el-row>
                  <div class="controller">
                    <el-button :type="NFA.startButton" @click="startNFA('TokenForm', NFA)" :disabled="!generateFlag">{{NFA.startText}}</el-button>
                    <el-button @click="previous(this.NFA)" :disabled="NFA.tokenChange">上一步</el-button>
                    <el-button @click="next(this.NFA)" :disabled="NFA.tokenChange">下一步</el-button>
                    <el-button :type="NFA.autoButton" @click="autoControl(NFA)" :disabled="NFA.tokenChange" plain>{{NFA.autoText}}</el-button>
                  </div>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="DFA生成" name="DFAGeneration">
              <div style="background-color: #dddddd; height: 100%">
                <el-row>
                  <div class="graph">
                    <span style="font-size: 35px;">DFA</span>
                    <div style="float: right">
                      <el-button @click="layoutChange('DFAGeneration', DFA)">{{DFA.layoutText}}</el-button>
                      <el-button @click="fitAnimated(DFA)">鹰眼</el-button>
                    </div>
                    <div style="height:350px; " id="DFAvis"></div>
                  </div>
                </el-row>
                <div v-if="DFA.tokenChange === true" class="token">
                  <el-row>
                    <el-input style="font-size:20px;" placeholder="请输入待分析的的源码：" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" v-model="DFA.TokenForm.Token" clearable></el-input>
                  </el-row>
                </div>
                <div v-else class="token">
                  <el-row>
                    <el-col :span="24">
                      <p class="p" v-html="DFA.Token"></p>
                    </el-col>
                  </el-row>
                </div>
                <el-row>
                  <div class="controller">
                    <el-button :type="this.DFA.startButton" @click="startDFA('TokenForm', DFA)" :disabled="!generateFlag">{{this.DFA.startText}}</el-button>
                    <el-button @click="previousFocus(DFA)" :disabled="DFA.tokenChange">上一步</el-button>
                    <el-button @click="nextFocus(DFA)" :disabled="DFA.tokenChange">下一步</el-button>
                    <el-button :type="this.DFA.autoButton" @click="autoControlFocus(DFA)" :disabled="DFA.tokenChange" plain>{{this.DFA.autoText}}</el-button>
                  </div>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="DFA化简" name="DFASimplification">
              <div style="background-color: #dddddd; height: 100%">
                <el-row>
                  <div class="graph">
                    <span style="font-size: 35px;">DFA化简</span>
                    <div style="float: right">
                      <el-button @click="layoutChange('DFASimplification', DFA_S)">{{this.DFA_S.layoutText}}</el-button>
                      <el-button @click="fitAnimated(DFA_S)" >鹰眼</el-button>
                    </div>
                    <div style="height:350px; " id="DFA_Svis"></div>
                  </div>
                </el-row>
                <div v-if="DFA_S.tokenChange === true" class="token">
                  <el-row>
                    <el-input style="font-size:20px;" placeholder="请输入待分析的的源码：" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" v-model="DFA_S.TokenForm.Token" clearable></el-input>
                  </el-row>
                </div>
                <div v-else class="token">
                  <el-row>
                    <el-col :span="24">
                      <p class="p" v-html="DFA_S.Token"></p>
                    </el-col>
                  </el-row>
                </div>
                <el-row>
                  <div class="controller">
                    <el-button :type="this.DFA_S.startButton" @click="startDFA_S('TokenForm', DFA_S)" :disabled="!generateFlag">{{this.DFA_S.startText}}</el-button>
                    <el-button @click="previousFocus(DFA_S)" :disabled="DFA_S.tokenChange">上一步</el-button>
                    <el-button @click="nextFocus(DFA_S)" :disabled="DFA_S.tokenChange">下一步</el-button>
                    <el-button :type="this.DFA_S.autoButton" @click="autoControlFocus(DFA_S)" :disabled="DFA_S.tokenChange" plain>{{this.DFA_S.autoText}}</el-button>
                  </div>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="查看代码" name="codeShow">
              <el-col :span="24">
                <span style="font-size: 35px;">啥都没有</span>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import {DataSet, Network} from '../../../node_modules/vis/dist/vis.js'
import {createNodes, createEdges} from '../../api/vis_api'
import {create_NFA, NFA_CODE} from '../../api/NFA'
import {create_DFA, DFA_CODE} from '../../api/DFA'
import {Message} from 'element-ui'
export default {
  props: {
    // NFAvis: {
    //   type: [String, Number],
    //   default: ''
    // },
    // DFAvis: {
    //   type: [String, Number],
    //   default: ''
    // },
    // DFA_Svis: {
    //   type: [String, Number],
    //   default: ''
    // },
  },
  data () {
    // 验证正则表达式是否合法
    var validateRe = (rule, value, callback) => {
      let input = value.split('\n')
      for (let i = 0; i < input.length; i++) {
        try {
          let re = new RegExp(input[i].substring(input[i].indexOf('=') + 1))
        } catch (e) {
          callback(new Error('第' + (i + 1).toString() + '条正则表达式不合法，请重新输入'))
        }
      }
      callback()
    }
    return {
      activeName: 'NFAGeneration',
      NFAdata: {
        transitionTable: [
          [[1, 5], [], [], [], [], [], []],
          [[], [2], [], [], [], [], []],
          [[3], [], [], [], [], [], []],
          [[], [], [4], [], [], [], []],
          [[], [], [], [], [], [], []],
          [[], [6], [], [], [], [], []],
          [[7], [], [], [], [], [], []],
          [[], [], [8], [], [], [], []],
          [[9], [], [], [], [], [], []],
          [[], [], [], [10], [], [], []],
          [[11], [], [], [], [], [], []],
          [[], [], [], [], [12], [], []],
          [[13], [], [], [], [], [], []],
          [[], [], [], [], [], [14], []],
          [[15], [], [], [], [], [], []],
          [[], [], [], [], [], [], [16]],
          [[], [], [], [], [], [], []]
        ],
        alphabet: ['ε', 'd', 'o', 'u', 'b', 'l', 'e'],
        acceptState: [
          {
            state: 4,
            REId: 1
          }, {
            state: 16,
            REId: 2
          }
        ]
      },
      DFAdata: {
        transitionTable: [
          [[], [1], [], [], [], [], [7]], // 0
          [[], [], [], [], [2], [], []], // 1
          [[], [], [], [], [], [3], []], // 2
          [[4], [], [], [], [], [], []], // 3
          [[], [], [], [5], [], [], []], // 4
          [[], [], [6], [], [], [], []], // 5
          [[], [], [], [], [], [], []], // 6
          [[], [], [], [], [], [], []] // 7
        ],

        alphabet: ['b', 'd', 'e', 'l', 'o', 'u', 'x'],

        acceptState: [
          {
            state: 2,
            REId: 0
          },
          {
            state: 6,
            REId: 1
          },
          {
            state: 1,
            REId: 2
          },
          {
            state: 7,
            REId: 3
          }
        ]
      },
      DFA_Sdata: {
        transitionTable: [
          [[], [1], [], [], [], [], [7]], // 0
          [[], [], [], [], [2], [], []], // 1
          [[], [], [], [], [], [3], []], // 2
          [[4], [], [], [], [], [], []], // 3
          [[], [], [], [5], [], [], []], // 4
          [[], [], [6], [], [], [], []], // 5
          [[], [], [], [], [], [], []], // 6
          [[], [], [], [], [], [], []] // 7
        ],

        alphabet: ['b', 'd', 'e', 'l', 'o', 'u', 'x'],

        acceptState: [
          {
            state: 2,
            REId: 0
          },
          {
            state: 6,
            REId: 1
          },
          {
            state: 1,
            REId: 2
          },
          {
            state: 7,
            REId: 3
          }
        ]
      },
      REForm: {
        RE: 'T_Do=do\nT_Double=double'
      },
      rulesRE: {
        RE: [
          {required: true, message: '输入不能为空', tirgger: 'blur'},
          { validator: validateRe, trigger: 'blur' }
        ]
      },
      title: '词法分析',
      active: true,
      loading: false,
      firstNFA: false,
      firstDFA: false,
      firstDFA_S: false,
      generateFlag: false,
      NFA_TEMP: {
        loading: false,

        FNAMachine: {},
        lastState: null,
        nextState: null,
        auto: false,
        autoText: '自动展示',
        layout: true,
        layoutText: '取消层级结构',
        Token: '<span>请点击开始分词<span>',
        TokenForm: {
          Token: 'dododouble'
        },
        tokenChange: true,
        startButton: 'primary',
        startText: '开始分词',
        autoButton: 'primary'
      },
      DFA_TEMP: {
        loading: false,
        FNAMachine: {},
        lastState: null,
        nextState: null,
        auto: false,
        autoText: '自动展示',
        layout: true,
        layoutText: '取消层级结构',
        Token: '<span>请点击开始分词<span>',
        TokenForm: {
          Token: 'dododouble'
        },
        tokenChange: true,
        startButton: 'primary',
        startText: '开始分词',
        autoButton: 'primary'
      },
      DFA_S_TEMP: {
        loading: false,
        FNAMachine: {},
        lastState: null,
        nextState: null,
        auto: false,
        autoText: '自动展示',
        layout: true,
        layoutText: '取消层级结构',
        Token: '<span>请点击开始分词<span>',
        TokenForm: {
          Token: 'dododouble'
        },
        tokenChange: true,
        startButton: 'primary',
        startText: '开始分词',
        autoButton: 'primary'
      },
      cdoe: {}
    }
  },
  created () {
    this.NFA = this.NFA_TEMP
    this.DFA = this.DFA_TEMP
    this.DFA_S = this.DFA_S_TEMP
  },
  methods: {
    // 检测tabs标签更改,将现在活跃的标签的数据保存到active，并将上一次活跃的数据放回到相应的位置，实现不同标签页的切换
    handleClick (tab, event) {
      console.log('我点击了' + this.activeName)
      if (this.activeName === 'NFAGeneration') {
        this.active = this.NFA
        if (this.firstNFA === false && this.generateFlag === true) {
          this.fresh('NFAGeneration', this.NFAdata)
          this.firstNFA = true
        }
      } else if (this.activeName === 'DFAGeneration') {
        this.active = this.DFA
        if (this.firstDFA === false && this.generateFlag === true) {
          this.fresh('DFAGeneration', this.DFAdata)
          this.firstDFA = true
        }
      } else if (this.activeName === 'DFASimplification') {
        this.active = this.DFA_S
        if (this.firstDFA_S === false && this.generateFlag === true) {
          this.fresh('DFASimplification', this.DFA_Sdata)
          this.firstDFA_S = true
        }
      } else if (this.activeName === 'codeShow') {
        this.active = this.code
      } else {
        console.log('我竟然点击了未定义的tab事件！！！')
      }
    },
    // 构建状态机
    generateFA (formName) {
      const self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.NFA = self.NFA_TEMP
          self.DFA = self.DFA_TEMP
          self.DFA_S = self.DFA_S_TEMP
          // self.loading = true
          let re = []
          let input = self.REForm.RE.split('\n')
          for (let i = 0; i < input.length; i++) {
            re.push(input[i].substring(input[i].indexOf('=') + 1))
          }
          let url = '/api/lexical/regularExpression'
          let Params = {RE: re}
          self.generateFlag = true
          self.firstNFA = false
          self.firstDFA = false
          self.firstDFA_S = false
          if (this.activeName === 'NFAGeneration') {
            self.fresh('NFAGeneration', self.NFAdata)
            this.firstNFA = true
          } else if (this.activeName === 'DFAGeneration') {
            self.fresh('DFAGeneration', self.DFAdata)
            this.firstDFA = true
          } else if (this.activeName === 'DFASimplification') {
            self.fresh('DFASimplification', self.DFA_Sdata)
            this.firstDFA_S = true
          }

          // self.fresh('NFAGeneration', self.NFAdata)
          // self.fresh('DFAGeneration', self.DFAdata)
          // self.fresh('DFASimplification', self.DFA_Sdata)
          // self.$axios.post(url, Params).then(function (response) {
          //   self.loading = false
          //   self.disable = false
          //   self.NFAdata.transitionTable = response.data[0].transitionTable
          //   self.NFAdata.alphabet = response.data[0].alphabet
          //   self.NFAdata.acceptState = response.data[0].acceptStateList
          //   self.DFAdata.transitionTable = response.data[1].transitionTable
          //   self.DFAdata.alphabet = response.data[1].alphabet
          //   self.DFAdata.acceptState = response.data[1].acceptStateList
          //   self.DFA_Sdata.transitionTable = response.data[2].transitionTable
          //   self.DFA_Sdata.alphabet = response.data[2].alphabet
          //   self.DFA_Sdata.acceptState = response.data[2].acceptStateList
          //   sessionStorage.setItem('input', self.REForm.RE)
          //   self.firstDFA = false
          //   self.firstDFA_S = false
          //   self.fresh('NFAGeneration', self.NFAdata)
          //   self.fresh('DFAGeneration', self.DFAdata)
          //   self.fresh('DFASimplification', self.DFA_Sdata)
          // }).catch(function (error) {
          //   self.loading = false
          //   console.log(error)
          //   Message({
          //     message: '请检查网络并重试',
          //     type: 'error',
          //     center: true
          //   })
          // })
        } else {
          Message({
            message: '格式错误，请检查输入',
            type: 'error',
            center: true
          })
          return false
        }
      })
    },
    // 开始分词
    startNFA (formName, object) {
      const self = this
      if (object.tokenChange === true) {
        /* self.RE = (function () {
           let arr = self.REForm.RE
           let str1 = "<p style='font-size: 25px;word-break:break-all;'>"
           for (let i = 0; i < arr.length; i++) {
             str1 = str1 + "<span class='mode" + i.toString() + "'>" + arr[i] + '</span><br>'
           }
           str1 = str1 + '</p>'
           return str1
         })() */
        self.addCSS(self.getCsstext())
        if (object.TokenForm.Token === '') {
          Message({
            message: '请输入表达式',
            type: 'error',
            center: true
          })
        } else {
          object.Token = object.TokenForm.Token

          object.FNAMachine = create_NFA(self.NFAdata.transitionTable, self.NFAdata.alphabet, self.NFAdata.acceptState)
          object.FNAMachine.feedText(object.TokenForm.Token)
          object.nextState = object.FNAMachine.init()

          self.fresh(self.NFAdata)

          self.changeNode(object.nextState.graphInfo.highlightNodes, 1, object)
          // self.nextState = {graphInfo: {highlightNodes: [0]}}
          object.tokenChange = false
          object.startButton = 'danger'
          object.startText = '停止分词'
        }
        /* self.$refs[formName].validate((valid) => {
              if (valid) {
                self.Token = self.TokenForm.Token
                self.FNAMachine = create_NFA(self.NFAdata.transitionTable, self.NFAdata.alphabet, self.NFAdata.acceptState)
                self.FNAMachine.init()
                self.FNAMachine.feedText(self.TokenForm.Token)
                self.fresh(self.NFAdata)
                self.changeNode([0], 1)
                self.nextState = {graphInfo: {highlightNodes: [0]}}
                self.tokenChange = false;
                // TODO：开始分词后 输入框不能编辑
              } else {
                Message({
                  message: '格式错误，请检查输入',
                  type: 'error',
                  center: true
                })
                return false
              }
            }) */
      } else {
        object.FNAMachine = null
        object.tokenChange = true
        object.startButton = 'primary'
        object.startText = '开始分词'
        self.fresh('NFAGeneration', this.NFAdata)
        if (object.auto === true) { this.autoControl(object) }
      }
    },
    startDFA (formName, object) {
      const self = this
      if (object.tokenChange === true) {
        self.addCSS(self.getCsstext())
        if (object.TokenForm.Token === '') {
          Message({
            message: '请输入表达式',
            type: 'error',
            center: true
          })
        } else {
          object.Token = object.TokenForm.Token

          object.FNAMachine = create_DFA(self.DFAdata.transitionTable, self.DFAdata.alphabet, self.DFAdata.acceptState)
          object.FNAMachine.feedText(object.TokenForm.Token)
          console.log('222222222222222222222222222')
          object.nextState = object.FNAMachine.init()
          console.log('33333333333333333333333333333')
          // self.fresh(self.FAdata)
          self.changeNode(object.nextState.graphInfo.highlightNodes, 1, object)
          // self.nextState = {graphInfo: {highlightNodes: [0]}}
          object.tokenChange = false
          object.startButton = 'danger'
          object.startText = '停止分词'
        }
      } else {
        object.FNAMachine = null
        object.tokenChange = true
        object.startButton = 'primary'
        object.startText = '开始分词'
        self.fresh('DFAGeneration', this.DFAdata)
        if (object.auto === true) { this.autoControlFocus(object) }
      }
    },
    startDFA_S (formName, object) {
      const self = this
      if (object.tokenChange === true) {
        self.addCSS(self.getCsstext())
        if (object.TokenForm.Token === '') {
          Message({
            message: '请输入表达式',
            type: 'error',
            center: true
          })
        } else {
          object.Token = object.TokenForm.Token

          object.FNAMachine = create_DFA(self.DFA_Sdata.transitionTable, self.DFA_Sdata.alphabet, self.DFA_Sdata.acceptState)
          object.FNAMachine.feedText(object.TokenForm.Token)
          object.nextState = object.FNAMachine.init()

          // self.fresh(self.NFAdata)

          self.changeNode(object.nextState.graphInfo.highlightNodes, 1, object)
          // self.nextState = {graphInfo: {highlightNodes: [0]}}
          object.tokenChange = false
          object.startButton = 'danger'
          object.startText = '停止分词'
        }
      } else {
        object.FNAMachine = null
        object.tokenChange = true
        object.startButton = 'primary'
        object.startText = '开始分词'
        self.fresh('DFASimplification', this.DFA_Sdata)
        if (object.auto === true) { this.autoControlFocus(object) }
      }
    },
    // 下一步
    changeWindow (object) {
      const self = this
      let recognized = object.nextState.windowInfo.recognizedTokens.map(obj => {
        let temp = []
        temp.push(obj.startIndex)
        temp.push(obj.endIndex)
        temp.push(obj.REId)
        return temp
      })
      let remains = [
        object.nextState.windowInfo.remains.startIndex,
        object.nextState.windowInfo.remains.endIndex,
        888
      ]
      let scanning = [
        object.nextState.windowInfo.scanning.startIndex,
        object.nextState.windowInfo.scanning.endIndex,
        999
      ]
      recognized.push(scanning)
      recognized.push(remains)
      console.log(recognized)
      let html = self.cut(object.TokenForm.Token, recognized)
      object.Token = html
    },
    next (object) {
      const self = this
      object.lastState = object.nextState
      object.nextState = object.FNAMachine.nextStep()

      // let recognized = object.nextState.windowInfo.recognizedTokens.map(obj => {
      //   let temp = []
      //   temp.push(obj.startIndex)
      //   temp.push(obj.endIndex)
      //   temp.push(obj.REId)
      //   return temp
      // })
      // let remains = [object.nextState.windowInfo.remains.startIndex, object.nextState.windowInfo.remains.endIndex, 888]
      // let scanning = [object.nextState.windowInfo.scanning.startIndex, object.nextState.windowInfo.scanning.endIndex, 999]
      // recognized.push(scanning)
      // recognized.push(remains)
      // let html = self.cut(object.TokenForm.Token, recognized)
      // object.Token = html
      switch (object.nextState.code) {
        case NFA_CODE.DONE:
          self.$message({
            type: 'success',
            message: 'Token提取完成'
          })
          break
        case NFA_CODE.DOCLOSURE:
          self.$message({
            type: 'success',
            message: '遵循最长子串原则继续重复做闭包和读字符'
          })
          self.changeWindow(object)
          if (object.lastState.graphInfo.highlightEdges === null) {
            this.changeNode(object.lastState.graphInfo.highlightNodes, 0, object)
            this.changeNode(object.nextState.graphInfo.highlightNodes, 2, object)

            this.changeEdge(object.nextState.graphInfo.highlightEdges, 2, object)
          } else {
            this.changeNode(object.lastState.graphInfo.highlightNodes, 0, object)
            this.changeNode(object.nextState.graphInfo.highlightNodes, 2, object)

            this.changeEdge(object.lastState.graphInfo.highlightEdges, 0, object)
            this.changeEdge(object.nextState.graphInfo.highlightEdges, 2, object)
          }
          break
        case NFA_CODE.READCHAR:
          self.$message({
            type: 'info',
            message: '遵循最长子串原则继续重复做闭包和读字符'
          })
          console.log('11111111111111111111111111111111')
          self.changeWindow(object)
          if (object.lastState.graphInfo.highlightEdges === null) {
            this.changeNode(object.lastState.graphInfo.highlightNodes, 0, object)
            this.changeNode(object.nextState.graphInfo.highlightNodes, 1, object)

            this.changeEdge(object.nextState.graphInfo.highlightEdges, 1, object)
          } else {
            this.changeNode(object.lastState.graphInfo.highlightNodes, 0, object)
            this.changeNode(object.nextState.graphInfo.highlightNodes, 1, object)

            this.changeEdge(object.lastState.graphInfo.highlightEdges, 0, object)
            this.changeEdge(object.nextState.graphInfo.highlightEdges, 1, object)
          }
          break
        case NFA_CODE.ACCEPT:
          self.$message({
            type: 'success',
            message: '提取Token'
          })
          self.changeWindow(object)
          if (object.lastState.graphInfo.highlightEdges === null) {
            this.changeNode(object.lastState.graphInfo.highlightNodes, 0, object)
            this.changeNode(object.nextState.graphInfo.highlightNodes, 1, object)

            this.changeEdge(object.nextState.graphInfo.highlightEdges, 1, object)
          } else {
            this.changeNode(object.lastState.graphInfo.highlightNodes, 0, object)
            this.changeNode(object.nextState.graphInfo.highlightNodes, 1, object)

            this.changeEdge(object.lastState.graphInfo.highlightEdges, 0, object)
            this.changeEdge(object.nextState.graphInfo.highlightEdges, 1, object)
          }
          break
        case NFA_CODE.REJECT:
          self.$message({
            type: 'success',
            message: '遇到了NFA拒绝的输入'
          })
          self.autoControlFocus(object)
          break
        case NFA_CODE.UNKNOWN:
          self.$message({
            type: 'success',
            message: '遇到了NFA遇到了不认识的字符'
          })
          self.autoControlFocus(object)
          break
        default:
          break
      }
    },
    nextFocus (object) {
      const self = this
      object.lastState = object.nextState
      object.nextState = object.FNAMachine.nextStep()
      switch (object.nextState.code) {
        case DFA_CODE.DONE:
          self.$message({
            type: 'success',
            message: 'Token提取完成'
          })
          self.fitAnimated(object)
          break
        case DFA_CODE.NEXTSTEP:
          self.$message({
            type: 'success',
            message: '遵循最长子串原则继续重复做闭包和读字符'
          })
          self.changeWindow(object)
          this.changeNode(object.lastState.graphInfo.highlightNodes, 0, object)
          this.changeNode(object.nextState.graphInfo.highlightNodes, 2, object)

          this.changeEdge(object.lastState.graphInfo.highlightEdges, 0, object)
          this.changeEdge(object.nextState.graphInfo.highlightEdges, 2, object)
          self.focusNode(object.nextState.graphInfo.highlightNodes[0], object)
          break
        case DFA_CODE.READCHAR:
          self.$message({
            type: 'info',
            message: '遵循最长子串原则继续重复做闭包和读字符'
          })
          self.changeWindow(object)
          this.changeNode(object.lastState.graphInfo.highlightNodes, 0, object)
          this.changeNode(object.nextState.graphInfo.highlightNodes, 1, object)

          this.changeEdge(object.lastState.graphInfo.highlightEdges, 0, object)
          this.changeEdge(object.nextState.graphInfo.highlightEdges, 1, object)
          self.focusNode(object.nextState.graphInfo.highlightNodes[0], object)

          break
        case DFA_CODE.ACCEPT:
          self.$message({
            type: 'success',
            message: '提取Token'
          })
          self.changeWindow(object)
          this.changeNode(object.lastState.graphInfo.highlightNodes, 0, object)
          this.changeNode(object.nextState.graphInfo.highlightNodes, 1, object)

          this.changeEdge(object.lastState.graphInfo.highlightEdges, 0, object)
          this.changeEdge(object.nextState.graphInfo.highlightEdges, 1, object)
          self.focusNode(object.nextState.graphInfo.highlightNodes[0], object)

          break
        case DFA_CODE.REJECT:
          self.$message({
            type: 'success',
            message: '遇到了DFA拒绝的输入'
          })
          self.autoControlFocus(object)
          break
        case DFA_CODE.UNKNOWN:
          self.$message({
            type: 'success',
            message: '遇到了DFA不认识的字符'
          })
          self.autoControlFocus(object)
          break
        default:
          break
      }
    },
    // 上一步
    previous (object) {
      const self = this
      object.lastState = object.nextState
      object.nextState = object.FNAMachine.preStep()
      switch (object.nextState.code) {
        case NFA_CODE.NOPRESTEP:
          self.$message({
            type: 'info',
            message: '已经是第一个状态了'
          })
          break
        case NFA_CODE.PRESTEP:
          self.$message({
            type: 'success',
            message: '返回到上一个步骤'
          })
          self.changeWindow(object)
          this.changeNode(object.lastState.graphInfo.highlightNodes, 0, object)
          this.changeNode(object.nextState.graphInfo.highlightNodes, 1, object)

          this.changeEdge(object.lastState.graphInfo.highlightEdges, 0, object)
          this.changeEdge(object.nextState.graphInfo.highlightEdges, 1, object)
          break
        default:
          break
      }
    },
    previousFocus (object) {
      const self = this
      object.lastState = object.nextState
      object.nextState = object.FNAMachine.preStep()
      self.focusNode(object.nextState.graphInfo.highlightNodes[0], object)
      switch (object.nextState.code) {
        case DFA_CODE.NOPRESTEP:
          self.$message({
            type: 'info',
            message: '已经是第一个状态了'
          })
          break
        case DFA_CODE.PRESTEP:
          self.$message({
            type: 'success',
            message: '返回到上一个步骤'
          })
          self.changeWindow(object)
          this.changeNode(object.lastState.graphInfo.highlightNodes, 0, object)
          this.changeNode(object.nextState.graphInfo.highlightNodes, 1, object)

          this.changeEdge(object.lastState.graphInfo.highlightEdges, 0, object)
          this.changeEdge(object.nextState.graphInfo.highlightEdges, 1, object)
          break
        default:
          break
      }
    },
    // 自动展示
    autoControl (object) {
      if (object.auto === false) {
        object.auto = true
        object.autoText = '停止'
        object.autoButton = 'danger'
        object.timer = setInterval(() => {
          this.next(object)
          if (object.nextState.code === NFA_CODE.DONE) {
            object.auto = false
            object.autoText = '自动展示'
            object.autoButton = 'primary'
            clearInterval(object.timer)
          }
        }, 1000)
      } else {
        object.auto = false
        object.autoText = '自动展示'
        object.autoButton = 'primary'
        clearInterval(object.timer)
      }
    },
    autoControlFocus (object) {
      if (object.auto === false) {
        object.auto = true
        object.autoText = '停止'
        object.autoButton = 'danger'
        object.timer = setInterval(() => {
          this.nextFocus(object)
          if (object.nextState.code === DFA_CODE.DONE) {
            object.auto = false
            object.autoText = '自动展示'
            object.autoButton = 'primary'
            this.fitAnimated(object)
            clearInterval(object.timer)
          }
        }, 1000)
      } else {
        object.auto = false
        object.autoText = '自动展示'
        object.autoButton = 'primary'
        clearInterval(object.timer)
      }
    },
    cut (str, arr) {
      let str1 = ''
      for (let i of arr) {
        console.log(i[2])
        if (i[2] < 888) {
          str1 = str1 + "<span class='mode" + i[2].toString() + "'>" + str.substring(i[0], i[1]) + '&nbsp;' + '</span>'
        } else {
          str1 = str1 + "<span class='mode" + i[2].toString() + "'>" + str.substring(i[0], i[1]) + '</span>'
        }
      }
      return str1
    },
    addCSS (cssText) {
      let style = document.createElement('style')
      let head = document.head || document.getElementsByTagName('head')[0]
      style.type = 'text/css'
      let textNode = document.createTextNode(cssText)
      style.appendChild(textNode)
      head.appendChild(style)
    },
    getCsstext () {
      let length = sessionStorage.getItem('input').split('\n').length
      let cssText = '\n'
      for (let i = 0; i < length; i++) {
        cssText = cssText + 'span.mode' + i.toString() + '{ color:' + '#' + Math.floor(Math.random() * 0xffffff).toString(16) + ';}\n'
      }
      return cssText
    },
    // 刷新图
    async fresh (id, networkdata) {
      if (id === 'NFAGeneration') {
        const self = this
        let options = {
          nodes: {
            color: {
              background: 'white',
              highlight: {
                border: 'rgba(139,183,233,1)',
                background: 'white'
              }},
            shape: 'dot',
            size: 26,
            font: {
              size: 18
            },
            borderWidth: 1
          },
          edges: {
            font: {
              size: 32,
              align: 'top'
            },
            color: {
              color: 'rgba(139,183,233,1)'
            },
            smooth: {
              forceDirection: 'none',
              type: 'dynamic'
            }
          },
          autoResize: true,
          height: '100%',
          width: '100%',
          clickToUse: true,
          // configure: {
          //   enabled: false,
          //   filter: 'nodes,edges',
          //   container: undefined,
          //   showButton: true
          // },
          interaction: {hover: true},
          layout: {
            hierarchical: {
              enabled: self.NFA.layout,
              direction: 'LR', // UD, DU, LR, RL
              sortMethod: 'directed' // hubsize, directed
            }
          },
          physics: {
            barnesHut: {
              gravitationalConstant: -2000,
              centralGravity: 0.1,
              springLength: 140
            }
          }
          // manipulation: {}

        }
        self.NFA.edges = new DataSet(createEdges(networkdata.transitionTable, networkdata.alphabet))
        self.NFA.nodes = new DataSet(createNodes(networkdata.transitionTable, networkdata.acceptState))
        var data = {
          nodes: self.NFA.nodes,
          edges: self.NFA.edges
        }
        let container = document.getElementById('NFAvis')
        self.NFA.network = new Network(container, data, options)
        self.NFA.network.on('doubleClick', (params) => {
          params.event = '[original event]'
          this.$emit('node_double_click', params)
          console.log('双击事件' + params)
          if (this.magnifier === false) {
            this.magnifier = true
            this.focusPosition(params.pointer.canvas, self.NFA)
          } else {
            this.magnifier = false
            this.fitAnimated(self.NFA)
          }
        })
        self.NFA.network.on('zoom', (params) => {
          params.event = '[original event]'
          this.$emit('zoom', params)
          console.log('滚动滚轮事件' + params)
          this.magnifier = true
        })
      } else if (id === 'DFAGeneration') {
        const self = this
        self.DFA.edges = new DataSet(createEdges(networkdata.transitionTable, networkdata.alphabet))
        self.DFA.nodes = new DataSet(createNodes(networkdata.transitionTable, networkdata.acceptState))
        var data = {
          nodes: self.DFA.nodes,
          edges: self.DFA.edges
        }
        let options = {
          nodes: {
            color: {
              background: 'white',
              highlight: {
                border: 'rgba(139,183,233,1)',
                background: 'white'
              }},
            shape: 'dot',
            size: 26,
            font: {
              size: 18
            },
            borderWidth: 1
          },
          edges: {
            font: {
              size: 32,
              align: 'top'
            },
            color: {
              color: 'rgba(139,183,233,1)'
            },
            smooth: {
              forceDirection: 'none',
              type: 'dynamic'
            }
          },
          autoResize: true,
          height: '100%',
          width: '100%',
          clickToUse: true,
          // configure: {
          //   enabled: false,
          //   filter: 'nodes,edges',
          //   container: undefined,
          //   showButton: true
          // },
          interaction: {hover: true},
          layout: {
            hierarchical: {
              enabled: self.DFA.layout,
              direction: 'LR', // UD, DU, LR, RL
              sortMethod: 'directed' // hubsize, directed
            }
          },
          physics: {
            barnesHut: {
              gravitationalConstant: -2000,
              centralGravity: 0.1,
              springLength: 140
            }
          }
          // manipulation: {}

        }
        let container = document.getElementById('DFAvis')
        self.DFA.network = new Network(container, data, options)
        self.DFA.network.on('doubleClick', (params) => {
          params.event = '[original event]'
          this.$emit('node_double_click', params)
          console.log('双击事件' + params)
          if (this.magnifier === false) {
            this.magnifier = true
            this.focusPosition(params.pointer.canvas, self.DFA)
          } else {
            this.magnifier = false
            this.fitAnimated(self.DFA)
          }
        })
        self.DFA.network.on('zoom', (params) => {
          params.event = '[original event]'
          this.$emit('zoom', params)
          console.log('滚动滚轮事件' + params)
          this.magnifier = true
        })
      } else if (id === 'DFASimplification') {
        const self = this
        self.DFA_S.edges = new DataSet(createEdges(networkdata.transitionTable, networkdata.alphabet))
        self.DFA_S.nodes = new DataSet(createNodes(networkdata.transitionTable, networkdata.acceptState))
        var data = {
          nodes: self.DFA_S.nodes,
          edges: self.DFA_S.edges
        }
        let options = {
          nodes: {
            color: {
              background: 'white',
              highlight: {
                border: 'rgba(139,183,233,1)',
                background: 'white'
              }},
            shape: 'dot',
            size: 26,
            font: {
              size: 18
            },
            borderWidth: 1
          },
          edges: {
            font: {
              size: 32,
              align: 'top'
            },
            color: {
              color: 'rgba(139,183,233,1)'
            },
            smooth: {
              forceDirection: 'none',
              type: 'dynamic'
            }
          },
          autoResize: true,
          height: '100%',
          width: '100%',
          clickToUse: true,
          // configure: {
          //   enabled: false,
          //   filter: 'nodes,edges',
          //   container: undefined,
          //   showButton: true
          // },
          interaction: {hover: true},
          layout: {
            hierarchical: {
              enabled: self.DFA_S.layout,
              direction: 'LR', // UD, DU, LR, RL
              sortMethod: 'directed' // hubsize, directed
            }
          },
          physics: {
            barnesHut: {
              gravitationalConstant: -2000,
              centralGravity: 0.1,
              springLength: 140
            }
          }
          // manipulation: {}

        }
        let container = document.getElementById('DFA_Svis')
        self.DFA_S.network = new Network(container, data, options)

        self.DFA_S.network.on('doubleClick', (params) => {
          params.event = '[original event]'
          this.$emit('node_double_click', params)
          console.log('双击事件' + params)
          if (this.magnifier === false) {
            this.magnifier = true
            this.focusPosition(params.pointer.canvas, self.DFA_S)
          } else {
            this.magnifier = false
            this.fitAnimated(self.DFA_S)
          }
        })
        self.DFA_S.network.on('zoom', (params) => {
          params.event = '[original event]'
          this.$emit('zoom', params)
          console.log('滚动滚轮事件' + params)
          this.magnifier = true
        })
      }
    },
    // 鹰眼
    fitAnimated (object) {
      var options = {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
      object.network.fit({animation: options})
    },
    // 聚焦到节点
    focusNode (val, object) {
      var options = {
        // position: {x:positionx,y:positiony}, // this is not relevant when focusing on nodes
        scale: 1.0,
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad'
        }
      }
      object.network.focus(val, options)
      object.magnifier = true
    },
    // 聚焦到坐标
    focusPosition (val, object) {
      var options = {
        scale: 1.0,
        position: {x: val.x, y: val.y},
        animation: {
          duration: 500,
          easingFunction: 'linear'
        }
      }
      object.network.moveTo(options)
    },
    // 改变节点的颜色
    changeNode (nodes, colorNum, object) {
      let backgroud, border
      if (colorNum === 0) {
        backgroud = '#fff'
        border = '#2b7ce9'
      } else if (colorNum === 1) {
        backgroud = '#ffD2E5'
        border = '#e92b7c'
      } else {
        backgroud = '#ffE5D2'
        border = '#e97c2b'
      }
      for (let i = 0; i < nodes.length; i++) {
        object.nodes.update([{id: nodes[i], color: {background: backgroud, border: border}}])
      }
    },
    // 改变边的颜色
    changeEdge (edges, colorNum, object) {
      let border
      if (colorNum === 0) {
        border = '#2b7ce9'
      } else if (colorNum === 1) {
        border = '#e92b7c'
      } else {
        border = '#e97c2b'
      }
      for (let i = 0; i < edges.length; i++) {
        object.edges.update([{id: edges[i], color: {color: border}}])
      }
    },
    // 布局更改
    layoutChange (id, object) {
      const self = this
      if (object.layout === true) {
        object.layout = false
        object.layoutText = '层级结构'
      } else {
        object.layout = true
        object.layoutText = '取消层级结构'
      }
      if (id === 'NFAGeneration') { self.fresh('NFAGeneration', self.NFAdata) } else if (id === 'DFAGeneration') { self.fresh('DFAGeneration', self.DFAdata) } else if (id === 'DFASimplification') { self.fresh('DFASimplification', self.DFA_Sdata) }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page{
    width: 85%;
    margin-left: 8%;
    margin-top: 3%;
    height: 90%;
  }
  .tab{
    height: 100%;
    width: 100%;
  }
  .graph{
    width: 100%;
    height: 40%;
  }
  .token{
    background-color: #bbbbbb;
    height: 70px;
  }
  .controller{
    width: 100%;
    height: 30%;
    margin-top: 6%;
    margin-bottom: 8%;
    text-align:center;
  }
  div#NFA,div#DFA,div#DFA_S{
    height:240px;
    background-color:#DDDDDD;
  }
  .p{
    font-size: 21px;
    text-align:center;
    word-wrap:break-word;
  }
</style>

<style>
  span.mode999 {
    background-color: red;
  }
</style>
