<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { CylinderGeometry, Vector3, Vector2, Color, InstancedBufferGeometry, BufferAttribute, InstancedBufferAttribute, RawShaderMaterial, Mesh, Object3D } from 'three'
import { Tree } from '../../Reusable'
/* eslint-disable */
export const tubeV = require('raw-loader!./tubeV.glsl').default
export const tubeF = require('raw-loader!./tubeF.glsl').default
/* eslint-enable */

export const createLineGeo = async ({ count = 100, numSides = 8, subdivisions = 50, openEnded = false }) => {
  // create a base CylinderGeometry which handles UVs, end caps and faces
  const radius = 1
  const length = 1
  const baseGeometry = new CylinderGeometry(radius, radius, length, numSides, subdivisions, openEnded)

  // fix the orientation so X can act as arc length
  baseGeometry.rotateZ(Math.PI / 2)

  // compute the radial angle for each position for later extrusion
  const tmpVec = new Vector2()
  const xPositions = []
  const angles = []
  const uvs = []
  const vertices = baseGeometry.vertices
  const faceVertexUvs = baseGeometry.faceVertexUvs[0]

  // Now go through each face and un-index the geometry.
  baseGeometry.faces.forEach((face, i) => {
    const { a, b, c } = face
    const v0 = vertices[a]
    const v1 = vertices[b]
    const v2 = vertices[c]
    const verts = [ v0, v1, v2 ]
    const faceUvs = faceVertexUvs[i]

    // For each vertex in this face...
    verts.forEach((v, j) => {
      tmpVec.set(v.y, v.z).normalize()

      // the radial angle around the tube
      const angle = Math.atan2(tmpVec.y, tmpVec.x)
      angles.push(angle)

      // "arc length" in range [-0.5 .. 0.5]
      xPositions.push(v.x)

      // copy over the UV for this vertex
      uvs.push(faceUvs[j].toArray())
    })
  })

  // build typed arrays for our attributes
  const posArray = new Float32Array(xPositions)
  const angleArray = new Float32Array(angles)
  const uvArray = new Float32Array(uvs.length * 2)

  // unroll UVs
  for (let i = 0; i < posArray.length; i++) {
    const [ u, v ] = uvs[i]
    uvArray[i * 2 + 0] = u
    uvArray[i * 2 + 1] = v
  }

  const geometry = new InstancedBufferGeometry()
  geometry.maxInstancedCount = count
  geometry.setAttribute('position', new BufferAttribute(posArray, 1))
  geometry.setAttribute('angle', new BufferAttribute(angleArray, 1))
  geometry.setAttribute('uv', new BufferAttribute(uvArray, 2))

  let offsets = []

  for (var i = 0; i < count; i++) {
    let x = i / count
    let y = i
    let z = count
    offsets.push(
      x,
      y,
      z
    )
  }

  geometry.setAttribute('offset', new InstancedBufferAttribute(new Float32Array(offsets), 3))

  // dispose old geometry since we no longer need it
  baseGeometry.dispose()
  return geometry
}

export default {
  props: {
    tCube: {
      default () {
        return null
      }
    }
  },
  name: 'ParametricRain',
  mixins: [Tree],
  components: {
    ...require('../../webgl')
  },
  data () {
    return {
    }
  },
  async mounted () {
    let count = 50
    let numSides = 4
    let subdivisions = 500
    let openEnded = false
    let geo = await createLineGeo({ count, numSides, subdivisions, openEnded })

    let uniforms = {
      // tCube: { value: cubeTexture },
      baseOpacity: { value: 1 },
      // baseColor: { value: new Color('#00f') },

      mRefractionRatio: { value: 0.02 },
      mFresnelBias: { value: 0.2 },
      mFresnelPower: { value: 2.2 },
      mFresnelScale: { value: 1.2 },
      tCube: { value: null },
      tDudv: { value: null },
      useDudv: { value: false },

      baseColor: { value: new Color('#fff') },
      thickness: { value: 0.01 },
      spread: { value: 0.01 },
      time: { value: 0 },
      speed: { value: 0 },
      displacement: { value: new Vector3() }
    }

    let sdk = this.lookup('sdk')
    let group = sdk.getGroup('parametric-rain')

    this.lookup('base').onLoop(() => {
      geo.maxInstancedCount = Math.floor(group.autoGet('maxLines') / 100.0 * count)

      uniforms.spread.value = group.autoGet('spread')
      uniforms.thickness.value = group.autoGet('thickness') / 1000.0

      uniforms.baseOpacity.value = group.autoGet('baseOpacity') / 100.0
      uniforms.baseColor.value = group.autoGet('baseColor')
      uniforms.speed.value = group.autoGet('speed') / 100.0
      uniforms.time.value = window.performance.now() * 0.001
    })

    let refresh = (mesh) => {
      let material = new RawShaderMaterial({
        defines: {
          lengthSegments: subdivisions.toFixed(1)
        },
        transparent: true,
        uniforms,
        vertexShader: tubeV,
        fragmentShader: tubeF
      })

      mesh.material = material
    }

    let mesh = new Mesh(geo, undefined, count)
    mesh.frustumCulled = false
    mesh.scale.set(200.0, 200.0, 200.0)
    refresh(mesh)

    uniforms.tCube.value = this.tCube

    let obj3d = new Object3D()
    obj3d.add(mesh)
    this.o3d.add(obj3d)
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
