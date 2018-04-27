
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/eui/eui.js",
	"libs/modules/assetsmanager/assetsmanager.js",
	"libs/modules/tween/tween.js",
	"libs/modules/game/game.js",
	"libs/modules/promise/promise.js",
	"libs/modules/dragonBones/dragonBones.js",
	"libs/modules/puremvc/puremvc.js",
	"bin-debug/model/common/Level.js",
	"bin-debug/ApplicationFacade.js",
	"bin-debug/AutoScreenAdapter.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	"bin-debug/ThemeAdapter.js",
	"bin-debug/app/AppConfig.js",
	"bin-debug/app/AppContainer.js",
	"bin-debug/app/IApp.js",
	"bin-debug/components/IconButton.js",
	"bin-debug/controller/ControllerPrepCommand.js",
	"bin-debug/controller/ModelPrepCommand.js",
	"bin-debug/controller/StartupCommand.js",
	"bin-debug/controller/ViewPrepCommand.js",
	"bin-debug/controller/commands/GameCommand.js",
	"bin-debug/controller/commands/SceneCommand.js",
	"bin-debug/model/GameProxy.js",
	"bin-debug/model/GridProxy.js",
	"bin-debug/model/common/CommonData.js",
	"bin-debug/model/common/constants.js",
	"bin-debug/AssetAdapter.js",
	"bin-debug/model/vos/TileVO.js",
	"bin-debug/utils/DragonBones.js",
	"bin-debug/utils/ObjectPool.js",
	"bin-debug/view/ApplicationMediator.js",
	"bin-debug/view/EndWindowMediator.js",
	"bin-debug/view/GameMenuMediator.js",
	"bin-debug/view/GameSceneMediator.js",
	"bin-debug/view/GameScreenMediator.js",
	"bin-debug/view/SettingWindowMediator.js",
	"bin-debug/view/StartScreenMediator.js",
	"bin-debug/view/panel/AboutWindow.js",
	"bin-debug/view/panel/EndWindow.js",
	"bin-debug/view/panel/GameMenuUI.js",
	"bin-debug/view/panel/GameScene.js",
	"bin-debug/view/panel/GameScreen.js",
	"bin-debug/view/panel/HowtoplayWindow.js",
	"bin-debug/view/panel/SettingWindow.js",
	"bin-debug/view/panel/StartScreen.js",
	"bin-debug/view/panel/TileUI.js",
	//----auto game_file_list end----
];

var window = {};

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 60,
		scaleMode: "fixedWidth",
		contentWidth: 1080,
		contentHeight: 2338,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:10",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};