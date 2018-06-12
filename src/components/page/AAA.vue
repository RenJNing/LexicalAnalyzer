<template>
  <div>
    <div style="display: flex;height: 100%;width: 100%; overflow-y: scroll">
      <div style="height: 400px;width: 600px;" :ref="this.myvis"></div>
    </div>
    <el-button @click="click()">123</el-button>
  </div>
</template>

<script>
// create an array with nodes
import {DataSet, Network} from 'vis'

// import {DataSet, Network} from 'vis/index-network';
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
        ['1,-7', '', ''],
        ['2,4', '', ''],
        ['', '3', ''],
        ['6', '', ''],
        ['', '', '-5'],
        ['6', '', ''],
        ['1,7', '', ''],
        ['', '8', ''],
        ['', '', '9'],
        ['', '', '']
      ],
      alpha: ['c', 'a', 'b'],
      nodes: [],
      edges: [],
      temp: [],
      flag: 0
    }
  },
  methods: {
    click () {
      console.log(1)
      // this.nodes[0]['color'] = {background : '#ff0000'};
      // this.$set(this.nodes[0].color.background,'#ff0000');
      // var newId = (Math.random() * 1e7).toString(32);
      var newColor = '#' + Math.floor((Math.random() * 255 * 255 * 255)).toString(16)
      this.nodes.update([{id: 1, color: {background: newColor}}])

      // this.nodes.add([{id:10, color:{background:'#ff0000'}}]);
    },
    // 按照 现有属性重新渲染页面
    myfunction1 (arr, alpha) {
      for (let i = 0; i < arr.length; i++) {
        this.temp[i] = i
      }
      var answer = []
      var answerFlag = 0
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
          if (arr[i][j] == '') {
          } else {
            var unit = arr[i][j].split(',')
            /* unit = unit.map(function(data){
                  return +data;
              }); */
            for (let k = 0; k < unit.length; k++) {
              if (unit[k][0] == '-') {
                console.log(111)
                answer[answerFlag] = {
                  from: i, to: unit[k].substring(1, parseInt(unit[k].length)), arrows: 'to', label: alpha[j], color: {color: ''}
                }
                let number = parseInt(unit[k])
                this.temp[-number] = number
                // this.flag = 1;
              } else {
                answer[answerFlag] = {
                  from: i, to: parseInt(unit[k]), arrows: 'to', label: alpha[j]
                }
              }
              answerFlag++
            }
          }
        }
      }
      return answer
    },

    myfunction2 (arr) {
      var answer = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] >= 0) {
          answer[i] = {
            id: i, label: i.toString(), color: {background: ''}
          }
        } else {
          answer[i] = {
            id: i, label: i.toString(), borderWidth: 5, color: {background: ''}
          }
        }
      }
      return answer
    },
    async refresh () {
      this.edges = new DataSet(this.myfunction1(this.array, this.alpha))
      this.nodes = new DataSet(this.myfunction2(this.temp))
      let data = {
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
              enabled: true,
              filter: 'nodes,edges',
              container: undefined,
              showButton: true
            },

            layout: {
              randomSeed: 0,
              hierarchical: {
                enabled: false,
                // parentCentralization: false,
                direction: 'LR', // UD, DU, LR, RL
                sortMethod: 'directed' // hubsize, directed
              }
            },
            physics: {
              enabled: true
            },
            manipulation: {
              addNode: function (nodeData, callback) {
                nodeData.label = 'hello world'
                callback(nodeData)
              },
              controlNodeStyle: {

              }
            }

          }
          let network = new Network(container, data, options)
        }
      )
    }
  },

  mounted () {
    this.refresh()
  }

}
</script>

<style scoped>

</style>
