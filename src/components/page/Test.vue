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
                  <el-input style="font-size:20px;" placeholder="请输入词法规则：" type="textarea" :autosize="{ minRows: 10, maxRows: 10}" v-model="REForm.RE"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="generateFA('REForm')">构建状态机</el-button>
                  <el-button @click="resetForm('REForm')" icon="el-icon-circle-close-outline" circle></el-button>
                  <el-button icon="el-icon-star-off" circle></el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="16" :offset="1">
        <div class="tab">
          <el-tabs v-model="TabActiveName">
            <el-tab-pane label="NFA生成" name="NFAGeneration">
              <div style="background-color: #dddddd; height: 100%">
                <el-row>
                  <div class="graph">
                    <span style="font-size: 35px;">NFA</span>
                    <div style="float: right">
                      <!-- <el-button @click="layoutChange()">{{layoutText}}</el-button> -->
                      <!-- <el-button @click="Zoom('NFA')">放大/收缩</el-button> -->
                      <el-button @click="fitAnimated(NFA)">适应屏幕</el-button>
                    </div>
                    <div style="height:350px; " id="NFAvis"></div>
                  </div>
                </el-row>
                <div class="token">
                <div v-if="NFA.hasbegin">
                  <div class="p" v-html="NFA.Token"></div>
                </div>
                <div v-else>
                  <el-input style="font-size:20px;" placeholder="请输入待分析的的源码：" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" v-model="NFA.TokenForm"></el-input>
                </div>
                </div>
                <el-row>
                  <div class="controller">
                    <el-button @click="startButton(NFA)" :type="NFA.startbuttonType">{{NFA.startbuttonText}}</el-button>
                    <el-button>上一步</el-button>
                    <el-button @click="next(NFA)">下一步</el-button>
                    <el-button :type="NFA.autobuttonType" plain>{{NFA.autobuttonText}}</el-button>
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
                      <!-- <el-button @click="layoutChange()">{{layoutText}}</el-button>
                      <el-button @click="Zoom('NFA')">放大/收缩</el-button>
                      <el-button @click="fitAnimated('NFA')">适应屏幕</el-button> -->
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
                      <!-- <el-button @click="layoutChange()">{{layoutText}}</el-button>
                      <el-button @click="Zoom('NFA')">放大/收缩</el-button>
                      <el-button @click="fitAnimated('NFA')">适应屏幕</el-button> -->
                    </div>
                    <div style="height:350px; " id="DFA_Svis"></div>
                  </div>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="查看代码" name="codeShow">
              <el-col :span="24">
                <span style="font-size: 35px;">敬请期待</span>
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
import { create_NFA, NFA_CODE } from '../../api/NFA'
import { create_DFA, DFA_CODE } from '../../api/DFA'
export default {
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
      title: '词法分析',
      REForm: {
        RE: ''
      },
      rulesRE: {
        RE: [
          { required: true, message: '输入不能为空', tirgger: 'blur' },
          { validator: validateRe, trigger: 'blur' }
        ]
      },
      TabActiveName: 'NFAGeneration',
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
        machine: null,
        nodes: null,
        edges: null,
        vis: null,
        lastState: null,
        nextState: null,
        TokenForm: '',
        Token: '',
        hasbegin: false,
        startbuttonType: 'primary',
        startbuttonText: '开始分词',
        autobuttonType: 'primary',
        autobuttonText: '自动展示'
      },
      DFA: {
        data: {
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
        machine: '',
        nodes: '',
        deges: '',
        vis: ''
      },
      DFA_S: {
        data: {
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
        machine: '',
        nodes: '',
        deges: '',
        vis: ''
      },
      auto: false,
      layout: true,
      RE: ''
    }
  },
  methods: {
    // 构建状态机
    generateFA (formName) {
      const self = this
      // 验证表单输入
      self.$refs[formName].validate(valid => {
        if (valid) {
          let re = []
          let input = self.REForm.RE.split('\n')
          for (let i = 0; i < input.length; i++) {
            re.push(input[i].substring(input[i].indexOf('=') + 1))
          }
          // let url = '/api/lexical/regularExpression'
          // let Params = {RE: re}
          // self.$axios.post(url, Params).then(function (response) {
          sessionStorage.setItem('input', self.REForm.RE)
          self.addCSS(self.getCsstext())
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
          color: {
            color: '#2b7ce9'
          },
          font: {
            size: 35,
            align: 'top'
          }
        },
        autoResize: true,
        height: '100%',
        width: '100%',
        clickToUse: true,
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
      }

      self.NFA.vis = new Network(NFAcontainer, NFAdata, options)
      self.DFA.vis = new Network(DFAcontainer, DFAdata, options)
      self.DFA_S.vis = new Network(DFA_Scontainer, DFA_Sdata, options)
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 开始分词
    startButton (object) {
      const self = this
      if (object.hasbegin === false) {
        if (object.TokenForm === '') {
          Message({
            message: '请输入待分析的源码',
            type: 'error',
            center: true
          })
        } else {
          object.Token = object.TokenForm
          if (object === self.NFA) {
            object.machine = create_NFA(object.data.transitionTable, object.data.alphabet, object.data.acceptState)
          } else {
            object.machine = create_DFA(object.data.transitionTable, object.data.alphabet, object.data.acceptState)
          }
          object.machine.feedText(object.TokenForm)
          object.nextState = object.machine.init()
          self.changeNode(object, object.nextState.graphInfo.highlightNodes, 1)
          object.hasbegin = true
          object.startbuttonType = 'danger'
          object.startbuttonText = '停止分词'
        }
      } else {
        object.machine = null
        object.hasbegin = false
        object.startbuttonType = 'primary'
        object.startbuttonText = '开始分词'
        self.fresh()
        // if (object.auto === true) { this.autoControl(object) }
      }
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
    // 改变节点的颜色
    changeNode (object, _nodes, status) {
      let bgcolor
      if (status === 0) {
        bgcolor = '#fff'
      } else if (status === 1) {
        bgcolor = '#ffD2E5'
      } else {
        bgcolor = '#ffE5D2'
      }
      for (let i = 0; i < _nodes.length; i++) {
        object.nodes.update([{id: _nodes[i], color: {background: bgcolor}}])
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
    // 适应屏幕
    fitAnimated (object) {
      var options = {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
      object.vis.fit({animation: options})
    },
    // NFA下一步
    next (object) {
      const self = this
      object.lastState = object.nextState
      object.nextState = object.machine.nextStep()
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
            self.changeNode(object, object.lastState.graphInfo.highlightNodes, 0)
            self.changeNode(object, object.nextState.graphInfo.highlightNodes, 2)

            self.changeEdge(object, object.nextState.graphInfo.highlightEdges, 2)
          } else {
            self.changeNode(object, object.lastState.graphInfo.highlightNodes, 0)
            self.changeNode(object, object.nextState.graphInfo.highlightNodes, 2)

            self.changeEdge(object, object.lastState.graphInfo.highlightEdges, 0)
            self.changeEdge(object, object.nextState.graphInfo.highlightEdges, 2)
          }
          break
        case NFA_CODE.READCHAR:
          self.$message({
            type: 'info',
            message: '遵循最长子串原则继续重复做闭包和读字符'
          })
          self.changeWindow(object)
          if (object.lastState.graphInfo.highlightEdges === null) {
            self.changeNode(object, object.lastState.graphInfo.highlightNodes, 0)
            self.changeNode(object, object.nextState.graphInfo.highlightNodes, 1)

            self.changeEdge(object, object.nextState.graphInfo.highlightEdges, 1)
          } else {
            self.changeNode(object, object.lastState.graphInfo.highlightNodes, 0)
            self.changeNode(object, object.nextState.graphInfo.highlightNodes, 1)

            self.changeEdge(object, object.lastState.graphInfo.highlightEdges, 0)
            self.changeEdge(object, object.nextState.graphInfo.highlightEdges, 1)
          }
          break
        case NFA_CODE.ACCEPT:
          self.$message({
            type: 'success',
            message: '提取Token'
          })
          self.changeWindow(object)
          if (object.lastState.graphInfo.highlightEdges === null) {
            self.changeNode(object, object.lastState.graphInfo.highlightNodes, 0)
            self.changeNode(object, object.nextState.graphInfo.highlightNodes, 1)

            self.changeEdge(object, object.nextState.graphInfo.highlightEdges, 1)
          } else {
            self.changeNode(object, object.lastState.graphInfo.highlightNodes, 0)
            self.changeNode(object, object.nextState.graphInfo.highlightNodes, 1)

            self.changeEdge(object, object.lastState.graphInfo.highlightEdges, 0)
            self.changeEdge(object, object.nextState.graphInfo.highlightEdges, 1)
          }
          break
        case NFA_CODE.REJECT:
          self.$message({
            type: 'error',
            message: '遇到了NFA拒绝的输入'
          })
          break
        case NFA_CODE.UNKNOWN:
          self.$message({
            type: 'error',
            message: '遇到了NFA遇到了不认识的字符'
          })
          break
        default:
          break
      }
    },
    // 改变文字框
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
      let html = self.cut(object.TokenForm, recognized)
      object.Token = html
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
    }

  //   // 检测tabs标签更改
  //   handleClick (tab, event) {
  //     console.log(tab, event)
  //   },

  //   changeWindow (object) {
  //     const self = this
  //     let recognized = object.nextState.windowInfo.recognizedTokens.map(obj => {
  //       let temp = []
  //       temp.push(obj.startIndex)
  //       temp.push(obj.endIndex)
  //       temp.push(obj.REId)
  //       return temp
  //     })
  //     let remains = [
  //       object.nextState.windowInfo.remains.startIndex,
  //       object.nextState.windowInfo.remains.endIndex,
  //       888
  //     ]
  //     let scanning = [
  //       object.nextState.windowInfo.scanning.startIndex,
  //       object.nextState.windowInfo.scanning.endIndex,
  //       999
  //     ]
  //     recognized.push(scanning)
  //     recognized.push(remains)
  //     let html = self.cut(self.TokenForm.Token, recognized)
  //     self.Token = html
  //   },
  //   // 下一步
  //   next (obj) {
  //     const self = this
  //     console.log(obj)
  //     obj.lastState = obj.nextState
  //     obj.nextState = obj.machine.nextStep()
  //     self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)
  //     // switch (obj.nextState.code) {
  //     //   case CODE.DONE:
  //     //     self.$message({
  //     //       type: 'success',
  //     //       message: 'Token提取完成'
  //     //     })
  //     //     break
  //     //   case CODE.DOCLOSURE:
  //     //     self.$message({
  //     //       type: 'success',
  //     //       message: '遵循最长子串原则继续重复做闭包'
  //     //     })
  //     //     if (obj.lastState.graphInfo.highlightEdges === null) {
  //     //       self.changeNode(obj, obj.lastState.graphInfo.highlightNodes, 0)
  //     //       self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)

  //     //       self.changeEdge(obj, obj.nextState.graphInfo.highlightEdges, 2)
  //     //     } else {
  //     //       self.changeNode(obj, obj.lastState.graphInfo.highlightNodes, 0)
  //     //       self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)

  //     //       self.changeEdge(obj, obj.lastState.graphInfo.highlightEdges, 0)
  //     //       self.changeEdge(obj, obj.nextState.graphInfo.highlightEdges, 2)
  //     //     }
  //     //     break
  //     //   case CODE.READCHAR:
  //     //     self.$message({
  //     //       type: 'info',
  //     //       message: '遵循最长子串原则继续读字符'
  //     //     })
  //     //     self.changeWindow(obj)
  //     //     if (obj.lastState.graphInfo.highlightEdges === null) {
  //     //       self.changeNode(obj, obj.lastState.graphInfo.highlightNodes, 0)
  //     //       self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)

  //     //       self.changeEdge(obj, obj.nextState.graphInfo.highlightEdges, 2)
  //     //     } else {
  //     //       self.changeNode(obj, obj.lastState.graphInfo.highlightNodes, 0)
  //     //       self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)

  //     //       self.changeEdge(obj, obj.lastState.graphInfo.highlightEdges, 0)
  //     //       self.changeEdge(obj, obj.nextState.graphInfo.highlightEdges, 2)
  //     //     }
  //     //     break
  //     //   case CODE.ACCEPT:
  //     //     self.$message({
  //     //       type: 'success',
  //     //       message: '提取Token'
  //     //     })
  //     //     self.changeWindow(obj)
  //     //     if (obj.lastState.graphInfo.highlightEdges === null) {
  //     //       self.changeNode(obj, obj.lastState.graphInfo.highlightNodes, 0)
  //     //       self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)

  //     //       self.changeEdge(obj, obj.nextState.graphInfo.highlightEdges, 2)
  //     //     } else {
  //     //       self.changeNode(obj, obj.lastState.graphInfo.highlightNodes, 0)
  //     //       self.changeNode(obj, obj.nextState.graphInfo.highlightNodes, 2)

  //     //       self.changeEdge(obj, obj.lastState.graphInfo.highlightEdges, 0)
  //     //       self.changeEdge(obj, obj.nextState.graphInfo.highlightEdges, 2)
  //     //     }
  //     //     break
  //     //   case CODE.REJECT:
  //     //     self.$message({
  //     //       type: 'success',
  //     //       message: '遇到了NFA拒绝的输入'
  //     //     })
  //     //     break
  //     //   case CODE.UNKNOWN:
  //     //     self.$message({
  //     //       type: 'success',
  //     //       message: '遇到了NFA遇到了不认识的字符'
  //     //     })
  //     //     break
  //     //   default:
  //     //     break
  //     // }
  //   },
  //   // 上一步
  //   previous () {
  //     const self = this
  //     self.lastState = self.nextState
  //     self.nextState = self.FNAMachine.preStep()
  //     let recognized = self.nextState.windowInfo.recognizedTokens.map(obj => {
  //       let temp = []
  //       temp.push(obj.startIndex)
  //       temp.push(obj.endIndex)
  //       temp.push(obj.REId)
  //       return temp
  //     })
  //     let remains = [
  //       self.nextState.windowInfo.remains.startIndex,
  //       self.nextState.windowInfo.remains.endIndex,
  //       888
  //     ]
  //     let scanning = [
  //       self.nextState.windowInfo.scanning.startIndex,
  //       self.nextState.windowInfo.scanning.endIndex,
  //       999
  //     ]
  //     recognized.push(scanning)
  //     recognized.push(remains)
  //     let html = self.cut(self.TokenForm.Token, recognized)
  //     self.Token = html

  //     if (self.nextState.code === 11) {
  //       this.$message({
  //         type: 'info',
  //         message: 'code==11 已经是第一个状态'
  //       })
  //     } else {
  //       this.changeNode(self.lastState.info.highlightNodes, 0)
  //       this.changeNode(self.nextState.info.highlightNodes, 1)

  //       this.changeEdge(self.lastState.info.highlightEdges, 0)
  //       this.changeEdge(self.nextState.info.highlightEdges, 1)
  //     }
  //   },
  //   // 自动展示
  //   autoControl () {
  //     if (this.auto === false) {
  //       this.auto = true
  //       this.status.autobuttonText = '停止'
  //       this.status.autobuttonType = 'danger'
  //       this.timer = setInterval(() => {
  //         this.next()
  //       }, 1000)
  //     } else {
  //       this.auto = false
  //       this.status.autobuttonText = '自动展示'
  //       this.status.autobuttonType = 'primary'
  //       clearInterval(this.timer)
  //     }
  //   },
  //   // 放大/缩小
  //   Zoom (name) {
  //     if (name === 'NFA') {
  //       this.isChoose1 = !this.isChoose1
  //     } else if (name === 'DFA') {
  //       this.isChoose2 = !this.isChoose2
  //     } else {
  //       this.isChoose3 = !this.isChoose3
  //     }
  //   },
  //   goto (url) {
  //     this.$router.push(url)
  //   },
  //   // 鹰眼
  //   fitAnimated () {
  //     var options = {
  //       duration: 1000,
  //       easingFunction: 'easeInOutQuad'
  //     }
  //     this.NFA.fit({ animation: options })
  //   },
  //   // 聚焦到节点
  //   focusNode (val) {
  //     var options = {
  //       // position: {x:positionx,y:positiony}, // this is not relevant when focusing on nodes
  //       scale: 1.5,
  //       animation: {
  //         duration: 1000,
  //         easingFunction: 'easeInOutQuad'
  //       }
  //     }
  //     this.network.focus(val, options)
  //     this.magnifier = true
  //   },
  //   // 聚焦到坐标
  //   focusPosition (val) {
  //     var options = {
  //       scale: 1.0,
  //       position: { x: val.x, y: val.y },
  //       animation: {
  //         duration: 500,
  //         easingFunction: 'linear'
  //       }
  //     }
  //     this.network.moveTo(options)
  //   },

  //   // 布局更改
  //   layoutChange () {
  //     if (this.layout === true) {
  //       this.layout = false
  //       this.layoutText = '层级结构'
  //     } else {
  //       this.layout = true
  //       this.layoutText = '取消层级结构'
  //     }
  //     this.fresh(this.NFAdata)
  //   }
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
.p {
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
