// 1.Vis 更新点和边 必须有id
nodes.update([{id: 1, color: {background: "red"}}])
edges.update([{id: 1, color: {color: "red"}}])

// 2.Vue要调用element-ui的message方法
import {Message} from 'element-ui'

// 3.Vue v-if 判断是否插入元素  值取true或者false
<p v-if="seen">是否插入元素</p>

// 4.立即执行函数 
// 函数声明：function fnName () {…}; 使用function关键字声明一个函数，指定一个函数名。
// 函数表达式 var fnName = function () {…};使用function关键字声明一个函数，但未给函数命名，最后将匿名函数赋予一个变量。
// 匿名函数 function () {}; 使用function关键字声明一个函数，但未给函数命名，所以叫匿名函数，匿名函数属于函数表达式，匿名函数有很多作用，赋予一个变量则创建函数，赋予一个事件则成为事件处理程序或创建闭包等等。
// 函数声明和函数表达式的不同之处:
// 一、JS引擎在解析JS代码时会函数声明提升当前执行环境的函数声明，而函数表达式必须等引擎执行到所在行才解析
// 二、函数表达式后面能加()立即调用该函数，函数声明不行，只能用fnName()的形式调用。
// 而（）、！、+、-、=等运算符，都将函数声明转换成函数表达式
(function(){
    // do something here;
})();