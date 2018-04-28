//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


class LoadingUI extends eui.Component implements RES.PromiseTaskReporter {

    private labelText: egret.TextField;
    private imageLoading1: egret.Bitmap;
    private imageLoading2: egret.Bitmap;
    private imageLoading3: egret.Bitmap;
    private imageLoading4: egret.Bitmap;

    private imageLoadings: Array<egret.Bitmap> = [];

    public constructor() {
        super();
        this.skinName = "skin.loadingUISkin";
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
    }

    public createCompleteEvent(event: eui.UIEvent): void {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        this.imageLoadings = [
            this.imageLoading1,
            this.imageLoading2,
            this.imageLoading3,
            this.imageLoading4,
        ];
        this.playEffect();
    }

    public playEffect(index: number = 0) {
        egret.Tween.get(this.imageLoadings[index]).to({ scaleX: 1.2, scaleY: 1.2 }, 150).call(() => {
            egret.Tween.get(this.imageLoadings[index]).to({ scaleX: 1, scaleY: 1 }).call(() => {
                this.playEffect(++index % 4);
            });
        });
    }

    // /**
    //  * 进度条
    //  */
    // public progressBar: eui.ProgressBar;

    // public setProgress(current: number, total: number): void {
    //     if (this.progressBar) {
    //         this.progressBar.maximum = total;
    //         this.progressBar.value = current;
    //     }
    // }

    public onProgress(current: number, total: number): void {
        this.labelText.text = `Loading...${current}/${total}`;
    }
}