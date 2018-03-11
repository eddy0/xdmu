const todoElementContainer = () => {
    const addButton = e('.add-item-button')
    const addContainer = e('.add-item-container')
    const newContentContainer = e('.add-item-content')
    const todoContainer = e('.reminder-items')

    return {
        addButton,
        addContainer,
        newContentContainer,
        todoContainer,
        }
}

const undoAdd = () => {
    const {addContainer, newContentContainer} = todoElementContainer()
    if (addContainer.classList.contains('open')) {
        addContainer.classList.remove('open')
        newContentContainer.value=''
        newContentContainer.blur()
    }
}

const todoTemplate = (reminder) => {
    let task = reminder.task
    let status = {
        checked: '',
        done: '',
    }
    if (reminder.done) {
        status.checked = 'checked'
        status.done = 'done'
        }

    const t = `
            <div class="reminder-item ">
                <input type="checkbox" class="item-status ${status.checked}">
            <span class="item-content ${status.done}" contenteditable="false">${task}</span>
            <div class="item-actions">
                <svg class="icon icon-edit" fill="#ffffff" height="20" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                <svg class="icon icon-delete" fill="#ffffff" height="20" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            </div>
        </div>
    `
    return t
}

const insertTodoTemplate = (reminder) => {
    const {todoContainer} = todoElementContainer()
    const t = todoTemplate(reminder)
    todoContainer.insertAdjacentHTML('beforeend', t)
}

const todoContentUpdate = (content) => {
    const keys = ['Enter', 'Escape']
    listen(content, 'keydown', event => {
        for (let k of keys) {
            if (event.key === k) {
                event.preventDefault()
                content.blur()
                content.setAttribute('contentEditable', false)
                // todo edit data update
            }
        }
    })
}

// edit & remove & done
const todoContentEdit = () => {
    const {todoContainer} = todoElementContainer()

    listen(todoContainer, 'click', event => {
        const target = event.target
        const p = event.target.parentElement
        const contentCell = target.closest('.reminder-item')

        // edit
        const edit = target.classList.contains('icon-edit') || p.classList.contains('icon-edit')
        if (edit) {
            // if todostatus is not done before editable
            const todoStatus = e('.item-status', contentCell)
            const checked = todoStatus.classList.contains('checked')
            const content = e('.item-content', contentCell)
            if ( checked === true) {
                content.classList.remove('done')
                todoStatus.classList.remove('checked')
            }
            content.setAttribute('contentEditable', true)
            content.focus()
            todoContentUpdate(content)
        }

        // delete
        const remove = target.classList.contains('icon-delete') || p.classList.contains('icon-delete')
        if (remove) {
            contentCell.remove()
            // todo remove data update
        }

        // done
        const todoStatus = target.classList.contains('item-status')
        if (todoStatus) {
            const content = e('.item-content', contentCell)

            if (target.classList.contains('checked')
            ) {
                content.classList.remove('done')
                target.classList.remove('checked')
            } else {
                content.classList.add('done')
                target.classList.add('checked')
            }
            // todo: done update
        }

    })
}

const todoContentAdd = () => {
    const {newContentContainer} = todoElementContainer()
    // keydown event
    listen(newContentContainer, 'keyup', event => {
        // console.log(event.key)
        if (event.key === 'Enter') {
            const value = newContentContainer.value
            const reminder = {
                task: value,
                done: false,
                }

            insertTodoTemplate(reminder)

            saveData(reminder)

            dynamicResponse()

            undoAdd()


        }
        if (event.key === 'Escape') {
            undoAdd(event)
        }
    })
}

const addContainerToggle = () => {
    const {addButton, addContainer , newContentContainer} = todoElementContainer()
    // open add container
    addButton.addEventListener('click',  () => {
        if (addContainer.classList.contains('open')) {
            addContainer.classList.remove('open')
            newContentContainer.value=''
        } else {
            addContainer.classList.add('open')
            newContentContainer.focus()
        }
    })
}

/*
calendar 
    calendar: [ 
                {   id : 1,
                    unixTime: 1234,
                    userId: 1,
                    task: 
                              {'iifj',
                                done: true,
                                _deleted: false,
                               },
                }
              ]
 */

