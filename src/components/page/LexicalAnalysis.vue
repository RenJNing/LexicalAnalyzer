<template>
  <el-row :gutter="50">
    <el-col :span="7" :offset="1">
      <el-row>
        <el-col :span="24">
          <h1>{{title}}</h1>
          <span>例子:<br>T_Do=do<br>T_Double=double<br>T_Mystery=[A-Za-z]<br>具体规则请查看 <a href="">简介</a></span>
          <p></p>
        </el-col>
        <el-col :span="24">
          <el-form ref="REForm" :rules="rules" :model="REForm" label-width="0px">
            <el-form-item prop="RE">
          <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 10}" v-model="REForm.RE"></el-input>
            </el-form-item>
          <el-button type="primary" @click="submitForm('REForm')" :loading="loading">构建状态机</el-button>
          <el-button type="primary" :disabled="disable" @click="goto('/index/Token')">Token模拟提取</el-button>
          <el-button type="primary" :disabled="disable">收藏</el-button>
          <el-button type="primary" :disabled="disable">查看代码</el-button>
          </el-form>

        </el-col>
      </el-row>
    </el-col>
    <el-col :span="15">
      <el-row>
        <el-col :span="24">
          <span><b>NFA生成</b></span> <el-button @click="Zoom('NFA')">缩放</el-button>
          <el-button @click="fitAnimated()">显示完整状态机</el-button>
            <div id="NFA" :class="{'active':isChoose1}" :ref="this.myvis"></div>
        </el-col>
        <el-col :span="24">
          <span><b>DFA生成</b></span> <el-button @click="Zoom('DFA')">缩放</el-button>
          <div id="DFA" :class="{'active':isChoose2}">
          </div>
        </el-col>
        <el-col :span="24">
          <span><b>DFA化简</b></span> <el-button @click="Zoom('DFA_S')">缩放</el-button>
          <div id="DFA_S" :class="{'active':isChoose3}">
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import {DataSet, Network} from 'vis'
import { Message } from 'element-ui'
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
      array: [
        [[], [1, 3], [], [], [], []], // 0
        [[], [], [], [], [2], []], // 1
        [[], [], [], [], [], []], // 2
        [[], [], [], [], [4], []], // 3
        [[], [], [], [], [], [5]], // 4
        [[6], [], [], [], [], []], // 5
        [[], [], [], [7], [], []], // 6
        [[], [], [8], [], [], []], // 7
        [[], [], [], [], [], []]], // 8
      alpha: ['b', 'd', 'e', 'l', 'o', 'u'],
      acceptState: [
        {
          state: 2,
          REId: 0
        }, {
          state: 8,
          REId: 1
        }
      ],
      isChoose1: false,
      isChoose2: false,
      isChoose3: false,
      disable: true,
      loading: false,
      title: '词法分析',
      REForm: {
        RE: 'T_Do=do\nT_Double=double\nT_Mystery=[A-Za-z]'
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
    this.fresh()
  },
  methods: {
    fitAnimated () {
      var options = {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
      this.network.fit({animation: options})
    },
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
          //   self.loading = false
          self.disable = false
          sessionStorage.setItem('input', self.REForm.RE)
          console.log(sessionStorage.getItem('input'))
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
    myfunction1 (arr, alpha) {
      var answer = []
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
          if (arr[i][j] == null) {
          } else {
            var unit = arr[i][j].toString().split(',')
            /* unit = unit.map(function(data){
                                return +data;
                            }); */
            for (let k = 0; k < unit.length; k++) {
              answer.push({
                from: i, to: parseInt(unit[k]), arrows: 'to', label: alpha[j], color: {color: '#2b7ce9'}
              })
            }
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
              font: {
                size: 35,
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
          // let all_movie = this.movie_list.concat(this.movie)
          // console.log('all', all_movie, typeof all_movie)

          // 重新渲染后需要重新添加事件
          /* network.on("click", (params) => {
                             params.event = "[original event]";
                             console.log(params)
                             // nodes 为空表示点击的是边

                             // console.log('单击的节点id为', params.nodes)

                             if (params.nodes.length > 0) {
                                 let click_node_id = params.nodes[0]
                                 let m = all_movie.find((val, index) => {
                                     // console.log(val, index)
                                     return val['id'] == click_node_id
                                 })
                                 this.$emit('node_click', m)
                             }

                             // document.getElementById('eventSpan').innerHTML = '<h2>Click event:</h2>' + JSON.stringify(params, null, 4);

                             // console.log('click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
                         });

                         network.on("doubleClick", (params) => {
                             params.event = "[original event]";
                             // document.getElementById('eventSpan').innerHTML = '<h2>doubleClick event:</h2>' + JSON.stringify(params, null, 4);
                             // console.log(params)
                             // nodes 为空表示点击的是边
                             // console.log('双击的节点id为', params.nodes)

                             if (params.nodes.length > 0) {
                                 let click_node_id = params.nodes[0]
                                 // let m = all_movie.find((val, index) => {
                                 //   console.log(val, index)
                                 //   return val['id'] == click_node_id
                                 // })
                                 this.$emit('node_double_click', click_node_id)
                             }
                         }); */
        }
      )
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
background-color:rgba(221,221,221,0.3)
}
</style>
