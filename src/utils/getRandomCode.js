const crypto = require('crypto')

function getRandomCode() {
  // Генерация кода подтверждения регистрации
  // На основе пустова массива Uint8Array с двумя элементами массива
  // getRandomValues заполняет их рандомными числами
  return crypto.webcrypto.getRandomValues(new Uint8Array(2)).reduce((acc, value) => {
    // Если один элемент массива не 3-х значный, то доводим его до 3-х значного числа
    // чтобы в конце получить 6-ти значный код
    if (value.toString().length < 3) {
      return acc + (new Array((3 - value.toString().length)).fill(0).join('') + value).toString()
    }
    return acc + value.toString()
  }, '')
}

module.exports = getRandomCode
