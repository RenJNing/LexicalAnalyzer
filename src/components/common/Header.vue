<template>
    <el-row>
        <div class="header">
            <div class="logo_nav">
                <div class="logo">
                    <span>Compiler Stimulation</span>
                </div>
                <div class="nav-menu">
                    <el-menu text-color="#040404" class="el-menu-demo" mode="horizontal" id="navigator" unique-opened router>
                        <template v-for="item in items">
                            <el-menu-item :index="item.index">
                            <template class="nav-tab"><i :class="item.icon"></i><span class="nav-tab">{{ item.title }}</span></template>
                            </el-menu-item>
                        </template>
                    </el-menu>
                </div>
            </div>
            <div class="user-info">
                <el-button style="display:none;">登陆</el-button>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        {{name}}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>我的收藏</el-dropdown-item>
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item divided>注销</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </el-row>
</template>

<script>
export default {
  data () {
    return {
      name: '账号',
      items: [
        {
          icon: 'el-icon-menu',
          index: '/index/main-interface',
          title: '首页'
        },
        {
          icon: 'el-icon-menu',
          index: '/index/lexical-analysis',
          title: '词法分析'
        },
        {
          icon: 'el-icon-menu',
          index: '/index/gramma-analysis',
          title: '语法分析'
        },
        {
          icon: 'el-icon-menu',
          index: '/index/semantic-analysis',
          title: '语义分析'
        }
      ]
    }
  }
}
</script>

<style scoped>
.header {
  position: relative;
  width: 100%;
  height: 60px;
  overflow: hidden;
  white-space: nowrap;
  min-width: 1200px;
  background-color: #eeeeee;
  line-height: 60px;
}
.logo_nav {
  display: inline-block;
  height: 60px;
  line-height: 60px;
}
.nav-menu {
  text-align: center;
  width: 610px;
  height: 60px;
  display: inline-block;
}
.logo {
  text-align: center;
  width: 350px;
  height: 60px;
  font-size: 28px;
  /* display:inline-block; */
  float: left;
  margin-top: 0px;
}
.user-info {
  width: 80px;
  height: 60px;
  display: inline-block;
  position: absolute;
  right: 10px;
  cursor: pointer;
}
.el-menu-demo {
  background-color: #eeeeee;
}
.nav-tab {
  font-size: 16px;
  height: 60px;
}
</style>
