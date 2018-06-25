// var express = require('express');
// var generateNFA =require("./lexical/历史版本/generateNFA");
// var router = express.Router();
//
// var RE=
//   {}
//
// var result={
//   transitionTable: [
//     [[1, 4], [], [], [], [], [], []], // 0
//     [[], [], [2], [], [], [], []], // 1
//     [[], [], [], [], [], [3], []], // 2
//     [[], [], [], [], [], [], []], // 3
//     [[], [], [5], [], [], [], []], // 4
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
//
// module.exports = router;
// var express = require('express');
// // var generateNFA =require("./generateNFA");
// var router = express.Router();
// var express = require('express');
// var router = express.Router();
function StateTransition(s,i,e) {
  this.startState=s
  this.inputChar=i
  this.endState=e
}

function AcceptStateList( s , id ){
  this.state = s
  this.REId = id
}
function judge_next( res , stPoint , edge , stateTransitions ){
  for( var j = 0 ; j < stateTransitions.length ; j ++){
    if( stPoint === stateTransitions[j].startState && edge === stateTransitions[j].inputChar ){
      for( var k = 0 ; k < res.length ; k++ ){
        for( var i = 0 ; i < res[k].length ; i ++ ){
          if( stateTransitions[j].endState === res[k][i]){
            return k;
          }
        }
      }
    }
  }

  return -1;
}
module.exports =function simplifyDFA( DFA){
  //该函数返回的结果是resStateTrans，alphabets , acceptStateList
  //console.log(DFA)
  var stateTransitions=DFA.stateTransition
  var alphabets=DFA.alphabet
  var acceptStates=DFA.acceptStateList

  var resStateTrans = new Array();
  var resAcceptStateList = new Array();

  //找出所有接受状态
  var endStates = new Array();
  for ( var i = 0 ; i < acceptStates.length ; i++ ){
    endStates.push( acceptStates[i].state );
  }

  //找出所有非接受状态
  var nonEndStates = new Array();
  for( var i = 0 ; i < stateTransitions.length ; i ++ ){
    if (endStates.indexOf(stateTransitions[i].startState) ===  -1 && nonEndStates.indexOf(stateTransitions[i].startState) === -1 )
    {
      nonEndStates.push(stateTransitions[i].startState)
    }
    if( endStates.indexOf(stateTransitions[i].endState) ===  -1 && nonEndStates.indexOf(stateTransitions[i].endState) === -1){
      nonEndStates.push(stateTransitions[i].endState)
    }
  }

  var res = new Array();
  res.push( nonEndStates );
  res.push( endStates );

  //对状态进行划分
  var i = 0 ;
  while( true ){
    for( ; i < res.length ; i++ ){
      var jumpNext = new Array();
      var belongTo = new Array();

      for( var j = 0 ; j < res[i].length ; j++ ){
        var eachJumpNext = new Array();

        for( var k = 0 ; k < alphabets.length ; k ++ ){
          eachJumpNext.push( judge_next(res,res[i][j],alphabets[k],stateTransitions));
        }

        var l;
        for( l = 0 ; l < jumpNext.length ; l++ ){
          var m;
          for( m = 0 ; m < eachJumpNext.length ; m++ ){
            if( jumpNext[l][m] != eachJumpNext[m] ){
              break;
            }
          }
          //完全匹配，标记为归到同一组
          if( m === eachJumpNext.length ){
            belongTo.push(l);
            break;
          }
        }

        //找不到匹配项，要分为新的一类
        if( l === jumpNext.length ){
          jumpNext.push( eachJumpNext );
          belongTo.push( jumpNext.length - 1 );
        }
      }

      //大于1，说明有不同的分组，要进行拆分、删除、添加
      if( jumpNext.length > 1 ){
        var toBeRemove = new Array();

        for( var j = 1 ; j < jumpNext.length ; j ++ ){
          var toBeRemoveTerm = new Array();
          for( var k = 0 ; k < belongTo.length ; k++ ){
            if( belongTo[k] == j ){
              toBeRemoveTerm.push(res[i][k]);
            }
          }
          toBeRemove.push(toBeRemoveTerm);
        }

        for( var l = 0 ; l < toBeRemove.length ; l ++ ){
          for( var m = 0 ; m < toBeRemove[l].length ; m++ ){
            var index = res[i].indexOf( toBeRemove[l][m] );
            res[i].splice( index , 1 );
          }
          res.push(toBeRemove[l]);
        }
        i = 0 ;
        break;
      }
    }

    if( i == res.length ){
      break;
    }
  }

  //找到开始状态,并将它移动到res数组的最开始位置
  for( var i = 0 ; i < res.length ; i ++ ){
    var startStateIndex = res[i].indexOf(0)
    if(startStateIndex != -1 ){
      if( startStateIndex != 0 ){
        var startStateArray = res.splice(startStateIndex,1);
        res.unshift( startStateArray[0] );
      }
      break;
    }
  }

  //对新分好的分组构建状态转化流数组，即resStateTrans
  for( var i = 0 ; i < res.length ; i ++ ){
    for( var j = 0 ;  j < alphabets.length ; j ++ ){
      var goToState = judge_next(res,res[i][0],alphabets[j],stateTransitions)
      if( goToState != -1 ){
        var newStateTransition = new StateTransition( i , alphabets[j] , goToState )
        resStateTrans.push(newStateTransition);
      }
    }
  }

  //构建新的acceptStateList
  for( var i = 0 ; i < acceptStates.length ; i++ ){
    for( var j = 0 ; j < res.length ; j ++ ){
      if( res[j].indexOf(acceptStates[i].state) !== -1 ){
        var k = 0;
        for( ; k < resAcceptStateList.length ; k++ ){
          if( acceptStates[i].REId === resAcceptStateList[k].REId && j === resAcceptStateList[k].state){
            break;
          }
        }
        if( k == resAcceptStateList.length ){
          var newAcceptState = new AcceptStateList(j,acceptStates[i].REId);
          // console.log(resAcceptStateList.indexOf( newAcceptState ));
          resAcceptStateList.push(newAcceptState);
        }
        break;
      }
    }
  }

  return { stateTransition:resStateTrans , alphabet:alphabets , acceptStateList:resAcceptStateList};
}
// module.exports = router;
//
// // 测试
// var stateTransitions = new Array();
// var acceptStates = new Array();
//
// var term = new StateTransition( 0 , 'a' , 1 );
// var term1 = new StateTransition( 0 , 'b' , 2 );
// var term2 = new StateTransition( 1 , 'a' , 3 );
// var term3 = new StateTransition( 1 , 'b' , 2 );
// var term4 = new StateTransition( 2 , 'a' , 1 );
// var term5 = new StateTransition( 2 , 'b' , 4 );
// var term6 = new StateTransition( 3 , 'a' , 3 );
// var term7 = new StateTransition( 3 , 'b' , 5 );
// var term8 = new StateTransition( 4 , 'a' , 6 );
// var term9 = new StateTransition( 4 , 'b' , 5 );
// var term10 = new StateTransition( 5 , 'a' , 6 );
// var term11 = new StateTransition( 6 , 'b' , 5 );
// var term12 = new StateTransition( 6 , 'a' , 3 );
//
//
// stateTransitions.push( term , term1 ,term2, term3 , term4 , term5 , term6 , term7, term8 , term9 ,term10,term11,term12);
//
// var acceptTerm = new AcceptStateList( 3 , 1 );
// var acceptTerm2 = new AcceptStateList( 4 , 1 );
// var acceptTerm3 = new AcceptStateList( 5 , 1 );
// var acceptTerm4 = new AcceptStateList( 6 , 1 );
//
// acceptStates.push(acceptTerm , acceptTerm2 ,acceptTerm3 , acceptTerm4);
//
// var res = new simplifyDFA(stateTransitions , ['a','b'] , acceptStates );
// var stateTrans = res.resStateTrans;
// var alphabets = res.alphabets;
// var acceptStates = res.acceptStates;
// console.log('run');
