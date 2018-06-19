/* eslint-disable */
export { create_NFA,CODE }

var CODE = {
	DONE:0,
	DOCLOSURE:1,
	READCHAR:2,
	ACCEPT:3,
	REJECT:4,
	UNKNOWN:5
  };

function create_NFA(TB, A, state2pattern){
    let _range = length => Array.from({ length }).map((v, k) => k);
    var transitionTable = TB;
	  var alphabet = A;
    var acceptState2patternId = new Map(state2pattern.map(obj=>{
      return [obj.state, obj.REId];
    }));
    var NFAStates = _range(transitionTable.length);
    var NFAAcceptStates;
    var NFAStatesTransition = [];
    var closureTable = new Map();
    var text;

    // 计算 NFAAcceptStates
    NFAAcceptStates = state2pattern.map(obj => {
      return obj.state;
      })
    // 计算 NFAStatesTransition
    for (let f_state of _range(transitionTable.length)) {
		for (let ch_index of _range(alphabet.length)) {
			for (let t_state of transitionTable[f_state][ch_index]) {
				NFAStatesTransition.push({ from: f_state, to: t_state, arrows: 'to', label: alphabet[ch_index] });
			}
		}
    }
    
    /**
     * @description 辅助函数，计算一个 state 的 ε-closure
     * @param {*} state 
     * @returns 一个array
     */
    function compute_closure(state){
      if(typeof state === 'number') state = [state];
      let state_closure = new Set(state);
      let sizeBefore = state_closure.size;
      for(let s of state_closure){
        for(let ss of transitionTable[s][alphabet.indexOf('ε')]){
          state_closure.add(ss);
        }
      }
      if(state_closure.size === sizeBefore){
        return [...state_closure];
      }else{
        return compute_closure([...state_closure]);
      }
    }
    // 计算 NFA 所有状态的闭包，保存在closureTable
    for(let state of NFAStates){
      closureTable.set(state, compute_closure(state));
    }

    /***************************************  状态机状态    */
    var scanStartIndex = -1;
    var scanEndIndex = -1;
    var currentStates = [];
    var acceptedStates = [];
    var TODOClosure = true;
    var historials = [];
    var recognizedTokens = [];
    /***************************************  状态机状态    */

    return {
      getNFAStates: function () {
        return NFAStates;
      },
      getNFAStatesTransition: function () {
        return NFAStatesTransition;
      },
      getNFAAcceptStates: function () {
        return NFAAcceptStates;
      },
      feedText: function (t) {
        text = t;
      },
      init: function(){
        scanStartIndex = -1;
        scanEndIndex = -1;
        currentStates = [];
        acceptedStates = [];
        TODOClosure = true;
        historials = [];
  
        currentStates.push(0);
      },
      reset: function(){
        currentStates = [];
        acceptedStates = [];
        currentStates.push(0);
        // 接受一个token后下一步是做闭包还是读字符
        TODOClosure = true;
      },
      nextStep: function(){
        // 情况一：Token提取完成
        if(scanStartIndex===scanEndIndex&&scanEndIndex===(text.length-1)){
          // console.log('Done.');
          return this.createResponse(CODE.DONE);
        }

        // 情况二：遇到了NFA拒绝的输入
        if(currentStates.length===0&&acceptedStates.length===0&&alphabet.indexOf(text[scanEndIndex+1])!=-1){
          // console.log(`fail to recognize from: ${scanStartIndex+1}`);
          return this.createResponse(CODE.REJECT);
        } 

        // 情况三：遇到了NFA遇到了不认识的字符
        if(currentStates.length===0&&acceptedStates.length===0&&alphabet.indexOf(text[scanEndIndex+1])===-1){
          // console.log(`unknown char at: ${scanEndIndex+1} '${text[scanEndIndex+1]}'`);
          return this.createResponse(CODE.UNKNOWN);
        } 

        // 前面三种情况不会改变状态机状态，后面的操作回改变状态机状态，先保存历史轨迹
        historials.push({
          TODOClosure: TODOClosure,
          scanStartIndex: scanStartIndex,
          scanEndIndex: scanEndIndex,
          currentStates: currentStates,
          acceptedStates: acceptedStates,
          recognizedTokens: recognizedTokens.slice()
        });

        // 情况四：提取Token
        if(currentStates.length===0&&acceptedStates.length!=0){
          console.log(`accept: [${text.substring(scanStartIndex+1, scanStartIndex+1+acceptedStates[0].offset)}]`);
          recognizedTokens.push({
            startIndex: scanStartIndex+1,
            endIndex: scanStartIndex+1+acceptedStates[0].offset,
            REId: acceptState2patternId.get(acceptedStates[0].stateId)
          });

          scanStartIndex += acceptedStates[0].offset;
          scanEndIndex = scanStartIndex;
          
          this.reset();
          // console.log(`current states: ${currentStates}`);
          // console.log(`current accept states: ${acceptedStates.map(element => {return element.stateId})}`);
          // console.log(`scan start: ${scanStartIndex}, scan end: ${scanEndIndex}: scan window: ${text.substring(scanStartIndex+1, scanEndIndex+1)}`);
          return this.createResponse(CODE.ACCEPT);
        }

        // 情况五：遵循最长子串原则继续重复做闭包和读字符
        if(TODOClosure){
          this.doClosure();
          TODOClosure = false;
          // console.log(`current states: ${currentStates}`);
          // console.log(`current accept states: ${acceptedStates.map(element => {return element.stateId})}`);
          // console.log(`scan start: ${scanStartIndex}, scan end: ${scanEndIndex}: scan window: ${text.substring(scanStartIndex+1, scanEndIndex+1)}`);
          return this.createResponse(CODE.DOCLOSURE);
        }else{
          this.readChar();
          TODOClosure = true;
          // console.log(`current states: ${currentStates}`);
          // console.log(`current accept states: ${acceptedStates.map(element => {return element.stateId})}`);
          // console.log(`scan start: ${scanStartIndex}, scan end: ${scanEndIndex}: scan window: ${text.substring(scanStartIndex+1, scanEndIndex+1)}`);
          return this.createResponse(CODE.READCHAR);        
        }

      },
      preStep: function(){
        let lastState = historials.pop();
        TODOClosure = lastState.TODOClosure;
        scanStartIndex = lastState.scanStartIndex;
        scanEndIndex = lastState.scanEndIndex;
        currentStates = lastState.currentStates.slice();
        acceptedStates = lastState.acceptedStates.slice();
        recognizedTokens = lastState.recognizedTokens.slice();
      },
      doClosure: function(){
        console.log('do closure');

        let nextStates = new Set(currentStates);
        let nextAcceptedStates = new Set();
        let isAcceptedStatesUpdate = false;
        for(let f_state of currentStates){
          let state_closure = compute_closure(f_state)
          for(let t_state of state_closure){
            nextStates.add(t_state);
            if(NFAAcceptStates.indexOf(t_state) != -1){
              isAcceptedStatesUpdate = true;
              nextAcceptedStates.add({stateId:t_state, offset: scanEndIndex-scanStartIndex});
            }
          }
        }
        currentStates = [...nextStates];
        // if(isAcceptedStatesUpdate===true) {
        //   if(acceptedStates[0].offset===nextAcceptedStates[0].offset){
        //     for(let s of acceptedStates){
        //       nextAcceptedStates.add(s);
        //     }
        //   }else{
        //     // nothing
        //   }
        // }
        // acceptedStates=[...nextAcceptedStates];
        if(isAcceptedStatesUpdate===true) acceptedStates=[...nextAcceptedStates];
      },
      readChar: function(){

        let character = text[scanEndIndex+1];
        let charIndex = alphabet.indexOf(character);
        let nextStates = [];
        // let nextAcceptedStates = [];
        // let isAcceptedStatesUpdate = false;

        // 到达文本结尾，没有下一个字符可读取，设置 currentStates 为空
        if(scanEndIndex===text.length-1){
          console.log('end of text');
          console.log(`scan start: ${scanStartIndex}, scan end: ${scanEndIndex}: scan window: ${text.substring(scanStartIndex+1, scanEndIndex+1)}`);
          currentStates=[];
          return;
        }

        console.log(`scan start: ${scanStartIndex}, scan end: ${scanEndIndex}: scan window: ${text.substring(scanStartIndex+1, scanEndIndex+2)}`);
        console.log(`look at: #${scanEndIndex+1} '${character}'`);

        if(charIndex===-1){
          console.log(`unknown char at: ${scanEndIndex+1} '${character}'`);
          currentStates=[];
          if(acceptedStates.length!=0){
            return;
          }else{
            return;
          }
        }
        
        for(let f_state of currentStates){
          let states = transitionTable[f_state][charIndex];
          for(let t_state of states){
            nextStates.push(t_state);
            // if(NFAAcceptStates.indexOf(t_state) != -1){
            //   isAcceptedStatesUpdate = true;
            //   nextAcceptedStates.push({stateId:t_state, offset: (scanEndIndex+1)-scanStartIndex});
            // }
          }
        }

        // 更新NFA状态
        currentStates = nextStates.slice();
        // if(isAcceptedStatesUpdate===true) acceptedStates = nextAcceptedStates.slice();
        scanEndIndex++;
      },
      createResponse: function(code){
        let resp;
        switch(code){
          case CODE.DONE:
            resp = {
              code:CODE.DONE,
              graphInfo:{

              },
              windowInfo:{

              }
            };
            break;
          case CODE.DOCLOSURE:
            let originalNodes = historials[historials.length-1].currentStates.slice();
            let closureNodes = currentStates.slice();
            closureNodes = originalNodes.forEach(e=>{
              closureNodes.splice(closureNodes.indexOf(e), 1);
            })
            resp = {
              code:CODE.DOCLOSURE,
              graphInfo:{
                originalNodes:originalNodes,
                closureNodes:closureNodes,
                transitionNodes:[]
              },
              windowInfo:{
                recognizedTokens:recognizedTokens,
                scanning:{
                  startIndex:scanStartIndex+1,
                  endIndex:scanEndIndex+1
                },
                remains:{
                  startIndex:scanEndIndex+1,
                  endIndex:text.length
                }
              }
            };
            break;
          case CODE.READCHAR:
            resp = {
              code:CODE.READCHAR,
              graphInfo:{
                originalNodes:historials[historials.length-1].currentStates.slice(),
                closureNodes:[],
                transitionNodes:currentStates
              },
              windowInfo:{
                recognizedTokens:recognizedTokens,
                scanning:{
                  startIndex:scanStartIndex+1,
                  endIndex:scanEndIndex+1
                },
                remains:{
                  startIndex:scanEndIndex+1,
                  endIndex:text.length
                }
              }
            };
            break;
          case CODE.ACCEPT:
            resp = {
              code:CODE.ACCEPT,
              graphInfo:{

              },
              windowInfo:{
                recognizedTokens:recognizedTokens,
                scanning:{
                  startIndex:scanStartIndex+1,
                  endIndex:scanEndIndex+1
                },
                remains:{
                  startIndex:scanEndIndex+1,
                  endIndex:text.length
                }
              }
            };
            break;
          case CODE.REJECT:
            resp = {
              code:CODE.REJECT,
              from:scanStartIndex+1,
              graphInfo:{

              },
              windowInfo:{

              }
            }
            break;
          case CODE.UNKNOWN:
            resp = {
              code:CODE.UNKNOWN,
              at:scanEndIndex+1,
              unknownChar:text[scanEndIndex+1],
              graphInfo:{

              },
              windowInfo:{

              }
            }
            break;
          default:
            break;
        }
        return resp;
      }
      

    }// end return
}