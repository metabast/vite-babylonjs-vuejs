precision highp float;

uniform mat4 worldView;

varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vColor;
varying vec2 vUv;
#include utils.glsl


void main(void) {
    // gl_FragColor = vColor;
    vec3 cl = vec3(invert(vUv.x));

    gl_FragColor = vec4(vColor, 1.);
}