const container = () => {
    const yearContainer = e('.currentYear')
    const monthContainer = e('.month-lists')
    const dateContainer = e('.date-lists')
    const contentYearContainer = e('.content-year')
    const contentMonthContainer = e('.content-month')
    const contentDateContainer = e('.content-date')
    return {
        yearContainer,
        monthContainer,
        dateContainer,
        contentYearContainer,
        contentMonthContainer,
        contentDateContainer,
    }
}

const highlightMonth = () => {
    const {monthContainer} = container()
    const m = monthContainer
    m.addEventListener('click', (event) => {
        const target = event.target
        const sel = e('.selected', m)
        sel.classList.remove('selected')
        target.classList.add('selected')
        dateUpdate()

        loadReminder()
        insertRemindermark()

    })
}

const hightlightDate = () => {
    const d = e('.date-lists')
    d.addEventListener('click', (event) => {
        const target = event.target
        const p = target.parentElement
        const list = p.classList.contains('date-lists') || p.parentElement.classList.contains('date-lists')
        if (list) {
            const sel = target.closest('.current-dateList')
            const wrapper = e('.date-lists')
            const activedElement = e('.active', wrapper)
            if (activedElement !== null) {
                activedElement.classList.remove('active')
            }
            sel.classList.add('active')

            contentUpdate()

            loadReminder()

            insertRemindermark()

        }
    })
}

const yearUpdate = (year) => {
    const yearContainer = e('.currentYear')
    yearContainer.innerText = year
}

const hightlightYear = () => {
    let currentYear = Number(e('.currentYear').innerText)

    const pre = e('.previous')
    pre.addEventListener('click', () => {
        currentYear -= 1
        yearUpdate(currentYear)
        dateUpdate()

        loadReminder()
        insertRemindermark()


    })

    const next = e('.next')
    next.addEventListener('click', () => {
        currentYear += 1
        yearUpdate(currentYear)
        dateUpdate()

        loadReminder()
        insertRemindermark()


    })
}

const dateUpdate = () => {
    const {yearContainer, monthContainer, dateContainer} = container()
    const selectedYear = yearContainer.innerText
    const selectedMonth = e('.selected', monthContainer).dataset.month
    const selectedDate = e('.active', dateContainer).innerText

    const year = Number(selectedYear)
    const month =  Number(selectedMonth)
    const date =  Number(selectedDate)
    mapUpdate(year, month, date)

    // get day
    contentUpdate()



    return {year, month, date}
}

const template = (dateCount, weekday) => {
    let ts = `
             <li class="current-dateList" style="margin-left: ${71.42 * weekday}px"><span>1</span></li>\n
             `
    for (let i = 2; i <= dateCount ; i++) {
        let t = `
                <li class="current-dateList">
                <span class="current-date">${i}</span>
                <!--<svg class="icon icon-reminder" fill="#000" height="20" style="text-align: center" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>-->
                <!--</li>\n-->`
        ts += t
    }
    return ts
}

/*
const reminderMark = () => {
    todo: get ajax data and if the date has a reminder, then insert the svg template below to hint there is a reminder, (feature: if over 3 reminders, the fill color will be various)

    <svg class="icon icon-reminder" fill="#000" height="20" style="text-align: center" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>


}
*/
const insertTemplate = (dateCount, day, date) => {
    const {dateContainer} = container()
    dateContainer.innerHTML = ''
    // const  t = template(dateCount, day, date)
    const  t = template(dateCount, day)
    dateContainer.insertAdjacentHTML('beforeend', t )

    // highlight date
    if (date > dateCount) {
        date = dateCount
    }
    dateContainer.children[date - 1].classList.add('active')


}

const contentYearUpdate = () => {
    const highlightedYear = e('.currentYear').innerText
    const year = Number(highlightedYear)
    const contentYear = e('.content-year')
    contentYear.innerText = year
    return year
}

