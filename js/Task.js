export default class Task{
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