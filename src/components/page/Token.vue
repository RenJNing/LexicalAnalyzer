<template>
  <el-row>
    <el-row :gutter="20">
        <el-col :span="8">
            <el-button type="text">NFA</el-button>
        </el-col>
        <el-col :span="8">
            <el-button type="text">DFA</el-button>
        </el-col>
        <el-col :span="8">
            <el-button type="text">DFA化简</el-button>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <div id="NFA">
                <canvas height="600"></canvas>
            </div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <!-- TODO: -->
            <p style="font-size: 46px">{{TokenForm.Token}}</p>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="12">
            <p>{{RE}}</p>
        </el-col>
        <el-col :span="12">
        <el-form ref="TokenForm" :rules="rules" :model="TokenForm" label-width="0px">
        <el-form-item prop="Token">
        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 5}" v-model="TokenForm.Token"></el-input>
        </el-form-item>
        <el-button type="primary">开始分词</el-button>
        <el-button>清空</el-button>
        <el-button @click="nextstep()">下一步</el-button>
        </el-form>
        </el-col>
    </el-row>
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
      RE: '',
      TokenForm: {
        Token: 'DOUBDOUBLE'
      },
      rules: {
        Token: [
          {required: true, message: '输入不能为空', tirgger: 'blur'},
          { validator: validateRe, trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function () {
    var nodesArray = [
      {id: 1, label: 'Node 1'},
      {id: 2, label: 'Node 2'},
      {id: 3, label: 'Node 3'},
      {id: 4, label: 'Node 4'},
      {id: 5, label: 'Node 5'}
    ]
    var nodes = new DataSet(nodesArray)

    // create an array with edges
    var edgesArray = [
      {from: 1, to: 3},
      {from: 1, to: 2},
      {from: 2, to: 4},
      {from: 2, to: 5}
    ]
    var edges = new DataSet(edgesArray)

    // create a network
    var container = document.getElementById('NFA')
    var data = {
      nodes: nodes,
      edges: edges
    }
    var options = {}
    var network1 = new Network(container, data, options)
    var network2 = new Network(document.getElementById('DFA'), data, options)
    var network3 = new Network(document.getElementById('DFA_S'), data, options)
  },
  methods: {
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
          let url = '/RE'
          let Params = {RE: re}
          self.$axios.post(url, Params).then(function (response) {
            self.loading = false
            self.disable = false
          }).catch(function (error) {
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
    nextstep () {
      const self = this
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
