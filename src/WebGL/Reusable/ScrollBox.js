import { Damper } from './Damper.js'
export const makeScrollBox = ({ dom, base }) => {
  let SmoothY = new Damper(0, base, 0.5)
  SmoothY.value = 0.0
  if (dom) {
    dom.addEventListener('scroll', () => {
      var h = document.documentElement
      var b = document.body
      var st = 'scrollTop'
      var sh = 'scrollHeight'

      var percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)
      SmoothY.value = percent
    }, true)
  }
  return SmoothY
}
