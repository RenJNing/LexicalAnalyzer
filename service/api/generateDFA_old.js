var DFA= function(nfa){
  this.nfa_stateTransition=nfa.stateTransition
  this.nfa_alphabet=nfa.alphabet
  this.nfa_acceptStateList=nfa.acceptStateList
  this.dfa_stateTransition=[]
  this.dfa_alphabet=[]
  this.dfa_acceptStateList=[]
  this.generateDFAalphabet=generateDFAalphabet
  this.generateDFAStateTransition=generateDFAStateTransition
}
function generateDFAStateTransition(){
  this.generateDFAalphabet()
  // console.log(this.nfa_stateTransition)
  // for(var i=0;i<this.nfa_stateTransition.length;i++){
  //   console.log(this.nfa_stateTransition[i].startState,this.nfa_stateTransition[i].inputChar,this.nfa_stateTransition[i].endState)
  // }
  var closureSet=[]
  var closureElement=[]
  var start=0
  closureElement[closureElement.length]=start
  // var InClosureOrNot =function(element,closureEl){
  //   for(var i=0;i<closureEl.length;i++){
  //     if(element==closureEl[i]){return true;break}
  //   }
  //   return false;
  // }
  for(var m=0;m<closureElement.length;m++){
    for(var n=0;n<this.nfa_stateTransition.length;n++){
      if(closureElement[m]==this.nfa_stateTransition[n].startState&&this.nfa_stateTransition[n].inputChar=='ε'){
        var inTheTable=false;
        for(var o=0;o<closureElement.length;o++){
          if(closureElement[o]==this.nfa_stateTransition[n].endState){
            inTheTable=true;
          }
        }
        if(inTheTable==false) {
          closureElement[closureElement.length] = this.nfa_stateTransition[n].endState
        }
      }
    }
  }
  //console.log(closureElement)
  closureSet[closureSet.length]=closureElement
  for(var i=0;i<closureSet.length;i++) {
    for (var j=0;j<closureSet[i].length;j++) {

      for(var k = 0; k < this.dfa_alphabet.length; k++) {
        closureElement = []
        for (var l = 0; l < this.nfa_stateTransition.length; l++) {
          if(closureSet[i][j]==this.nfa_stateTransition[l].startState&&this.nfa_stateTransition[l].inputChar==this.dfa_alphabet[k]){
            closureElement[closureElement.length]=this.nfa_stateTransition[l].endState
            for(var m=0;m<closureElement.length;m++){
              for(var n=0;n<this.nfa_stateTransition.length;n++){
                if(closureElement[m]==this.nfa_stateTransition[n].startState&&this.nfa_stateTransition[n].inputChar=='ε'){
                  var inTheTable=false;
                  for(var o=0;o<closureElement.length;o++){
                    if(closureElement[o]==this.nfa_stateTransition[n].endState){
                      inTheTable=true;
                    }
                  }
                  if(inTheTable==false) {
                    closureElement[closureElement.length] = this.nfa_stateTransition[n].endState
                  }
                }
              }
            }
            //console.log(closureElement)
            break;
          }
        }
        if(closureElement.length==0){continue;}
        var SameOrNot=false;

        for(var l=0;l<closureSet.length;l++){
          if(closureSet[l].length==closureElement.length) {
            //console.log(closureSet,l)
            //console.log(closureElement)
            var SameOrNot1 = false;
            for (var m = 0; m < closureSet[l].length; m++) {
              //当前闭包的第m个元素 是否在 新闭包中
              //每一个元素  都在新闭包里面里面
              var temp = false;//默认不在
              for (var n = 0; n < closureElement.length; n++) {
                if (closureSet[l][m] == closureElement[n]) {
                  temp = true
                }
              }
              if (temp == false) {
                //当前元素 不在新闭包里面
                break;
              }else{
                if(m=closureSet[l].length-1){
                  //console.log("相等！！！")
                  SameOrNot1=true;
                  this.dfa_stateTransition[this.dfa_stateTransition.length]={startState:i,inputChar:this.dfa_alphabet[k],endState:l}
                }
              }
            }

            if (SameOrNot1) {
              SameOrNot = true;
              break;
            }
          }
        }

        if(!SameOrNot){
          this.dfa_stateTransition[this.dfa_stateTransition.length]={startState:i,inputChar:this.dfa_alphabet[k],endState:closureSet.length}
          closureSet[closureSet.length]=closureElement
        }else{

        }
      }

    }
  }
  //console.log(closureSet)
  //console.log(this.dfa_stateTransition)
  //console.log(closureElement)
  // for(var i=0;i<this.nfa_stateTransition.length;i++){
  //   if(InClosureOrNot(this.nfa_stateTransition[i].startState,closureElement)&&this.nfa_stateTransition[i].inputChar=='ε'){
  //     closureElement[closureElement.length]=this.nfa_stateTransition[i].endState;
  //   }
  // }


  for (var i = 0; i < this.nfa_acceptStateList.length; i++) {
    var end=this.nfa_acceptStateList[i].state;
    for(var j=0;j<closureSet.length;j++) {
      for(var k=0;k<closureSet[j].length;k++){
        if(closureSet[j][k]==end){
          this.dfa_acceptStateList[this.dfa_acceptStateList.length]={state:j,REId:this.nfa_acceptStateList[i].REId}
          break;
        }
      }
    }

  }
  // console.log(this.dfa_alphabet)
  // console.log(this.dfa_acceptStateList)
  // console.log(this.dfa_stateTransition)
}
function generateDFAalphabet(){
  //console.log(this)
  for(var i=0;i<this.nfa_alphabet.length;i++){
    if(this.nfa_alphabet[i]!='ε'){
      this.dfa_alphabet[this.dfa_alphabet.length]=this.nfa_alphabet[i]
    }
  }
  //console.log(this.dfa_alphabet)
}

module.exports = function(nfa) {
  // console.log(nfa.stateTransition)
  // console.log(nfa.acceptStateList)
  // console.log(nfa.alphabet)
  var dfa=new DFA(nfa)
  dfa.generateDFAStateTransition()
  return{
    stateTransition:dfa.dfa_stateTransition,
    alphabet:dfa.dfa_alphabet,
    acceptStateList:dfa.dfa_acceptStateList//元素state
    }
}
