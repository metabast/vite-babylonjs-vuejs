import { Color3 } from "@babylonjs/core";
import MatcapEditor from "./matcapEditor";
import { World } from "./world";

class MatcapTweaks {

    constructor() {
        if (!MatcapTweaks.instance) MatcapTweaks.instance = this;
        else throw new Error("MatcapTweaks is a singleton. Use MatcapTweaks.getInstance()");
        this.tweakpane = World.getInstance().tweakpane;
    }

    addTweaks() {
        this.folder = this.tweakpane.addFolder({ title: "Material matcap" });
        this.params = {
            matcapId: "",
            matcapIndex: 0,
            matcapDesaturate: false,
            matcapBlur: 0,
            matcapBump: .6,
            matcapBrightness: 0,
            matcapContrast: 0,
            matcapEmissiveColor: Color3.Black().toHexString(),
            matcapReflectionColor: Color3.White().toHexString(),
        };

        this.folder.addInput(this.params, "matcapId", { label: "id" });

        this.folder.addInput(this.params, "matcapIndex", { label: "index", min: 0, max: MatcapEditor.matcapIds.length - 1, step: 1 })
            .on("change", (event) => {
                MatcapEditor.matcapIndex = event.value;
                MatcapEditor.getInstance().loadMatcap(MatcapEditor.getSrc());
            });

        this.folder.addButton({ label: "matcap >", title: "next" }).on("click", () => {
            MatcapEditor.nextMatcapTexture();
        });

        this.folder.addButton({ label: "matcap <", title: "prev" }).on("click", () => {
            MatcapEditor.prevMatcapTexture();
        });
        this.folder.addBlade({
            view: "list",
            label: "matcap resol",
            options: [
                { text: "64", value: 64 },
                { text: "128", value: 128 },
                { text: "256", value: 256 },
                { text: "512", value: 512 },
            ],
            value: 64,
        }).on("change", (event) => {
            MatcapEditor.updateMatcapSize(event.value);
        });

        this.folder.addInput(this.params, "matcapDesaturate", { label: "desaturate" }).on("change", (event) => {
            MatcapEditor.updateMatcapDesaturate(event.value);
        });
        this.folder.addInput(this.params, "matcapBump", { label: "bump" , min: 0, max: 10, step: .1}).on("change", (event) => {
            window.dispatchEvent(new CustomEvent("matcap:bump", { detail: event.value }));
        });

        this.folder.addInput(this.params, "matcapBlur", { label: "matcapBlur", min: 0, max: 180, step: 1 }).on("change", (event) => {
            if (event.last) {
                MatcapEditor.updateMatcapBlur(event.value);
            }
        });

        this.folder.addInput(this.params, "matcapBrightness", { label: "matcapBrightness", min: -100, max: 100, step: 1 }).on("change", (event) => {
            if (event.last) {
                MatcapEditor.updateMatcapBrightness(event.value);
            }
        });

        this.folder.addInput(this.params, "matcapContrast", { label: "matcapContrast", min: -100, max: 100, step: 1 }).on("change", (event) => {
            if (event.last) {
                MatcapEditor.updateMatcapContrast(event.value);
            }
        });

        this.folder.addInput(this.params, "matcapEmissiveColor", { label: "emissive" }).on("change", (event) => {
            // BoardMesh.matcapMaterial.emissiveColor = Color3.FromHexString(event.value);
            window.dispatchEvent(new CustomEvent("matcap:emissiveColor", { detail: event.value }));
        });

        this.folder.addInput(this.params, "matcapReflectionColor", { label: "reflection" }).on("change", (event) => {
            // BoardMesh.matcapMaterial.reflectionColor = Color3.FromHexString(event.value);
            window.dispatchEvent(new CustomEvent("matcap:reflectionColor", { detail: event.value }));
        });

        window.addEventListener('matcap:changed', this.onMatcapChanged.bind(this));

    }
        
    onMatcapChanged(event) {
        this.params.matcapIndex = MatcapEditor.matcapIndex;
        this.params.matcapId = MatcapEditor.matcapIds[MatcapEditor.matcapIndex];
        this.tweakpane.refresh();
    }

    static getInstance() {
        if (!MatcapTweaks.instance) {
            return new MatcapTweaks();
        }
        return MatcapTweaks.instance;
    }

}

export default MatcapTweaks;