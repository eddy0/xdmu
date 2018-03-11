const e = (sel, element=document) => element.querySelector(sel)

const er = (sel, element=document) => element.querySelectorAll(sel)

const log = (...args) => {
    console.log.apply(console, args)
}

const formattedTime = () => {
    const currentTime = new Date()
    const year = currentTime.getFullYear()
    // 0-11
    const month = currentTime.getMonth()
    // 1-31
    const date = currentTime.getDate()
    //0-sun
    const day = currentTime.getDay()

    return {year, month, date, day}

}

const ajax = (url, callback) => {
    const r = new XMLHttpRequest()
    r.open('GET', url, true)
    r.onreadyStateChange = () => {
        if (r.readyState === 4) {
            callback(r)
        }
    }
    r.send()
}

const listen = ( element, EventName, callback) => {
    return element.addEventListener(EventName, callback )
}