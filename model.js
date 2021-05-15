
var ModelBuilder = function(foundationEl) {
  let self = this
  
  let builder = {}
  
  builder.addBoard = function(name) {
    let board = document.createElement('a-box')
    board.setAttribute('id', name)
    board.setAttribute('height', 0.1)
    foundationEl.appendChild(board)
    return builder
  }
  
  builder.build = function() {
  }
  
  return builder
}