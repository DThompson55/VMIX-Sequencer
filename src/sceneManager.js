'use strict';
const loader = require('./sceneCompiler.js')

var scenes = [];

function setScenes(x){scenes = x; }

var currentScene = 0;

function getNextScene(){
if (currentScene < scenes.length-1) currentScene++;
return getScene(currentScene)
}

function skipNextScene(){
if (currentScene < scenes.length-2) currentScene+=2;
var scene = getScene(currentScene);
scene.wasSkippedTo = true;
return scene;
}

function getPreviousScene(){
if (currentScene > 0) currentScene--;
var previousScene = getScene(currentScene)
var scene =    {"number": "INITIAL", "actions":[] }
scene.description = previousScene.description;
scene.number = previousScene.number;

for (var i in previousScene.actions){
    var cmd =      {"Function": "blank", "Input": -1}; 
    cmd.Function = previousScene.actions[i].Function;
    cmd.Input = previousScene.actions[i].Input;
    if ( previousScene.actions[i].Function === "Fade"){
		cmd.Input = previousScene.actions[i].Ignore;
		cmd.Function = "CutDirect";	
    }
    scene.actions.push(cmd);
}

//console.log("built previous scene",scene);
return scene
}

function getFirstScene(){
currentScene = 0;
return getScene(currentScene)
}

function getLastScene(){
currentScene = (scenes.length == 0)?0:scenes.length-1;
return getScene(currentScene)
}


function getDisplayText(){
return {"currentSceneName":getScene(currentScene).description,
        "nextSceneName":getScene(currentScene+2).description,
        "previewSceneName":getScene(currentScene+1).description,        
        "overlaySceneName":getScene(currentScene).overlay,
        "isPreviewable":!(getScene(currentScene).usesAllOneCamera),
        "buttons":getButtons(currentScene),connectionStatus:""}
}

function getButtons(n){ // 1 = fwd, 2 = back, 4 = ff, 8 = rw, 16 = preview
	var retval = 0; 
	if (n == scenes.length) { 
		retval = 0xf } 
	else if (n == 0 ) { 
		retval = 0xa }
    else if ((n == scenes.length-1)) { 
    	retval = 0x5}

	if (getScene(n).usesAllOneCamera){
		retval = retval | 0x10
	}
	return retval;
}

function getScene(n){
	if (n < scenes.length){
		var s = scenes[n];
		s.wasSkippedTo = false;
		return s;
	}
	else
		return {"description": "No More Scenes", "actions":[], "wasSkippedTo":false, "usesAllOneCamera": false, "forceCut":false, "previewOnly":false  }
}

function loadSceneFile(workbookPath, vMixCfg, callback){ 
	loader.load(workbookPath, vMixCfg, callback);
}

module.exports = {getFirstScene: getFirstScene,getNextScene: getNextScene, 
	skipNextScene: skipNextScene,getPreviousScene: getPreviousScene,
	getLastScene: getLastScene,getDisplayText: getDisplayText,
	loadSceneFile: loadSceneFile, setScenes:setScenes}
