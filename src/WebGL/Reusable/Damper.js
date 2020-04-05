import { Clock } from 'three'

export class Damper {
  constructor (v = 0, base) {
    this.latestVal = v
    this.dampedVal = v
    this.clock = new Clock()
    base.onLoop(() => {
      let delta = this.clock.getDelta()
      let diff = (this.latestVal - this.dampedVal) * (delta * 1000 / 60 * 0.85)
      this.dampedVal += diff
    })
  }
  set value (v) {
    this.latestVal = v
  }
  get value () {
    return this.dampedVal
  }
}
