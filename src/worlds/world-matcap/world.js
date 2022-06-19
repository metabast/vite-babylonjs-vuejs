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
} from '@babylonjs/core';
import '@babylonjs/loaders';

import customFragmentShader from './shaders/custom.frag.glsl';
import customVertexShader from './shaders/custom.vertex.glsl';

import matcapFragmentShader from './shaders/matcap.frag.glsl';
import matcapVertexShader from './shaders/matcap.vertex.glsl';

class World{
  constructor(){
    const canvas = document.getElementById( 'scene3d' );
    const engine = new Engine( canvas, true );


    const scene = new Scene( engine );
    // scene.ambientColor = new Color3(.2,.2,.2);

    const camera = new ArcRotateCamera( 'camera', Math.PI/2, Math.PI / 2.5, 6, new Vector3( 0,0,0 ) );
    camera.minZ = 0.1;
    camera.maxZ = 100;
    camera.wheelDeltaPercentage = .035;
    camera.lowerRadiusLimit = 2 ;
    camera.upperRadiusLimit = 10 ;
    
    camera.attachControl( canvas, true );
    // const light = new HemisphericLight("hemi", new Vector3(0,1,0));
    // const mat = new StandardMaterial("mat1");
    // mat.ambientColor = new Color3(1,1,1);


    Effect.ShadersStore.customFragmentShader = customFragmentShader;
    Effect.ShadersStore.customVertexShader = customVertexShader;

    Effect.ShadersStore.matcapFragmentShader = matcapFragmentShader;
    Effect.ShadersStore.matcapVertexShader = matcapVertexShader;

    console.log( Effect.ShadersStore );
    console.log( Effect.IncludesShadersStore );

    const matcapTexture = new Texture( './matcap-D54C2B_5F1105_F39382_F08375-128px.png' );
    matcapTexture.coordinatesMode = Texture.SPHERICAL_MODE;
    const matcapBlurTexture = new Texture( './matcap-D54C2B_5F1105_F39382_F08375-128px-blur.png' );
    const colorTexture = new Texture( './green_metal_rust_diff_1k.jpg' );
    const colorTexture2 = new Texture( './plywood_diff_1k.jpg' );
    const specularTexture = new Texture( './green_metal_rust_disp_1k.png' );
    const checkerTexture = new Texture( './checker.png' );

    var customMaterial = new ShaderMaterial(
      'shader',
      scene,
      {
        vertex: 'custom',
        fragment: 'custom',
      },
      {
        uniforms: ['worldView', 'worldViewProjection'],
        samplers: ['matcapSampler', 'colorTexSampler'],
      },
    );
    customMaterial.setTexture( 'matcapSampler', matcapTexture );
    
    const defines = [];
    defines.push( 'ADDCOLOR' );
    defines.push( 'MATCAP_DESATURATE' );
    var matcapMaterial = new ShaderMaterial(
      'shader',
      scene,
      {
        vertex: 'matcap',
        fragment: 'matcap',
      },
      {
        defines: defines,
        uniforms: ['worldView', 'worldViewProjection', 'uColor'],
        samplers: ['matcapSampler', 'checkerSampler'],
      },
    );
    matcapMaterial.setTexture( 'matcapSampler', matcapTexture );
    matcapMaterial.setTexture( 'matcapBlurSampler', matcapBlurTexture );
    matcapMaterial.setTexture( 'colorTexSampler', colorTexture );
    matcapMaterial.setTexture( 'colorTex2Sampler', colorTexture2 );
    matcapMaterial.setTexture( 'specularSampler', specularTexture );
    matcapMaterial.setTexture( 'checkerSampler', checkerTexture );
    matcapMaterial.setVector3( 'uColor', new Vector3(1,1,1) );

    const matcap = new StandardMaterial( '' );
    matcap.reflectionTexture = matcapTexture;

    SceneLoader.Append( './', 'monkey.glb', scene, function ( scene ) {
      scene.meshes.forEach( mesh => {
        if( mesh.geometry ){
          mesh.material = matcapMaterial;

          // const cloneMesh = mesh.clone();
          // cloneMesh.position.x += 2;
          // cloneMesh.material = matcap;

          // const cloneMesh2 = cloneMesh.clone();
          // cloneMesh2.position.x += 4;
          // cloneMesh2.material = customMaterial;

          // mesh.position.x -= 2;
        }
      } );
    } );

    // const plane = MeshBuilder.CreatePlane( 'plane', { size: 1 }, scene );
    // plane.material = matcapMaterial;



    engine.runRenderLoop( ()=> {
      scene.render();
    } );

    window.addEventListener( 'resize', ()=>{
      engine.resize();
    } );
  }
}

export {World};
