const API = `https://62bad550573ca8f8328cae02.mockapi.io`;

const participantsSelect = document.querySelector(`#taskParticipants`),
    taskForm = document.querySelector(`#createTask`),
    taskTitleInput = document.querySelector(`#taskTitle`),
    tasksTable = document.querySelector(`#tasksTable`);

const controller = async (url, method=`GET`, obj) => {
    let options = {
        method,
        headers:{
            "Content-type": "application/json"
        }
    };

    if(obj) options.body = JSON.stringify(obj);

    let request = await fetch(url, options);
    
    if(request.ok){
        return request.json();
    } else{
        throw request.status;
    }
}

const TASK_STATUS = {
    0: task => new ToDo(task),
    1: task => new InProgress(task),
    2: task => new NeedTesting(task),
    3: task => new Testing(task),
    4: task => new Reopened(task),
    5: task => new Done(task)
}

class Task{
    constructor(task){
        Object.assign(this, task);
    }

    render(){
        let taskBlock = document.createElement(`div`);
        taskBlock.className = `card`;
        taskBlock.innerHTML = `<h3>${this.title}</h3>
        <p>Participants: ${this.participants.map(participant => participant.name).join(`, `)}</p>`;

        return taskBlock;
    }
}

class ToDo extends Task{
    constructor(task){
        super(task);
    }

    render(){
        let taskBlock = super.render();

        let btn = document.createElement(`button`);
        btn.innerHTML = `Start doing`;
        
        btn.addEventListener(`click`, async e => {
            try{
                let modifiedTask = await controller(API+`/tasks/${this.id}`, `PUT`, {status: 1});
                taskBlock.remove();
                
                new InProgress(modifiedTask).render();

            } catch(err){
                console.log(err);
            }
        })

        taskBlock.append(btn);

        tasksTable.querySelector(`td#ToDo`).append(taskBlock);
    }
}

class InProgress extends Task{
    constructor(task){
        super(task);
    }

    render(){
        let taskBlock = super.render();

        let btn = document.createElement(`button`);
        btn.innerHTML = `Need tesing`;
        
        btn.addEventListener(`click`, async e => {
            try{
                let modifiedTask = await controller(API+`/tasks/${this.id}`, `PUT`, {status: 2});
                taskBlock.remove();
                
                new NeedTesting(modifiedTask).render();

            } catch(err){
                console.log(err);
            }
        })

        taskBlock.append(btn);

        tasksTable.querySelector(`td#InProgress`).append(taskBlock);
    }
}

class NeedTesting extends Task{
    constructor(task){
        super(task);
    }

    render(){
        let taskBlock = super.render();

        let btn = document.createElement(`button`);
        btn.innerHTML = `Start tesing`;

        btn.addEventListener(`click`, async e => {
            try{
                let modifiedTask = await controller(API+`/tasks/${this.id}`, `PUT`, {status: 3});
                taskBlock.remove();
                
                new Testing(modifiedTask).render();

            } catch(err){
                console.log(err);
            }
        })

        taskBlock.append(btn);

        tasksTable.querySelector(`td#NeedTesting`).append(taskBlock);
    }
}

class Testing extends Task{
    constructor(task){
        super(task);
    }

    render(){
        let taskBlock = super.render();

        let btnReopen = document.createElement(`button`);
        btnReopen.innerHTML = `Reopen`;
        btnReopen.addEventListener(`click`, async e => {
            try{
                let modifiedTask = await controller(API+`/tasks/${this.id}`, `PUT`, {status: 4});
                taskBlock.remove();
                
                new Reopened(modifiedTask).render();

            } catch(err){
                console.log(err);
            }
        })

        let btnDone = document.createElement(`button`);
        btnDone.innerHTML = `Done`;
        btnDone.addEventListener(`click`, async e => {
            try{
                let modifiedTask = await controller(API+`/tasks/${this.id}`, `PUT`, {status: 5});
                taskBlock.remove();

                let modifiedParticipants = await Promise.all(modifiedTask.participants.map(participant => controller(API+`/participants/${participant.id}`, `PUT`, {task: false})));
        
                modifiedParticipants.forEach(participants => {
                    let option = participantsSelect.querySelector(`option[value="${participants.id}"]`);
                    option.disabled = false;
                })
        
                taskForm.reset();
                
                new Done(modifiedTask).render();

            } catch(err){
                console.log(err);
            }
        })

        taskBlock.append(btnReopen, btnDone);

        tasksTable.querySelector(`td#Testing`).append(taskBlock);
    }
}

class Reopened extends Task{
    constructor(task){
        super(task);
    }

    render(){
        let taskBlock = super.render();

        let btn = document.createElement(`button`);
        btn.innerHTML = `Restart`;
        btn.addEventListener(`click`, async e => {
            try{
                let modifiedTask = await controller(API+`/tasks/${this.id}`, `PUT`, {status: 0});
                taskBlock.remove();
                
                new ToDo(modifiedTask).render();

            } catch(err){
                console.log(err);
            }
        })

        taskBlock.append(btn);

        tasksTable.querySelector(`td#Reopened`).append(taskBlock);
    }
}

class Done extends Task{
    constructor(task){
        super(task);
    }

    render(){
        let taskBlock = super.render();
        tasksTable.querySelector(`td#Done`).append(taskBlock);
    }
}

// getParticipants
const getParticipants = async () => await controller(API+`/participants`);
// getParticipants

// participantsRender
const participantsRender = async () => {
    try{
        let participants = await getParticipants();
        
        participantsSelect.innerHTML = participants
            .map(participant => `<option value="${participant.id}" ${participant.task ? `disabled` : ``}>${participant.name}</option>`)
            .join(``);

    } catch(err){
        console.log(err);
    }
}
participantsRender();
// participantsRender

// createTask
taskForm.addEventListener(`submit`, async e=>{
    e.preventDefault();
    
    try{
        let participants = [...participantsSelect.selectedOptions]
            .map(option => {
                return {name: option.innerHTML, id: option.value};
            });

        let newTask = {
            title: taskTitleInput.value,
            participants,
            status: 0
        };

        let addedPost = await controller(API+`/tasks`, `POST`, newTask);

        new ToDo(addedPost).render();
        
        let modifiedParticipants = await Promise.all(addedPost.participants.map(participant => controller(API+`/participants/${participant.id}`, `PUT`, {task: true})));
        
        modifiedParticipants.forEach(participants => {
            let option = participantsSelect.querySelector(`option[value="${participants.id}"]`);
            option.disabled = true;
        })

        taskForm.reset();

    } catch(err){
        console.log(err);
    }
})
// createTask

// renderTasks
const renderTasks = async() => {
    try{
        let tasks = await controller(API+`/tasks`);
        tasks.forEach(task => TASK_STATUS[task.status](task).render());
    } catch(err){
        console.log(err);
    }
}
renderTasks();
// renderTasks