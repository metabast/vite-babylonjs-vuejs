import {
  Scene,
  ArcRotateCamera,
  Engine,
  Vector3,
  SceneLoader,
  Color4,
} from '@babylonjs/core';
import '@babylonjs/loaders';

import {
  Pane
} from 'tweakpane';
import MatcapTweaks from './matcapTweaks';
import Materials from './Materials';


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

    Materials.initialize(scene);


    SceneLoader.Append('./', 'monkey.glb', scene, function (scene) {
      scene.meshes.forEach(mesh => {
        if (mesh.geometry) {
          mesh.material = Materials.matcapShaderMaterial;


          // Center 
          const cloneMesh = mesh.clone();
          cloneMesh.position.x = 0;
          cloneMesh.material = Materials.matcapPBRCustomMaterial;

          // Right
          const cloneMesh2 = cloneMesh.clone();
          cloneMesh2.position.x += 3;
          cloneMesh2.material = Materials.customShaderMaterial;

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