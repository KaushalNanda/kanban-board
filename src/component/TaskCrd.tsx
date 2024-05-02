import { useState } from "react";
import TrashIcon from "../icons/trash";
import { Id, Task } from "../type";
import{CSS} from"@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

interface Props{
    task:Task;
    deleteTask:(id:Id) => void;
    updateTask:(id:Id,content:string)=>void;
}

function TaskCrd({task,deleteTask,updateTask}:Props) {

    const [mouseisover,setMouseIsOver]=useState(false);
    const [editMode,setEditMode]=useState(false);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
      } = useSortable({
        id: task.id,
        data: {
          type: "Task",
          task,
        },
        disabled:editMode,
      });

      const style = {
        transition,
        transform: CSS.Transform.toString(transform),
      };



    const togleeditmode=()=>{
        setEditMode(prev=> !prev);
        setMouseIsOver(false);
    }

    if(isDragging){
        return(
            <div ref={setNodeRef} style={style}
            className="bg-mainBackgroundColor p-2.5 h-[100px] 
            min-h-[100px] items-center flex  rounded-xl border-2
            border-blue-900
            opacity-35 
             cursor-grab  relative"
            />
        )
    }

    if(editMode){
        return(
        <div 
        ref={
            setNodeRef
        }
        style={style}
        {...attributes}
        {...listeners}
         
            className="bg-mainBackgroundColor p-2.5 h-[100px] 
            min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 
            hover:ring-inset cursor-grab hovor:ring-blue-900 relative"
  >
    <textarea 
    className="h-[90%]
    w-full resize-none border-none rounded bg-transparent
    text-white focus:outline-none"
    value={task.content}
    autoFocus
    placeholder="Task content"
    onBlur={togleeditmode}
    onKeyDown={e=>{
        if(e.key==="Enter"&&e.shiftKey)togleeditmode();
    }}
    onChange={(e)=>updateTask(task.id,e.target.value)}
    >
    </textarea>
    </div>
    );
    }
  return (
  <div 
  ref={
    setNodeRef
}
style={style}
{...attributes}
{...listeners}
  onClick={togleeditmode} 
  className="bg-mainBackgroundColor p-2.5 h-[100px] 
  min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 
  hover:ring-inset cursor-grab hovor:ring-blue-900 relative task"
  onMouseEnter={()=>{
    setMouseIsOver(true);
  }}
  onMouseLeave={()=>{
    setMouseIsOver(false);
  }}
  >
   <p className="my-auto h-[90%] w-full overflow-y-auto
   overflow-x-hidden whitespace-pre-wrap">{task.content}
   </p> 
   {mouseisover&& (
   <button onClick={()=>{
    deleteTask(task.id);
   }} className="stroke-white absolute 
    right-4 
    top-1/2-tarnslate-y-1/2 
    bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100">
        <TrashIcon/>
    </button>)}
    </div>);
}

export default TaskCrd