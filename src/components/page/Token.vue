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
            <p style="font-size: 46px" id="p" v-html="Token"></p>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="12">
            <p v-html="RE"></p>
        </el-col>
        <el-col :span="12">
        <el-form ref="TokenForm" :rules="rules" :model="TokenForm" label-width="0px">
        <el-form-item prop="Token">
        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 5}" v-model="TokenForm.Token"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('TokenForm')">开始分词</el-button>
        <el-button>清空</el-button>
        <el-button @click="previous()">上一步</el-button>
        <el-button @click="next()">下一步</el-button>
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
    return {
      Token: '',
      RE: '',
      TokenForm: {
        Token: 'DOUBDOUBLE'
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
    this.$nextTick(function () {
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
    })
  },
  methods: {
    submitForm (formName) {
      const self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.Token = self.TokenForm.Token
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
      let html = self.cut(self.TokenForm.Token, [[0, 2, 1], [2, 5, 2], [5, 10, 5]])
      self.Token = html
    },
    previous () {

    },
    cut (str, arr) {
      let str1 = ''
      for (let i of arr) {
        str1 = str1 + "<span class='mode" + i[2].toString() + "'>" + str.substring(i[0], i[1]) + '&nbsp;' + '</span>'
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
