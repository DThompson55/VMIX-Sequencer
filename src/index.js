const controller = require("./controller.js")
const { dialog, app, BrowserWindow, Menu, MenuItem, ipcMain } = require('electron');
const path = require('path');

const isMac = process.platform === 'darwin'

 console.log("VMIX_DELAY is",(process.env["VMIX_DELAY"] || "not set. Default 10"));
 console.log("VMIX_INPUTNUMBERCOLUMN is",(process.env["VMIX_INPUTNUMBERCOLUMN"] || "not set. Default B"));
 console.log("VMIX_SHORTTITLECOLUMN is",(process.env["VMIX_SHORTTITLECOLUMN"] || "not set. Default D"));
 console.log("VMIX_DESCRIPTIONCOLUMN is",(process.env["VMIX_DESCRIPTIONCOLUMN"] || "not set. Default E"));
 console.log("VMIX_ANNOTATIONCOLUMN is",(process.env["VMIX_ANNOTATIONCOLUMN"] || "not set. Default C"));

app.disableHardwareAcceleration()

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
//
// TODO create a flexible initialization file loader
//

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    alwaysOnTop: true,
    width: 400,
    height: 300,
    webPreferences:{
      preload: path.join(__dirname, 'preload.js'),
      devTools: false // This will disable dev tools
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index3.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-finish-load', ()=>{

function loadSceneFile(sceneFilePath, vMixCfg){
      controller.loadSceneFile(sceneFilePath, vMixCfg, (scenes, sceneFileValidation) => {
         if (sceneFileValidation.error){
            mainWindow.webContents.send('warning', "Warning: Scene file does not match vMix. See logs.")
         }
//       mainWindow.webContents.send('validation', sceneFileValidation)
         controller.setScenes(scenes);
         mainWindow.webContents.send('FILE_OPEN', sceneFilePath)
         mainWindow.setTitle("vMix Sequencer "+sceneFilePath)  
            
      })
}
    controller.connect((ctx)=>{
    
    mainWindow.webContents.send('VMIX_STATUS', ctx.vMixStatus);

//-------------------------------
const template = [
   {
      label: 'App',
      submenu: [         
           { label: "About...", click(){ 
            console.log("About Box");
              }} 
       ]},
     {
      label: 'File',
      submenu: [         
           { 

            accelerator: process.platform === 'darwin' ? 'Cmd+O' : 'Ctrl+O',
   
            label: "Open...", click(){            
             dialog.showOpenDialog({
                filters: [{ name: 'Service Scripts', extensions: ['xlsx'] }],
                properties: ['openFile']
              })
              .then(function(fileObj) {
                 // the fileObj has two props 
                 if (!fileObj.canceled) {
                     loadSceneFile(fileObj.filePaths[0], ctx.vMixCfg);
                 }
              })
  // should always handle the error yourself, later Electron release might crash if you don't 
              .catch(function(err) {
                 console.error(err)  
              })
         }},
         { label: "Exit", click(){
            app.quit();
         }}]
   }
]
   const menu = Menu.buildFromTemplate(template)
   Menu.setApplicationMenu(menu)
//-------------------------------





   })
 })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


ipcMain.on('initScenes', (event, arg) => {
   event.returnValue = controller.setFirstScene()
})
ipcMain.on('fwdBtnMsg', (event, arg) => {
   event.returnValue = controller.setNextScene()
})
ipcMain.on('backBtnMsg', (event, arg) => {
   event.returnValue = controller.setPreviousScene()
})
ipcMain.on('ffBtnMsg', (event, arg) => {
   event.returnValue = controller.setLastScene()
})
ipcMain.on('rewindBtnMsg', (event, arg) => {
   event.returnValue = controller.setFirstScene()
})
ipcMain.on('getStatus', (event, arg) => {
   event.returnValue = controller.getStatus()
})
ipcMain.on('getFileName', (event, arg) => {
   event.returnValue = controller.getFileName()
})
ipcMain.on('skipBtnMsg', (event, arg) => {
   event.returnValue = controller.skipNextScene()
})



