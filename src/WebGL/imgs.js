// export const NavRow = () => import(/* webpackChunkName: "NavRow" */ './Shared/NavRow.vue')

// export const HeroUnit = () => import(/* webpackChunkName: "HeroUnit" */ './Home/HeroUnit.vue')
// export const IntroUnit = () => import(/* webpackChunkName: "IntroUnit" */ './Home/IntroUnit.vue')
// export const FeaturedCards = () => import(/* webpackChunkName: "FeaturedCards" */ './Home/FeaturedCards.vue')
// export const EffortsAndLove = () => import(/* webpackChunkName: "EffortsAndLove" */ './Home/EffortsAndLove.vue')

let exporter = []
let path = require('path')
async function importAll (r) {
  r.keys().forEach(key => {
    exporter.push({
      key: path.basename(key).replace(path.extname(key), ''),
      img: r(key)
    })
  })
  return exporter
}

importAll(require.context('./Pages/AppUnits/hdri/', true, /\.jpg$/, 'sync'), 'sync')

export default exporter
