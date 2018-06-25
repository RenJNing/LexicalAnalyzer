
var generateNFA =require("./generateNFA");
var generateDFA =require("./generateDFA");
var simplifyDFA =require("./simplifyDFA");
var tool =require("./tool");

var expressions=['(a|b)*']
console.log(expressions)
var NFA =new generateNFA(expressions)
console.log("NFA      ")
console.log(NFA)
console.log(tool(NFA))
var DFA =new generateDFA(NFA)
console.log("DFA      ")
console.log(DFA)
console.log(tool(DFA))

var s_DFA=new simplifyDFA(DFA)
console.log("s_DFA      ")
console.log(s_DFA)
console.log(tool(s_DFA))
//console.log(s_DFA)
//console.log(DFA)
