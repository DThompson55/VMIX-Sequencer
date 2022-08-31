'use strict';
const workbookTool = require('./workbookTool.js');

var sceneTemplate =    {"number": "INITIAL", "actions":[] }
var cmdTemplate =      {"Function": "blank", "Input": -1}; // these have to be uppercase for vMix

var scenes = [];
var sceneNumber = 1;

function buildScenes(rows, callback){
    for (var i = 0 ; i < rows.length; i++){
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
        addToScene(scene,"Preview",row)  
    }   
    callback(null,scenes);
}

function newScene(){
    let scene = Object.assign({}, sceneTemplate); // new scene
    scene.number=sceneNumber++;
//    if (scene.overlay) delete scene.overlay;
//    scene.description="blank";
    scene.actions = [];
    scenes.push(scene);
    return scene;
}

function addToScene(scene, action, row){
//    console.log("Adding ",action, row,"to",scene)
    let cmd = Object.assign({}, cmdTemplate); // new scene

    if (action === "Overlay"){
        scene.overlay = row.description;
    }
    if (action === "Preview"){
        action = "PreviewInput";
    }
    cmd.Function = action;
    cmd.Input = row.inputNumber;
    if (action === "Fade"){
        delete cmd.Input;
        cmd.Duration = 1000;
    }
    if (!scene.description)
        scene.description = row.description;

    scene.actions.push(cmd);
}

async function load(workbookPath, vMixCfg, callback){
try{
  await workbookTool.load(workbookPath, vMixCfg, (err, rows)=>{
  buildScenes(rows, (err,scenes) =>{
    callback(null,scenes,"")
  })
})
}catch(err){console.log(err.message);}
} 



module.exports = {load: load}
