<template>
  <div>
    <h1>{{title}}</h1>
    <span>例子:<br>T_Do=do<br>T_Double=double<br>T_Mystery=[A-Za-z]<br>具体规则请查看 <a href="">简介</a></span>
    <el-input
      type="textarea"
      :autosize="{ minRows: 10, maxRows: 10}"
      v-model="RE">
    </el-input>
    <el-button type="primary">构建状态机</el-button>
    <el-button type="primary" disabled>Token模拟提取</el-button>
    <el-button type="primary" disabled>收藏</el-button>
    <el-button type="primary" disabled>查看代码</el-button>
    <div>
      <span>NFA生成</span>
    </div>
    <div>
      <span>DFA生成</span>
    </div>
    <div>
      <span>DFA化简</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '词法分析',
      RE: 'T_Do=do\nT_Double=double\nT_Mystery=[A-Za-z]'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
