precision highp float;

uniform sampler2D textureSampler;
uniform sampler2D colorTexSampler;
uniform sampler2D specularSampler;

varying vec3 vColor;
varying vec2 vUvView;
varying vec3 vNormal;
varying vec2 vUv;

vec4 LinearToLinear( in vec4 value ) {
	return value;
}

void main(void) {
    vec4 specular = texture2D( specularSampler, vUv );
    vec4 matcapColor = texture2D( textureSampler, vUvView );

    float scaleUV = 2.;
    vec2 uvTex = vec2(  vUv.x * scaleUV , vUv.y * scaleUV );
    vec4 texColor = texture2D( colorTexSampler, uvTex );
    // matcapColor = LinearToLinear( matcapColor );

    vec3 matcapNb = vec3((matcapColor.r + matcapColor.g + matcapColor.b)/2.);
    // specular = vec4( 1. - specular.r, 1. - specular.g, 1. - specular.b, 1.);
    // matcapNb *= specular.rgb;

    gl_FragColor = vec4(matcapColor.rgb , 1.);
    // gl_FragColor = vec4(vColor * matcapNb * texColor.rgb , 1.);
}