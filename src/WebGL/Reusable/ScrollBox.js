import { Damper } from './Damper.js'
export const makeScrollBox = ({ dom, base }) => {
  let SmoothY = new Damper(0, base, 0.1)
  let PageY = new Damper(0, base, 0.1)
  if (dom) {
    dom.addEventListener('scroll', () => {
      var h = document.documentElement
      var b = document.body
      var st = 'scrollTop'
      var sh = 'scrollHeight'

      var percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)
      var percentPage = (h[st] || b[st]) / ((h[sh] || b[sh]))
      SmoothY.value = percent
      PageY.value = percentPage
    }, true)
  }
  return {
    get page () {
      return SmoothY.value
    },
    get win () {
      return PageY.value
    }
  }
}
