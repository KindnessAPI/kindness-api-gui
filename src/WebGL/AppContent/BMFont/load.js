import { ImageUtils } from 'three'
var loadFont = require('load-bmfont')

export default (opt, cb = () => {}) => {
  return new Promise((resolve) => {
    loadFont(opt.font, function (err, font) {
      if (err) throw err
      ImageUtils.loadTexture(opt.image, undefined, function (tex) {
        resolve({ font, texture: tex })
        cb(font, tex)
      })
    })
  })
}
