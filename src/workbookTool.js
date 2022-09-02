'use strict';

const Excel = require('exceljs');
const workbook = new Excel.Workbook();

const verbose = false;

function validate(rows, vMixCfg){
var numberBag = []
var shortTitleBag = []
var errorBag = []

var mismatch = false;

	for (var i = 0; i < vMixCfg.vmix.inputs[0].input.length; i++) {
		let row = vMixCfg.vmix.inputs[0].input[i].$;
		if (shortTitleBag[row.shortTitle]){
			errorBag[("Duplcate shortTitle",shortTitle,"in vMix")]="";
			mismatch=true;
		}
		numberBag["_"+row.number] = row.shortTitle;
		shortTitleBag[row.shortTitle] = row.number;
	}

	for (var i in rows) {
		var shortTitle = rows[i].shortTitle;
		var inputNumber = rows[i].inputNumber;

		if (inputNumber == "#N/A"){
			// we don't care about #N/A
		} else if (numberBag["_"+inputNumber] == null)  {
			errorBag[("1.Service Plan Uses an Input Number "+inputNumber+" that isn't defined in vMix")]="";
		}  
		else if (numberBag["_"+inputNumber] != shortTitle){
			errorBag[("2.Service Plan Uses an number/title "+inputNumber+"/'"+shortTitle+"' that doesn't match vMix "+inputNumber+"/'"+(numberBag["_"+inputNumber])+"'")]="";

			mismatch=true;	
		// } 	else if (!(shortTitleBag[numberBag[inputNumber].shortTitle]){
		// 	errorBag[("Service Plan uses an Input Number",inputNumber," with ShortTitle",shortTitle," that don't match vMix")]="";
		// 	mismatch=true;	
		} else if (shortTitleBag[shortTitle] == null){
			errorBag[("3.Service Plan Uses an Input Name",shortTitle,"that isn't in vMix")]="";
			mismatch=true;	
		} else if (shortTitleBag[shortTitle] != inputNumber){
			errorBag[("4.Service Plan Uses an number/title "+inputNumber+"/'"+shortTitle+"' that doesn't match vMix "+inputNumber+"/'"+(numberBag["_"+inputNumber])+"'")]="";
//			errorBag[("eService Plan uses an Input Number and Name (",inputNumber,shortTitle,") that don't match vMix");	]="";
			mismatch=true;	
		} else if (numberBag["_"+inputNumber] == null)  {
			errorBag[("5.Service Plan Uses an Input Number",inputNumber,"that isn't in vMix")]="";
		} else if (numberBag["_"+inputNumber] != shortTitle){
			errorBag[("6.Service Plan Uses an number/title "+inputNumber+"/'"+shortTitle+"' that doesn't match vMix "+inputNumber+"/'"+(numberBag["_"+inputNumber])+"'")]="";
//			errorBag[("gService Plan uses an Input Name and Number (",shortTitle,inputNumber,") that don't match vMix")]="";
			mismatch=true;	
		} 
	}

	console.log(Object.keys(errorBag).sort())
	return({"error":mismatch,"msg":(mismatch?"Mismatch warnings. See logs.":"OK")})
}

//--------------------------------------------------
async function loadWorkbook(workbookPath, vMixCfg, callback){
await workbook.xlsx.readFile(workbookPath);
let scenesSheet = workbook.getWorksheet('Sheet1'); //Scenes
var i = 1;
for (; i < 12; i++){
	try {
		var row = {}
		var r = scenesSheet.getRow(i)
	  var x = r.getCell("B").value.result; // expect this to fail until we get to paydirt
	  break;
	 } catch (e){} //i don't care until it finds a value
}

var firstRow = i;
var rows=[]
var rowCount = 0;
var inputNumberColumn = (process.env["VMIX_INPUTNUMBERCOLUMN"] || "B")
var shortTitleColumn   = (process.env["VMIX_SHORTTITLECOLUMN"] || "D")
var descriptionColumn = (process.env["VMIX_dESCRIPTIONCOLUMN"] || "E")
for (; i < 100; i++){
try {
	var row = {}
	var r = scenesSheet.getRow(i)
//    console.log("Row",i,r.getCell("B").value.result,r.getCell("D").value)
	row.rowNumber = i;
	row.inputNumber =r.getCell(inputNumberColumn).value;
	if ( row.inputNumber == null ) {continue;}
	if ( row.inputNumber == "#N/A" ) {continue;}
	row.inputNumber =r.getCell(inputNumberColumn).value.result;
	if ( row.inputNumber == "#N/A" ) {continue;}
	row.shortTitle =r.getCell(shortTitleColumn).value;
	row.isOverlay = false;
	if (row.shortTitle){
		row.isOverlay  = ((r.getCell(shortTitleColumn).value).toUpperCase().indexOf("OVERLAY"))>=0	
		row.isOverlay1 = ((r.getCell(shortTitleColumn).value).toUpperCase().indexOf("OVERLAY 1"))>=0	
		row.isOverlay2 = ((r.getCell(shortTitleColumn).value).toUpperCase().indexOf("OVERLAY 2"))>=0	
		row.isOverlay3 = ((r.getCell(shortTitleColumn).value).toUpperCase().indexOf("OVERLAY 3"))>=0	
		row.isOverlay4 = ((r.getCell(shortTitleColumn).value).toUpperCase().indexOf("OVERLAY 4"))>=0	
	}
	row.cameraNumber = NaN;
	if (row.shortTitle ){
		row.cameraNumber = parseInt(row.shortTitle.split(" ")[0])
	}
	row.desc =r.getCell(descriptionColumn).value;
	if ( row.desc == null )	row.desc = "";
  	row.description = row.inputNumber+" / "+row.shortTitle+" / "+row.desc

	rows[rowCount++] = row; 
// console.log(row)
// break;
 } catch (e){console.log("last row found at ",i);console.log(e);break}
   

}
callback(rows, validate(rows,vMixCfg));
}


// function tester(){
// var workbookPath = _dirname+"/../data/Plan.xlsx";
// validate(workbookPath, null, console.log)
// }

module.exports = {load:loadWorkbook}
