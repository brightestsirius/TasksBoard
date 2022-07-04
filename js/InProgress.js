import Task from "./Task.js"
import NeedTesting from "./NeedTesting.js"
import {API, controller} from "./../script.js";

export default class InProgress extends Task{
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