<template>
  <!--<div>-->
    <!--<div>-->
      <!--<span>NFA生成</span>-->
    <!--</div>-->
    <!--<div>-->
      <!--<span>DFA生成</span>-->
    <!--</div>-->
    <!--<div>-->
      <!--<span>DFA化简</span>-->
    <!--</div>-->
  <!--</div>-->
  <el-row>
    <el-col :span="12">
      <el-row>
        <el-col :span="24">
          <h1>{{title}}</h1>
          <span>例子:<br>T_Do=do<br>T_Double=double<br>T_Mystery=[A-Za-z]<br>具体规则请查看 <a href="">简介</a></span>
        </el-col>
        <el-col :span="24">
          <el-form ref="REForm" :rules="rules" :model="REForm" label-width="0px">
            <el-form-item prop="RE">
          <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 10}" v-model="REForm.RE"></el-input>
            </el-form-item>
          <el-button type="primary" @click="submitForm('REForm')">构建状态机</el-button>
          <el-button type="primary" disabled>Token模拟提取</el-button>
          </el-form>
          <el-button type="primary" disabled>收藏</el-button>
          <el-button type="primary" disabled>查看代码</el-button>
          <div id="mynetwork"></div>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="12">

    </el-col>
  </el-row>
</template>

<script>
import {DataSet, Network} from 'vis'
export default {
  data () {
    // var validatePass = (rule, value, callback) => {
    //   // if (value === '') {
    //   //   callback(new Error('请再次输入密码'))
    //   // } else if (value !== this.RegisterForm.password) {
    //   //   callback(new Error('两次输入密码不一致!'))
    //   // } else {
    //   //   callback()
    //   // }
    //   let input = value.split('\n')
    //   for (let i=0;i<input.lenght;i++){
    //     input[i].substring(input[i].indexof('='))
    //   }
    // }
    return {
      title: '词法分析',
      REForm: {
        RE: 'T_Do=do\nT_Double=double\nT_Mystery=[A-Za-z]'
      },
      rules: {
        RE: [{required: true, message: '输入不能为空', tirgger: 'blur'}
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
    var container = document.getElementById('mynetwork')
    var data = {
      nodes: nodes,
      edges: edges
    }
    var options = {}
    var network = new Network(container, data, options)
  },
  methods: {
    submitForm (formName) {
      const self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let input = self.REForm.RE.split('\n')
          console.log(input.length)
          for (let i = 0; i < input.length; i++) {
            console.log(input[i].indexOf('='))
          }
          alert('submit!')
        } else {
          console.log('error submit!!')
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
