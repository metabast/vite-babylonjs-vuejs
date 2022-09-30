import {
    Color3,
    Effect,
    ShaderMaterial,
    Texture,
    Vector3,
} from '@babylonjs/core';

import MatcapEditor from './matcapEditor';
import MatcapPBRCustomMaterial from './MatcapPBRCustomMaterial';

import customFragmentShader from './shaders/custom.frag.glsl';
import customVertexShader from './shaders/custom.vertex.glsl';

import matcapFragmentShader from './shaders/matcap.frag.glsl';
import matcapVertexShader from './shaders/matcap.vertex.glsl';

const data = {
    customMaterial: null,
    matcapShaderMaterial: null,
    matcapPBRCustomMaterial: null,
    matcapTexture: null,
    matcapBlurTexture: null,
};

function initShadersStore(scene) {
    Effect.ShadersStore.customFragmentShader = customFragmentShader;
    Effect.ShadersStore.customVertexShader = customVertexShader;

    Effect.ShadersStore.matcapFragmentShader = matcapFragmentShader;
    Effect.ShadersStore.matcapVertexShader = matcapVertexShader;

    console.log(Effect.ShadersStore);
    console.log(Effect.IncludesShadersStore);
}

function initTextures() {
    data.matcapTexture = new Texture('./matcap-D54C2B_5F1105_F39382_F08375-128px.png');
    data.matcapTexture.coordinatesMode = Texture.SPHERICAL_MODE;
    data.matcapBlurTexture = new Texture('./matcap-D54C2B_5F1105_F39382_F08375-128px-blur.png');
    data.checkerTexture = new Texture('./checker.png');
}

function initCustomShaderMaterial(scene) {
    data.customShaderMaterial = new ShaderMaterial(
        'shader',
        scene, {
            vertex: 'matcap',
            fragment: 'custom',
        }, {
            uniforms: ['worldView', 'worldViewProjection'],
            samplers: ['matcapSampler', 'colorTexSampler'],
        },
    );
    data.customShaderMaterial.setTexture('matcapSampler', data.matcapTexture);
}

function initMatcapShaderMaterial(scene) {
    const defines = [];
    defines.push('ADDCOLOR');
    defines.push('MATCAP_DESATURATE');
    data.matcapShaderMaterial = new ShaderMaterial(
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
    data.matcapShaderMaterial.setTexture('matcapSampler', data.matcapTexture);
    data.matcapShaderMaterial.setTexture('matcapBlurSampler', data.matcapBlurTexture);
    data.matcapShaderMaterial.setTexture('checkerSampler', data.checkerTexture);
    data.matcapShaderMaterial.setVector3('uColor', new Vector3(1., 1., 1.));
}

function initMatcapPBRCustomMaterial(scene) {
    data.matcapPBRCustomMaterial = new MatcapPBRCustomMaterial("pbrCustom", scene);
    data.matcapPBRCustomMaterial.bumpTexture = new Texture("./Substance_graph_normal.png", scene);
    data.matcapPBRCustomMaterial.bumpTexture.uScale = data.matcapPBRCustomMaterial.bumpTexture.vScale = 4;
    data.matcapPBRCustomMaterial.bumpTexture.level = .6;
    data.matcapPBRCustomMaterial.reflectionTexture = MatcapEditor.getMatcapTexture();
    data.matcapPBRCustomMaterial.emissiveColor = Color3.Black();
    data.matcapPBRCustomMaterial.reflectionColor = Color3.White();
}

const Materials = {
    get customShaderMaterial() {
        return data.customShaderMaterial;
    },
    get matcapShaderMaterial() {
        return data.matcapShaderMaterial;
    },

    get matcapPBRCustomMaterial() {
        return data.matcapPBRCustomMaterial;
    },

    initialize: function (scene) {

        initShadersStore(scene);

        initTextures();

        initCustomShaderMaterial(scene);

        initMatcapShaderMaterial(scene);

        initMatcapPBRCustomMaterial(scene);

        window.addEventListener('matcap:bump', (event) => {
            data.matcapPBRCustomMaterial.bumpTexture.level = event.detail;
        });

        window.addEventListener('matcap:emissiveColor', (event) => {
            data.matcapPBRCustomMaterial.emissiveColor = Color3.FromHexString(event.detail);
        });

        window.addEventListener('matcap:reflectionColor', (event) => {
            data.matcapPBRCustomMaterial.reflectionColor = Color3.FromHexString(event.detail);
        });

    },
};
export default Materials;