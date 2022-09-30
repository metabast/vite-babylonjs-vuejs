float invert(float st) {
    return 1.0 - st;
}

vec4 desaturate( in vec4 color ) {
    return vec4(vec3((color.r + color.g + color.b)/2.), color.a);
}