precision highp float;

uniform sampler2D matcapSampler;
uniform sampler2D matcapBlurSampler;
uniform sampler2D checkerSampler;

#ifdef ADDCOLOR
    uniform vec3 uColor;
#endif

varying vec3 vColor;
varying vec2 vUvView;
varying vec3 vNormal;
varying vec2 vUv;

vec4 LinearToLinear( in vec4 value ) {
	return value;
}

#include ../../../shaders/blur.glsl
#include ../../../shaders/utils.glsl



#include<bumpFragmentMainFunctions>
#include<bumpFragmentFunctions>

void main(void) {
    vec4 matcapColor = texture2D( matcapSampler, vUvView );

    vec4 matcapBlurColor = texture2D( matcapBlurSampler, vUvView );

    #ifdef MATCAP_DESATURATE
        matcapColor = desaturate(matcapColor);
        // matcapBlurColor = desaturate(matcapBlurColor);
    #endif

    float scaleUV = 1.;
    vec2 uvTex = vec2(  vUv.x * scaleUV , vUv.y * scaleUV );
    vec4 checker = texture2D( checkerSampler, uvTex );
    vec4 invertChercker = vec4( 1. - checker.r, 1. - checker.g, 1. - checker.b, 1. );

    vec4 r1 = matcapColor * checker;
    vec4 r2 = matcapBlurColor * invertChercker;
    
    matcapColor = r1 + r2;

    #ifdef ADDCOLOR
        matcapColor *= vec4(uColor, 1.);
    #endif

    gl_FragColor = vec4(matcapColor.rgb , 1.);
}