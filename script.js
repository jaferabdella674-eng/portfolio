<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard JS To-Do App</title>
<style>
body{ font-family:Arial,sans-serif; background:#f0f0f0; text-align:center; padding:30px; transition:background 0.3s, color 0.3s;}
body.dark{ background:#121212; color:white; }

h2{ margin-bottom:20px; }

input, select{ padding:8px; margin:5px; border-radius:5px; border:1px solid #ccc; }

button{ padding:6px 10px; margin:2px; border:none; border-radius:5px; background:blue; color:white; cursor:pointer; transition:all 0.3s;}
button:hover{ background:darkblue; }

ul{ list-style:none; padding:0; margin-top:20px; min-height:50px; }

li{ background:white; padding:10px; margin-bottom:8px; border-radius:5px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 0 5px #aaa; cursor:grab; transition:all 0.3s;}
body.dark li{ background:#1e1e1e; color:white; }

li.completed{ text-decoration:line-through; color:gray; }
li.overdue{ background:#ffcccc; }

.category{ font-size:12px; font-weight:bold; margin-left:5px; color:purple; }

.dashboard{ display:flex; justify-content:center; margin-top:20px; gap:20px; }
.card{ background:white; padding:10px; border-radius:5px; width:120px; box-shadow:0 0 5px #aaa;}
body.dark .card{ background:#1e1e1e; color:white; }

.progress-container{ width:100%; height:10px; background:#ccc; border-radius:5px; margin-top:5px; overflow:hidden;}
.progress-bar{ height:100%; width:0%; background:green; transition:width 0.5s;}
</style>
</head>
<body>

<h2>Dashboard JS To-Do App</h2>

<input type="text" id="taskInput" placeholder="Enter task">
<select id="categorySelect">
  <option value="Work">Work</option>
  <option value="Personal">Personal</option>
  <option value="Other">Other</option>
</select>
<select id="prioritySelect">
  <option value="High">High</option>
  <option value="Medium">Medium</option>
  <option value="Low">Low</option>
</select>
<input type="date" id="dueDate">
<button id="addBtn">Add Task</button>
<button id="toggleTheme">Dark/Light Mode</button>

<p>
  <button id="allBtn">All</button>
  <button id="completedBtn">Completed</button>
  <button id="pendingBtn">Pending</button>
</p>

<input type="text" id="searchInput" placeholder="Search tasks">

<div class="dashboard">
  <div class="card" id="workCard">Work: <span id="workCount">0</span><div class="progress-container"><div class="progress-bar" id="workProgress"></div></div></div>
  <div class="card" id="personalCard">Personal: <span id="personalCount">0</span><div class="progress-container"><div class="progress-bar" id="personalProgress"></div></div></div>
  <div class="card" id="otherCard">Other: <span id="otherCount">0</span><div class="progress-container"><div class="progress-bar" id="otherProgress"></div></div></div>
</div>

<p>Remaining tasks: <span id="counter">0</span></p>

<ul id="taskList"></ul>

<script>
// ===== VARIABLES =====
let input=document.getElementById("taskInput");
let addBtn=document.getElementById("addBtn");
let taskList=document.getElementById("taskList");
let counter=document.getElementById("counter");
let toggleThemeBtn=document.getElementById("toggleTheme");
let categorySelect=document.getElementById("categorySelect");
let prioritySelect=document.getElementById("prioritySelect");
let dueDateInput=document.getElementById("dueDate");
let searchInput=document.getElementById("searchInput");

let allBtn=document.getElementById("allBtn");
let completedBtn=document.getElementById("completedBtn");
let pendingBtn=document.getElementById("pendingBtn");

let workCount=document.getElementById("workCount");
let personalCount=document.getElementById("personalCount");
let otherCount=document.getElementById("otherCount");
let workProgress=document.getElementById("workProgress");
let personalProgress=document.getElementById("personalProgress");
let otherProgress=document.getElementById("otherProgress");

let tasks=JSON.parse(localStorage.getItem("tasks"))||[];
let currentFilter="all";
let darkMode=localStorage.getItem("darkMode")==="true";

// ===== THEME =====
function applyTheme(){ if(darkMode) document.body.classList.add("dark"); else document.body.classList.remove("dark"); }
toggleThemeBtn.addEventListener("click",()=>{ darkMode=!darkMode; localStorage.setItem("darkMode",darkMode); applyTheme(); });
applyTheme();

// ===== SAVE =====
function saveTasks(){ localStorage.setItem("tasks",JSON.stringify(tasks)); }

// ===== DASHBOARD UPDATE =====
function updateDashboard(){
  let work=tasks.filter(t=>t.category==="Work"); 
  let personal=tasks.filter(t=>t.category==="Personal");
  let other=tasks.filter(t=>t.category==="Other");
  
  workCount.innerText=work.length; personalCount.innerText=personal.length; otherCount.innerText=other.length;
  workProgress.style.width=(work.length?work.filter(t=>t.completed).length/work.length*100:0)+"%";
  personalProgress.style.width=(personal.length?personal.filter(t=>t.completed).length/personal.length*100:0)+"%";
  otherProgress.style.width=(other.length?other.filter(t=>t.completed).length/other.length*100:0)+"%";
}

// ===== RENDER =====
function renderTasks(filter=currentFilter,search=""){
  taskList.innerHTML="";
  let remaining=0;
  let today=new Date();
  tasks.forEach((task,index)=>{
    if(filter==="completed"&&!task.completed) return;
    if(filter==="pending"&&task.completed) return;
    if(search && !task.text.toLowerCase().includes(search.toLowerCase())) return;
    
    let li=document.createElement("li");
    let overdueClass="";
    if(task.dueDate && new Date(task.dueDate)<today && !task.completed) overdueClass="overdue";
    li.className=overdueClass+(task.completed?" completed":"");
    li.innerHTML=`<span>${task.text}</span> <span class="category">[${task.category}]</span> <span>${task.priority}</span> <span>Due:${task.dueDate||"N/A"}</span>`;
    li.setAttribute("draggable","true");
    
    // Toggle complete
    li.addEventListener("click",()=>{
      tasks[index].completed=!tasks[index].completed;
      saveTasks(); renderTasks(currentFilter,searchInput.value); updateDashboard();
    });
    
    // Edit button
    let editBtn=document.createElement("button"); editBtn.innerText="Edit";
    editBtn.addEventListener("click",e=>{
      e.stopPropagation();
      let newText=prompt("Edit task:",task.text);
      if(newText && newText.trim()!==""){
        task.text=newText.trim();
        task.category=prompt("Edit category (Work, Personal, Other):",task.category)||task.category;
        task.priority=prompt("Edit priority (High, Medium, Low):",task.priority)||task.priority;
        task.dueDate=prompt("Edit due date (YYYY-MM-DD):",task.dueDate)||task.dueDate;
        saveTasks(); renderTasks(currentFilter,searchInput.value); updateDashboard();
      }
    });
    
    // Delete button
    let delBtn=document.createElement("button"); delBtn.innerText="Delete";
    delBtn.addEventListener("click",e=>{
      e.stopPropagation(); tasks.splice(index,1); saveTasks(); renderTasks(currentFilter,searchInput.value); updateDashboard();
    });
    
    li.appendChild(editBtn); li.appendChild(delBtn);
    taskList.appendChild(li);
    
    if(!task.completed) remaining++;
    
    // Drag & Drop
    li.addEventListener("dragstart",()=>li.classList.add("dragging"));
    li.addEventListener("dragend",()=>{ li.classList.remove("dragging"); saveOrder(); });
  });
  counter.innerText=remaining;
  updateDashboard();
}

// ===== ADD TASK =====
function addTask(){
  let taskText=input.value.trim(); if(taskText==="") return;
  let taskObj={ text:taskText, category:categorySelect.value, priority:prioritySelect.value, dueDate:dueDateInput.value, completed:false };
  tasks.push(taskObj); input.value=""; dueDateInput.value=""; saveTasks(); renderTasks(currentFilter,searchInput.value); updateDashboard();
}

// ===== EVENTS =====
addBtn.addEventListener("click",addTask);
input.addEventListener("keypress",e=>{ if(e.key==="Enter") addTask(); });
allBtn.addEventListener("click",()=>{ currentFilter="all"; renderTasks(); });
completedBtn.addEventListener("click",()=>{ currentFilter="completed"; renderTasks(); });
pendingBtn.addEventListener("click",()=>{ currentFilter="pending"; renderTasks(); });
searchInput.addEventListener("input",()=>renderTasks(currentFilter,searchInput.value));

// ===== DRAG & DROP =====
taskList.addEventListener("dragover",e=>{
  e.preventDefault();
  const dragging=document.querySelector(".dragging");
  const afterElement=getDragAfterElement(e.clientY);
  if(afterElement==null) taskList.appendChild(dragging); else taskList.insertBefore(dragging,afterElement);
});
function getDragAfterElement(y){
  const draggableElements=[...taskList.querySelectorAll("li:not(.dragging)")];
  return draggableElements.reduce((closest,child)=>{
    const box=child.getBoundingClientRect();
    const offset=y-box.top-box.height/2;
    if(offset<0 && offset>closest.offset) return {offset:offset,element:child}; else return closest;
  },{offset:Number.NEGATIVE_INFINITY}).element;
}
function saveOrder(){
  const lis=taskList.querySelectorAll("li");
  tasks=[...lis].map(li=>{
    const spanText=li.querySelector("span").textContent;
    return tasks.find(t=>t.text===spanText);
  });
  saveTasks();
}

// ===== INITIAL =====
renderTasks(); updateDashboard();

</script>

</body>
</html>
