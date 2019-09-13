const DateDiff = require('date-diff')

const wait = require('util').promisify(setTimeout) // For test purpose

const diff = (date) => new DateDiff(new Date(), new Date(date)).seconds()

/**
 * Check if a string is a valid mail.
 *
 * @category Validate
 * @param {string} email - The string to check
 * @return {boolean}
 */
const isEmail = (email) => {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

  return regex.test(email)
}

const isVtexCode = (val) => {
  const regex = /^[0-9]{6}$/

  return regex.test(val)
}

const objectSearch = (object, needle) => {
  let p
  let key
  let val
  let tRet

  /* eslint-disable no-restricted-syntax */
  for (p in needle) {
    if (hasOwnProperty.call(needle, p)) {
      key = p
      val = needle[p]
    }
  }

  for (p in object) {
    if (p === key) {
      if (object[p] === val) {
        return object
      }
    } else if (object[p] instanceof Object) {
      if (hasOwnProperty.call(object, p)) {
        tRet = objectSearch(object[p], needle)

        if (tRet) {
          return tRet
        }
      }
    }
  }

  return false
}

/**
 * Zero padding number
 *
 * @param  {integer} number     Number to format
 * @param  {integer} [size=2]   Digits limit
 * @return {string}             Formatted num with zero padding
 */
const pad = (number, size) => {
  let stringNum = String(number)

  while (stringNum.length < (size || 2)) {
    stringNum = `0${stringNum}`
  }

  return stringNum
}

/**
 * Format a seconds given into a human time
 *
 * @param {Number} value Value in seconds
 * @returns xx:xx:xx
 */
const time = (value) => {
  const hours = Math.floor(value / 60 / 60)
  const minutes = Math.floor((value - (hours * 60 * 60)) / 60)
  const seconds = Math.round(value - (hours * 60 * 60) - (minutes * 60))

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

module.exports = {
  wait,
  diff,
  isEmail,
  isVtexCode,
  objectSearch,
  pad,
  time
}
