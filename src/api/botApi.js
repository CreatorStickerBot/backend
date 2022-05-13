const axios = require('axios')

const bot = axios.create({
  baseURL: 'http://127.0.0.1:3000/bot-api'
})

const botApi = {
  getProfilePhotos (telegramId, token) {
    return new Promise((resolve, reject) => {
      bot.get(`/profile-photo/${telegramId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => resolve(res.data)).catch(reject)
    })
  },
  createStickerSet (telegramId, stickerSetName, pngFileId, emojis, token) {
    return new Promise((resolve, reject) => {
      bot.post('/createStickerSet', {
        telegramId,
        title: stickerSetName,
        pngFileId,
        emojis
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        resolve(res.data)
      }).catch(reject)
    })
  },
  addSticker (telegramId, stickerSetName, pngFileId, emojis, token) {
    return new Promise((resolve, reject) => {
      bot.post('/addSticker', {
        telegramId,
        stickerSetName,
        pngFileId,
        emojis
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(resolve).catch(reject)
    })
  },
  getStickers (stickerSetTitle, token) {
    return new Promise((resolve, reject) => {
      bot.get(`/sticker-set/${stickerSetTitle}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(resolve).catch(reject)
    })
  },
  deleteSticker (fileId, token) {
    return new Promise((resolve, reject) => {
      bot.delete(`/sticker-set/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(resolve).catch(reject)
    })
  },
  checkLife () {
    return new Promise((resolve, reject) => {
      bot.get('/check-life').then(resolve).catch(reject)
    })
  }
}

module.exports = botApi
