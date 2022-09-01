const electron = require('electron')
const ipc = electron.ipcRenderer;


window.addEventListener('DOMContentLoaded', () => {
  var buttonMask = 0;

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }

  ipc.on('VMIX_STATUS', (event, message) => {
   document.querySelector('#vmix-status').innerHTML = message;
  })

  ipc.on('validation', (event, message) => {
   document.querySelector('#validation').innerHTML = message;
  })

   const reply = ipc.sendSync('initScenes')
   setDescriptions(reply)
   document.querySelector('#vmix-status').innerHTML = "Waiting for vMix connection...";
 

   ipc.on('FILE_OPEN', (event, message) => {
      document.querySelector('#title').style='display:none';    
      document.querySelector('#initialize').style='display:none';    
      document.querySelector('#ready').style.display = "inline";
      document.querySelector('#buttons').style.display = "flex";
      const reply = ipc.sendSync('rewindBtnMsg');
      setDescriptions(reply)

    })

  function setDescriptions(reply){
    document.querySelector('#current-scene').innerHTML = reply.currentSceneName;
    document.querySelector('#preview-scene').innerHTML = reply.previewSceneName;
    document.querySelector('#next-scene').innerHTML = reply.nextSceneName;
    if (reply.isPreviewable){
      document.querySelector('#preview-scene').style.textDecoration = "";
    } else {
      document.querySelector('#preview-scene').style.textDecoration = "line-through";
    }
    if (reply.overlaySceneName) {
      document.querySelector('#overlay-scene').style.display = "inline"
      document.querySelector('#overlay-scene').innerHTML = reply.overlaySceneName;
     } else {
      document.querySelector('#overlay-scene').innerHTML = "No overlay";
     }

   buttonMask = reply.buttons;
   try {updateButtons(buttonMask)} catch(e){}
}

  const backBtn = document.querySelector('#backBtn')
  const fwdBtn = document.querySelector('#fwdBtn')
  const skipBtn = document.querySelector('#skipBtn')

function updateButtons(buttonMask){
   var image_id = fwdBtn; image_id.src = ((((buttonMask&1)==0))?"images/fwdBtn.png":    "images/fwdBtn_Disabled.png")         ;
   image_id = backBtn;    image_id.src = ((((buttonMask&2)==0))?"images/backBtn.png":   "images/backBtn_Disabled.png")        ;


   image_id = fwdBtn;     image_id.style.pointerEvents = ((((buttonMask&1)==0))?"auto" :"none"); 
   image_id = backBtn;    image_id.style.pointerEvents = ((((buttonMask&2)==0))?"auto" :"none"); 


}  

  fwdBtn.addEventListener   ('click', () => {const reply = ipc.sendSync('fwdBtnMsg');    setDescriptions(reply); })
  backBtn.addEventListener  ('click', () => {const reply = ipc.sendSync('backBtnMsg');   setDescriptions(reply); })
  skipBtn.addEventListener  ('click', () => {const reply = ipc.sendSync('skipBtnMsg');   setDescriptions(reply); })



  fwdBtn.addEventListener   ('mousedown', () => { var image_id = fwdBtn;     image_id.src = ((((buttonMask&1)==0))?"images/fwdBtn_Gray.png":   "images/fwdBtn_Disabled.png")    })
  fwdBtn.addEventListener   ('mouseup', () => {   var image_id = fwdBtn;     image_id.src = ((((buttonMask&1)==0))?"images/fwdBtn.png":        "images/fwdBtn_Disabled.png")    })
  backBtn.addEventListener  ('mousedown', () => { var image_id = backBtn;    image_id.src = ((((buttonMask&2)==0))?"images/backBtn_Gray.png":  "images/backBtn_Disabled.png")   })
  backBtn.addEventListener  ('mouseup', () => {   var image_id = backBtn;    image_id.src = ((((buttonMask&2)==0))?"images/backBtn.png":       "images/backBtn_Disabled.png")   })





})