const contentMonthUpdate = () => {
    const monthMap = {
        0: 'JANUARY',
        1: 'FEBURARY',
        2: 'MARCH',
        3: 'APRIL',
        4: 'MAY',
        5: 'JUNE',
        6: 'JULY',
        7: 'AUGUST',
        8: 'SEPTEMBER',
        9: 'OCTOBER',
        10: 'NOVEMBER',
        11: 'DECEMBER',
    }
    const contentMonthContainer = e('.content-month')
    const highlightedMonth = e('.selected')
    let m = Number(highlightedMonth.dataset.month)
    contentMonthContainer.innerHTML = monthMap[m]
    return m
}

const contentDateUpdate = () => {
    const dateMap = {
        1: 'ST',
        2: 'ND',
        3: 'ST'
    }

    /*
    let orderedDate = `${date}TH`
    if ( date in dateMap) {
        orderedDate = String(date) + dateMap[date]
    }
    */
    const highlightedDate = e('.active')
    const date = Number(highlightedDate.innerText)
    let orderedDate = (date in dateMap)? `${date}${dateMap[date]}`: `${date}TH`
    const contentDateContainer = e('.content-date')
    contentDateContainer.innerText = orderedDate
    return date
}

const contentDayUpdate = () => {
    const dayMap = {
        0: 'SUNDAY',
        1: 'MONDAY',
        2: 'TUESDAY',
        3: 'WEDNESDAY',
        4: 'THURSDAY',
        5: 'FRIDAY',
        6: 'SATURDAY',
    }
    const year = contentYearUpdate()
    const month = contentMonthUpdate()
    const date = contentDateUpdate()
    const day = new Date(year, month, date).getDay()
    const contentDateContainer = e('.content-day')
    contentDateContainer.innerHTML = dayMap[day]
}

const daysMapper = (year, month) => {
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (year % 100 === 0 && year % 400 === 0) {
        days[1] = 29
    }
    if (year % 100 !== 0 && year % 4 === 0) {
        days[1] = 29
    }
    const dayCountByMonth = days[month]

    // type number
    const firstDay = new Date(year, month, 1)
    const firstDayOfWeek = firstDay.getDay()
    return {dayCountByMonth, firstDayOfWeek}
}

const mapUpdate = (year, month, date) => {
    const {dayCountByMonth, firstDayOfWeek} = daysMapper(year, month)
    insertTemplate(dayCountByMonth, firstDayOfWeek, date)
}

const highlightEvent = () => {
    highlightMonth()
    hightlightDate()
    hightlightYear()
}

const contentUpdate = () => {
    contentYearUpdate()
    contentMonthUpdate()
    contentDateUpdate()
    divResponse()

}


const dynamicResponse = () => {
    insertRemindermark()
    divResponse()
}

const divResponse = () => {
    const items = e('.reminder-items')
    const h = items.offsetHeight
    const wrapper = e('.date-wrapper')
    if (h > 245) {
        wrapper.style.marginTop = '-50px'
        wrapper.style.fontSize = '22px'

    } else {
        wrapper.style.marginTop = '50px'
        wrapper.style.fontSize = 'inherit'


    }
}


const init = () => {
    // type number
    const {year, month, date, day} = formattedTime()
    // init year
    const {yearContainer, monthContainer} = container()
    yearContainer.innerHTML = year

    // init highlighted date
    const ms = monthContainer.querySelectorAll('.month-detail')
    for (let i = 0; i < ms.length; i++) {
        const index = ms[i].dataset.month
        if (index === String(month)) {
            ms[i].classList.add('selected')
        }
    }

    // init date map, how many days in current month & year and the day for the first month
    mapUpdate(year, month, date)


    // init reminder content
    contentUpdate(year, month, date, day)


    // load data
    loadReminder()

    dynamicResponse()



}



// const calendarEvents = () => {
//     init()
//     highlightEvent()
// }

