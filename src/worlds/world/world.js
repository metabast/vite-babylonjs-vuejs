import {
  Scene, 
  ArcRotateCamera, 
  MeshBuilder, 
  StandardMaterial, 
  Engine, 
  Vector3,
  HemisphericLight,
  PointLight,
  Color3,
} from "@babylonjs/core";

class World{
  constructor(){
    const canvas = document.getElementById("scene3d");
    const engine = new Engine(canvas, true);


    const scene = new Scene(engine);
    scene.ambientColor = new Color3(.2,.2,.2);

    const camera = new ArcRotateCamera('camera', -Math.PI/2, Math.PI / 2.5, 3, new Vector3(0,0,0));
    camera.minZ = 0.1;
    camera.maxZ = 100;
    camera.attachControl(canvas, true);
    camera.wheelDeltaPercentage = .1;

    const light = new HemisphericLight("hemi", new Vector3(0,1,0));
    const mat = new StandardMaterial("mat1");
    mat.ambientColor = new Color3(1,1,1);

    const box = MeshBuilder.CreateBox("box", {size:1});
    box.material = mat;

    engine.runRenderLoop( ()=> {
      scene.render();
    });

    window.addEventListener('resize', (event)=>{
      engine.resize();
    });
  }
}

export {World};