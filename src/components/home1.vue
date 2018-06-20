<template>
    <el-row>
        <el-row style="height:60px;width:1200px">
        <el-col style="text-align:center;width:400px;font-size:36px;">
            <span>Compiler Stimulation</span>
        </el-col>
        <el-col style="text-align:center;width:610px">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1" style="font-size:32px;">首页</el-menu-item>
            <el-menu-item index="2" style="font-size:32px;">词法分析</el-menu-item>
            <el-menu-item index="3" disabled style="font-size:32px;">语法分析</el-menu-item>
            <el-menu-item index="4" disabled style="font-size:32px;">语义分析</el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="1" :offset="2" style="width:80px;">
            <el-button style="display:none;">登陆</el-button>
        </el-col>
        </el-row>
                    <div style="float:right;">
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
        <el-col :span="24">
        </el-col>
        <el-col :span="24">
        </el-col>
    </el-row>
</template>

<script>
export default {}
</script>

<style scoped>

</style>
