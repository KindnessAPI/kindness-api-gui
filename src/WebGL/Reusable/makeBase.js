export const getID = () => '_' + (100000000.0 * Math.random()).toFixed(0) + ''

export const makeBase = () => {
  let env = {
    isActiveRender: true,
    _mounter: document.body,
    get mounter () {
      return env._mounter
    },
    set mounter (v) {
      env._mounter = v
      runResize()
    },
    refs: {},
    stats: false,
    waitKN: (kn) => {
      return new Promise((resolve) => {
        let key = getID()
        env._.loop[key] = () => {
          if (env.refs[kn]) {
            env._.loop[key] = () => {}
            resolve(env.refs[kn])
          }
        }
      })
    },
    setKN: (kn, val) => {
      env.refs[kn] = val
    },
    getID,
    _: {
      loop: {},
      resize: {},
      resizeNow: {},
      clean: {}
    },
    onLoop: (fn) => {
      let key = getID()
      env._.loop[key] = fn
      fn()
      // cleaner
      return () => {
        env._.loop[key] = () => {}
      }
    },
    onResize: async (fn) => {
      await fn()
      env._.resize[getID()] = fn
    },
    onResizeNow: async (fn) => {
      await fn()
      env._.resizeNow[getID()] = fn
    },
    onClean: (fn) => {
      env._.clean[getID()] = fn
    },
    destroy: () => {
      for (var loopKN in env._.loop) {
        env._.loop[loopKN] = () => {}
      }
      for (var cleanKN in env._.clean) {
        env._.clean[cleanKN]()
      }
    }
  }
  let rAFID = 0
  let runLoop = () => {
    if (!env.isActiveRender) {
      return
    }
    for (var loopKN in env._.loop) {
      env._.loop[loopKN]()
    }
  }
  let looper = () => {
    rAFID = requestAnimationFrame(looper)
    if (env.stats) {
      env.stats.begin()
    }
    runLoop()
    if (env.stats) {
      env.stats.end()
    }
  }
  let startLoop = () => {
    rAFID = requestAnimationFrame(looper)
  }
  let stopLoop = () => {
    cancelAnimationFrame(rAFID)
  }

  let tout = 0
  let runResize = async () => {
    if (!env.isActiveRender) {
      return
    }
    // let rect = env.mounter.getBoundingClientRect()
    for (var resizeKN in env._.resize) {
      await env._.resize[resizeKN]()
    }
  }
  let runResizeNow = async () => {
    if (!env.isActiveRender) {
      return
    }
    // let rect = env.mounter.getBoundingClientRect()
    for (var resizeKN in env._.resizeNow) {
      await env._.resizeNow[resizeKN]()
    }
  }

  let resize = () => {
    runResizeNow()
    clearTimeout(tout)
    tout = setTimeout(() => {
      runResize()
    }, 100)
  }
  env.runResize = runResize
  window.addEventListener('resize', resize, false)
  env.onClean(() => {
    window.removeEventListener('resize', resize, false)
  })

  env.onInit = () => {
    console.log('Engine: Start loop')
    startLoop()
    runResize()
  }
  env.onTearDown = () => {
    stopLoop()
    console.log('Engine: Stop loop')
    env.destroy()
  }
  return env
}
