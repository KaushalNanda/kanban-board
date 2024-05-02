import PlusIcon from "../icons/plusicon";
import { useMemo, useState } from "react";
import { Id,Task,column } from "../type";
import ColumnContainer from "./ColmnContainer";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useSensor,
  PointerSensor,
  useSensors,
  DragOverEvent
} from "@dnd-kit/core";
import { SortableContext, arrayMove} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCrd from "./TaskCrd";

function KanbanBoard() {
  const [Columns, setColumns] = useState<column[]>([]);
  const columnsId = useMemo(() => Columns.map((col) => col.id), [Columns]);

  const[tasks,setTasks]= useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<column | null>(null);
  const [activetask, setActiveTask]=useState<Task | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 20,
      },
    })
  );


  return (
    <div
      className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    "
    >
      <DndContext
      sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {Columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deletTask}
                  updateTask={updateTask}
                  tasks={tasks.filter(task=>task.columnId===col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      rounded-lg
      bg-mainBackgroundColor
      border-2
      border-columnBackgroundColor
      p-4
      #0047AB
      hover:ring-2
      flex
      gap-2
      "
          >
            <PlusIcon />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn} 
                createTask={createTask}
                deleteTask={deletTask}
                updateTask={updateTask}
                tasks={tasks.filter(task=>task.columnId===activeColumn.id)}
                />
            )}
            {activetask && (<TaskCrd task={activetask}
            deleteTask={deletTask}
            updateTask={updateTask}/>)}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId:Id){
    const newTask: Task={
      id:generateId(),
      columnId,
      content:`Task ${tasks.length+1}`
    };
    setTasks([...tasks,newTask]);
  }

  function createNewColumn() {
    const columnToAdd: column = {
      id: generateId(),
      title: `Colum ${Columns.length + 1}`,
    };

    setColumns([...Columns, columnToAdd]);
  }

  function updateTask(i:Id,content:string){
    const newTask =tasks.map(task=>{
      if (task.id !== i)return task;
      return {...task,content}
    })
    setTasks(newTask);
  }


  function deletTask(id:Id){
    const newTask=tasks.filter(task=>task.id !== id);

    setTasks(newTask);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = Columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
    const newTask=tasks.filter(t=>t.columnId !==id);
    setTasks(newTask);
  }


  function updateColumn(id:Id,title:string){
    const newcolumn=Columns.map(col=>{
      if(col.id !==id) return col;
      return{...col,title};
    });
    setColumns(newcolumn);
  }


  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type==="Task"){
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

function onDragEnd(event :DragEndEvent){
  setActiveColumn(null);
  setActiveTask(null);
  
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
}

function onDragOver(event:DragOverEvent){
  const { active, over } = event;
  if (!over) return;

  const activeId = active.id;
  const overId = over.id;

  if (activeId === overId) return;

  const isActiveTask=active.data.current?.type==="Task";
  const isOverTask=over.data.current?.type==="Task";
  if(!isActiveTask) return;
  // droping task in other column
  if(isActiveTask && isOverTask){
    setTasks(tasks=>{
      const activeIndex=tasks.findIndex(t=>t.id===activeId);
      const overIndex=tasks.findIndex(t=>t.id===overId);

      tasks[activeIndex].columnId=tasks[overIndex].columnId;

      return arrayMove(tasks,activeIndex,overIndex)
    });
  }

// droping task inside the column
const isOveracol =over.data.current?.type==="Column";
if (isActiveTask && isOveracol){
  setTasks(tasks=>{
    const activeIndex=tasks.findIndex(t=>t.id===activeId);
    tasks[activeIndex].columnId=overId

    return arrayMove(tasks,activeIndex,activeIndex)
  });  
}

}

}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
