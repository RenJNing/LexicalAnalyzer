var express = require('express');
var generateNFA =require("./generateNFA");
var generateDFA =require("./generateDFA");
var simplifyDFA =require("./simplifyDFA");
var router = express.Router();
var tool =require("./tool");

var jsonWrite = function(res, ret) {
  if(typeof ret === 'undefined') {
    res.send('err');
  } else {
    //console.log(ret);
    res.send(ret);
  }
}
// var dateStr = function(str) {
//   return new Date(str.slice(0,7));
// }

// 生成NFA接口
router.post('/regularExpression', (req, res) => {
  var params=req.body;
  console.log(params.RE)
  var expressions=params.RE


  console.log(expressions)
  var NFA =new generateNFA(expressions)
  var DFA =new generateDFA(NFA)
  var s_DFA=new simplifyDFA(DFA)
  var NFAdata={
    transitionTable:tool(NFA),
    alphabet:NFA.alphabet,
    acceptStateList:NFA.acceptStateList};
  var DFAdata={
    transitionTable:tool(DFA),
    alphabet:DFA.alphabet,
    acceptStateList:DFA.acceptStateList};
  var S_DFAdata={
    transitionTable:tool(s_DFA),
    alphabet:s_DFA.alphabet,
    acceptStateList:s_DFA.acceptStateList};


  console.log(NFA)
  // var DFA=new generateDFA
  // var DFA = new generateDFA(NFA)
  //
  // var S_DFA=new simplifyDFA(DFA)
  //
  // console.log("简化过后的DFA")
  // console.log(S_DFA)
  result=[NFAdata,DFAdata,S_DFAdata]
  jsonWrite(res, result);
});



// var test={
//
//   transitionTable: [
//     [[1, 4], [], [], [], [], [], []], // 0
//     [[], [], [2], [], [], [], []],    // 1
//     [[], [], [], [], [], [3], []],    // 2
//     [[], [], [], [], [], [], []],     // 3
//     [[], [], [5], [], [], [], []],    // 4
//     [[], [], [], [], [], [6], []], // 5
//     [[], [], [], [], [], [], [7]], // 6
//     [[], [8], [], [], [], [], []], // 7
//     [[], [], [], [], [9], [], []], // 8
//     [[], [], [], [10], [], [], []], // 9
//     [[], [], [], [], [], [], []] // 10
//   ],
//   alphabet: ['ε', 'b', 'd', 'e', 'l', 'o', 'u'],
//   acceptState: [
//     {
//       state: 3,
//       REId: 0
//     }, {
//       state: 10,
//       REId: 1
//     }
//   ]
// }

// var ffi = require("ffi")
// console.log("111")
//
// var DLL = ffi.Library('./NFA.dll', {
//   'generateNFA' : ['string', ['string']]
// });
//
// var DLL = new ffi.Library('./test.dll' ,{
//   'GetMaxNumber':
//     [
//       'int64', ['int64','int64']
//
//     ]
// });
// var n = DLL.generateNFA("a");
// console.log(n)
//
//

module.exports = router;
