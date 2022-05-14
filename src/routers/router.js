const { Router } = require('express')
const protectionMiddleware = require('../middleware/protectionMiddleware')
const botApi = require('../api/botApi')

const StickerSet = require('../database/models/StickerSet')

const router = Router()

router.all('/check-life', (_, res) => {
  botApi.checkLife()
    .then(() => {
      res.status(200)
      res.send('ok')
    })
    .catch(() => {
      console.error('BotApi service is unavailable')
      res.sendStatus(400)
    })
})

/**
 * Routes
 * get  /profile
 *
 * post /sticker-sets
 * post /sticker-sets/{id}/sticker
 * get  /sticker-sets
 * get  /sticker-sets/{id}/stickers
 *
 * post /uploadImage [form-data]
 */

router.get('/', protectionMiddleware, (req, res) => {
  res.sendStatus(200)
})

router.get('/profile', protectionMiddleware, (req, res) => {
  const { user, accessToken } = req
  botApi.getProfilePhotos(user.telegramId, accessToken).then((data) => {
    res.json(data)
  }).catch(err => {
    res.send(err)
  })
})

router.post('/upload-image', protectionMiddleware, (req, res) => {
  res.redirect(307, `http://localhost:3000/bot-api/uploadStickerImage/${req.user.telegramId}`)
})

/**
 * @param {{ stickerSetName: string, stickers: {fileId: string, emojis: string[]}[] }} req.body
 */
router.post('/sticker-sets', protectionMiddleware, async (req, res) => {
  const { stickerSetName, stickers } = req.body
  const { accessToken, user } = req

  if (!stickerSetName || !stickers || stickers.length < 1) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid field one or more of [stickerSetName, stickers]'
    })
    return;
  }

  const [firstSticker] = stickers

  const responseStickerSet = await botApi.createStickerSet(user.telegramId, stickerSetName, firstSticker.fileId, firstSticker.emojis, accessToken).catch(err => {
    if (err.response.data.error === 'Bad request') {
      res.status(400)
      res.json({
        error: 'Bad request',
        message: 'Invalid field stickers'
      })
    } else {
      res.status(400)
      res.send(err)
    }
  })

  if (!responseStickerSet) return;

  const stickerSet = new StickerSet({
    title: responseStickerSet.title,
    userId: user._id
  })

  await stickerSet.save()

  if (stickers.length > 1) {
    await Promise.all(
      stickers.slice(1).map(async sticker => {
        return await botApi.addSticker(user.telegramId, stickerSetName, sticker.fileId, sticker.emojis, accessToken)
      }),
    )
  }

  responseStickerSet.id = stickerSet._id

  res.status(200)
  res.json(responseStickerSet)
})

/**
 * @param {{ stickers: {fileId: string, emojis: string[]}[] }} req.body
 */
router.post('/sticker-sets/:stickerSetId/stickers', protectionMiddleware, async (req, res) => {
  const { stickers } = req.body
  const { stickerSetId } = req.params
  const { user, accessToken } = req

  if (stickerSetId.length !== 24) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid param stickerSetId'
    })
    return;
  }

  if (!stickers || stickers.length < 1) {
    res.status(400)
    res.json({
      error: 'Bad request',
      message: 'Invalid field stickers'
    })
    return;
  }

  const stickerSet = await StickerSet.findOne({ _id: stickerSetId }).exec()

  if (!stickerSet) {
    res.status(404)
    res.json({
      error: 'Bad request',
      message: `Not found stickerSet with Id: ${stickerSetId}`
    })
    return;
  }

  const awaitStickers = await Promise.all(
    stickers.map(async sticker => await botApi.addSticker(user.telegramId, stickerSet.title, sticker.fileId, sticker.emojis, accessToken))
  ).catch(err => {
    res.status(400)
    if (err.response.data.error === 'Bad request') {
      res.json({
        error: 'Bad request',
        message: `Invalid field stickers`
      })
    } else {
      res.send(err.response.data)
    }
  })
  if (!awaitStickers) return;

  res.sendStatus(200)
})

router.get('/sticker-sets', protectionMiddleware, async (req, res) => {
  const { user } = req
  const stickerSets = await StickerSet.find({ userId: user._id }).exec()

  res.json(stickerSets)
})

router.get('/sticker-sets/:stickerSetId', protectionMiddleware, async (req, res) => {
  const { user } = req
  const { stickerSetId } = req.params
  const stickerSet = await StickerSet.findOne({ _id: stickerSetId, userId: user._id }).exec()

  if (!stickerSet) {
    res.status(404)
    res.json({
      error: 'Not found',
      message: `Not found sticker set by set id`
    })
  } else
    res.json(stickerSet)
})

router.get('/sticker-sets/:stickerSetId/stickers', protectionMiddleware, async (req, res) => {
  const { stickerSetId } = req.params
  const { user, accessToken } = req

  const stickerSet = await StickerSet.findOne({ _id: stickerSetId, userId: user._id }).exec()

  try {
    const responseStickers = await botApi.getStickers(stickerSet.title, accessToken)
    res.json(responseStickers.data)
  } catch (e) {
    console.error(JSON.stringify(e))

    res.status(400)
    res.json(e)
  }
})

router.delete('/sticker-sets/:stickerSetId/stickers/:fileId', protectionMiddleware, async (req, res) => {
  const { stickerSetId, fileId } = req.params
  const { user, accessToken } = req

  const stickerSet = await StickerSet.findOne({ _id: stickerSetId, userId: user._id }).exec()
  if (!stickerSet) {
    res.status(404)
    res.json({
      error: 'Not found',
      message: 'StickerSet not found'
    })
    return;
  }

  botApi.deleteSticker(fileId, accessToken).then(() => {
    res.sendStatus(200)
  }).catch(e => {
    res.status(400)
    res.json(e.response.data)
  })

})

module.exports = router
