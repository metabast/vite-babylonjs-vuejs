import {
  Scene,
  ArcRotateCamera,
  StandardMaterial,
  ShaderMaterial,
  Engine,
  Vector3,
  SceneLoader,
  Effect,
  Texture,
  MeshBuilder,
  HemisphericLight,
  Color3,
  PBRMaterial,
  Color4,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import {
  PBRCustomMaterial
} from '@babylonjs/materials';
import {
  Pane
} from 'tweakpane';
import MatcapEditor from './matcapEditor';
import MatcapPBRCustomMaterial from './MatcapPBRCustomMaterial';
import MatcapTweaks from './matcapTweaks';

import customFragmentShader from './shaders/custom.frag.glsl';
import customVertexShader from './shaders/custom.vertex.glsl';

import matcapFragmentShader from './shaders/matcap.frag.glsl';
import matcapVertexShader from './shaders/matcap.vertex.glsl';

class World {
  constructor() {

    if (!World.instance) World.instance = this;
    else throw new Error('World is a singleton');

    this.tweakpane = new Pane();

    const canvas = document.getElementById('scene3d');
    const engine = new Engine(canvas, true);


    const scene = new Scene(engine);
    scene.clearColor = Color4.FromHexString('#313131');

    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0));
    camera.minZ = 0.1;
    camera.maxZ = 100;
    camera.wheelDeltaPercentage = .035;
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 14;

    camera.attachControl(canvas, true);

    Effect.ShadersStore.customFragmentShader = customFragmentShader;
    Effect.ShadersStore.customVertexShader = customVertexShader;

    Effect.ShadersStore.matcapFragmentShader = matcapFragmentShader;
    Effect.ShadersStore.matcapVertexShader = matcapVertexShader;

    console.log(Effect.ShadersStore);
    console.log(Effect.IncludesShadersStore);

    const matcapTexture = new Texture('./matcap-D54C2B_5F1105_F39382_F08375-128px.png');
    matcapTexture.coordinatesMode = Texture.SPHERICAL_MODE;
    const matcapBlurTexture = new Texture('./matcap-D54C2B_5F1105_F39382_F08375-128px-blur.png');
    const colorTexture = new Texture('./green_metal_rust_diff_1k.jpg');
    const colorTexture2 = new Texture('./plywood_diff_1k.jpg');
    const specularTexture = new Texture('./green_metal_rust_disp_1k.png');
    const checkerTexture = new Texture('./checker.png');

    var customMaterial = new ShaderMaterial(
      'shader',
      scene, {
        vertex: 'matcap',
        fragment: 'custom',
      }, {
        uniforms: ['worldView', 'worldViewProjection'],
        samplers: ['matcapSampler', 'colorTexSampler'],
      },
    );
    customMaterial.setTexture('matcapSampler', matcapTexture);

    const defines = [];
    defines.push('ADDCOLOR');
    defines.push('MATCAP_DESATURATE');
    var matcapMaterial = new ShaderMaterial(
      'shader',
      scene, {
        vertex: 'matcap',
        fragment: 'matcap',
      }, {
        defines: defines,
        uniforms: ['worldView', 'worldViewProjection', 'uColor'],
        samplers: ['matcapSampler', 'checkerSampler'],
      },
    );
    matcapMaterial.setTexture('matcapSampler', matcapTexture);
    matcapMaterial.setTexture('matcapBlurSampler', matcapBlurTexture);
    matcapMaterial.setTexture('checkerSampler', checkerTexture);
    matcapMaterial.setVector3('uColor', new Vector3(1., 1., 1.));

    const customPBR = new MatcapPBRCustomMaterial("pbrCustom", scene);

    customPBR.bumpTexture = new Texture("./Substance_graph_normal.png", scene);
    customPBR.bumpTexture.uScale = customPBR.bumpTexture.vScale = 4;
    customPBR.bumpTexture.level = .6;
    window.addEventListener('matcap:bump', (event) => {
      customPBR.bumpTexture.level = event.detail;
    });

    customPBR.emissiveColor = Color3.Black();
    window.addEventListener('matcap:emissiveColor', (event) => {
      customPBR.emissiveColor = Color3.FromHexString(event.detail);
    });

    customPBR.reflectionColor = Color3.White();
    window.addEventListener('matcap:reflectionColor', (event) => {
      customPBR.reflectionColor = Color3.FromHexString(event.detail);
    });
    // customPBR.reflectionTexture = matcapTexture;
    customPBR.reflectionTexture = MatcapEditor.getMatcapTexture();


    SceneLoader.Append('./', 'monkey.glb', scene, function (scene) {
      scene.meshes.forEach(mesh => {
        if (mesh.geometry) {
          mesh.material = matcapMaterial;


          // Center 
          const cloneMesh = mesh.clone();
          cloneMesh.position.x = 0;
          cloneMesh.material = customPBR;

          // Right
          const cloneMesh2 = cloneMesh.clone();
          cloneMesh2.position.x += 3;
          cloneMesh2.material = customMaterial;

          // Left
          mesh.position.x -= 3;
        }
      });
    });

    MatcapTweaks.getInstance().addTweaks();

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });
  }
  static getInstance() {
    if (!World.instance) {
      return new World();
    }
    return World.instance;
  }
}

export {
  World
};