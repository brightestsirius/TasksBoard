import Task from "./Task.js"

export default class Done extends Task{
    constructor(task){
        super(task);
    }

    render(){
        let taskBlock = super.render();
        tasksTable.querySelector(`td#Done`).append(taskBlock);
    }
}