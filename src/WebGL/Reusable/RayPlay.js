
import { Raycaster, Vector2 } from 'three'

export class RayPlay {
  constructor ({ mounter, base, camera }) {
    this.raycaster = new Raycaster()
    this.camera = camera
    this.activeTargets = []
    this.mouser = new Vector2(0, 0)

    this.add = (v, handler = () => {}) => {
      v.userData = v.userData || {}
      v.userData.clicker = handler
      this.activeTargets.push(v)
      // console.log(this.activeTargets)
    }

    this.remove = (v) => {
      this.activeTargets.splice(this.activeTargets.indexOf(v), 1)
      // console.log(this.activeTargets)
    }

    let onDocumentHover = () => {
      let rc = this.raycaster
      if (this.camera && this.mouser && rc) {
        rc.setFromCamera(this.mouser, this.camera)

        // var findings = rc.intersectObjects(this.o3dHovers)
        var tryhover = rc.intersectObjects(this.activeTargets)
        if ((tryhover.length) > 0) {
          document.body.style.cursor = 'pointer'
        } else {
          document.body.style.cursor = ''
        }
      }
    }
    var onDocumentMouseMove = (event) => {
      // event.preventDefault()
      this.mouser.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouser.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    let moveAmount = 0
    var onDocumentTouchMove = (event) => {
      moveAmount += 1
      let obj = event.touches[0]
      // console.log(obj)
      this.mouser.x = (obj.pageX / window.innerWidth) * 2 - 1
      this.mouser.y = -(obj.pageY / window.innerHeight) * 2 + 1
    }

    let onDocumentClick = () => {
      if (moveAmount > 5) {
        moveAmount = 0
        return
      }
      let rc = this.raycaster
      if (this.camera && this.mouser && rc) {
        rc.setFromCamera(this.mouser, this.camera)
        // console.log(this.o3dClickers.children)

        var findings = rc.intersectObjects(this.activeTargets)
        let event = (findings.length) > 0 ? findings[0] : null
        // console.log(first)
        if (event) {
          let obj = event.object
          let userData = obj.userData
          let handler = userData.clicker
          if (handler) {
            handler({
              type: 'click',
              event,
              userData,
              object: obj
            })
          } else {
            console.error('handler not found')
          }
          // console.log(event)
        }
      }
    }
    let onStart = () => {
      moveAmount = 0
    }

    mounter.addEventListener('touchstart', (evt) => { onStart(evt); onDocumentTouchMove(evt) }, { passive: false })
    mounter.addEventListener('touchmove', onDocumentTouchMove, { passive: false })
    mounter.addEventListener('mousemove', onDocumentMouseMove, { passive: false })
    mounter.addEventListener('click', onDocumentClick, { passive: false })
    mounter.addEventListener('touchend', onDocumentClick, { passive: false })
    base.onLoop(onDocumentHover)
  }
}
