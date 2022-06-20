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
} from '@babylonjs/core';
import '@babylonjs/loaders';
import { PBRCustomMaterial } from '@babylonjs/materials';

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

    const customPBR = new PBRCustomMaterial("pbrCustom", scene);
    
    customPBR.AddUniform(`lightmapColor2`, "sampler2D");

    customPBR.Vertex_Definitions(`
      varying vec2 vUvView;

      `);
      
      customPBR.Vertex_Before_PositionUpdated(`
      mat4 worldView = world * view;
      vec4 p = vec4( position, 1. );
      vec3 normalView = normalize( mat3(worldView) * normal );
      vec4 vPositionView = worldView * p;

      vec3 viewDir = normalize( vPositionView.xyz );
      vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
      vec3 y = cross( viewDir, x );
      vUvView = vec2( dot( x, normalView ), dot( y, normalView ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks
      // vUvView = vec2(normalView.x);
    `);

    customPBR.Fragment_Definitions(`
      varying vec2 vUvView;
      vec4 desaturate( in vec4 color ) {
        return vec4(vec3((color.r + color.g + color.b)/2.), color.a);
      }
    `);

    customPBR.Fragment_Before_FragColor(`
      // vec4 lightmapColor2 = desaturate(texture(lightmapColor2, vUvView));
      // lightmapColor2.rgb *= 1.;
      // // finalColor.rgb = vec3(vUvView.y);
      // lightmapColor = lightmapColor2;
      // finalColor.rgb = lightmapColor.rgb;
      // finalColor.rgb = vec3(vLightmapInfos.y);
      // finalColor.r = 1.-finalColor.r;
    `);

    // customPBR.albedoTexture = colorTexture;
    // customPBR.bumpTexture = new Texture("http://i.imgur.com/wGyk6os.png", scene);
    // customPBR.bumpTexture.level = 2;
    // customPBR.bumpTexture.uScale  = customPBR.bumpTexture.vScale = 4;
    // console.log(customPBR);
    
    customPBR.bumpTexture = new Texture("http://i.imgur.com/wGyk6os.png", scene);
    customPBR.bumpTexture.uScale = customPBR.bumpTexture.vScale = 10;
    customPBR.bumpTexture.level = .2
    // customPBR.useRoughnessFromMetallicTextureAlpha = false;
    // customPBR.useRoughnessFromMetallicTextureGreen = true;
    // customPBR.useMetallnessFromMetallicTextureBlue = true;
    customPBR.metallic = 1;
    customPBR.roughness = 1;
    console.log(customPBR);
    customPBR.onBindObservable.add(function () { 
      customPBR.getEffect().setTexture('lightmapColor2', matcapTexture);
    });
    // customPBR.setTexture('lightmapColor2', matcapTexture);
    // customPBR.emissiveColor = new Color3(1,1,1);
    customPBR.reflectionTexture = matcapTexture;

    SceneLoader.Append( './', 'monkey.glb', scene, function ( scene ) {
      scene.meshes.forEach( mesh => {
        if( mesh.geometry ){
          mesh.material = matcapMaterial;

          const cloneMesh = mesh.clone();
          cloneMesh.position.x += 2;
          cloneMesh.material = customPBR;

          // const cloneMesh = mesh.clone();
          // cloneMesh.position.x += 2;
          // cloneMesh.material = matcap;

          // const cloneMesh2 = cloneMesh.clone();
          // cloneMesh2.position.x += 4;
          // cloneMesh2.material = customMaterial;

          mesh.position.x -= 2;
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
