<template>
  <el-row>
    <el-row :gutter="20" style="text-align:center;" >
      <el-col :span="8">
        <el-button type="text" style="font-size: 46px;">NFA</el-button>
      </el-col>
      <el-col :span="8">
        <el-button type="text" style="font-size: 46px;">DFA</el-button>
      </el-col>
      <el-col :span="8">
        <el-button type="text" style="font-size: 46px;">DFA化简</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div style="height: 400px; background-color:#DDDDDD;" :ref="this.myvis"></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <p id="p" v-html="Token"></p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11" :offset="1">
        <p v-html="RE"></p>
      </el-col>
      <el-col :span="11">
        <el-form ref="TokenForm" :rules="rules" :model="TokenForm" label-width="0px">
          <el-form-item prop="Token">
            <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 5}" v-model="TokenForm.Token"></el-input>
          </el-form-item>
          <el-button type="primary" @click="submitForm('TokenForm')">开始分词</el-button>
          <el-button>清空</el-button>
          <el-button @click="previous()">上一步</el-button>
          <el-button @click="next()">下一步</el-button>
          <el-button @click="fitAnimated()">鹰眼</el-button>
          <el-button @click="layoutChange()">{{layoutText}}</el-button>
        </el-form>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import {DataSet, Network} from 'vis'
import { Message } from 'element-ui'
import {create_NFA, CODE} from '../../api/NFA'
import {createNodes, createEdges} from '../../api/vis_api'

export default {
  props: {
    myvis: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      NFAdata: {
        transitionTable: [],
        alphabet: [],
        acceptState: []
      },
      FNAMachine: {},
      lastState: null,
      nextState: null,
      layout: true,
      layoutText: '取消层级结构',
      Token: '<span>请点击开始分词<span>',
      RE: '',
      TokenForm: {
        Token: 'dododouble'
      },
      rules: {
        Token: [
          {required: true, message: '输入不能为空', tirgger: 'blur'}
        ]
      }
    }
  },
  mounted: function () {
    const self = this
    self.RE = (function () {
      let arr = sessionStorage.getItem('input').split('\n')
      let str1 = "<p style='font-size: 25px;word-break:break-all;'>"
      for (let i = 0; i < arr.length; i++) {
        str1 = str1 + "<span class='mode" + i.toString() + "'>" + arr[i] + '</span><br>'
      }
      str1 = str1 + '</p>'
      return str1
    })()
    self.addCSS(self.getCsstext())
    self.NFAdata = JSON.parse(sessionStorage.getItem('NFAdata'))
    this.fresh(self.NFAdata)
  },
  methods: {
    submitForm (formName) {
      const self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.Token = self.TokenForm.Token
          self.FNAMachine = create_NFA(self.NFAdata.transitionTable, self.NFAdata.alphabet, self.NFAdata.acceptState)
          self.FNAMachine.init()
          self.FNAMachine.feedText(self.TokenForm.Token)
          self.fresh(self.NFAdata)
          self.changeNode([0], 1)
          self.nextState = {info: {highlightNodes: [0]}}
          // TODO：开始分词后 输入框不能编辑
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
          break
        case CODE.READCHAR:
          self.$message({
            type: 'info',
            message: '遵循最长子串原则继续重复做闭包和读字符'
          })
          break
        case CODE.ACCEPT:
          self.$message({
            type: 'success',
            message: '提取Token'
          })
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
    async fresh (networkdata) {
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
            enabled: self.layout,
            direction: 'LR', // UD, DU, LR, RL
            sortMethod: 'directed' // hubsize, directed
          }
        },
        physics: {
          enabled: true
        }
        // manipulation: {}

      }
      self.NFA = new Network(container, data, options)
    },
    fitAnimated () {
      var options = {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
      this.NFA.fit({animation: options})
    },
    changeNode (nodes, colorNum) {
      let backgroud
      if (colorNum === 0) {
        backgroud = '#fff'
      } else if (colorNum === 1) {
        backgroud = '#ffD2E5'
      } else {
        backgroud = '#ffE5D2'
      }
      for (let i = 0; i < nodes.length; i++) {
        this.nodes.update([{id: nodes[i], color: {background: backgroud}}])
      }
    },
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
<style>
#p{
  font-size: 46px;
  text-align:center;
  word-wrap:break-word;
}
span.mode999{
  background-color:red;
}
</style>
