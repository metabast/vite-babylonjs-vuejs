precision highp float;

uniform sampler2D matcapSampler;
uniform sampler2D matcapBlurSampler;
uniform sampler2D colorTexSampler;
uniform sampler2D colorTex2Sampler;
uniform sampler2D specularSampler;
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

// #include ../../../shaders/blur.glsl

vec4 desaturate( in vec4 color ) {
    return vec4(vec3((color.r + color.g + color.b)/2.), color.a);
}


void main(void) {
    vec4 specular = texture2D( specularSampler, vUv );

    vec4 matcapColor = texture2D( matcapSampler, vUvView );

    vec4 matcapBlurColor = texture2D( matcapBlurSampler, vUvView );

    float scaleUV = 4.;
    vec2 uvTex = vec2(  vUv.x * scaleUV , vUv.y * scaleUV );
    vec4 texColor = texture2D( colorTexSampler, uvTex );

    scaleUV = 4.;
    uvTex = vec2(  vUv.x * scaleUV , vUv.y * scaleUV );
    vec4 texColor2 = texture2D( colorTex2Sampler, uvTex );

    #ifdef MATCAP_DESATURATE
        matcapColor = desaturate(matcapColor);
        // matcapBlurColor = desaturate(matcapBlurColor);
    #endif
    // specular = vec4( 1. - specular.r, 1. - specular.g, 1. - specular.b, 1.);
    // matcapNb *= specular.rgb;

    scaleUV = 1.;
    uvTex = vec2(  vUv.x * scaleUV , vUv.y * scaleUV );
    vec4 checker = texture2D( checkerSampler, uvTex );
    vec4 invertChercker = vec4( 1. - checker.r, 1. - checker.g, 1. - checker.b, 1. );

    vec4 r1 = matcapColor * checker;
    vec4 r2 = matcapBlurColor * invertChercker;
    
    matcapColor = r1 + r2;

    #ifdef ADDCOLOR
        matcapColor *= vec4(uColor, 1.);
    #endif

    // texColor *= checker;
    // texColor2 *= invertChercker;

    // matcapColor *= checker;
    // matcapColor *= texColor;
    
    // matcapColor = blur2(matcapSampler, vUvView);
    // matcapColor = matcapBlurColor;

    gl_FragColor = vec4(matcapColor.rgb , 1.);
}