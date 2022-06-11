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
    
    vec3 e = normalize( vec3( worldView * -p ) );
    vec3 n = normalize( mat3(worldView) * normal );

    vec3 r = reflect( e, n );
    float m = 2. * sqrt(
        pow( r.x, 2. ) +
        pow( r.y, 2. ) +
        pow( r.z + 1., 2. )
    );
    vN = r.xy / m + .5;

    vNormal = normal;
    vColor = color;
    vUv = uv;

    gl_Position = worldViewProjection * p;
}