const log = (...args) => {
    return console.log.apply(console, args)
}

module.exports = {
    log: log,
}