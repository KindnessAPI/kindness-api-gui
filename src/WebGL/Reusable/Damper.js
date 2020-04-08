import { Clock } from 'three'

export class Damper {
  constructor (v = 0, base, damper = 0.85) {
    this.latestVal = v
    this.dampedVal = v
    this.clock = new Clock()
    base.onLoop(() => {
      let delta = this.clock.getDelta()
      let diff = (this.latestVal - this.dampedVal) * (delta * 1000 / 60 * damper)
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
