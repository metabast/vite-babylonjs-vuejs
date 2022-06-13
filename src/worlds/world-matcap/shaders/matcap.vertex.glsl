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
varying vec4 vPositionView;
varying vec3 vNormal;
varying vec3 vColor;
varying vec2 vUvView;
varying vec2 vUv;


void main() {
    vec4 p = vec4( position, 1. );
    
    vec3 normalView = normalize( mat3(worldView) * normal );
    vPositionView = worldView * p;

    vec3 viewDir = normalize( vPositionView.xyz );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vUvView = vec2( dot( x, normalView ), dot( y, normalView ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks

    vNormal = normal;
    vColor = vec3(2.,2.,2.);

    gl_Position = worldViewProjection * p;
    vUv = uv;
}