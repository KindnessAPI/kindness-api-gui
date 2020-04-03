export class Damper {
  constructor (v = 0, base) {
    this.latestVal = v
    this.dampedVal = v
    base.onLoop(() => {
      let diff = (this.latestVal - this.dampedVal) * (60 / 1000)
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
