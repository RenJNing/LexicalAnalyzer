<template>
    <div>
        <div style="display: flex;height: 100%;width: 100%; overflow-y: scroll">
            <div style="height: 400px;width: 600px;" :ref="this.myvis"></div>
        </div>
        {{this.temp}}

    </div>
</template>

<script>
// create an array with nodes
import {DataSet, Network} from 'vis/index-network'

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
            /*unit = unit.map(function(data){
                                return +data;
                            }); */
            for (let k = 0; k < unit.length; k++) {
              if (unit[k][0] == '-') {
                console.log(111)
                answer[answerFlag] = {
                  from: i, to: unit[k].substring(1, parseInt(unit[k].length)), arrows: 'to', label: alpha[j]
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
            id: i, label: i.toString()
          }
        } else {
          answer[i] = {
            id: i, label: i.toString(), borderWidth: 5
          }
        }
      }
      return answer
    },
    async refresh () {
      this.edges = new DataSet(this.myfunction1(this.array, this.alpha))
      this.nodes = new DataSet(this.myfunction2(this.temp))
      data = {
        nodes: this.nodes,
        edges: this.edges
      }
      this.$nextTick(
        () => {
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
