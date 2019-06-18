((typeof self !== 'undefined' ? self : this)["webpackJsonpLoadBall"] = (typeof self !== 'undefined' ? self : this)["webpackJsonpLoadBall"] || []).push([[2],{

/***/ "7b24":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/taggedTemplateLiteral.js
var taggedTemplateLiteral = __webpack_require__("aede");

// EXTERNAL MODULE: ./node_modules/three/build/three.module.js
var three_module = __webpack_require__("5a89");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.typed.float32-array.js
var es6_typed_float32_array = __webpack_require__("63d9");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("7f7f");

// CONCATENATED MODULE: ./src/engine-visual/geosim/gpgpu.js



/* eslint-disable */

/**
 * @author yomboprime https://github.com/yomboprime
 *
 * GPUComputationRenderer, based on SimulationRenderer by zz85
 *
 * The GPUComputationRenderer uses the concept of variables. These variables are RGBA float textures that hold 4 floats
 * for each compute element (texel)
 *
 * Each variable has a fragment shader that defines the computation made to obtain the variable in question.
 * You can use as many variables you need, and make dependencies so you can use textures of other variables in the shader
 * (the sampler uniforms are added automatically) Most of the variables will need themselves as dependency.
 *
 * The renderer has actually two render targets per variable, to make ping-pong. Textures from the current frame are used
 * as inputs to render the textures of the next frame.
 *
 * The render targets of the variables can be used as input textures for your visualization shaders.
 *
 * Variable names should be valid identifiers and should not collide with THREE GLSL used identifiers.
 * a common approach could be to use 'texture' prefixing the variable name; i.e texturePosition, textureVelocity...
 *
 * The size of the computation (sizeX * sizeY) is defined as 'resolution' automatically in the shader. For example:
 * #DEFINE resolution vec2( 1024.0, 1024.0 )
 *
 * -------------
 *
 * Basic use:
 *
 * // Initialization...
 *
 * // Create computation renderer
 * var gpuCompute = new GPUComputationRenderer( 1024, 1024, renderer );
 *
 * // Create initial state float textures
 * var pos0 = gpuCompute.createTexture();
 * var vel0 = gpuCompute.createTexture();
 * // and fill in here the texture data...
 *
 * // Add texture variables
 * var velVar = gpuCompute.addVariable( "textureVelocity", fragmentShaderVel, pos0 );
 * var posVar = gpuCompute.addVariable( "texturePosition", fragmentShaderPos, vel0 );
 *
 * // Add variable dependencies
 * gpuCompute.setVariableDependencies( velVar, [ velVar, posVar ] );
 * gpuCompute.setVariableDependencies( posVar, [ velVar, posVar ] );
 *
 * // Add custom uniforms
 * velVar.material.uniforms.time = { value: 0.0 };
 *
 * // Check for completeness
 * var error = gpuCompute.init();
 * if ( error !== null ) {
 *		console.error( error );
  * }
 *
 *
 * // In each frame...
 *
 * // Compute!
 * gpuCompute.compute();
 *
 * // Update texture uniforms in your visualization materials with the gpu renderer output
 * myMaterial.uniforms.myTexture.value = gpuCompute.getCurrentRenderTarget( posVar ).texture;
 *
 * // Do your rendering
 * renderer.render( myScene, myCamera );
 *
 * -------------
 *
 * Also, you can use utility functions to create ShaderMaterial and perform computations (rendering between textures)
 * Note that the shaders can have multiple input textures.
 *
 * var myFilter1 = gpuCompute.createShaderMaterial( myFilterFragmentShader1, { theTexture: { value: null } } );
 * var myFilter2 = gpuCompute.createShaderMaterial( myFilterFragmentShader2, { theTexture: { value: null } } );
 *
 * var inputTexture = gpuCompute.createTexture();
 *
 * // Fill in here inputTexture...
 *
 * myFilter1.uniforms.theTexture.value = inputTexture;
 *
 * var myRenderTarget = gpuCompute.createRenderTarget();
 * myFilter2.uniforms.theTexture.value = myRenderTarget.texture;
 *
 * var outputRenderTarget = gpuCompute.createRenderTarget();
 *
 * // Now use the output texture where you want:
 * myMaterial.uniforms.map.value = outputRenderTarget.texture;
 *
 * // And compute each frame, before rendering to screen:
 * gpuCompute.doRenderTarget( myFilter1, myRenderTarget );
 * gpuCompute.doRenderTarget( myFilter2, outputRenderTarget );
 *
 *
 *
 * @param {int} sizeX Computation problem size is always 2d: sizeX * sizeY elements.
 * @param {int} sizeY Computation problem size is always 2d: sizeX * sizeY elements.
 * @param {WebGLRenderer} renderer The renderer
  */

/*
eslint-disable
*/

function GPUComputationRenderer(sizeX, sizeY, renderer) {
  this.variables = [];
  this.currentTextureIndex = 0;
  var scene = new three_module["Scene"]();
  var camera = new three_module["Camera"]();
  camera.position.z = 1;
  var passThruUniforms = {
    texture: {
      value: null
    }
  };
  var passThruShader = createShaderMaterial(getPassThroughFragmentShader(), passThruUniforms);
  var mesh = new three_module["Mesh"](new three_module["PlaneBufferGeometry"](2, 2), passThruShader);
  scene.add(mesh);

  this.addVariable = function (variableName, computeFragmentShader, initialValueTexture) {
    var material = this.createShaderMaterial(computeFragmentShader);
    var variable = {
      name: variableName,
      initialValueTexture: initialValueTexture,
      material: material,
      dependencies: null,
      renderTargets: [],
      wrapS: null,
      wrapT: null,
      minFilter: three_module["NearestFilter"],
      magFilter: three_module["NearestFilter"]
    };
    this.variables.push(variable);
    return variable;
  };

  this.setVariableDependencies = function (variable, dependencies) {
    variable.dependencies = dependencies;
  };

  this.init = function () {
    if (!renderer.extensions.get("OES_texture_float")) {
      return "No OES_texture_float support for float textures.";
    }

    if (renderer.capabilities.maxVertexTextures === 0) {
      return "No support for vertex shader textures.";
    }

    for (var i = 0; i < this.variables.length; i++) {
      var variable = this.variables[i]; // Creates rendertargets and initialize them with input texture

      variable.renderTargets[0] = this.createRenderTarget(sizeX, sizeY, variable.wrapS, variable.wrapT, variable.minFilter, variable.magFilter);
      variable.renderTargets[1] = this.createRenderTarget(sizeX, sizeY, variable.wrapS, variable.wrapT, variable.minFilter, variable.magFilter);
      this.renderTexture(variable.initialValueTexture, variable.renderTargets[0]);
      this.renderTexture(variable.initialValueTexture, variable.renderTargets[1]); // Adds dependencies uniforms to the ShaderMaterial

      var material = variable.material;
      var uniforms = material.uniforms;

      if (variable.dependencies !== null) {
        for (var d = 0; d < variable.dependencies.length; d++) {
          var depVar = variable.dependencies[d];

          if (depVar.name !== variable.name) {
            // Checks if variable exists
            var found = false;

            for (var j = 0; j < this.variables.length; j++) {
              if (depVar.name === this.variables[j].name) {
                found = true;
                break;
              }
            }

            if (!found) {
              return "Variable dependency not found. Variable=" + variable.name + ", dependency=" + depVar.name;
            }
          }

          uniforms[depVar.name] = {
            value: null
          };
          material.fragmentShader = "\nuniform sampler2D " + depVar.name + ";\n" + material.fragmentShader;
        }
      }
    }

    this.currentTextureIndex = 0;
    return null;
  };

  this.compute = function () {
    var currentTextureIndex = this.currentTextureIndex;
    var nextTextureIndex = this.currentTextureIndex === 0 ? 1 : 0;

    for (var i = 0, il = this.variables.length; i < il; i++) {
      var variable = this.variables[i]; // Sets texture dependencies uniforms

      if (variable.dependencies !== null) {
        var uniforms = variable.material.uniforms;

        for (var d = 0, dl = variable.dependencies.length; d < dl; d++) {
          var depVar = variable.dependencies[d];
          uniforms[depVar.name].value = depVar.renderTargets[currentTextureIndex].texture;
        }
      } // Performs the computation for this variable


      this.doRenderTarget(variable.material, variable.renderTargets[nextTextureIndex]);
    }

    this.currentTextureIndex = nextTextureIndex;
  };

  this.getCurrentRenderTarget = function (variable) {
    return variable.renderTargets[this.currentTextureIndex];
  };

  this.getAlternateRenderTarget = function (variable) {
    return variable.renderTargets[this.currentTextureIndex === 0 ? 1 : 0];
  };

  function addResolutionDefine(materialShader) {
    materialShader.defines.resolution = 'vec2( ' + sizeX.toFixed(1) + ', ' + sizeY.toFixed(1) + " )";
  }

  this.addResolutionDefine = addResolutionDefine; // The following functions can be used to compute things manually

  function createShaderMaterial(computeFragmentShader, uniforms) {
    uniforms = uniforms || {};
    var material = new three_module["ShaderMaterial"]({
      uniforms: uniforms,
      vertexShader: getPassThroughVertexShader(),
      fragmentShader: computeFragmentShader
    });
    addResolutionDefine(material);
    return material;
  }

  this.createShaderMaterial = createShaderMaterial;

  this.createRenderTarget = function (sizeXTexture, sizeYTexture, wrapS, wrapT, minFilter, magFilter) {
    sizeXTexture = sizeXTexture || sizeX;
    sizeYTexture = sizeYTexture || sizeY;
    wrapS = wrapS || three_module["ClampToEdgeWrapping"];
    wrapT = wrapT || three_module["ClampToEdgeWrapping"];
    minFilter = minFilter || three_module["NearestFilter"];
    magFilter = magFilter || three_module["NearestFilter"];
    var renderTarget = new three_module["WebGLRenderTarget"](sizeXTexture, sizeYTexture, {
      wrapS: wrapS,
      wrapT: wrapT,
      minFilter: minFilter,
      magFilter: magFilter,
      format: three_module["RGBAFormat"],
      type: /(iPad|iPhone|iPod)/g.test(navigator.userAgent) ? three_module["HalfFloatType"] : three_module["FloatType"],
      stencilBuffer: false,
      depthBuffer: false
    });
    return renderTarget;
  };

  this.createTexture = function () {
    var a = new Float32Array(sizeX * sizeY * 4);
    var texture = new three_module["DataTexture"](a, sizeX, sizeY, three_module["RGBAFormat"], three_module["FloatType"]);
    texture.needsUpdate = true;
    return texture;
  };

  this.renderTexture = function (input, output) {
    // Takes a texture, and render out in rendertarget
    // input = Texture
    // output = RenderTarget
    passThruUniforms.texture.value = input;
    this.doRenderTarget(passThruShader, output);
    passThruUniforms.texture.value = null;
  };

  this.doRenderTarget = function (material, output) {
    var currentRenderTarget = renderer.getRenderTarget();
    mesh.material = material;
    renderer.setRenderTarget(output);
    renderer.render(scene, camera);
    mesh.material = passThruShader;
    renderer.setRenderTarget(currentRenderTarget);
  }; // Shaders


  function getPassThroughVertexShader() {
    return "void main()	{\n" + "\n" + "	gl_Position = vec4( position, 1.0 );\n" + "\n" + "}\n";
  }

  function getPassThroughFragmentShader() {
    return "uniform sampler2D texture;\n" + "\n" + "void main() {\n" + "\n" + "	vec2 uv = gl_FragCoord.xy / resolution.xy;\n" + "\n" + "	gl_FragColor = texture2D( texture, uv );\n" + "\n" + "}\n";
  }
}
// CONCATENATED MODULE: ./src/engine-visual/geosim/geosim.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeAPI", function() { return geosim_makeAPI; });


function _templateObject4() {
  var data = Object(taggedTemplateLiteral["a" /* default */])(["\n      precision highp float;\n      precision highp sampler2D;\n\n      uniform sampler2D colorShader;\n      varying highp vec2 vUv;\n      varying highp vec3 vPos;\n      void main () {\n        vec4 colorVal = texture2D(colorShader, vUv);\n        gl_FragColor = vec4(vec3(\n          vPos.x / 100.0 * 0.6 + 0.5,\n          vPos.y / 100.0 * 0.6 + 0.5,\n          vPos.z / 100.0 * 0.6 + 0.5\n        ), 0.9);\n      }\n    "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = Object(taggedTemplateLiteral["a" /* default */])(["\n      precision highp float;\n      precision highp sampler2D;\n\n      varying highp vec2 vUv;\n      varying highp vec3 vPos;\n\n      uniform sampler2D geoShader;\n      void main () {\n        vUv = uv;\n        vec4 posTex = texture2D(geoShader, uv);\n        gl_PointSize = 1.0;\n        vPos = posTex.xyz;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(posTex.xyz, posTex.w);\n      }\n    "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = Object(taggedTemplateLiteral["a" /* default */])(["\n  /*\n    LIBRARY\n  */\n  #include <common>\n\n  /*\n    Simulation Main Code\n  */\n  uniform float time;\n  uniform sampler2D meta0;\n  void main (void) {\n    vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n    vec4 LAST_COLOR = texture2D(textureColor, uv);\n    vec4 META0 = texture2D(meta0, uv);\n\n    float vertexIDX = META0.x;\n    float squareIDX = META0.y;\n    float totalSquares = META0.z;\n    float pointIDX = META0.w;\n\n    float red = uv.x + 0.5;\n    float green = uv.y + 0.5;\n    float blue = 0.5;\n\n    gl_FragColor = vec4(red, green, blue, 1.0);\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = Object(taggedTemplateLiteral["a" /* default */])(["\n  /*\n    LIBRARY\n  */\n  #include <common>\n\n  mat3 rotateX (float rad) {\n    float c = cos(rad);\n    float s = sin(rad);\n    return mat3(\n      1.0, 0.0, 0.0,\n      0.0, c, s,\n      0.0, -s, c\n    );\n  }\n\n  mat3 rotateY (float rad) {\n    float c = cos(rad);\n    float s = sin(rad);\n    return mat3(\n      c, 0.0, -s,\n      0.0, 1.0, 0.0,\n      s, 0.0, c\n    );\n  }\n\n  mat3 rotateZ (float rad) {\n    float c = cos(rad);\n    float s = sin(rad);\n    return mat3(\n      c, s, 0.0,\n      -s, c, 0.0,\n      0.0, 0.0, 1.0\n    );\n  }\n\n  mat3 rotateQ (vec3 axis, float rad) {\n    float hr = rad / 2.0;\n    float s = sin( hr );\n    vec4 q = vec4(axis * s, cos( hr ));\n    vec3 q2 = q.xyz + q.xyz;\n    vec3 qq2 = q.xyz * q2;\n    vec2 qx = q.xx * q2.yz;\n    float qy = q.y * q2.z;\n    vec3 qw = q.w * q2.xyz;\n\n    return mat3(\n      1.0 - (qq2.y + qq2.z),  qx.x - qw.z,            qx.y + qw.y,\n      qx.x + qw.z,            1.0 - (qq2.x + qq2.z),  qy - qw.x,\n      qx.y - qw.y,            qy + qw.x,              1.0 - (qq2.x + qq2.y)\n    );\n  }\n\n  /*\n    Position Main Code\n  */\n  precision highp sampler2D;\n  uniform sampler2D meta0;\n  uniform float time;\n\n  void main (void) {\n    vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n    vec4 LAST_POS = texture2D(texturePosition, uv);\n    vec4 META0 = texture2D(meta0, uv);\n    vec4 pos = vec4(0.0);\n\n    float vertexIDX = META0.x;\n    float squareIDX = META0.y;\n    float totalSquares = META0.z;\n    float pointIDX = META0.w;\n\n    /*\n      Assemble\n    */\n    vec3 plane = vec3(0.6, 0.3, 0.0);\n    bool isInvalid = false;\n    if (vertexIDX == 0.0) {\n      pos.x = 1.0 * plane.x;\n      pos.y = 1.0 * plane.y;\n      pos.z = 1.0 * plane.z;\n    } else if (vertexIDX == 1.0) {\n      pos.x = -1.0 * plane.x;\n      pos.y = 1.0 * plane.y;\n      pos.z = 1.0 * plane.z;\n    } else if (vertexIDX == 2.0) {\n      pos.x = -1.0 * plane.x;\n      pos.y = -1.0 * plane.y;\n      pos.z = 1.0 * plane.z;\n    } else if (vertexIDX == 3.0) {\n      pos.x = 1.0 * plane.x;\n      pos.y = 1.0 * plane.y;\n      pos.z = 1.0 * plane.z;\n    } else if (vertexIDX == 4.0) {\n      pos.x = -1.0 * plane.x;\n      pos.y = -1.0 * plane.y;\n      pos.z = 1.0 * plane.z;\n    } else if (vertexIDX == 5.0) {\n      pos.x = 1.0 * plane.x;\n      pos.y = -1.0 * plane.y;\n      pos.z = 1.0 * plane.z;\n    } else {\n      isInvalid = true;\n    }\n\n    if (!isInvalid) {\n      float dimension = (pow(totalSquares, 0.5));\n\n      vec3 offset = vec3(\n        plane.x * 15.25 * (squareIDX / dimension),\n        plane.y * 1.0 * (mod(squareIDX, dimension)),\n        plane.z * 0.0\n      );\n\n      pos.xyz += offset.xyz;\n\n      float pX = pos.x;\n      float pY = pos.y;\n      float pZ = pos.y;\n\n      float piz = 0.001 * 2.0 * 3.14159265;\n\n      pos.xyz = rotateQ(normalize(vec3(1.0, pZ * piz, 1.0)), time + pX * piz) * rotateY(time + pY * piz) * pos.xyz;\n      pos.z += sin(time  + pX * piz * 0.333) * 50.0;\n\n      pos.xyz *= 0.075;\n\n      pos.w = 1.0;\n      gl_FragColor = pos;\n    } else {\n      pos.w = 0.0;\n      gl_FragColor = pos;\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}




var glsl = function glsl(x) {
  return x[0];
};

var simulatePosition = glsl(_templateObject());
var simulateState = glsl(_templateObject2());
var geosim_makeAPI = function makeAPI(_ref) {
  var renderer = _ref.renderer,
      scene = _ref.scene;
  var api = {
    render: function render() {}
  };
  var WIDTH = 1024;
  var gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);
  var pos0 = gpuCompute.createTexture();
  var color0 = gpuCompute.createTexture(); // meta0

  var meta0 = gpuCompute.createTexture();
  var posVar = gpuCompute.addVariable('texturePosition', simulatePosition, pos0);
  var colorVar = gpuCompute.addVariable('textureColor', simulateState, color0); // Add variable dependencies

  gpuCompute.setVariableDependencies(posVar, [posVar]);
  gpuCompute.setVariableDependencies(colorVar, [colorVar]); // pos var

  posVar.material.uniforms.time = {
    value: 0.0
  };
  posVar.material.uniforms.meta0 = {
    value: meta0 // state var

  };
  colorVar.material.uniforms.time = {
    value: 0.0
  };
  colorVar.material.uniforms.meta0 = {
    value: meta0 // Check for completeness

  };
  var error = gpuCompute.init();

  if (error !== null) {
    console.error(error);
  }

  var geo = new three_module["BufferGeometry"]();

  var processMeta = function processMeta() {
    var iii = 0;
    var dimension = Math.pow(WIDTH * WIDTH, 1 / 3);
    var total = dimension * dimension * dimension; // let dimension05 = dimension / 2

    var ARR_VALUE = meta0.image.data;

    for (var ix = 0; ix < dimension; ix++) {
      for (var iy = 0; iy < dimension; iy++) {
        for (var iz = 0; iz < dimension; iz++) {
          // console.log(iii)
          var id = iii / 4;
          ARR_VALUE[iii + 0] = id % 6; // square vertex ID

          ARR_VALUE[iii + 1] = Math.floor(id / 6); // square ID

          ARR_VALUE[iii + 2] = total / 6.0; // percentage
          // dot id

          ARR_VALUE[iii + 3] = id; // point ID

          iii += 4;
        }
      }
    }
  };

  processMeta();

  var getUV = function getUV() {
    var uv = [];
    var uvi = 0;

    for (var j = 0; j < WIDTH; j++) {
      for (var i = 0; i < WIDTH; i++) {
        uv[uvi + 0] = i / WIDTH;
        uv[uvi + 1] = j / WIDTH;
        uvi += 2;
      }
    }

    return uv;
  };

  var getPosition = function getPosition() {
    var newArr = [];
    var na = 0; // let W5 = WIDTH * 0.5

    for (var j = 0; j < WIDTH; j++) {
      for (var i = 0; i < WIDTH; i++) {
        newArr[na + 0] = 0; // (i - W5)

        newArr[na + 1] = 0; // (j - W5)

        newArr[na + 2] = 0;
        na += 3;
      }
    }

    return newArr;
  };

  geo.addAttribute('position', new three_module["Float32BufferAttribute"](getPosition(), 3));
  geo.addAttribute('uv', new three_module["Float32BufferAttribute"](getUV(), 2));
  var uniforms = {
    time: {
      value: 0
    },
    geoShader: {
      value: null
    },
    colorShader: {
      value: null
    }
  };
  var material = new three_module["ShaderMaterial"]({
    transparent: true,
    uniforms: uniforms,
    defines: {
      resolution: "vec2(".concat(WIDTH.toFixed(1), ", ").concat(WIDTH.toFixed(1), ")")
    },
    vertexShader: glsl(_templateObject3()),
    fragmentShader: glsl(_templateObject4()),
    side: three_module["DoubleSide"]
  });
  var mesh = new three_module["Mesh"](geo, material);
  scene.add(mesh);
  scene.background = new three_module["Color"]('#ffffff');

  api.render = function () {
    // Update texture uniforms in your visualization materials with the gpu renderer output
    material.uniforms.geoShader.value = gpuCompute.getCurrentRenderTarget(posVar).texture;
    material.uniforms.colorShader.value = gpuCompute.getCurrentRenderTarget(colorVar).texture;
    var time = window.performance.now() * 0.001;
    posVar.material.uniforms.time.value = time;
    colorVar.material.uniforms.time.value = time;
    gpuCompute.compute();
  };

  api.clean = function () {
    scene.remove(mesh);
  };

  return api;
};

/***/ }),

/***/ "98dd":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"80059ef6-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/engine-visual/ActiveLearningART.vue?vue&type=template&id=4e3b59d2&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div')}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/engine-visual/ActiveLearningART.vue?vue&type=template&id=4e3b59d2&

// EXTERNAL MODULE: ./node_modules/regenerator-runtime/runtime.js
var runtime = __webpack_require__("96cf");

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js
var asyncToGenerator = __webpack_require__("3b8d");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/engine-visual/ActiveLearningART.vue?vue&type=script&lang=js&



//
//
//
//
//
var GLAPI = __webpack_require__("7b24");

/* harmony default export */ var ActiveLearningARTvue_type_script_lang_js_ = ({
  props: {
    engine: {}
  },
  data: function data() {
    return {
      api: {}
    };
  },
  mounted: function mounted() {
    this.setup();
  },
  methods: {
    setup: function () {
      var _setup = Object(asyncToGenerator["a" /* default */])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.api = GLAPI.makeAPI({
                  renderer: this.engine.renderer,
                  scene: this.engine.scene
                });

                this.engine.execStack.renderActiveLearningART = function () {
                  _this.api.render();
                };

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function setup() {
        return _setup.apply(this, arguments);
      }

      return setup;
    }()
  },
  beforeDestroy: function beforeDestroy() {
    this.api.clean();

    this.engine.execStack.renderActiveLearningART = function () {};
  }
});
// CONCATENATED MODULE: ./src/engine-visual/ActiveLearningART.vue?vue&type=script&lang=js&
 /* harmony default export */ var engine_visual_ActiveLearningARTvue_type_script_lang_js_ = (ActiveLearningARTvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("2877");

// CONCATENATED MODULE: ./src/engine-visual/ActiveLearningART.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  engine_visual_ActiveLearningARTvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var ActiveLearningART = __webpack_exports__["default"] = (component.exports);

/***/ })

}]);
//# sourceMappingURL=LoadBall.common.content.js.map