precision highp float;

uniform sampler2D textureSampler;

varying vec3 vColor;
varying vec2 vUvView;

vec4 LinearToLinear( in vec4 value ) {
	return value;
}

void main(void) {
    vec4 matcapColor = texture2D( textureSampler, vUvView );
    // matcapColor = LinearToLinear( matcapColor );

    gl_FragColor = vec4(vColor * matcapColor.rgb, 1.);
}