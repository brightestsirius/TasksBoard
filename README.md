На https://mockapi.io створити проект з двома табличками (сутностями):
    
    participants – об’єкт даної сутності має дві властивості: name та id (генерується автоматично сервісом). Приклад об’єкту: {"name": "Mervin", "id": "1"}. Заповнити дану табличку 10-ма рандомними об’єктами.
    
    tasks – пуста табличка, яка буде заповнюватись об’єктами (далі – task) через форму.

ТЗ (архів tasks.zip з базовою версткою):
    Заповнити select#taskParticipants даними з сутності participants.
        Якщо у об'єкта є властивість task: true, то рендерити option з атрибутом disabled. Дана властивість з'являється у обєкта, якщо йому призначена таска, що знаходиться в статусі 1-4 (ToDo, InProgress, NeedTesting, Testing, Reopened).
    
    При сабміті форми form#createTask:
        Додавати об’єкт у сутність tasks у вигляді: 
        {
            "id": "1",
            "title": "Creating home page",
            "participants": [
                {
                "name": "Norris",
                "id": "1"
                },
                {
                "name": "Kory",
                "id": "3"
                }
            ],
            "status": 0
        }, де:
        
        title – назва таски (input#taskTitle);
        participants – масив виконавців таски (select#taskParticipants)
        status – статус таски:
            0 – статус ToDo (таска рендериться в першу td#ToDo)
            1 – статус InProgress (таска рендериться в другу td#InProgress)
            2 – статус NeedTesting (таска рендериться в третю td#NeedTesting)
            3 – статус Testing (таска рендериться в чертверту td#Testing)
            4 – статус Reopened (таска рендериться в п'яту td#Reopened)
            5 – статус Done (таска рендериться в шосту td#Done)
        id (генерується автоматично сервісом).
        
        У разі успішного додавання task в сутність – відрендерити task у першій td#ToDo в таблиці table#tasksTable.
        
        Для кожного обраного виконавця оновити дані в сутності participants, додавши об’єкту властивість task: true. В результаті успішного оновлення данних об’єкта, оновити для нього в select#taskParticipants option, додавши атрибут disabled="true".
        
        При рендері task виводити назву і перелік виконавців.
        
        При рендері task у першій td#ToDo також виводити кнопку <button>Start doing</button> при натисканні на яку:
            В сутності tasks оновлюється статус task з status: 0 на status: 1
            При успішному оновленні статусу task видаляємо її з td#ToDo і рендеримо в td#InProgress
        
        При рендері task у другій td#InProgress також виводити кнопку <button>Need testing</button> при натисканні на яку:
            В сутності tasks оновлюється статус task з status: 1 на status: 2
            При успішному оновленні статусу task видаляємо її з td#InProgress і рендеримо в td#NeedTesting
        
        При рендері task у третій td#NeedTesting також виводити кнопку <button>Start testing</button> при натисканні на яку:
            В сутності tasks оновлюється статус task з status: 2 на status: 3
            При успішному оновленні статусу task видаляємо її з td#NeedTesting і рендеримо в td#Testing
        
        При рендері task у четвертій td#Testing також виводимо кнопки:
            <button>Reopen</button> при натисканні на яку:
                В сутності tasks оновлюється статус task з status: 3 на status: 4
                При успішному оновленні статусу task видаляємо її з td#Testing і рендеримо в td#Reopened
            
            <button>Done</button> при натисканні на яку:
                В сутності tasks оновлюється статус task з status: 3 на status: 5
                При успішному оновленні статусу task видаляємо її з td#Testing і рендеримо в td#Done
                
                Для кожного виконавця даної task оновити дані в сутності participants, змінивши об’єкту властивість task: false. В результаті успішного оновлення данних об’єкта, оновити для нього в select#taskParticipants option, змінивши атрибут disabled="false".
            
        При рендері task у п'ятій td#Reopened також виводити кнопку <button>Restart</button> при натисканні на яку:
            В сутності tasks оновлюється статус task з status: 4 на status: 0
            При успішному оновленні статусу task видаляємо її з td#Reopened і рендеримо в td#ToDo
        При рендері task у шостій td#Done виводити лише назву і перелік виконавців.