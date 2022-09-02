'use strict';
const workbookTool = require('./workbookTool.js');

var sceneTemplate =    {"number": 0, "description":"", "actions":[], "wasSkippedTo":false, "usesAllOneCamera": false, "forceCut":false, "previewOnly":false  }
var cmdTemplate =      {"Function": "blank", "Input": -1}; // these have to be uppercase for vMix

var scenes = [];
var sceneNumber = 1;


function buildScenes(rows){

    var i = 0;
    var row = rows[i];
    let scene = newScene(); 
    addToScene(scene,"PreviewInput",row)  ;
    scene.description = ""
    i++;

    for (; i < rows.length; i++){
        var row = rows[i];
        var prevRow = row;
        if (i > 0 ) prevRow = rows[i-1];
        let scene = newScene(); 
        addToScene(scene,"Fade",prevRow)  
        if (row.isOverlay){
//            console.log("Added Overlay ",row)
            addToScene(scene,"Overlay",row)    
            i++;
            row = rows[i];
        }
        addToScene(scene,"PreviewInput",row) 
        if (row.cameraNumber == prevRow.cameraNumber){
            scene.usesAllOneCamera = true;
        }
    }   

    for (i = 1; i < scenes.length; i++){
        if (scenes[i-1].usesAllOneCamera){
            scenes[i].previewOnly = true;
        }
        if (scenes[i-1].previewOnly){
            scenes[i].forceCut = true;
        }
    }   

    return scenes;
}


function newScene(){
    let scene = Object.assign({}, sceneTemplate); // new scene
    scene.number=sceneNumber++;
//    if (scene.overlay) delete scene.overlay;
//    scene.description="blank";
    scene.actions = [];
    scene.undoActions = [];
    scenes.push(scene);
    return scene;
}

function addToScene(scene, action, row){
//    console.log("Adding ",action, row,"to",scene)
    let cmd = Object.assign({}, cmdTemplate); // new commmand within a scene

    if (action === "Overlay"){
        scene.overlay = row.description;
    }
    cmd.Function = action;
    cmd.Input = row.inputNumber;
    cmd.Ignore = row.inputNumber;
    if (action === "Fade"){
        delete cmd.Input;
        cmd.Duration = (process.env["VMIX_FADE"] || 500);
    }
    if (!scene.description)
        scene.description = row.description;

    scene.actions.push(cmd);
}

async function load(workbookPath, vMixCfg, callback){
try{
    await workbookTool.load(workbookPath, vMixCfg, (rows, warnings)=>{
    var scenes = buildScenes(rows);
    callback(scenes,warnings)
})
}catch(PreviewInput){console.log(PreviewInput.message);}
} 



module.exports = {load: load}
