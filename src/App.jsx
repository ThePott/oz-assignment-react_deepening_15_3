import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import BoardBox from './components/BoardBox';
import Boards from './components/Boards';
import Controller from './components/Controller';
import { useBoardStore } from './store';

// Fold Level 2
const App = () => {
  const activeBoard = useBoardStore((state) => state.activeBoard)
  const setActiveBoard = useBoardStore((state) => state.setActiveBoard)
  const boardArray = useBoardStore((state) => state.data)
  const setBoardArray = useBoardStore((state) => state.setBoardArray)

  const boardIdArray = useMemo(() => boardArray.map((board) => board.id), [boardArray])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 20,
      }
    })
  )

  const handleDragStart = (event) => {
    const currentEventData = event.active.data.current

    if (currentEventData?.type === "BOARD") {
      setActiveBoard(currentEventData.board)
    }
  }

  const handleDragOver = (event) => {
    const { active, over } = event

    if (!over) { return }
    if (active.id === over.id) { return }

    const curentData = active.data.current
    const overData = over.data.current
    if (!curentData || !overData) { return }

    const isBoardActive = curentData.type === "BOARD"
    const isOverAnotherBoard = overData.type === "BOARD"

    if (isBoardActive && isOverAnotherBoard) {
      const oldIndex = boardIdArray.indexOf(active.id)
      const newIndex = boardIdArray.indexOf(over.id)

      const newArray = arrayMove(boardArray, oldIndex, newIndex)

      setBoardArray(newArray)

      if (boardArray[oldIndex].type !== boardArray[newIndex].type) {
        boardArray[oldIndex].type = boardArray[newIndex].type
      }
    }
  }

  const handleDragEnd = (event) => {
    setActiveBoard(null)

    const { active, over } = event

    if (!over) { return }
    if (active.id === over.id) { return }

    const oldIndex = boardIdArray.indexOf(active.id)
    const newIndex = boardIdArray.indexOf(over.id)

    const newArray = arrayMove(boardArray, oldIndex, newIndex)

    setBoardArray(newArray)
  }


  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <div className="flex flex-col h-screen">
        <header className="w-full h-[80px] bg-slate-800 flex flex-col items-center justify-center text-stone-100">
          <p className="text-lg font-semibold">Kanban Board Project</p>
          <p>Chapter 3. dnd kit</p>
        </header>
        <main className="flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-3 gap-4 p-4 w-full">
            <Boards type={'todo'} />
            <Boards type={'inprogress'} />
            <Boards type={'done'} />
          </div>
          <Controller />
        </main>
        <footer className="w-full h-[60px] bg-slate-800 flex items-center text-stone-100 justify-center">
          <p>&copy; OZ-CodingSchool</p>
        </footer>
      </div>

      {createPortal(
        <DragOverlay>
          {activeBoard && <BoardBox item={activeBoard} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

export default App;