const reminderTemplate = (container, len) => {
    let color = '#d0d000'
    if (len > 3) {
        color = '#39c9bb'
    }
    if (len > 8) {
        color = '#dd6262'
    }


    const t = `
      <svg class="icon icon-reminder" fill=${color} height="20" style="text-align: center" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
      </svg>
    `
    const svg = e('.icon-reminder', container)
    if (svg === null) {
        container.insertAdjacentHTML('beforeend', t)
    }
}

const insertRemindermark = () => {
    //  only for current year & month

    /*
    let datas = loadReminderMark()
    const {year, month} = dateUpdate()
    const dateContainer = er('.current-dateList')

    datas = datas.map( ds => new Date(ds))
    datas.forEach( ds => {
        const markYear = ds.getFullYear()
        const markMonth = ds.getMonth()
        const markDate = ds.getDate()
        if (markYear === year && markMonth === month) {
            dateContainer.forEach( date => {
                let d = Number(date.innerText)
                if (d === markDate) {
                    reminderTemplate(date)
                }
            })
        }
    })
    */
    let data = ttt()
    const {year, month} = dateUpdate()
    const dateContainer = er('.current-dateList')


    for (let newData in data ) {
        // console.log('tasks', newData)

        // let dt = Object.keys(newData)
        let ds = new Date(Number(newData))

        const markYear = ds.getFullYear()
        const markMonth = ds.getMonth()
        const markDate = ds.getDate()
        const tasks = data[newData]
        const len = tasks.length
        if (markYear === year && markMonth === month) {
            dateContainer.forEach( date => {
                let d = Number(date.innerText)
                if (d === markDate) {
                    reminderTemplate(date, len)
                }
            })
        }
    }


}

// data = {unixTime: []}
const ttt = () => {
    const data = {}
    globalData.forEach( g => {
        const time = g.unixTime
        if (data[time]) {
            const task = data[time]
            task.push(g.reminder)
        } else {
            data[time] = [g.reminder]
        }
    } )

    return data
}

const loadReminderMark = () => {
    const data = []
    for (let d of globalData) {
        const time = d.unixTime
        if (time) {
           const index = data.findIndex( d => d === time )
            if (index) {
                data.push(time)
            }
        }
    }
    return data
}

const dateByHighlight = () => {
    const {year, month, date} = dateUpdate()
    const unixTime = new Date(year, month, date).getTime()
    let data = []
    for (let d of globalData) {
        if ( d.unixTime === unixTime && d.reminder ) {
            let t = d.reminder
            data.push(t)
        }
    }
    return data

    /*
    for (let d of database) {
        if ( d.unixTime === unixTime && d.task ) {
                let t = d.task
                if (t['_deleted'] === false) {
                    data.push(d)
            }
        }
    }
    */
}

const loadReminder = () => {
    const {todoContainer} = todoElementContainer()
    todoContainer.innerHTML=''

    const data = dateByHighlight()
    // console.log('data', data)
    if (data) {
        data.forEach( d => {
            insertTodoTemplate(d)
        })
    }

}



const retrieveFile = () => {
    const file = localStorage.calendar
    let data = []
    if (file !== undefined) {
        data = JSON.parse(file)
    }
    return data
}

const saveData = (data) => {
    const {year, month, date} = dateUpdate()
    const unixTime = new Date(year, month, date).getTime()

    const d =  {
        unixTime: unixTime,
        'reminder': {
                    'task': data.task ,
                    'done': data.done,
                },
    }

    globalData.push(d)
    // console.log('globalData',globalData)

    localStorage.calendar = JSON.stringify(globalData)
}

const todoEvent = () => {
    addContainerToggle()
    todoContentAdd()
    todoContentEdit()
}


// globalData = [
//     {
//         unixTime: 1520582400000,
//         reminder: {
//             'task': 'ojbk',
//             done: true,
//         }
//     },
//     {
//         unixTime: 1520668800000,
//         reminder: {
//             'task': 'ojsssbk',
//             done: true,
//         }
//     },
//     {
//         unixTime:1521788400000,
//         reminder: {
//             'task': 'testtest',
//             done: true,
//         }
//     },
//
// ]

const __main = () => {
    globalData = retrieveFile()
    init()
    highlightEvent()
    todoEvent()

    // calendarEvents()

}

__main()
