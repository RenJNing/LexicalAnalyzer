<template>
 <div class="wrapper">
    <v-head></v-head>
    <div class="content">
      <transition name="move" mode="out-in"><router-view></router-view></transition>
    </div>
    <v-foot></v-foot>
  </div>
</template>

<script>
import vHead from './Header.vue'
import vFoot from './Footer.vue'
export default {
  data () {
  },
  components: {
    vHead,
    vFoot
  }
}
</script>

<style scoped>
.wrapper{
  min-height:100%;
  height: auto !important;
  position: relative;
}
.content{
  padding-bottom: 40px;
}
</style>
