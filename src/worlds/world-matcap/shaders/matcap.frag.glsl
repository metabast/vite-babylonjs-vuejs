precision highp float;

uniform sampler2D matcapSampler;
uniform sampler2D matcapBlurSampler;
uniform sampler2D colorTexSampler;
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

void main(void) {
    vec4 specular = texture2D( specularSampler, vUv );

    vec4 matcapColor = texture2D( matcapSampler, vUvView );
    vec4 matcapFinal = matcapColor * specular;
    vec4 matcapBlurColor = texture2D( matcapBlurSampler, vUvView );

    float scaleUV = 2.;
    vec2 uvTex = vec2(  vUv.x * scaleUV , vUv.y * scaleUV );
    vec4 texColor = texture2D( colorTexSampler, uvTex );
    // matcapColor = LinearToLinear( matcapColor );

    #ifdef MATCAP_DESATURATE
        matcapColor = vec4(vec3((matcapColor.r + matcapColor.g + matcapColor.b)/2.), matcapColor.a);
        matcapBlurColor = vec4(vec3((matcapBlurColor.r + matcapBlurColor.g + matcapBlurColor.b)/2.), matcapBlurColor.a);
    #endif
    // specular = vec4( 1. - specular.r, 1. - specular.g, 1. - specular.b, 1.);
    // matcapNb *= specular.rgb;

    vec4 checker = texture2D( checkerSampler, vUv );
    vec4 invertChercker = vec4( 1. - checker.r, 1. - checker.g, 1. - checker.b, 1. );

    vec4 r1 = matcapColor * checker;
    vec4 r2 = matcapBlurColor * invertChercker;
    vec4 r3 = r1 + r2;

    #ifdef ADDCOLOR
        r3 *= vec4(uColor, 1.);
    #endif

    gl_FragColor = vec4(matcapFinal.rgb , 1.);
    // gl_FragColor = vec4(vColor * r3.rgb  , 1.);
    // gl_FragColor = vec4(checkerSampler , 1.);
}