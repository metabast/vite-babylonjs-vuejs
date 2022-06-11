precision highp float;

uniform mat4 world;
uniform mat4 worldView;
uniform mat4 worldViewProjection;
uniform mat4 view;
uniform mat4 projection;
uniform mat3 normalMatrix;
uniform sampler2D textureSampler;

varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vColor;
varying vec2 vUv;
varying vec2 vN;

#include ../../../shaders/utils.glsl

void main(void) {

    vec4 matcapColor = texture2D( textureSampler, -vN );
    vec4 diffuseColor = vec4( 1.0, 1.0, 1.0, 1.0 );

    gl_FragColor = vec4(matcapColor.rgb, 1.);
}