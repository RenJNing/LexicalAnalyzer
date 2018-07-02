<template>
    <el-row>
        <div class="header">
          <div class="navigation">
            <div class="logo">
              <img src="../../assets/_logo.png"/>
              <a style="float:left">文法分析模拟器</a>
            </div>
            <div class="nav-menu">
              <ul class="menu-ul">
                <li><a :class="{'active':active.a}" @click="gotoUrl('/index/main-interface',active.a)">首页</a></li>
                <li><a :class="{'active':active.b}" @click="gotoUrl('/index/lexical-analysis',active.b)">词法分析</a></li>
                <li><a :class="{'active':active.c}" @click="gotoUrl('/index/main-interface',active.c)">语法分析</a></li>
                <li><a :class="{'active':active.d}" @click="gotoUrl('/index/main-interface',active.d)">语义分析</a></li>
              </ul>
            </div>
            <div class="nav-login">
              <ul>
                <li><a class='login-btn'>登录</a></li>
              </ul>
            </div>
          </div>
        </div>
    </el-row>
</template>

<script>
export default {
  data () {
    return {
      active: {
        a: false,
        b: false,
        c: false,
        d: false
      }
    }
  },
  methods: {
    gotoUrl (url, highlight) {
      const self = this
      self.active.a = false
      self.active.b = false
      self.active.c = false
      self.active.d = false
      console.log(self.active)
      highlight = true
      self.$router.push(url)
    }
  },
  mounted () {
    switch (window.location.href) {
      case 'http://localhost:8088/#/index/main-interface':
        this.active.a = true
        break
      case 'http://localhost:8088/#/index/lexical-analysis':
        this.active.b = true
        break
    }
  }
}
</script>

<style scoped>
.header {
  width: 100%;
  height: 4rem;
  color: #ffffff;
  background-color: #161616;
  font-size: 1.6rem;
  font-weight: 400;
  padding:1.5rem 0rem;
  box-shadow: 0rem 1px 1px #ece9e9;
  position: absolute;
  font-family:"Microsoft YaHei",Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
}
.navigation{
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  min-width: 80rem;
  margin:0px auto;
  width:65%;
  height:4.2rem;
}
.logo {
  font-size: 3rem;
  cursor: pointer;
  -webkit-text-size-adjust:100%;
  float: left;
}
img{
  float:left ;
  width:40px ;
  height:40px;
}
.nav-menu {
  height: 4rem;
  padding-bottom: 0.2rem;
  float: left;
  margin-left: 10%
}
.nav-login{
  height: 4rem;
  float: right;
}

ul{
  list-style:none; /* 去掉ul前面的符号 */
  margin: 0px; /* 与外界元素的距离为0 */
  padding: 0px; /* 与内部元素的距离为0 */
  width: auto; /* 宽度根据元素内容调整 */
}
ul li
{
  padding:0px 1rem;
  float:left; /* 向左漂移，将竖排变为横排 */
}
ul li a, ul li a:visited
{
  cursor: pointer;
  color:#eeeeee;
  display: block; /* 此元素将显示为块级元素，此元素前后会带有换行符 */
  padding: 1rem; /* 内部填充的距离 */
  text-decoration: none; /* 不显示超链接下划线 */
  white-space: nowrap; /* 对于文本内的空白处，不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。 */
}
ul li a:hover
{
  color: #39a9db; /* 文字颜色 */
  text-decoration: none; /* 不显示超链接下划线 */
}
ul li a:active
{
  color:#49505b;/* 文字颜色 */
  text-decoration: none; /* 不显示超链接下划线 */
}
ul li a.active{
  color: #409eff; /* 文字颜色 */
  border-bottom: 0.2rem solid #409eff;
}

.login-btn{
  cursor: pointer;
  font-size:1.5rem;
  color: #ffffff;
  display: block; /* 此元素将显示为块级元素，此元素前后会带有换行符 */
  padding: 1.2rem 2rem; /* 内部填充的距离 */
  text-decoration: none; /* 不显示超链接下划线 */
  white-space: nowrap; /* 对于文本内的空白处，不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。 */
}
</style>
