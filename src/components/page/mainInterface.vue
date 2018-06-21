<template>
  <div style="font-size: 40px">
    逐步开放中
    <el-button @click="turnToHome">返回主页</el-button>
  </div>
</template>

<script>
export default {
  name: 'mainInterface',
  methods: {
    turnToHome () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>
