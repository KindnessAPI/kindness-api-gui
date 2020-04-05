import { PerspectiveCamera } from 'three'

export class PCamera {
  constructor ({ base, element }) {
    let rect = false
    if (element) {
      rect = element.getBoundingClientRect()
    } else {
      base.mounter.getBoundingClientRect()
    }
    let camera = new PerspectiveCamera(75, base.getWidth(rect) / base.getHeight(rect), 0.01, 10000000)

    let resizer = () => {
      let rect = false
      if (element) {
        rect = element.getBoundingClientRect()
      } else {
        base.mounter.getBoundingClientRect()
      }
      camera.aspect = base.getWidth(rect) / base.getHeight(rect)
      camera.updateProjectionMatrix()
    }
    base.onResize(resizer)
    return camera
  }
}
