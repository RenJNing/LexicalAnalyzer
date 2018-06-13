<template>
  <el-row :gutter="50">
    <el-col :span="11" :offset="1">
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
          <el-button type="primary" :disabled="disable">Token模拟提取</el-button>
          </el-form>
          <el-button type="primary" :disabled="disable">收藏</el-button>
          <el-button type="primary" :disabled="disable">查看代码</el-button>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="11">
      <el-row>
        <el-col :span="24">
          <span><b>NFA生成</b></span>
          <div id="NFA">
            <canvas height="200"></canvas>
          </div>
        </el-col>
        <el-col :span="24">
          <span><b>DFA生成</b></span>
          <div id="DFA">
            <canvas height="200"></canvas>
          </div>
        </el-col>
        <el-col :span="24">
          <span><b>DFA化简</b></span>
          <div id="DFA_S">
            <canvas height="200"></canvas>
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
          // let url = '/RE'
          // let Params = {RE: re}
          // self.$axios.post(url, Params).then(function (response) {
          //   self.loading = false
          //   self.disable = false
          sessionStorage.setItem('input', self.REForm.RE)
          console.log(sessionStorage.getItem('input'))
          self.$router.push('/index/Token')
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
