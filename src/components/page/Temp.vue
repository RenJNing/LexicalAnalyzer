<template>
  <div class="page">
    <el-row>
      <el-col :span="5" :offset="1">
        <div>
          <el-row>
            <el-col :span="24">
              <p style="font-size: 35px;">{{title}}</p>
            </el-col>
            <el-col :span="24" style="margin-top:50px;">
              <el-form ref="REForm" :rules="rulesRE" :model="REForm" label-width="0px">
                <el-form-item prop="RE">
                  <el-input style="font-size:20px;" placeholder="请输入词法规则：" type="textarea" :autosize="{ minRows: 10, maxRows: 10}" v-model="REForm.RE" :disabled="!tokenChange"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="generateFA('REForm')" :loading="loading" :disabled="!tokenChange">构建状态机</el-button>
                  <el-button :disabled="!tokenChange" @click="resetForm('REForm')" icon="el-icon-circle-close-outline" circle></el-button>
                  <el-button icon="el-icon-star-off" circle></el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="16" :offset="1">
        <div class="tab">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="NFA生成" name="NFAGeneration">
              <div style="background-color: #dddddd; height: 100%">
                <el-row>
                  <div class="graph">
                    <span style="font-size: 35px;">NFA</span>
                    <div style="float: right">
                      <el-button @click="layoutChange()">{{layoutText}}</el-button>
                      <el-button @click="Zoom('NFA')">放大/收缩</el-button>
                      <el-button @click="fitAnimated('NFA')">适应屏幕</el-button>
                    </div>
                    <div style="height:350px; " id="NFAvis"></div>
                  </div>
                </el-row>
                <div class="token">
                <div v-if="tokenChange === true">
                  <el-input style="font-size:20px;" placeholder="请输入待分析的的源码：" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" v-model="TokenForm.Token"></el-input>
                </div>
                <div v-else>
                    <div id="p" v-html="Token"></div>
                </div>
                </div>
                <el-row>
                  <div class="controller">
                    <el-button :type="startButton" @click="startNFA('TokenForm')">{{startText}}</el-button>
                    <el-button @click="previous()">上一步</el-button>
                    <el-button @click="next(NFA)">下一1111步</el-button>
                    <el-button :type="autoButton" @click="autoControl()" plain>{{autoText}}</el-button>
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
                      <el-button @click="layoutChange()">{{layoutText}}</el-button>
                      <el-button @click="Zoom('NFA')">放大/收缩</el-button>
                      <el-button @click="fitAnimated('NFA')">适应屏幕</el-button>
                    </div>
                    <div style="height:350px; " id="DFAvis"></div>
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
                      <el-button @click="layoutChange()">{{layoutText}}</el-button>
                      <el-button @click="Zoom('NFA')">放大/收缩</el-button>
                      <el-button @click="fitAnimated('NFA')">适应屏幕</el-button>
                    </div>
                    <div style="height:350px; " id="DFA_Svis"></div>
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
import { DataSet, Network } from 'vis'
import { Message } from 'element-ui'
import { createNodes, createEdges } from '../../api/vis_api'
import { create_NFA, CODE } from '../../api/NFA'
export default {
  props: {
    myvis: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    // 验证正则表达式是否合法
    var validateRe = (rule, value, callback) => {
      let input = value.split('\n')
      for (let i = 0; i < input.length; i++) {
        try {
          let re = new RegExp(input[i].substring(input[i].indexOf('=') + 1))
        } catch (e) {
          callback(
            new Error(
              '第' + (i + 1).toString() + '条正则表达式不合法，请重新输入'
            )
          )
        }
      }
      callback()
    }
    return {
      status: {
        loading: false
      },
      NFA: {
        data: {
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
              REId: 0
            },
            {
              state: 16,
              REId: 1
            }
          ]
        },
        machine: '',
        nodes: '',
        edges: '',
        vis: '',
        lastState: {},
        nextState: {
          code: '',
          graphInfo: {},
          windowInfo: {}
        }
      },
      DFA: {
        data: {
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
              REId: 0
            },
            {
              state: 16,
              REId: 1
            }
          ]
        },
        machine: '',
        nodes: '',
        deges: '',
        vis: ''
      },
      DFA_S: {
        data: {
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
              REId: 0
            },
            {
              state: 16,
              REId: 1
            }
          ]
        },
        machine: '',
        nodes: '',
        deges: '',
        vis: ''
      },
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
            REId: 0
          },
          {
            state: 16,
            REId: 1
          }
        ]
      },
      DFAdata: {
        transitionTable: [
          [[1, 4], [], [], [], [], [], []], // 0
          [[], [], [2], [], [], [], []], // 1
          [[], [], [], [], [], [3], []], // 2
          [[], [], [], [], [], [], []], // 3
          [[], [], [5], [], [], [], []], // 4
          [[], [], [], [], [], [6], []], // 5
          [[], [], [], [], [], [], [7]], // 6
          [[], [8], [], [], [], [], []], // 7
          [[], [], [], [], [9], [], []], // 8
          [[], [], [], [10], [], [], []], // 9
          [[], [], [], [], [], [], []] // 10
        ],
        alphabet: ['ε', 'd', 'o', 'u', 'b', 'l', 'e'],
        acceptState: [
          {
            state: 3,
            REId: 0
          },
          {
            state: 10,
            REId: 1
          }
        ]
      },
      DFA_Sdata: {
        transitionTable: [
          [[1, 4], [], [], [], [], [], []], // 0
          [[], [], [2], [], [], [], []], // 1
          [[], [], [], [], [], [3], []], // 2
          [[], [], [], [], [], [], []], // 3
          [[], [], [5], [], [], [], []], // 4
          [[], [], [], [], [], [6], []], // 5
          [[], [], [], [], [], [], [7]], // 6
          [[], [8], [], [], [], [], []], // 7
          [[], [], [], [], [9], [], []], // 8
          [[], [], [], [10], [], [], []], // 9
          [[], [], [], [], [], [], []] // 10
        ],
        alphabet: ['ε', 'b', 'd', 'e', 'l', 'o', 'u'],
        acceptState: [
          {
            state: 3,
            REId: 0
          },
          {
            state: 10,
            REId: 1
          }
        ]
      },
      isChoose1: false,
      isChoose2: false,
      isChoose3: false,
      loading: false,
      title: '词法分析',
      REForm: {
        RE: 'T_Do=do\nT_Double=double'
      },
      rulesRE: {
        RE: [
          { required: true, message: '输入不能为空', tirgger: 'blur' },
          { validator: validateRe, trigger: 'blur' }
        ]
      },
      FNAMachine: {},
      lastState: null,
      nextState: null,
      auto: false,
      autoText: '自动展示',
      layout: true,
      layoutText: '取消层级结构',
      Token: '<span>请点击开始分词<span>',
      RE: '',
      TokenForm: {
        Token: 'dododouble'
      },
      rulesToken: {
        Token: [{ required: true, message: '输入不能为空', tirgger: 'blur' }]
      },
      tokenChange: true,
      startButton: 'primary',
      startText: '开始分词',
      autoButton: 'primary'
    }
  },
  methods: {
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 检测tabs标签更改
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 构建状态机
    generateFA (formName) {
      const self = this
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.status.loading = true
          let re = []
          let input = self.REForm.RE.split('\n')
          for (let i = 0; i < input.length; i++) {
            re.push(input[i].substring(input[i].indexOf('=') + 1))
          }
          // let url = '/RE'
          // let Params = {RE: re}
          // self.$axios.post(url, Params).then(function (response) {
          self.status.loading = false
          sessionStorage.setItem('input', self.REForm.RE)
          self.fresh()
          // sessionStorage.setItem('NFAdata', JSON.stringify(self.NFAdata))
          // sessionStorage.setItem('DFAdata', JSON.stringify(self.DFAdata))
          // sessionStorage.setItem('DFA_Sdata', JSON.stringify(self.DFA_Sdata))
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
    startNFA (formName) {
      const self = this
      if (self.tokenChange === true) {
        self.addCSS(self.getCsstext())
        if (self.TokenForm.Token === '') {
          Message({
            message: '请输入表达式',
            type: 'error',
            center: true
          })
        } else {
          self.Token = self.TokenForm.Token
          self.NFA.machine = create_NFA(
            self.NFA.data.transitionTable,
            self.NFA.data.alphabet,
            self.NFA.data.acceptState
          )
          self.NFA.machine.feedText(self.TokenForm.Token)
          self.NFA.machine.init()
          // self.changeNode([0], 1)
          // self.nextState = { graphInfo: { highlightNodes: [0] } }
          self.tokenChange = false
          self.startButton = 'danger'
          self.startText = '停止分词'
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
        self.FNAMachine = null
        self.tokenChange = true
        self.startButton = 'primary'
        self.startText = '开始分词'
        self.fresh(this.activeName, this.NFAdata)
        if (self.auto === true) {
          this.autoControl()
        }
      }
    },
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
      let html = self.cut(self.TokenForm.Token, recognized)
      self.Token = html
    },
    // 下一步
    next (obj) {
      const self = this
      console.log(obj)
      obj.lastState = obj.nextState
      obj.nextState = obj.machine.nextStep()
      self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)
      // switch (obj.nextState.code) {
      //   case CODE.DONE:
      //     self.$message({
      //       type: 'success',
      //       message: 'Token提取完成'
      //     })
      //     break
      //   case CODE.DOCLOSURE:
      //     self.$message({
      //       type: 'success',
      //       message: '遵循最长子串原则继续重复做闭包'
      //     })
      //     if (obj.lastState.graphInfo.highlightEdges === null) {
      //       self.changeNode(obj, obj.lastState.graphInfo.highlightNodes, 0)
      //       self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)

      //       self.changeEdge(obj, obj.nextState.graphInfo.highlightEdges, 2)
      //     } else {
      //       self.changeNode(obj, obj.lastState.graphInfo.highlightNodes, 0)
      //       self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)

      //       self.changeEdge(obj, obj.lastState.graphInfo.highlightEdges, 0)
      //       self.changeEdge(obj, obj.nextState.graphInfo.highlightEdges, 2)
      //     }
      //     break
      //   case CODE.READCHAR:
      //     self.$message({
      //       type: 'info',
      //       message: '遵循最长子串原则继续读字符'
      //     })
      //     self.changeWindow(obj)
      //     if (obj.lastState.graphInfo.highlightEdges === null) {
      //       self.changeNode(obj, obj.lastState.graphInfo.highlightNodes, 0)
      //       self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)

      //       self.changeEdge(obj, obj.nextState.graphInfo.highlightEdges, 2)
      //     } else {
      //       self.changeNode(obj, obj.lastState.graphInfo.highlightNodes, 0)
      //       self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)

      //       self.changeEdge(obj, obj.lastState.graphInfo.highlightEdges, 0)
      //       self.changeEdge(obj, obj.nextState.graphInfo.highlightEdges, 2)
      //     }
      //     break
      //   case CODE.ACCEPT:
      //     self.$message({
      //       type: 'success',
      //       message: '提取Token'
      //     })
      //     self.changeWindow(obj)
      //     if (obj.lastState.graphInfo.highlightEdges === null) {
      //       self.changeNode(obj, obj.lastState.graphInfo.highlightNodes, 0)
      //       self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)

      //       self.changeEdge(obj, obj.nextState.graphInfo.highlightEdges, 2)
      //     } else {
      //       self.changeNode(obj, obj.lastState.graphInfo.highlightNodes, 0)
      //       self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)

      //       self.changeEdge(obj, obj.lastState.graphInfo.highlightEdges, 0)
      //       self.changeEdge(obj, obj.nextState.graphInfo.highlightEdges, 2)
      //     }
      //     break
      //   case CODE.REJECT:
      //     self.$message({
      //       type: 'success',
      //       message: '遇到了NFA拒绝的输入'
      //     })
      //     break
      //   case CODE.UNKNOWN:
      //     self.$message({
      //       type: 'success',
      //       message: '遇到了NFA遇到了不认识的字符'
      //     })
      //     break
      //   default:
      //     break
      // }
    },
    // 上一步
    previous () {
      const self = this
      self.lastState = self.nextState
      self.nextState = self.FNAMachine.preStep()
      let recognized = self.nextState.windowInfo.recognizedTokens.map(obj => {
        let temp = []
        temp.push(obj.startIndex)
        temp.push(obj.endIndex)
        temp.push(obj.REId)
        return temp
      })
      let remains = [
        self.nextState.windowInfo.remains.startIndex,
        self.nextState.windowInfo.remains.endIndex,
        888
      ]
      let scanning = [
        self.nextState.windowInfo.scanning.startIndex,
        self.nextState.windowInfo.scanning.endIndex,
        999
      ]
      recognized.push(scanning)
      recognized.push(remains)
      let html = self.cut(self.TokenForm.Token, recognized)
      self.Token = html

      if (self.nextState.code === 11) {
        this.$message({
          type: 'info',
          message: 'code==11 已经是第一个状态'
        })
      } else {
        this.changeNode(self.lastState.info.highlightNodes, 0)
        this.changeNode(self.nextState.info.highlightNodes, 1)

        this.changeEdge(self.lastState.info.highlightEdges, 0)
        this.changeEdge(self.nextState.info.highlightEdges, 1)
      }
    },
    // 自动展示
    autoControl () {
      if (this.auto === false) {
        this.auto = true
        this.autoText = '停止'
        this.autoButton = 'danger'
        this.timer = setInterval(() => {
          this.next()
        }, 1000)
      } else {
        this.auto = false
        this.autoText = '自动展示'
        this.autoButton = 'primary'
        clearInterval(this.timer)
      }
    },
    cut (str, arr) {
      let str1 = ''
      for (let i of arr) {
        if (i[2] < 888) {
          str1 =
            str1 +
            "<div class='tooltip mode" +
            i[2].toString() +
            "'>" +
            str.substring(i[0], i[1]) +
            '&nbsp;' +
            '<span class="tooltiptext">' +
            sessionStorage.getItem('input').split('\n')[i[2]] +
            '</span></div>'
        } else {
          str1 =
            str1 +
            "<span class='mode" +
            i[2].toString() +
            "'>" +
            str.substring(i[0], i[1]) +
            '</span>'
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
        cssText =
          cssText +
          'div.mode' +
          i.toString() +
          '{ color:' +
          '#' +
          Math.floor(Math.random() * 0xffffff).toString(16) +
          ';}\n'
      }
      return cssText
    },
    // 放大/缩小
    Zoom (name) {
      if (name === 'NFA') {
        this.isChoose1 = !this.isChoose1
      } else if (name === 'DFA') {
        this.isChoose2 = !this.isChoose2
      } else {
        this.isChoose3 = !this.isChoose3
      }
    },
    goto (url) {
      this.$router.push(url)
    },
    // 生成状态机图
    async fresh () {
      const self = this
      // NFA 边、点、容器
      self.NFA.edges = new DataSet(
        createEdges(self.NFA.data.transitionTable, self.NFA.data.alphabet)
      )
      self.NFA.nodes = new DataSet(
        createNodes(self.NFA.data.transitionTable, self.NFA.data.acceptState)
      )
      var NFAdata = {
        nodes: self.NFA.nodes,
        edges: self.NFA.edges
      }
      let NFAcontainer = document.getElementById('NFAvis')
      // DFA 边、点、容器
      self.DFA.edges = new DataSet(
        createEdges(self.DFA.data.transitionTable, self.DFA.data.alphabet)
      )
      self.DFA.nodes = new DataSet(
        createNodes(self.DFA.data.transitionTable, self.DFA.data.acceptState)
      )
      var DFAdata = {
        nodes: self.DFA.nodes,
        edges: self.DFA.edges
      }
      let DFAcontainer = document.getElementById('DFAvis')
      // DFA化简 边、点、容器
      self.DFA_S.edges = new DataSet(
        createEdges(self.DFA_S.data.transitionTable, self.DFA_S.data.alphabet)
      )
      self.DFA_S.nodes = new DataSet(
        createNodes(self.DFA_S.data.transitionTable, self.DFA_S.data.acceptState)
      )
      var DFA_Sdata = {
        nodes: self.DFA_S.nodes,
        edges: self.DFA_S.edges
      }
      let DFA_Scontainer = document.getElementById('DFA_Svis')

      let options = {
        nodes: {
          color: {
            background: 'white',
            highlight: {
              border: 'rgba(139,183,233,1)',
              background: 'white'
            }},
          shape: 'dot',
          size: 30,
          font: {
            size: 18
          },
          borderWidth: 1
        },
        edges: {
          font: {
            size: 35,
            align: 'top'
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

        layout: {
          hierarchical: {
            enabled: true,
            direction: 'LR', // UD, DU, LR, RL
            sortMethod: 'directed' // hubsize, directed
          }
        },
        physics: {
          enabled: true
        }
        // manipulation: {}

      }
      self.NFA.vis = new Network(NFAcontainer, NFAdata, options)
      self.DFA.vis = new Network(DFAcontainer, DFAdata, options)
      self.DFA_S.vis = new Network(DFA_Scontainer, DFA_Sdata, options)
      // self.network.on('doubleClick', params => {
      //   params.event = '[original event]'
      //   this.$emit('node_double_click', params)
      //   console.log('双击事件' + params)
      //   if (this.magnifier === false) {
      //     this.magnifier = true
      //     this.focusPosition(params.pointer.canvas)
      //   } else {
      //     this.magnifier = false
      //     this.fitAnimated()
      //   }
      // })

      // self.network.on('zoom', params => {
      //   params.event = '[original event]'
      //   this.$emit('zoom', params)
      //   console.log('滚动滚轮事件' + params)
      //   this.magnifier = true
      // })
    },
    // 鹰眼
    fitAnimated () {
      var options = {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
      this.NFA.fit({ animation: options })
    },
    // 聚焦到节点
    focusNode (val) {
      var options = {
        // position: {x:positionx,y:positiony}, // this is not relevant when focusing on nodes
        scale: 1.5,
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad'
        }
      }
      this.network.focus(val, options)
      this.magnifier = true
    },
    // 聚焦到坐标
    focusPosition (val) {
      var options = {
        scale: 1.0,
        position: { x: val.x, y: val.y },
        animation: {
          duration: 500,
          easingFunction: 'linear'
        }
      }
      this.network.moveTo(options)
    },
    // 改变节点的颜色
    changeNode (object, _nodes, status) {
      let background
      console.log(object.nodes)
      if (status === 0) {
        background = '#fff'
      } else if (status === 1) {
        background = '#ffD2E5'
      } else {
        background = '#ffE5D2'
      }
      console.log('nodes=======================')
      if (_nodes != null) {
        for (let i = 0; i < _nodes.length; i++) {
          console.log(object.nodes)
          object.nodes.update([{id: _nodes[i], color: {background: background}}])
        }
      }
    },
    // 改变边的颜色
    changeEdge (object, edges, status) {
      let border
      if (status === 0) {
        border = '#2b7ce9'
      } else if (status === 1) {
        border = '#e92b7c'
      } else {
        border = '#e97c2b'
      }
      for (let i = 0; i < edges.length; i++) {
        object.edges.update([{id: edges[i], color: {color: border}}])
      }
    },
    // 布局更改
    layoutChange () {
      if (this.layout === true) {
        this.layout = false
        this.layoutText = '层级结构'
      } else {
        this.layout = true
        this.layoutText = '取消层级结构'
      }
      this.fresh(this.NFAdata)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page {
  /* width: 85%; */
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
  min-width: 1200px;
}
.token {
  background-color: #bbbbbb;
  height: 70px;
}
.controller {
  width: 100%;
  height: 30%;
  margin-top: 6%;
  margin-bottom: 8%;
  text-align: center;
}
div#NFA,
div#DFA,
div#DFA_S {
  height: 240px;
  background-color: #dddddd;
}
#p {
  text-align: center;
  font-size: 46px;
  margin: 0px;
  word-wrap: break-word;
}
</style>

<style>
span.mode999 {
  background-color: red;
}
.tooltip {
  position: relative;
  display: inline-block;
  word-wrap: break-word;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  font-size: 12px;
  /* 定位 */
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
