import { Effect, PBRMaterial } from "@babylonjs/core";
import { PBRCustomMaterial } from "@babylonjs/materials";

class CustomPBRMat extends PBRCustomMaterial {
    constructor(name, scene) {
        super(name, scene);

        this.VertexShader = Effect.ShadersStore["pbrVertexShader"];
        this.FragmentShader = Effect.ShadersStore["pbrPixelShader"];

        this.FragmentShader = this.FragmentShader.replace(
            '#include<reflectionFunction>',
            `
            vec3 computeMatcapCoords(vec4 worldPos, vec3 worldNormal, mat4 view, mat4 reflectionMatrix)
            {
                vec3 normalView = normalize( mat3(view) * worldNormal );
                vec4 vPositionView = view * worldPos;

                vec3 viewDir = normalize( vPositionView.xyz );
                vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
                vec3 y = cross( viewDir, -x );
                return vec3( dot( x, normalView ), dot( y, normalView ), 0. ) * 0.495 + 0.5;

            }

            #ifdef REFLECTION
            vec3 computeReflectionCoords(vec4 worldPos, vec3 worldNormal)
            {
            #ifdef REFLECTIONMAP_SPHERICAL
                // return computeSphericalCoords(worldPos, worldNormal, view, reflectionMatrix);
                return computeMatcapCoords(worldPos, worldNormal, view, reflectionMatrix);
            #endif

            #ifdef REFLECTIONMAP_MATCAP
                return computeMatcapCoords(worldPos, worldNormal, view, reflectionMatrix);
            #endif

            }
            #endif
            `
        );
        // console.log(this.FragmentShader);
        // console.log(this.VertexShader);
        return this;
    }
}

export default CustomPBRMat;