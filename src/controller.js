const scnMgr = require('./sceneManager.js')
const vMix = require('./vMixHelper.js')

function connect(callback){ //{vMixCfg:result, vMixStatus:"Connected to vMix"}
console.log("CONNECTING...");
    vMix.connect(cfg=>{
        callback(cfg);
    })
}

function loadSceneFile(workbookPath, vMixCfg, callback){
        scnMgr.loadSceneFile(workbookPath, vMixCfg, callback);
    }

function setScenes(scenes){scnMgr.setScenes(scenes)}

function setFirstScene(){
 var scene = scnMgr.getFirstScene()
 try { sendScene(scene) }catch(c){console.log("Problem with first scene");console.log(c);return {}}
 return  scnMgr.getDisplayText();
}

function setLastScene(){
 var scene = scnMgr.getLastScene()
 try { sendScene(scene) }catch(c){return {}}
 return  scnMgr.getDisplayText();
}

function setNextScene(){
 var scene = scnMgr.getNextScene()
 try { sendScene(scene) }catch(c){return {}}
 return  scnMgr.getDisplayText();
}

function skipNextScene(){
 var scene = scnMgr.skipNextScene()
 try { sendScene(scene) }catch(c){console.log(c);return {}}
 return  scnMgr.getDisplayText();
}


function setPreviousScene(){
 var scene = scnMgr.getPreviousScene()
// console.log("Sending Previous Scene ---------------",scene)
 try { sendScene(scene) }catch(c){console.log("Error Sending Scene",c);return {}}
 return  scnMgr.getDisplayText();
}

async function sendScene(scene, i=0){  // yes, this is recursive, so keep that i=0
    // console.log("iteration",i)
    // console.log("sending scene",scene);
    // console.log("action",i,scene.actions[i])
    if ( i < scene.actions.length){
        var action = {...scene.actions[i]}; // a shallow copy of actions[i]

        if (scene.usesAllOneCamera){
            if (action.Function == "PreviewInput"){
//                console.log("Not Showing Preview",action)
//  This is a little strange, yet clever because when it 
//  returns it's just bumping the interation stack
//
//
                return;
            }
        } 
        if (scene.previewOnly){
            if (action.Function == "Fade"){
                action.Function = "CutDirect"
                action.Input = action.Ignore;

            }
        } 
        if (action.Function == "Overlay"){
            return; // at this point in time we are not sending overlays to VMIX
        }

        if (scene.wasSkippedTo){
            if (action.Function == "Fade"){
                action.Function = "CutDirect"
                action.Input = action.Ignore;

            }
        } 

        response = await vMix.send( action )
        sendScene(scene,++i)
    }
}

async function sendScenePreview(scene, i=0){  // yes, this is recursive, so keep that i=0
//    console.log("sending scene",i,scene.actions[i])
    if ( i < scene.actions.length){

        var action = scene.actions[i];
        if (scene.usesAllOneCamera){
            if (action.Function == "PreviewInput"){
                response = await vMix.send( action )
            }
        }
        sendScene(scene,++i)
    }
}

function getStatus(){
    return vMix.status;
}

module.exports = {connect:connect, sendScene: sendScene, setFirstScene: setFirstScene,
    setNextScene: setNextScene, skipNextScene: skipNextScene,  skipNextScene: skipNextScene, setLastScene: setLastScene, loadSceneFile:loadSceneFile, 
    setPreviousScene: setPreviousScene, setScenes:setScenes, getStatus: getStatus}
    
