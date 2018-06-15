<template>
  <el-row :gutter="50">
    <el-col :span="7" :offset="1">
      <el-row>
        <el-col :span="24">
          <p style="font-size: 50px;">{{title}}</p>
          <span>例子:<br>T_Do=do<br>T_Double=double<br>具体规则请查看 <a href="">简介</a></span>
        </el-col>
        <el-col :span="24" style="margin-top:5%">
          <el-form ref="REForm" :rules="rules" :model="REForm" label-width="0px">
            <el-form-item prop="RE">
              <el-input style="font-size:20px;" type="textarea" :autosize="{ minRows: 10, maxRows: 10}" v-model="REForm.RE"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('REForm')" :loading="loading">构建状态机</el-button>
              <el-button type="primary" :disabled="disable" @click="goto('/index/Token')">Token模拟提取</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="disable">收藏</el-button>
              <el-button type="primary" :disabled="disable">查看代码</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="15">
      <el-row>
        <el-col :span="24">
          <span style="font-size: 35px;">NFA</span>
          <el-button @click="Zoom('NFA')">放大/收缩</el-button>
          <el-button @click="fitAnimated('NFA')">鹰眼</el-button>
          <div id="NFA" :class="{'active':isChoose1}"></div>
        </el-col>
        <el-col :span="24">
          <span style="font-size: 35px;">DFA</span>
          <el-button type="primary" @click="fresh('DFA', DFAdata)">显示DFA</el-button>
          <el-button @click="Zoom('DFA')">放大/收缩</el-button>
          <el-button @click="fitAnimated('DFA')">鹰眼</el-button>
          <div id="DFA" :class="{'active':isChoose2}"></div>
        </el-col>
        <el-col :span="24">
          <span style="font-size: 35px;">DFA化简</span>
          <el-button type="primary" @click="fresh('DFA_S', DFA_Sdata)">显示化简DFA</el-button>
          <el-button @click="Zoom('DFA_S')">放大/收缩</el-button>
          <el-button @click="fitAnimated('DFA_S')">鹰眼</el-button>
          <div id="DFA_S" :class="{'active':isChoose3}"></div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import {DataSet, Network} from 'vis'
import { Message } from 'element-ui'
export default {
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
      NFAdata: {
        transitionTable: [],
        alphabet: [],
        acceptState: []
      },
      DFAdata: {
        transitionTable: [],
        alphabet: [],
        acceptState: []
      },
      DFA_Sdata: {
        transitionTable: [],
        alphabet: [],
        acceptState: []
      },
      isChoose1: false,
      isChoose2: false,
      isChoose3: false,
      disable: true,
      loading: false,
      title: '词法分析',
      REForm: {
        RE: 'T_Do=do\nT_Double=double'
      },
      rules: {
        RE: [
          {required: true, message: '输入不能为空', tirgger: 'blur'},
          { validator: validateRe, trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function () {
  },
  methods: {
    // 构建状态机
    submitForm (formName) {
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
          self.NFAdata = {
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
              [[], [], [], [], [], [], []]],
            alphabet: ['ε', 'd', 'o', 'u', 'b', 'l', 'e'],
            acceptState: [{state: 4, REId: 1}, {state: 16, REId: 2}]
          }
          self.DFAdata = {
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
          }
          self.DFA_Sdata = {
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
          }
          self.fresh('NFA', self.NFAdata)
          sessionStorage.setItem('NFAdata', JSON.stringify(self.NFAdata))
          sessionStorage.setItem('DFAdata', JSON.stringify(self.DFAdata))
          sessionStorage.setItem('DFA_Sdata', JSON.stringify(self.DFA_Sdata))
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
    // 鹰眼
    fitAnimated (networkname) {
      let options = {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
      if (networkname === 'NFA') {
        this.NFA.fit({animation: options})
      } else if (networkname === 'DFA') {
        this.DFA.fit({animation: options})
      } else {
        this.DFA_S.fit({animation: options})
      }
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
    createEdges (transitionTable, alphabet) {
      var Edges = []
      let _range = length => Array.from({ length }).map((v, k) => k)
      for (var fState of _range(transitionTable.length)) {
        for (var chIndex of _range(alphabet.length)) {
          for (var tState of transitionTable[fState][chIndex]) {
            Edges.push({id: Edges.length, from: fState, to: tState, arrows: 'to', label: alphabet[chIndex]})
          }
        }
      }
      return Edges
    },
    createNodes (transitionTable, acceptState) {
      var Nodes = []
      for (let i = 0; i < transitionTable.length; i++) {
        Nodes[i] = {
          id: i, label: i.toString()
        }
      }
      for (let i = 0; i < acceptState.length; i++) {
        Nodes[acceptState[i].state].borderWidth = 5
      }
      return Nodes
    },
    async fresh (containerid, networkdata) {
      const self = this
      self.edges = new DataSet(self.createEdges(networkdata.transitionTable, networkdata.alphabet))
      self.nodes = new DataSet(self.createNodes(networkdata.transitionTable, networkdata.acceptState))
      var data = {
        nodes: self.nodes,
        edges: self.edges
      }
      let container = document.getElementById(containerid)
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
      if (containerid === 'NFA') {
        self.NFA = new Network(container, data, options)
      } else if (containerid === 'DFA') {
        self.DFA = new Network(container, data, options)
      } else {
        self.DFA_S = new Network(container, data, options)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div#NFA,div#DFA,div#DFA_S{
 height:240px;
 background-color:#DDDDDD;
}
div#NFA.active,div#DFA.active,div#DFA_S.active{
height:auto;
margin-left:-55%;
background-color:rgba(221,221,221,0.7)
}
</style>
