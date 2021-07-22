import { ref, readonly, computed } from 'vue'

export function useTicTacToe(initialState) {
  const initialBoard = [
    ['-', '-', '-'],
    ['-', '-', '-'],
    ['-', '-', '-']
  ]

  const boards = ref(initialState || [initialBoard])
  const currentPlayer = ref('o')
  const currentMove = ref(0)
  const currentBoard = computed(() => boards.value[currentMove.value])
  const gameOver = ref(false)

  function makeMove({ row, col }) {
    if (gameOver.value) {
      console.log("Game is over!")
      return
    }

    if (currentBoard.value[row][col] !== "-") {
      console.log("Illegal move!")
      return
    }

    const newBoard = JSON.parse(JSON.stringify(boards.value))[currentMove.value]
    newBoard[row][col] = currentPlayer.value
    currentPlayer.value  = currentPlayer.value === 'o' ? 'x' : 'o'
    boards.value.push(newBoard)
    currentMove.value += 1

    gameOver.value = newBoard.filter((row) => {
      return row.includes("-")
    }).length === 0

  }

  function undo() {
    if( currentMove.value <= 0) {
      return
    }

    gameOver.value = false
    currentMove.value -= 1
    boards.value.pop()
    currentPlayer.value  = currentPlayer.value === 'o' ? 'x' : 'o'
  }

  function redo() {
    currentMove.value += 1
  }

  return {
    makeMove,
    redo,
    undo,
    boards: readonly(boards),
    currentMove,
    currentPlayer: readonly(currentPlayer),
    currentBoard,
    gameOver
  }
}

