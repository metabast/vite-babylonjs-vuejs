precision highp float;

// Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 color;

// Uniforms
uniform mat4 worldViewProjection;
uniform mat4 worldView;
uniform mat4 view;
uniform mat4 world;

// Varying
varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vColor;
varying vec2 vUv;
varying vec2 vN;


void main() {
    vec4 p = vec4( position, 1. );

    vNormal = normal;
    vUv = uv;
    vColor = normal;

    gl_Position = worldViewProjection * p;
}