var DFA= function(test){
  this.StateTransition=test.stateTransition
  this.alphabet=test.alphabet
  this.acceptStateList=test.acceptStateList
  this.state=0
  this.start=0
  this.new_state=1
  this.set_state=set_state
  this.stateTable=[]
  this.StateTransitionTable=[]
  this.generateTransitionTable=generateTransitionTable
  this.generateStateTable=generateStateTable
  this.generateStateTable1=generateStateTable1
  this.updateStateTransition=updateStateTransition

  // this.updateNFA=updateNFA;
  // this.generateStateTable=generateStateTable
  // this.generateStateTable1=generateStateTable1
}
function set_state(){
  var max=0
  for(var i=0;i<this.StateTransition.length;i++){
    if(max<this.StateTransition[i].endState){
      max=this.StateTransition[i].endState
    }
  }
  for(var i=0;i<this.StateTransition.length;i++){
    if(max<this.StateTransition[i].startState){
      max=this.StateTransition[i].startState
    }
  }
  this.state=max+1;
}
function generateStateTable() {
  this.set_state()
  for(var i=0;i<this.state;i++){
    this.stateTable[this.stateTable.length]=-1
  }
  console.log(this.stateTable)
  this.stateTable[0]=0
  var start=this.start
  for(var i=0;i<this.stateTransition.length;i++){
    if(this.stateTransition[i].startState==start&&this.stateTable[this.stateTransition[i].endState]==-1){
      this.stateTable[this.stateTransition[i].endState]=this.new_state;
      this.new_state++;
      this.generateStateTable1(this,this.stateTransition[i].endState)
    }
  }
  console.log(this.stateTable)
}
function generateStateTable1(self,start) {
  for(var i=0;i<self.stateTransition.length;i++){
    if(self.stateTransition[i].startState==start&&self.stateTable[self.stateTransition[i].endState]==-1){
      self.stateTable[self.stateTransition[i].endState]=self.new_state;
      self.new_state++;
      self.generateStateTable1(self,self.stateTransition[i].endState)
    }
  }
}
function updateStateTransition(){
  for(var i=0;i<this.stateTransition.length;i++){
    this.stateTransition[i].startState=this.stateTable[this.stateTransition[i].startState]
    this.stateTransition[i].endState=this.stateTable[this.stateTransition[i].endState]
  }
  for(var i=0;i<this.acceptStateList.length;i++){
    this.acceptStateList[i].state=this.stateTable[this.acceptStateList[i].state]
  }
}
function generateTransitionTable(){
  this.set_state()
  for(var i=0;i<this.state;i++){
    var vector2=[]
    for(var j=0;j<this.alphabet.length;j++){
      var vector1=[]
      vector2[vector2.length]=vector1
    }
    this.StateTransitionTable[this.StateTransitionTable.length]=vector2
  }
  //console.log(this.StateTransitionTable)
  for(var i=0;i<this.StateTransition.length;i++){
    var input =0
    for(var j=0;j<this.alphabet.length;j++){
      if(this.alphabet[j]==this.StateTransition[i].inputChar){input=j;break}
    }
    this.StateTransitionTable[this.StateTransition[i].startState][input][this.StateTransitionTable[this.StateTransition[i].startState][input].length]=this.StateTransition[i].endState

  }
}
module.exports=function(test){
  console.log(test)
  var temp=new  DFA(test)
  temp.generateTransitionTable()
  return temp.StateTransitionTable
}
// function generateStateTable(){
//   for(var i=0;i<this.state;i++){
//     this.stateTable[i]=-1;
//   }
//   var temp_NFA=this.NFAStack.top().stateTransitionList
//   this.stateTable[this.NFAStack.top().startState]=this.new_state;
//   //this.stateTable[this.NFAStack.top().endState]=this.state-1;
//   this.new_state++;
//   var start=this.NFAStack.top().startState;
//   for (var i=0;i<this.NFAStack.top().stateTransitionList.length;i++){
//     if(this.NFAStack.top().stateTransitionList[i].startState==start&&this.stateTable[this.NFAStack.top().stateTransitionList[i].endState]==-1){
//
//       if(this.NFAStack.top().stateTransitionList[i].endState!=this.NFAStack.top().endState){
//         this.stateTable[this.NFAStack.top().stateTransitionList[i].endState]=this.new_state;
//         this.new_state++;
//         this.generateStateTable1(this,this.NFAStack.top().stateTransitionList[i].endState)
//       }
//     }
//
//   }
//   this.stateTable[this.NFAStack.top().endState]=this.state-1;
// }
// function generateStateTable1(self,start){
//   for (var i=0;i<self.NFAStack.top().stateTransitionList.length;i++){
//     if(self.NFAStack.top().stateTransitionList[i].startState==start&&self.stateTable[self.NFAStack.top().stateTransitionList[i].endState]==-1){
//       //console.log(self.NFAStack.top().stateTransitionList[i].endState)
//
//       if(self.NFAStack.top().stateTransitionList[i].endState!=self.NFAStack.top().endState){
//         self.stateTable[self.NFAStack.top().stateTransitionList[i].endState]=self.new_state;
//         self.new_state++;
//         self.generateStateTable1(self,self.NFAStack.top().stateTransitionList[i].endState)}
//     }
//
//   }
//
// }
// function updateNFA(){
//   var result = this.NFAStack.top();
//   result.startState=this.stateTable[result.startState]
//   result.endState=this.stateTable[result.endState]
//   for(var i=0;i<result.stateTransitionList.length;i++){
//     result.stateTransitionList[i].startState=this.stateTable[result.stateTransitionList[i].startState]
//     result.stateTransitionList[i].endState=this.stateTable[result.stateTransitionList[i].endState]
//   }
//
// }
