import {
  Scene, 
  ArcRotateCamera, 
  MeshBuilder, 
  StandardMaterial,
  ShaderMaterial,
  Engine, 
  Vector3,
  HemisphericLight,
  PointLight,
  SceneLoader,
  Color3,
  Effect,
  Texture,
  Mesh,
  TransformNode,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import customFragmentShader from "./shaders/custom.frag.glsl";
import customVertexShader from "./shaders/custom.vertex.glsl";

import matcapFragmentShader from "./shaders/matcap.frag.glsl";
import matcapVertexShader from "./shaders/matcap.vertex.glsl";

class World{
  constructor(){
    const canvas = document.getElementById("scene3d");
    const engine = new Engine(canvas, true);


    const scene = new Scene(engine);
    // scene.ambientColor = new Color3(.2,.2,.2);

    const camera = new ArcRotateCamera('camera', -Math.PI/2, Math.PI / 2.5, 6, new Vector3(0,0,0));
    camera.minZ = 0.1;
    camera.maxZ = 100;
    camera.attachControl(canvas, true);
    camera.wheelDeltaPercentage = .1;

    // const light = new HemisphericLight("hemi", new Vector3(0,1,0));
    // const mat = new StandardMaterial("mat1");
    // mat.ambientColor = new Color3(1,1,1);


    Effect.ShadersStore.customFragmentShader = customFragmentShader;
    Effect.ShadersStore.customVertexShader = customVertexShader;

    Effect.ShadersStore.matcapFragmentShader = matcapFragmentShader;
    Effect.ShadersStore.matcapVertexShader = matcapVertexShader;

    console.log(Effect.ShadersStore);
    console.log(Effect.IncludesShadersStore);

    const matcapTexture = new Texture("https://makio135.com/matcaps/1024/D54C2B_5F1105_F39382_F08375.png");

    var customMaterial = new ShaderMaterial(
      "shader",
      scene,
      {
        vertex: "custom",
        fragment: "custom",
      },
      {
        uniforms: ["worldView", "worldViewProjection"],
        samplers: ["textureSampler"],
      },
    );
    customMaterial.setTexture("textureSampler", matcapTexture);

    var matcapMaterial = new ShaderMaterial(
      "shader",
      scene,
      {
        vertex: "matcap",
        fragment: "matcap",
      },
      {
        uniforms: ["worldView", "worldViewProjection"],
        samplers: ["textureSampler"],
      },
    );
    matcapMaterial.setTexture("textureSampler", matcapTexture);

    const matcap = new StandardMaterial("");
    matcap.reflectionTexture = matcapTexture;

    SceneLoader.Append("./", "monkey.glb", scene, function (scene) {
      scene.meshes.forEach(mesh => {
        if(mesh.geometry){
          mesh.material = customMaterial;
          
          const cloneMesh = mesh.clone();
          cloneMesh.position.x += 2;
          cloneMesh.material = matcapMaterial;
          mesh.position.x -= 2;
        }else{
        }
      } );
  });



    engine.runRenderLoop( ()=> {
      scene.render();
    });

    window.addEventListener('resize', (event)=>{
      engine.resize();
    });
  }
}

export {World};