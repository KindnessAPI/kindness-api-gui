import { Damper } from './Damper.js'
export const makeScrollBox = ({ dom, base }) => {
  let SmoothY = new Damper(0, base)
  SmoothY.value = 0.0
  if (dom) {
    dom.addEventListener('scroll', () => {
      let value = (dom.scrollTop) / dom.clientHeight
      if (dom === document.body || dom === document) {
        value = (window.scrollY) / window.innerHeight
      }
      if (value < 0) {
        value = 0
      }
      SmoothY.value = value
    }, true)
  }
  return SmoothY
}
