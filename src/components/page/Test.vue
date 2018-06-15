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
            <!-- TODO: -->
            <p style="" id="p" v-html="Token"></p>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="11" offset="1">
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
          <el-button @click="fitAnimated()">显示完整状态机</el-button>
          <el-button @click="refresh()">重新生成</el-button>
          <el-button @click="end()">结束</el-button>
          </el-form>
        </el-col>
    </el-row>
  </el-row>
</template>

<script>
import {DataSet, Network} from 'vis'
import { Message } from 'element-ui'
import {create_NFA} from '../../api/FNA'

export default {
  props: {
    myvis: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      array: [
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
        [[], [], [], [], [], [], []]],

      alpha: ['ε', 'd', 'o', 'u', 'b', 'l', 'e'],
      acceptState: [
        {
          state: 4,
          REId: 1
        }, {
          state: 16,
          REId: 2
        }
      ],
      randomSeed: 0,
      recordNode: [],
      recordEdge: [],
      activeFlag: 0,
      FNAMachine: {},
      Token: '',
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
    this.fresh()
  },
  methods: {
    submitForm (formName) {
      const self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.Token = self.TokenForm.Token
          // var myNFA = API(transitionTable, alphabet, acceptState2patternId)
          // myNFA.init()
          // myNFA.feedText(self.TokenForm.Token)
          self.FNAMachine = create_NFA(this.array, this.alpha, this.acceptState)
          self.FNAMachine.init()
          self.FNAMachine.feedText(self.TokenForm.Token)
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
      let nextState = this.FNAMachine.nextStep()
      if (nextState.code == 0) {
        this.$message({
          type: 'info',
          message: 'code==0 o(╯□╰)o'
        })
      } else if (nextState.code == 1) {
        this.$message({
          type: 'success',
          message: 'code==1 o(╯□╰)o' +
                            '匹配到正则表达式'
        })
        for (let i of nextState.info.highlightNodes) {
          this.nodes.update([{id: i, color: {background: 'black', border: 'black'}}])
        }
        for (let i of nextState.info.highlightEdges) {
          this.edges.update([{id: i.id, color: {color: 'black'}}])
        }
      } else {
        for (let i of nextState.info.highlightNodes) {
          this.nodes.update([{id: i, color: {background: 'black', border: 'black'}}])
        }
        for (let i of nextState.info.highlightEdges) {
          console.log(i)
          this.edges.update([{id: i.id, color: {color: 'black'}}])
        }
      }

      const self = this
      // let nextState = self.FNAMachine.nextStep()
      console.log(nextState)
      let recognized = nextState.windowInfo.recognizedTokens.map(obj => {
        let temp = []
        temp.push(obj.startIndex)
        temp.push(obj.endIndex)
        temp.push(obj.REId)
        return temp
      })
      let remains = [nextState.windowInfo.remains.startIndex, nextState.windowInfo.remains.endIndex, 888]
      let scanning = [nextState.windowInfo.scanning.startIndex, nextState.windowInfo.scanning.endIndex, 999]
      recognized.push(scanning)
      recognized.push(remains)
      let html = self.cut(self.TokenForm.Token, recognized)
      self.Token = html
    },
    previous () {
      const self = this
      let data = self.FNAMachine.preStep()
      console.log(data)
      let recognized = data.windowInfo.recognizedTokens.map(obj => {
        let temp = []
        temp.push(obj.startIndex)
        temp.push(obj.endIndex)
        temp.push(obj.REId)
        return temp
      })
      let remains = [data.windowInfo.remains.startIndex, data.windowInfo.remains.endIndex, 888]
      let scanning = [data.windowInfo.scanning.startIndex, data.windowInfo.scanning.endIndex, 999]
      recognized.push(scanning)
      recognized.push(remains)
      let html = self.cut(self.TokenForm.Token, recognized)
      console.log(recognized)
      console.log(html)
      self.Token = html
    },
    cut (str, arr) {
      let str1 = ''
      for (let i of arr) {
        if (i[2] < 888) {
          str1 = str1 + "<span class='mode" + i[2].toString() + "'>" + str.substring(i[0], (i[1] + 1)) + '&nbsp;' + '</span>'
        } else {
          str1 = str1 + "<span class='mode" + i[2].toString() + "'>" + str.substring(i[0], (i[1] + 1)) + '</span>'
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
    myfunction1 (arr, alpha) {
      var answer = []
      let _range = length => Array.from({ length }).map((v, k) => k)
      // var count = 0
      // for (let i = 0; i < arr.length; i++) {
      //   for (let j = 0; j < arr[0].length; j++) {
      //     if (arr[i][j] == null) {
      //     } else {
      //       var unit = arr[i][j].toString().split(',')
      //       /* unit = unit.map(function(data){
      //                           return +data;
      //                       }); */
      //       for (let k = 0; k < unit.length; k++) {
      //         answer.push({
      //           id: count++, from: i, to: parseInt(unit[k]), arrows: 'to', label: alpha[j], color: {color: 'green'}
      //         })
      //       }
      //     }
      //   }
      // }
      for (var f_state of _range(arr.length)) {
        for (var ch_index of _range(alpha.length)) {
          for (var t_state of arr[f_state][ch_index]) {
            answer.push({id: answer.length, from: f_state, to: t_state, arrows: 'to', label: alpha[ch_index]})
          }
        }
      }
      return answer
    },
    myfunction2 (arr) {
      var answer = []
      for (let i = 0; i < arr.length; i++) {
        answer[i] = {
          id: i, label: i.toString(), color: {background: ''}
        }
      }
      for (let i = 0; i < this.acceptState.length; i++) {
        answer[this.acceptState[i].state].borderWidth = 5
      }
      return answer
    },
    async fresh () {
      this.edges = new DataSet(this.myfunction1(this.array, this.alpha))
      this.nodes = new DataSet(this.myfunction2(this.array))
      var data = {
        nodes: this.nodes,
        edges: this.edges
      }
      this.$nextTick(
        () => {
          // console.log(this.myvis)
          // console.log(this.$refs[this.myvis])
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
              color: {
                color: 'green'
              },
              font: {
                size: 65,
                align: 'top'
              }
            },
            autoResize: true,
            height: '100%',
            width: '100%',
            clickToUse: true,

            configure: {// 打开控制面板，可以调整有向图的参数
              enabled: false,
              filter: 'nodes,edges',
              container: undefined,
              showButton: true
            },

            layout: {
              randomSeed: this.randomSeed,
              hierarchical: {
                enabled: true,
                // parentCentralization: false,
                direction: 'LR', // UD, DU, LR, RL
                sortMethod: 'directed' // hubsize, directed
              }
            },
            physics: {
              enabled: true
            }
            // manipulation: {}

          }
          this.network = new Network(container, data, options)

          this.recordNode.push([0])
          this.activeFlag++
          this.change(this.recordNode[0], 1)
          this.randomSeed++
        }
      )
    },
    refresh () {
      this.end()
      this.fresh()
    },
    fitAnimated () {
      var options = {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
      this.network.fit({animation: options})
    },

    focusNode (val) {
      // this.updateValues();
      /* var nodeId = Math.floor(Math.random() * amountOfNodes); */
      var options = {
        // position: {x:positionx,y:positiony}, // this is not relevant when focusing on nodes
        scale: 1.5,
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad'
        }
      }
      /* statusUpdateSpan.innerHTML = 'Focusing on node: ' + nodeId;
                finishMessage = 'Node: ' + nodeId + ' in focus.'; */
      this.network.focus(val, options)
    },
    // 点击更改节点颜色并聚焦
    // colorNum为0 置为初始状态；为1置为激活状态；为2置为濒死状态
    change (nodes, colorNum) {
      let backgroud, border
      if (colorNum == 0) {
        backgroud = '#D2E5FF'
        border = '#2b7ce9'
      } else if (colorNum == 1) {
        backgroud = '#ffD2E5'
        border = '#e92b7c'
      } else {
        backgroud = '#ffE5D2'
        border = '#e97c2b'
      }
      for (let i = 0; i < nodes.length; i++) {
        this.nodes.update([{id: nodes[i], color: {background: backgroud, border: border}}])
      }

      // this.focusNode(nodes[0]);
    },
    end () {
      this.randomSeed = 0
      this.node = 0
      this.recordNode = []
      this.recordEdge = []
      this.activeFlag = 0
      this.fresh()
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
