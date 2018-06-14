<!-- 代码源：https://my.oschina.net/ahaoboy/blog/1618784?p=1    -->
<!-- 代码源：https://my.oschina.net/ahaoboy/blog/1618784?p=1    -->
<!-- 代码源：https://my.oschina.net/ahaoboy/blog/1618784?p=1    -->
<!-- 代码源：https://my.oschina.net/ahaoboy/blog/1618784?p=1    -->

<template>
    <div>
        <div style="display: flex;height: 100%;width: 100%; overflow-y: scroll">
            <div style="height: 400px;width: 600px;" :ref="this.myvis"></div>
        </div>
        <el-button @click="previous()">上一个</el-button>
        <el-button @click="next()">下一个</el-button>
        <!--el-button @click="focusNode()">随机聚焦</el-button-->
        <el-button @click="fitAnimated()">显示完整状态机</el-button>
        <el-button @click="refresh()">重新生成</el-button>
        <el-button @click="end()">结束</el-button>
    </div>
</template>

<script>
// create an array with nodes
import {DataSet, Network} from '../../node_modules/vis/dist/vis.js'
import {create_NFA} from '../api/FNA'
export default {
  props: {
    myvis: {
      type: [String, Number],
      default: ''
    }
  },
  /* watch: {
            myvis() {
                console.log('myvis change')
                this.refresh()
            }
        }, */
  data () {
    return {
      array: [
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
      alpha: ['ε', 'b', 'd', 'e', 'l', 'o', 'u'],
      acceptState: [
        {
          state: 3,
          REId: 0
        }, {
          state: 10,
          REId: 1
        }
      ],
      randomSeed: 0,
      recordNode: [],
      recordEdge: [],
      activeFlag: 0
    }
  },
  methods: {
    // 按照 现有属性重新渲染页面
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
                enabled: false,
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
          this.FNAMachine = create_NFA(this.array, this.alpha, this.acceptState)
          this.FNAMachine.init()

          this.FNAMachine.feedText('dododouble')
          this.recordNode.push([0])
          this.activeFlag++
          this.change(this.recordNode[0], 1)
          this.randomSeed++
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
    },
    refresh () {
      this.end()
      this.fresh()
    },
    // 调整到合适大小
    fitAnimated () {
      var options = {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
      this.network.fit({animation: options})
    },
    // 更新数值
    /* updateValues() {
                offsetx = parseInt(document.getElementById('offsetx').value);
                offsety = parseInt(document.getElementById('offsety').value);
                duration = parseInt(document.getElementById('duration').value);
                scale = parseFloat(document.getElementById('scale').value);
                positionx = parseInt(document.getElementById('positionx').value);
                positiony = parseInt(document.getElementById('positiony').value);
                easingFunction = document.getElementById('easingFunction').value;
            }, */
    // 聚焦到...
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
    // 下一个状态
    next () {
      console.log(this.recordNode)
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
        this.change(this.recordNode[this.recordNode.length - 1], 2)
        if (this.recordNode.length >= 2) {
          this.change(this.recordNode[this.recordNode.length - 2], 0)
        }
        console.log('---执行“下一步”操作')
        console.log(nextState.code)
        console.log(nextState.info.highlightNodes)
        this.change(nextState.info.highlightNodes, 1)
        this.recordNode.push(nextState.info.highlightNodes)
        this.activeFlag++
      } else {
        this.change(this.recordNode[this.recordNode.length - 1], 2)
        if (this.recordNode.length >= 2) {
          this.change(this.recordNode[this.recordNode.length - 2], 0)
        }
        console.log('---执行“下一步”操作')
        console.log(nextState.code)
        console.log(nextState.info.highlightNodes)
        this.change(nextState.info.highlightNodes, 1)
        this.recordNode.push(nextState.info.highlightNodes)
        this.activeFlag++
      }
    },
    // 上一个状态
    previous () {
      /* if(this.activeFlag == 1)
                {
                    this.$message({
                        type:'info',
                        message:"已经是第一个状态了！"
                    });
                    return 0;
                }
                else if(this.activeFlag == 2){
                    this.change(this.recordNode[this.activeFlag - 1], 0);
                    this.change(this.recordNode[this.activeFlag - 2], 1);
                }
                this.change(this.recordNode[this.activeFlag - 3], 2);
                this.activeFlag--; */
    },
    // 结束展示，恢复成最初状态
    end () {
      this.randomSeed = 0
      this.node = 0
      this.recordNode = []
      this.recordEdge = []
      this.activeFlag = 0
      this.fresh()
    }
  },

  mounted () {
    this.fresh()
  }

}
</script>

<style scoped>

</style>
