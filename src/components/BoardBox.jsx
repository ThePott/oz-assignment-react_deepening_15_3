import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const BoardBox = ({ item, onClick }) => {

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: {
      type: "BOARD",
      board: item
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) return (
    <div
      ref={setNodeRef} style={style} 
      onClick={onClick}
      className="border-2 border-zinc-100 rounded-md  h-[80px]" />
  )

  return (
    <div
      ref={setNodeRef} style={style} {...attributes} {...listeners}
      onClick={onClick}
      className="bg-white hover:bg-stone-100 shadow-md rounded-md p-4 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        {item.type === 'todo' && <div className="animate-pulse w-2 h-2 rounded-full bg-green-500"></div>}
        {item.type === 'inprogress' && <div className="animate-pulse w-2 h-2 rounded-full bg-amber-500"></div>}
        {item.type === 'done' && <div className="animate-pulse w-2 h-2 rounded-full bg-red-500"></div>}
      </div>
      <p className="text-sm text-gray-500">{item.created_at}</p>
    </div>
  )
}

export default BoardBox