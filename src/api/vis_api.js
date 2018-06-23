export { createEdges, createNodes }
function createEdges(transitionTable, alphabet) {
  var Edges = []
  let _range = length => Array.from({ length }).map((v, k) => k)
  for (var fState of _range(transitionTable.length)) {
    for (var chIndex of _range(alphabet.length)) {
      for (var tState of transitionTable[fState][chIndex]) {
        Edges.push({ id: Edges.length, from: fState, to: tState, arrows: 'to', label: alphabet[chIndex] })
      }
    }
  }
  Edges.push({ id: 10086, from: 10086, to: 0, arrows: 'to', label: 'Start' })
  return Edges
}
function createNodes(transitionTable, acceptState) {
  var Nodes = []
  for (let i = 0; i < transitionTable.length; i++) {
    Nodes[i] = {
      id: i, label: i.toString()
    }
  }
  for (let i = 0; i < acceptState.length; i++) {
    Nodes[acceptState[i].state].borderWidth = 5
  }
  Nodes.push({ id: 10086, size: 0 })
  return Nodes
}