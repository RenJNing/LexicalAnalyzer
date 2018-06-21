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
                  <el-input style="font-size:20px;" placeholder="请输入词法规则：" type="textarea" :autosize="{ minRows: 14, maxRows: 14}" v-model="REForm.RE" :disabled="!tokenChange" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="generateFA('REForm')" :loading="loading" :disabled="!tokenChange">构建状态机</el-button>
                  <el-button type="primary" :disabled="!tokenChange">清空</el-button>
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
                      <el-button @click="layoutChange()">{{layoutText}}</el-button>
                      <el-button @click="Zoom('NFA')">放大/收缩</el-button>
                      <el-button @click="fitAnimated('NFA')">鹰眼</el-button>
                    </div>
                    <div style="height:350px; " :ref="this.myvis"></div>
                  </div>
                </el-row>
                <div v-if="tokenChange === true" class="token">
                  <el-row>
                    <el-input style="font-size:20px;" placeholder="请输入待分析的的源码：" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" v-model="TokenForm.Token" clearable></el-input>
                  </el-row>
                </div>
                <div v-else class="token">
                  <el-row>
                    <el-col :span="24">
                      <p id="p" v-html="Token"></p>
                    </el-col>
                  </el-row>
                </div>
                <el-row>
                  <div class="controller">
                    <el-button :type="startButton" @click="start('TokenForm')">{{startText}}</el-button>
                    <el-button @click="previous()">上一步</el-button>
                    <el-button @click="next()">下一步</el-button>
                    <el-button :type="autoButton" @click="autoControl()" plain>{{autoText}}</el-button>
                  </div>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="DFA生成" name="DFAGeneration">
              <el-col :span="24">
                <span style="font-size: 35px;">DFA</span>
                <el-button type="primary" @click="fresh('DFA', DFAdata)">显示DFA</el-button>
                <el-button @click="Zoom('DFA')">放大/收缩</el-button>
                <el-button @click="fitAnimated('DFA')">鹰眼</el-button>
                <div id="DFA" :class="{'active':isChoose2}"></div>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="DFA化简" name="DFASimplification">
              <el-col :span="24">
                <span style="font-size: 35px;">DFA化简</span>
                <el-button type="primary" @click="fresh('DFA_S', DFA_Sdata)">显示化简DFA</el-button>
                <el-button @click="Zoom('DFA_S')">放大/收缩</el-button>
                <el-button @click="fitAnimated('DFA_S')">鹰眼</el-button>
                <div id="DFA_S" :class="{'active':isChoose3}"></div>
              </el-col>
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
import {DataSet, Network} from 'vis'
import { Message } from 'element-ui'
import {createNodes, createEdges} from '../../api/vis_api'
import {create_NFA, CODE} from '../../api/NFA'
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
          }, {
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
          }, {
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
          {required: true, message: '输入不能为空', tirgger: 'blur'},
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
        Token: [
          {required: true, message: '输入不能为空', tirgger: 'blur'}
        ]
      },
      tokenChange: true,
      startButton: 'primary',
      startText: '开始分词',
      autoButton: 'primary'
    }
  },
  mounted: function () {
  },
  methods: {
    // 检测tabs标签更改
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 构建状态机
    generateFA (formName) {
      const self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.loading = true
          let re = []
          let input = self.REForm.RE.split('\n')
          for (let i = 0; i < input.length; i++) {
            re.push(input[i].substring(input[i].indexOf('=') + 1))
          }
          // let url = '/RE'
          // let Params = {RE: re}
          // self.$axios.post(url, Params).then(function (response) {
          self.loading = false
          self.disable = false
          sessionStorage.setItem('input', self.REForm.RE)
          self.fresh(this.activeName, this.NFAdata)
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
    start (formName) {
      const self = this
      if (self.tokenChange === true) {
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
        if (self.TokenForm.Token === '') {
          Message({
            message: '请输入表达式',
            type: 'error',
            center: true
          })
        } else {
          self.Token = self.TokenForm.Token
          self.FNAMachine = create_NFA(self.NFAdata.transitionTable, self.NFAdata.alphabet, self.NFAdata.acceptState)
          self.FNAMachine.init()
          self.FNAMachine.feedText(self.TokenForm.Token)
          self.fresh(self.NFAdata)
          self.changeNode([0], 1)
          self.nextState = {graphInfo: {highlightNodes: [0]}}
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
        if (self.auto === true) { this.autoControl() }
      }
    },
    // 下一步
    next () {
      const self = this
      self.lastState = self.nextState
      self.nextState = self.FNAMachine.nextStep()
      let recognized = self.nextState.windowInfo.recognizedTokens.map(obj => {
        let temp = []
        temp.push(obj.startIndex)
        temp.push(obj.endIndex)
        temp.push(obj.REId)
        return temp
      })
      let remains = [self.nextState.windowInfo.remains.startIndex, self.nextState.windowInfo.remains.endIndex, 888]
      let scanning = [self.nextState.windowInfo.scanning.startIndex, self.nextState.windowInfo.scanning.endIndex, 999]
      recognized.push(scanning)
      recognized.push(remains)
      let html = self.cut(self.TokenForm.Token, recognized)
      self.Token = html
      switch (self.nextState.code) {
        case CODE.DONE:
          self.$message({
            type: 'success',
            message: 'Token提取完成'
          })
          break
        case CODE.DOCLOSURE:
          self.$message({
            type: 'success',
            message: '遵循最长子串原则继续重复做闭包和读字符'
          })
          if (this.lastState.graphInfo.highlightEdges === null) {
            this.changeNode(this.lastState.graphInfo.highlightNodes, 0)
            this.changeNode(this.nextState.graphInfo.highlightNodes, 2)

            this.changeEdge(this.nextState.graphInfo.highlightEdges, 2)
          } else {
            this.changeNode(this.lastState.graphInfo.highlightNodes, 0)
            this.changeNode(this.nextState.graphInfo.highlightNodes, 2)

            this.changeEdge(this.lastState.graphInfo.highlightEdges, 0)
            this.changeEdge(this.nextState.graphInfo.highlightEdges, 2)
          }
          break
        case CODE.READCHAR:
          self.$message({
            type: 'info',
            message: '遵循最长子串原则继续重复做闭包和读字符'
          })
          if (this.lastState.graphInfo.highlightEdges === null) {
            this.changeNode(this.lastState.graphInfo.highlightNodes, 0)
            this.changeNode(this.nextState.graphInfo.highlightNodes, 1)

            this.changeEdge(this.nextState.graphInfo.highlightEdges, 1)
          } else {
            this.changeNode(this.lastState.graphInfo.highlightNodes, 0)
            this.changeNode(this.nextState.graphInfo.highlightNodes, 1)

            this.changeEdge(this.lastState.graphInfo.highlightEdges, 0)
            this.changeEdge(this.nextState.graphInfo.highlightEdges, 1)
          }
          break
        case CODE.ACCEPT:
          self.$message({
            type: 'success',
            message: '提取Token'
          })
          if (this.lastState.graphInfo.highlightEdges === null) {
            this.changeNode(this.lastState.info.highlightNodes, 0)
            this.changeNode(this.nextState.info.highlightNodes, 1)

            this.changeEdge(this.nextState.info.highlightEdges, 1)
          } else {
            this.changeNode(this.lastState.info.highlightNodes, 0)
            this.changeNode(this.nextState.info.highlightNodes, 1)

            this.changeEdge(this.lastState.info.highlightEdges, 0)
            this.changeEdge(this.nextState.info.highlightEdges, 1)
          }
          break
        case CODE.REJECT:
          self.$message({
            type: 'success',
            message: '遇到了NFA拒绝的输入'
          })
          break
        case CODE.UNKNOWN:
          self.$message({
            type: 'success',
            message: '遇到了NFA遇到了不认识的字符'
          })
          break
        default:
          break
      }
      //   if (self.nextState.code === CODE.DONE) {
      //   this.$message({
      //     type: 'success',
      //     message: 'Token提取完成'
      //   })
      // } else if (self.nextState.code === 1) {
      //   this.$message({
      //     type: 'success',
      //     message: 'code==1' + '匹配到正则表达式'
      //   })
      //   if (self.lastState === null || self.lastState.info.highlightEdges === null) {
      //     this.changeNode(self.lastState.info.highlightNodes, 0)
      //     this.changeNode(self.nextState.info.highlightNodes, 1)

      //     this.changeEdge(self.nextState.info.highlightEdges, 1)
      //   } else {
      //     this.changeNode(self.lastState.info.highlightNodes, 0)
      //     this.changeNode(self.nextState.info.highlightNodes, 1)

      //     this.changeEdge(self.lastState.info.highlightEdges, 0)
      //     this.changeEdge(self.nextState.info.highlightEdges, 1)
      //   }
      // } else {
      //   if (self.lastState === null || self.lastState.info.highlightEdges === null) {
      //     this.changeNode(self.lastState.info.highlightNodes, 0)
      //     this.changeNode(self.nextState.info.highlightNodes, 1)

      //     this.changeEdge(self.nextState.info.highlightEdges, 1)
      //   } else {
      //     this.changeNode(self.lastState.info.highlightNodes, 0)
      //     this.changeNode(self.nextState.info.highlightNodes, 1)

      //     this.changeEdge(self.lastState.info.highlightEdges, 0)
      //     this.changeEdge(self.nextState.info.highlightEdges, 1)
      //   }
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
      let remains = [self.nextState.windowInfo.remains.startIndex, self.nextState.windowInfo.remains.endIndex, 888]
      let scanning = [self.nextState.windowInfo.scanning.startIndex, self.nextState.windowInfo.scanning.endIndex, 999]
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
    async fresh (containerid, networkdata) {
      const self = this
      self.edges = new DataSet(createEdges(networkdata.transitionTable, networkdata.alphabet))
      self.nodes = new DataSet(createNodes(networkdata.transitionTable, networkdata.acceptState))
      var data = {
        nodes: self.nodes,
        edges: self.edges
      }
      let container = this.$refs[this.myvis]
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
            enabled: self.layout,
            direction: 'LR', // UD, DU, LR, RL
            sortMethod: 'directed' // hubsize, directed
          }
        },
        physics: {
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.1,
            springLength: 100
          }
        }
        // manipulation: {}

      }

      if (containerid === 'NFAGeneration') {
        self.NFA = new Network(container, data, options)
      } else if (containerid === 'DFAGeneration') {
        self.DFA = new Network(container, data, options)
      } else {
        self.DFA_S = new Network(container, data, options)
      }
      self.network.on('doubleClick', (params) => {
        params.event = '[original event]'
        this.$emit('node_double_click', params)
        console.log('双击事件' + params)
        if (this.magnifier === false) {
          this.magnifier = true
          this.focusPosition(params.pointer.canvas)
        } else {
          this.magnifier = false
          this.fitAnimated()
        }
      })

      self.network.on('zoom', (params) => {
        params.event = '[original event]'
        this.$emit('zoom', params)
        console.log('滚动滚轮事件' + params)
        this.magnifier = true
      })
    },
    // 鹰眼
    fitAnimated () {
      var options = {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
      this.NFA.fit({animation: options})
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
        position: {x: val.x, y: val.y},
        animation: {
          duration: 500,
          easingFunction: 'linear'
        }
      }
      this.network.moveTo(options)
    },
    // 改变节点的颜色
    changeNode (nodes, colorNum) {
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
        this.nodes.update([{id: nodes[i], color: {background: backgroud, border: border}}])
      }
    },
    // 改变边的颜色
    changeEdge (edges, colorNum) {
      let border
      if (colorNum === 0) {
        border = '#2b7ce9'
      } else if (colorNum === 1) {
        border = '#e92b7c'
      } else {
        border = '#e97c2b'
      }
      for (let i = 0; i < edges.length; i++) {
        this.edges.update([{id: edges[i].id, color: {color: border}}])
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
  #p{
    font-size: 46px;
    text-align:center;
    word-wrap:break-word;
  }
  span.mode999{
    background-color:red;
  }
</style>
