const sectionTasks = document.querySelector('.sectionTasks');
const divNewTaskCreated = document.querySelector('#taskCreated');
const buttonNewTaskCreated = document.querySelector('#buttonNewTask')
let tasks = [];
getTasks();

function getTasks() {
  tasks = [];
  Object.keys(localStorage).forEach(function (key) { 
    let value = localStorage[key];
    value.tid = key;
    tasks.push(JSON.parse(value));
  });
}

function printTasks(pTaskList, pDom) {
/*   getTasks(); */
  pDom.innerHTML = "";
  if (pTaskList.length == 0){
    pDom.innerHTML = `<h3>No quedan más tareas para realizar, bien hecho!</h3>`
  } else {
    pTaskList.forEach(task => printOneTask(task, pDom));
  }
}

function printOneTask(pTask, pDom) {
    //para crear los elementos
    let article = document.createElement('article');
    let p1 = document.createElement('p');
    let p2 = document.createElement('p');
    let button1 = document.createElement('button');
    button1.addEventListener('click', deleteTask);
    button1.dataset.id = pTask.id;

    //para crear los contenidos
    p1.innerText = pTask.titulo;
    p1.className = "task-title"
    p2.innerText = pTask.prioridad;   
    p2.className = "task-priority"
    button1.innerHTML = 'Eliminar';
  
    if (pTask.prioridad == 'urgente'){
        article.style.backgroundColor = '#ff6347';
        p2.innerHTML = `<i class="fa-solid fa-truck-fast"></i>`
    } else if (pTask.prioridad == 'mensual'){
        article.style.backgroundColor = '#90ee90';
        p2.innerHTML = `<i class="fa-solid fa-calendar-days"></i>`
    } else if (pTask.prioridad == 'diaria')
    {article.style.backgroundColor = '#add8e6';
    p2.innerHTML = `<i class="fa-solid fa-sun"></i>`
    } else {
      {article.style.backgroundColor = '#d6b832';
      p2.innerHTML =`<i class="fa-solid fa-circle-question"></i>`
    }}
        


    //para colocar los elementos creados con sus texto dentro del article
    article.appendChild(p1);
    article.appendChild(p2);
    article.appendChild(button1);

    //para colocar el article dentro del pDom donde tiene que ir
    pDom.appendChild(article);

}

printTasks(tasks, sectionTasks)


// Add tasks


registerForm = document.querySelector('.registerForm')
/* registerForm.addEventListener('submit', getDataForm); */

function getDataForm() {
/*     event.preventDefault(); */

    const newTask = {
        titulo: document.querySelector("#titulo").value,
        prioridad: document.querySelector("#prioridad").value,
        
    }

    addTask(newTask);
/*     event.target.reset() */
}
function addTask(pTask) {

    
    if (localStorage.length == 0){
        sectionTasks.innerHTML = "";
    }

    if(taskDuplicated(pTask)) {
      changeStatusOnError();
    } else {
      getTasks();
      let id = tasks.length;
      pTask.id = id + 1;
    
      saveTaskToLocalStorage(pTask);
      printOneTask(pTask, sectionTasks);
      changeStatusOnAdd();
    }

}

function taskDuplicated(pTask) {
  let isDuplicated = false;
  getTasks();

  tasks.forEach(function(task) {
    if(String(task.titulo) == String(pTask.titulo)) {
      isDuplicated = true;
    
    } 
  });
console.log(isDuplicated)
  return isDuplicated;
}

function saveTaskToLocalStorage(pTask) {
  if(localStorage.getItem('task_' + pTask.id) == null) {
    localStorage.setItem('task_'+ pTask.id, JSON.stringify(pTask))
  } else {
    pTask.id = pTask.id + 1;
    saveTaskToLocalStorage(pTask);
  }
}



function changeStatusOnAdd(e) {
  divNewTaskCreated.className="taskCreated show";
  divNewTaskCreated.innerHTML= `Tarea creada con éxito! <i class="fa-solid fa-check"></i>`
  setTimeout(function() {
    divNewTaskCreated.className="taskCreated hide";
  }, 2000);
}

function changeStatusOnError(e) {
  divNewTaskCreated.className="taskNotCreated show";
  divNewTaskCreated.innerHTML= `La tarea ya ha sido creada previamente <i class="fa-solid fa-registered"></i>`;
  setTimeout(function() {
    divNewTaskCreated.className="taskNotCreated hide";
  }, 2000);
}


function changeStatusOnRemove(e) {
  divNewTaskCreated.className="taskCreated show";
  divNewTaskCreated.innerHTML= `La tarea ha sido eliminada con éxito <i class="far fa-trash-alt"></i>`;
  setTimeout(function() {
    divNewTaskCreated.className="taskCreated hide";
  }, 2000);
}


// Remove tasks
function deleteTask(event) {
  let idRemove = parseInt(event.target.dataset.id);
  //borrar del html - necesito el padre
  let article = event.target.parentNode;
  let section = article.parentNode;
  section.removeChild(article)

  //borrar del array - tengo id
  deleteData(idRemove);
}

function deleteData(pId) {
  changeStatusOnRemove();
  localStorage.removeItem("task_" + pId);
  getTasks();
  printTasks(tasks, sectionTasks);
}

printTasks(tasks, sectionTasks)

const priorityFilter = document.querySelector('.priorityFilter');
const wordFilter = document.querySelector('.wordFilter');


// filtrar por palabra clave


const inputKeyWord = document.querySelector('#keyWord');

inputKeyWord.addEventListener('keypress', getKeyWord)

function getKeyWord(e) {
    if (e.key === 'Enter') {
    //para  recoger los datos de los input
    let keyWord = String(inputKeyWord.value).toLowerCase();
    if (keyWord !== "") {
      //para filtrar
      let filterTask = filterByKeyWord(tasks, String(keyWord))

      //para pintar
      printTasks(filterTask, sectionTasks);
    } else {
      printTasks(tasks, sectionTasks)
    }
}}

function filterByKeyWord(pTaskList, pWord) {
    return pTaskList.filter(task => task.titulo.toLowerCase().includes(pWord))
}


//filtrar por prioridad

//para saber qué prioridades hay
const allPriorities = tasks.map(item => item.prioridad)

//para remover prioridades duplicadas
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

const priorities = allPriorities.filter(onlyUnique);

//seleccionar prioridades
let prioritySelect = document.querySelector(".priorityFilter");

function getFilterSelect() {

  for(var i = 0; i < priorities.length; i++) {
    var prio = priorities[i];
    var element = document.createElement("option");
    element.textContent = prio.charAt(0).toUpperCase() + prio.slice(1);
    element.value = prio;
    prioritySelect.appendChild(element);
  }
}
getFilterSelect();  

// filtrar por prioridad

const inputPriority = document.querySelector('.priorityFilter');

inputPriority.addEventListener('click', getPriorities) 

function getPriorities() {
  //para recoger los datos de los input
  /* getFilterSelect() */
  let wantedPriority = inputPriority.value;
  if (wantedPriority !== "") {
    //para filtrar
    let filterTask = filterByPriority(tasks, String(wantedPriority))
    console.log(filterTask)

    //para pintar
    printTasks(filterTask, sectionTasks);
  } else {
    printTasks(tasks, sectionTasks)
  }
}

function filterByPriority(pTaskList, pPriority) {
  return pTaskList.filter(task => task.prioridad == pPriority);
}