import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Id,Task,column } from "../type";
import { CSS } from "@dnd-kit/utilities";
import PlusIcon from "../icons/plusicon";
import TrashIcon from "../icons/trash";
import { useMemo, useState } from "react";
import TaskCrd from "./TaskCrd";


interface Props {
  column: column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id:Id, title:string)=> void;
  createTask:(columnId:Id)=>void;
  tasks:Task[];
  updateTask:(id:Id,content:string)=>void;
  deleteTask:(id:Id)=>void;
}

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,updateTask
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const taskIDS= useMemo(()=>{
    return tasks.map(task=>task.id)
  },[tasks]);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled:editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
      bg-columnBackgroundColor
      opacity-50
      border-2
      border-blue-500
      w-[350px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
      "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
  bg-columnBackgroundColor
  w-[350px]
  h-[500px]
  max-h-[500px]
  rounded-md
  flex
  flex-col
  "
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="
      bg-mainBackgroundColor
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      rounded-b-none
      p-3
      font-bold
      border-columnBackgroundColor
      border-4
      flex
      items-center
      justify-between
      "
      >
        <div className="flex gap-2">
          <div
            className="
        flex
        justify-center
        items-center
        bg-columnBackgroundColor
        px-2
        py-1
        text-sm
        rounded-full
        "
          >
            0
          </div>
          {/* {column.title} */}
          {!editMode && column.title}
          {editMode && 
          <input 
          className="bg-black focus:border-blue-500
          border rounded outline-none px-2"
          value={column.title}
          onChange={e=>updateColumn(column.id,e.target.value)}
          autoFocus
          onBlur={()=>{
            setEditMode(false);
          }} 
          onKeyDown={e=>{
            if (e.key !=="Enter")return;
            setEditMode(false);
          }}
          />}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="
        stroke-gray-500
        hover:stroke-white
        hover:bg-columnBackgroundColor
        rounded
        px-1
        py-2
        "
        >
          <TrashIcon />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskIDS}>
        {tasks.map(task=>(
          <TaskCrd key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
        ))}
        </SortableContext>
      </div>
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor active:bg-black hover:text-blue-700"
        onClick={()=>{
          createTask(column.id);
        }}
        >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
}

export default ColumnContainer;
