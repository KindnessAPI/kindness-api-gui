export { Stats } from './Stats.js'
export { Renderer } from './Renderer.js'
export { PCamera } from './PCamera.js'
export { makeBase } from './makeBase.js'
export { makeScroller } from './Scroller.js'
export { visibleHeightAtZDepth, visibleWidthAtZDepth, getScreen } from './Screen.js'

export { makePaintCanvas } from './makePaintCanvas'
export { Tree } from './Tree'
export { PipeBasic } from './PipeBasic'
export { RayPlay } from './RayPlay'
export { Damper } from './Damper'

export const getID = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}
