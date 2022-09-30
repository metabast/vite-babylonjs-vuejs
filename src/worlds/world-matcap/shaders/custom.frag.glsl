precision highp float;

uniform sampler2D matcapSampler;

varying vec3 vColor;
varying vec2 vUvView;
varying vec3 vNormal;
varying vec2 vUv;

void main(void) {
    vec4 matcapColor = texture2D( matcapSampler, vUvView );

    gl_FragColor = vec4(vec3(vUvView, 1.) , 1.);
}