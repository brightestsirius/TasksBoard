import Task from "./Task.js"
import Reopened from "./Reopened.js"
import Done from "./Done.js"
import {API, controller, taskForm, participantsSelect} from "./../script.js";

export default class Testing extends Task{
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