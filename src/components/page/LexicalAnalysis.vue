<template>
  <div class="page">
    <el-row>
      <el-col :span="5" :offset="RE_offset">
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
                  <el-button :disabled="NFA.hasbegin" type="primary" @click="generateFA('REForm')">构建状态机</el-button>
                  <el-button @click="resetForm('REForm')" icon="el-icon-circle-close-outline" circle></el-button>
                  <el-button icon="el-icon-star-off" circle></el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="16" :offset="1">
        <!-- <div v-if="isFirsttime" >
          <p>词法分析是编译的第一阶段</p>
        </div> -->
        <div class="tab">
          <el-tabs v-model="TabActiveName" @tab-click="handleClick">
            <el-tab-pane label="NFA生成" name="NFAGeneration">
              <div style="background-color: #dddddd; height: 100%">
                <el-row>
                  <div :class="{'active':NFA.isFull_screen,'graph':true}">
                    <span style="font-size: 35px;">NFA</span>
                    <div style="float: right">
                      <!-- <el-button @click="layoutChange()">{{layoutText}}</el-button> -->
                      <el-button type="info" :icon="NFA.zoomicon" circle @click="full_screen(NFA)"></el-button>
                      <el-button type="info" icon="el-icon-view" circle @click="fitAnimated(NFA)"></el-button>
                    </div>
                    <div class="vis" id="NFAvis"></div>
                  </div>
                </el-row>
                <div class="token">
                <div v-if="NFA.hasbegin">
                  <div class="scroll_bar">
                    <div class="p" v-html="NFA.Token"></div>
                  </div>
                </div>
                <div v-else>
                  <el-input style="font-size:20px;" placeholder="请输入待分析的的源码：" type="textarea" :autosize="{ minRows: 3, maxRows: 3}" v-model="NFA.TokenForm"></el-input>
                </div>
                </div>
                <el-row>
                  <div class="controller">
                    <el-button :disabled="isFirsttime" @click="startButton(NFA)" :type="NFA.startbuttonType">{{NFA.startbuttonText}}</el-button>
                    <el-button :disabled="!NFA.hasbegin" @click="previous(NFA)">上一步</el-button>
                    <el-button :disabled="!NFA.hasbegin" @click="next(NFA)">下一步</el-button>
                    <el-button :disabled="!NFA.hasbegin" @click="autoControl(NFA)" :type="NFA.autobuttonType" plain>{{NFA.autobuttonText}}</el-button>
                  </div>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="DFA生成" name="DFAGeneration">
              <div style="background-color: #dddddd; height: 100%">
                <el-row>
                  <div :class="{'active':DFA.isFull_screen,'graph':true}">
                    <span style="font-size: 35px;">DFA</span>
                    <div style="float: right">
                      <!-- <el-button @click="layoutChange()">{{layoutText}}</el-button> -->
                      <el-button type="info" :icon="DFA.zoomicon" circle @click="full_screen(DFA)"></el-button>
                      <el-button type="info" icon="el-icon-view" circle @click="fitAnimated(DFA)"></el-button>
                    </div>
                    <div class="vis" id="DFAvis"></div>
                  </div>
                </el-row>
                <div class="token">
                <div v-if="DFA.hasbegin">
                  <div class="scroll_bar">
                    <div class="p" v-html="DFA.Token"></div>
                  </div>
                </div>
                <div v-else>
                  <el-input style="font-size:20px;" placeholder="请输入待分析的的源码：" type="textarea" :autosize="{ minRows: 3, maxRows: 3}" v-model="DFA.TokenForm"></el-input>
                </div>
                </div>
                <el-row>
                  <div class="controller">
                    <el-button :disabled="isFirsttime" @click="startButton(DFA)" :type="DFA.startbuttonType">{{DFA.startbuttonText}}</el-button>
                    <el-button :disabled="!DFA.hasbegin" @click="previousFocus(DFA)">上一步</el-button>
                    <el-button :disabled="!DFA.hasbegin" @click="nextFocus(DFA)">下一步</el-button>
                    <el-button :disabled="!DFA.hasbegin" @click="autoControlFocus(DFA)" :type="DFA.autobuttonType" plain>{{DFA.autobuttonText}}</el-button>
                  </div>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="DFA化简" name="DFASimplification">
              <div style="background-color: #dddddd; height: 100%">
                <el-row>
                  <div :class="{'active':DFA_S.isFull_screen,'graph':true}">
                    <span style="font-size: 35px;">DFA化简</span>
                    <div style="float: right">
                      <!-- <el-button @click="layoutChange()">{{layoutText}}</el-button> -->
                      <el-button type="info" :icon="DFA_S.zoomicon" circle @click="full_screen(DFA_S)"></el-button>
                      <el-button type="info" icon="el-icon-view" circle @click="fitAnimated(DFA_S)"></el-button>
                    </div>
                    <div class="vis" id="DFA_Svis"></div>
                  </div>
                </el-row>
                <div class="token">
                <div v-if="DFA_S.hasbegin">
                  <div class="scroll_bar">
                    <div class="p" v-html="DFA_S.Token"></div>
                  </div>
                </div>
                <div v-else>
                  <el-input style="font-size:20px;" placeholder="请输入待分析的的源码：" type="textarea" :autosize="{ minRows: 3, maxRows: 3}" v-model="DFA_S.TokenForm"></el-input>
                </div>
                </div>
                <el-row>
                  <div class="controller">
                    <el-button :disabled="isFirsttime" @click="startButton(DFA_S)" :type="DFA_S.startbuttonType">{{DFA_S.startbuttonText}}</el-button>
                    <el-button :disabled="!DFA_S.hasbegin" @click="previousFocus(DFA_S)">上一步</el-button>
                    <el-button :disabled="!DFA_S.hasbegin" @click="nextFocus(DFA_S)">下一步</el-button>
                    <el-button :disabled="!DFA_S.hasbegin" @click="autoControlFocus(DFA_S)" :type="DFA_S.autobuttonType" plain>{{DFA_S.autobuttonText}}</el-button>
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
          let index = input[i].indexOf('=')
          if (index === -1) {
            callback(new Error('第' + (i + 1).toString() + "条规则缺少'=',请按格式输入"))
          } else if (index < 1) {
            // 等式左侧不能为空
            callback(new Error('第' + (i + 1).toString() + '条规则等式左侧不能为空'))
          } else {
            let re = new RegExp(input[i].substring(input[i].indexOf('=') + 1))
          }
        } catch (e) {
          callback(
            new Error(
              '第' + (i + 1).toString() + '条规则不合法，请重新输入'
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
          { max: 1200, message: '不能超过1200个字符', tirgger: 'blur' },
          { validator: validateRe, trigger: 'blur' }
        ]
      },
      TabActiveName: 'NFAGeneration',
      status: {
        loading: false
      },
      NFA: {
        data: {
          transitionTable: [],
          alphabet: [],
          acceptState: []
        },
        machine: null,
        nodes: null,
        edges: null,
        lastState: null,
        nextState: null,
        TokenForm: '',
        Token: '',
        TokenId: 0,
        hasbegin: false,
        startbuttonType: 'primary',
        startbuttonText: '开始分词',
        autobuttonType: 'primary',
        autobuttonText: '自动展示',
        isFull_screen: false,
        zoomicon: 'el-icon-zoom-in'
      },
      DFA: {
        data: {
          transitionTable: [],
          alphabet: [],
          acceptState: []
        },
        machine: null,
        nodes: null,
        edges: null,
        lastState: null,
        nextState: null,
        TokenForm: '',
        Token: '',
        TokenId: 1,
        hasbegin: false,
        startbuttonType: 'primary',
        startbuttonText: '开始分词',
        autobuttonType: 'primary',
        autobuttonText: '自动展示',
        isFull_screen: false,
        zoomicon: 'el-icon-zoom-in'
      },
      DFA_S: {
        data: {
          transitionTable: [],
          alphabet: [],
          acceptState: []
        },
        machine: null,
        nodes: null,
        edges: null,
        lastState: null,
        nextState: null,
        TokenForm: '',
        Token: '',
        TokenId: 2,
        hasbegin: false,
        startbuttonType: 'primary',
        startbuttonText: '开始分词',
        autobuttonType: 'primary',
        autobuttonText: '自动展示',
        isFull_screen: false,
        zoomicon: 'el-icon-zoom-in'
      },
      RE_offset: 1,
      isFirsttime: true
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
          let url = '/api/lexical/regularExpression'
          let Params = { RE: re }
          self.$axios
            .post(url, Params)
            .then(function (response) {
              console.log(response)
              self.NFA.data.transitionTable = response.data[0].transitionTable
              self.NFA.data.alphabet = response.data[0].alphabet
              self.NFA.data.acceptState = response.data[0].acceptStateList
              self.DFA.data.transitionTable = response.data[1].transitionTable
              self.DFA.data.alphabet = response.data[1].alphabet
              self.DFA.data.acceptState = response.data[1].acceptStateList
              self.DFA_S.data.transitionTable =
                response.data[2].transitionTable
              self.DFA_S.data.alphabet = response.data[2].alphabet
              self.DFA_S.data.acceptState = response.data[2].acceptStateList
              sessionStorage.setItem('input', self.REForm.RE)
              self.addCSS(self.getCsstext())
              self.isFirsttime = false
              self.fresh()
            })
            .catch(function (error) {
              self.loading = false
              console.log(error)
              Message({
                message: '请检查网络并重试',
                type: 'error',
                center: true
              })
            })
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
        createNodes(
          self.DFA_S.data.transitionTable,
          self.DFA_S.data.acceptState
        )
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
            }
          },
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
            object.machine = create_NFA(
              object.data.transitionTable,
              object.data.alphabet,
              object.data.acceptState
            )
          } else {
            object.machine = create_DFA(
              object.data.transitionTable,
              object.data.alphabet,
              object.data.acceptState
            )
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
        self.refresh(object)
        if (object.autobuttonText === '停止') {
          self.autoControl(object)
        }
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
        object.nodes.update([
          { id: _nodes[i], color: { background: bgcolor } }
        ])
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
        object.edges.update([{ id: edges[i], color: { color: border } }])
      }
    },
    // 适应屏幕
    fitAnimated (object) {
      var options = {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
      object.vis.fit({ animation: options })
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
            message: '闭包'
          })
          self.changeWindow(object)
          self.changeGraph(object, 2)
          break
        case NFA_CODE.READCHAR:
          self.$message({
            type: 'success',
            message: '读取字符'
          })
          self.changeWindow(object)
          self.changeGraph(object, 1)
          break
        case NFA_CODE.ACCEPT:
          self.$message({
            type: 'success',
            message: '提取Token'
          })
          self.changeWindow(object)
          self.changeGraph(object, 1)
          break
        case NFA_CODE.REJECT:
          // self.$message({
          //   type: 'error',
          //   message: '遇到了NFA拒绝的输入'
          // })
          alert('遇到了NFA拒绝的输入')
          break
        case NFA_CODE.UNKNOWN:
          // self.$message({
          //   type: 'error',
          //   message: '遇到了NFA不认识的字符'
          // })
          alert('遇到了NFA不认识的字符')
          break
        default:
          break
      }
    },
    nextFocus (object) {
      const self = this
      object.lastState = object.nextState
      object.nextState = object.machine.nextStep()
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
            message: '读取字符'
          })
          self.changeWindow(object)
          self.changeGraph(object, 2)
          self.focusNode(object.nextState.graphInfo.highlightNodes[0], object)
          break
        case DFA_CODE.READCHAR:
          self.$message({
            type: 'info',
            message: '遵循最长子串原则继续重复做闭包和读字符'
          })
          self.changeWindow(object)
          self.changeGraph(object, 1)
          self.focusNode(object.nextState.graphInfo.highlightNodes[0], object)

          break
        case DFA_CODE.ACCEPT:
          self.$message({
            type: 'success',
            message: '提取Token'
          })
          self.changeWindow(object)
          self.changeGraph(object, 1)
          self.focusNode(object.nextState.graphInfo.highlightNodes[0], object)

          break
        case DFA_CODE.REJECT:
          self.$message({
            type: 'success',
            message: '遇到了DFA拒绝的输入'
          })
          break
        case DFA_CODE.UNKNOWN:
          self.$message({
            type: 'success',
            message: '遇到了DFA不认识的字符'
          })
          break
        default:
          break
      }
    },
    // NFA上一步
    previous (object) {
      const self = this
      object.lastState = object.nextState
      object.nextState = object.machine.preStep()
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
          self.changeGraph(object, 1)
          break
        default:
          break
      }
    },
    previousFocus (object) {
      const self = this
      object.lastState = object.nextState
      object.nextState = object.machine.preStep()
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
          self.changeGraph(object, 1)
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
      // 自动滑动滚动条，把扫描框聚焦在中央
      try {
        document.getElementsByClassName('p')[object.TokenId].scrollLeft =
          document.getElementsByClassName('mode999')[object.TokenId]
            .offsetLeft -
          document.getElementsByClassName('token')[object.TokenId].offsetWidth /
            2
      } catch (e) {
      }
    },
    changeGraph (object, status) {
      const self = this
      self.changeNode(object, object.lastState.graphInfo.highlightNodes, 0)
      self.changeNode(
        object,
        object.nextState.graphInfo.highlightNodes,
        status
      )
      self.changeEdge(object, object.lastState.graphInfo.highlightEdges, 0)
      self.changeEdge(
        object,
        object.nextState.graphInfo.highlightEdges,
        status
      )
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
    autoControl (object) {
      const self = this
      if (object.autobuttonText === '自动展示') {
        object.autobuttonText = '停止'
        object.autobuttonType = 'danger'
        object.timer = setInterval(() => {
          self.next(object)
          if (object.nextState.code === NFA_CODE.DONE) {
            object.autobuttonText = '自动展示'
            object.autobuttonType = 'primary'
            clearInterval(object.timer)
          }
        }, 1000)
      } else {
        object.autobuttonText = '自动展示'
        object.autobuttonType = 'primary'
        clearInterval(object.timer)
      }
    },
    autoControlFocus (object) {
      const self = this
      if (object.autobuttonText === '自动展示') {
        object.autobuttonText = '停止'
        object.autobuttonType = 'danger'
        object.timer = setInterval(() => {
          self.nextFocus(object)
          if (object.nextState.code === NFA_CODE.DONE) {
            object.autobuttonText = '自动展示'
            object.autobuttonType = 'primary'
            self.fitAnimated(object)
            clearInterval(object.timer)
          }
        }, 1000)
      } else {
        object.autobuttonText = '自动展示'
        object.autobuttonType = 'primary'
        clearInterval(object.timer)
      }
    },
    // 聚焦到点上
    focusNode (val, object) {
      var options = {
        scale: 1.0,
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad'
        }
      }
      object.vis.focus(val, options)
      // object.magnifier = true
    },
    // 全屏化/还原
    full_screen (object) {
      object.zoomicon = object.isFull_screen
        ? 'el-icon-zoom-in'
        : 'el-icon-zoom-out'
      object.isFull_screen = !object.isFull_screen
    },
    // 刷新图
    refresh (object) {
      object.nodes.clear()
      object.edges.clear()
      object.nodes.add(
        createNodes(object.data.transitionTable, object.data.acceptState)
      )
      object.edges.add(
        createEdges(object.data.transitionTable, object.data.alphabet)
      )
      object.vis.stabilize()
    },
    // 切换Tab菜单时自动鹰眼
    handleClick (tab, event) {
      const self = this
      if (self.TabActiveName === 'DFAGeneration') {
        self.$nextTick(() => {
          self.fitAnimated(self.DFA)
        })
      } else if (self.TabActiveName === 'NFAGeneration') {
        self.$nextTick(() => {
          self.fitAnimated(self.NFA)
        })
      } else if (self.TabActiveName === 'DFASimplification') {
        self.$nextTick(() => {
          self.fitAnimated(self.DFA_S)
        })
      }
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
  height: 100px;
}
.controller {
  width: 100%;
  height: 30%;
  margin-top: 6%;
  margin-bottom: 8%;
  text-align: center;
}
.p {
  text-align: center;
  font-size: 45px;
  margin: 0px;
  /* word-wrap: break-word; */
  height: 60px;
  padding: 20px 10px;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}
.scroll_bar{
  /* background-color: #bbbbbb; */
  height:80px;
  overflow: hidden;
}
div.graph.active {
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(221, 221, 221, 1);
}
div.graph.active div.vis {
  height: 95%;
}
div.graph div.vis {
  height: 350px;
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
  min-width: 120px;
  height: 20px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 0px 5px;
  font-size: 15px;
  position: absolute;
  z-index: 5;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
