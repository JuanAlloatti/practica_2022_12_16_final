const sectionTasks = document.querySelector('.sectionTasks');

function printTasks(pTaskList, pDom) {
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
    let button1 = document.createElement('button');
    button1.addEventListener('click', deleteTask);
    button1.dataset.id = pTask.id;

    //para crear los contenidos
    p1.innerText = pTask.titulo;
    button1.innerHTML = 'Eliminar';

    if (pTask.prioridad == 'urgente'){
        article.style.backgroundColor = 'rgb(186, 108, 13)';
    } else if (pTask.prioridad == 'mensual'){
        article.style.backgroundColor = 'rgb(162, 186, 12)';
    } else
    {article.style.backgroundColor = 'rgb(5, 168, 168)';}
        


    //para colocar los elementos creados con sus texto dentro del article
    article.appendChild(p1);
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

    addTask(tasks, newTask);
/*     event.target.reset() */
}
function addTask(pTaskList, pTask) {
    //como controlamos que no haya tareas duplicadas. Buscar antes de insertar un elemento que tenga mi mismo nombre.
    let posicion = pTaskList.findIndex(task => task.titulo === pTask.titulo);

    
    if (pTaskList.length == 0){
        sectionTasks.innerHTML = "";
    }

    if (posicion === -1) {
        let id = tasks.length;
        pTask.id = id;
        pTaskList.push(pTask);
        printOneTask(pTask, sectionTasks);
        id++;
        changeStatus()
    }else{
        alert('La tarea ya ha sido creada previamente');
    }

}

const divNewTaskCreated = document.querySelector('.taskCreated');

const buttonNewTaskCreated = document.querySelector('#buttonNewTask')

function changeStatus(e)
{
    divNewTaskCreated.className="taskCreated show";
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
    deleteData(tasks, idRemove);
}

function deleteData(pTaskList, pId) {

    let posicion = pTaskList.findIndex(task => task.id === pId);
    console.log(posicion)
    pTaskList.splice(posicion, 1)
    printTasks(pTaskList, sectionTasks);

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
    let keyWord = inputKeyWord.value.toLowerCase();

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
var select = document.querySelector(".priorityFilter");

for(var i = 0; i < priorities.length; i++) {
    var prio = priorities[i];
    var element = document.createElement("option");
    element.textContent = prio.charAt(0).toUpperCase() + prio.slice(1);
    element.value = prio;
    select.appendChild(element);
}


// filtrar por prioridad

const inputPriority = document.querySelector('.priorityFilter');

inputPriority.addEventListener('click', getPriorities) 

function getPriorities() {
        //para recoger los datos de los input
    let wantedPriority = inputPriority.value;

    if (wantedPriority !== "") {
        //para filtrar
        let filterTask = filterByPriority(tasks, String(wantedPriority))

        //para pintar
        printTasks(filterTask, sectionTasks);
    } else {
        printTasks(tasks, sectionTasks)
    }
}

function filterByPriority(pTaskList, pPriority) {
    return pTaskList.filter(task => task.prioridad == pPriority);
}