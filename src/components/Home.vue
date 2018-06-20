<template>
    <div id="head" style="overflow:hidden;white-space:nowrap;position:relative;min-width:1200px;width:100%">
        <div style="height:60px;display:inline-block;">
            <div style="text-align:center;width:400px;height:60px;font-size:36px;display:inline-block">
                <span>Compiler Stimulation</span>
            </div>
            <div style="text-align:center;width:610px;height:60px;display:inline-block">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1" style="font-size:32px;">首页</el-menu-item>
                <el-menu-item index="2" style="font-size:32px;">词法分析</el-menu-item>
                <el-menu-item index="3" disabled style="font-size:32px;">语法分析</el-menu-item>
                <el-menu-item index="4" disabled style="font-size:32px;">语义分析</el-menu-item>
                </el-menu>
            </div>
        </div>
        <div style="width:80px;height:60px;display:inline-block;position:absolute;right:10px;">
            <el-button style="display:none;">登陆</el-button>

            <el-dropdown>
                <span class="el-dropdown-link" style="font-size:22px;">
                    账户<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>我的收藏</el-dropdown-item>
                    <el-dropdown-item>修改密码</el-dropdown-item>
                    <el-dropdown-item divided>注销</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
export default {}
</script>

<style scoped>
</style>
