import Task from "./Task.js"
import ToDo from "./ToDo.js"
import {API, controller} from "./../script.js";

export default class Reopened extends Task{
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