/**
 * Created by xzper on 2014/11/15.
 */

module game {

    export class StartScreen extends eui.Component {

        private customFilter: egret.CustomFilter;

        public constructor() {
            super();
            this.skinName = "skin.startScreenSkin";
            //ApplicationFacade.getInstance().registerMediator(new StartScreenMediator(this));
            this.addEventListener(eui.UIEvent.ADDED, this.createCompleteEvent, this);

            let fragmentSrc = [
                "precision lowp float;\n" +
                "varying vec2 vTextureCoord;",
                "varying vec4 vColor;\n",
                "uniform sampler2D uSampler;",

                "uniform vec2 center;",
                "uniform vec3 params;", // 10.0, 0.8, 0.1"
                "uniform float time;",

                "void main()",
                "{",
                "vec2 uv = vTextureCoord.xy;",
                "vec2 texCoord = uv;",

                "float dist = distance(uv, center);",

                "if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )",
                "{",
                "float diff = (dist - time);",
                "float powDiff = 1.0 - pow(abs(diff*params.x), params.y);",

                "float diffTime = diff  * powDiff;",
                "vec2 diffUV = normalize(uv - center);",
                "texCoord = uv + (diffUV * diffTime);",
                "}",

                "gl_FragColor = texture2D(uSampler, texCoord);",
                "}"
            ].join("\n");

            let vertexSrc =
                "attribute vec2 aVertexPosition;\n" +
                "attribute vec2 aTextureCoord;\n" +
                "attribute vec2 aColor;\n" +

                "uniform vec2 projectionVector;\n" +

                "varying vec2 vTextureCoord;\n" +
                "varying vec4 vColor;\n" +

                "const vec2 center = vec2(-1.0, 1.0);\n" +

                "void main(void) {\n" +
                "   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n" +
                "   vTextureCoord = aTextureCoord;\n" +
                "   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n" +
                "}";

            this.customFilter = new egret.CustomFilter(vertexSrc, fragmentSrc, {
                center: { x: 0, y: 0 },
                params: { x: 10, y: 0.8, z: 0.1 },
                time: 0
            });
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.ADDED, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new StartScreenMediator(this));

            this.startBackground.filters = [this.customFilter];

            // this.addEventListener(egret.Event.ENTER_FRAME, this.onFilterRender, this);
            let dragonBone = DragonBones.createDragonBone("cloud_1", "armatureName");
            this.addChild(dragonBone);
            dragonBone.animation.play();

            let dragonBone2 = DragonBones.createDragonBone("threekingdoms2048", "monster_1001");
            this.addChild(dragonBone2);
            dragonBone2.x = 400;
            dragonBone2.y = 600;
            let names = dragonBone2.animation.animationNames;

            const playNextAnimation = (index) => {

                if (index >= names.length) {
                    index = 0;
                }

                let state = dragonBone2.animation.play(names[index], 1);

                let onComplete = () => {
                    dragonBone2.removeEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
                    playNextAnimation(++index);
                };
                dragonBone2.addEventListener(dragonBones.EventObject.COMPLETE, onComplete, this);
            }

            playNextAnimation(0);
        }

        public startBackground: eui.Image;
        public playButton: eui.Button;
        public settingButton: eui.Button;
        public levelButton: IconButton;

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        private onFilterRender() {
            this.customFilter.uniforms.time += 0.03;
            if (this.customFilter.uniforms.time > 1) {
                //this.startBackground.filters = [];
                //this.removeEventListener(egret.Event.ENTER_FRAME, eventHandler, this);
                this.customFilter.uniforms.time = 0.0;
            }
        }
    }
}