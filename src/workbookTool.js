const Excel = require('exceljs');
const workbook = new Excel.Workbook();

const verbose = false;



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
for (; i < 999; i++){
try {
	var row = {}
	var r = scenesSheet.getRow(i)
//    console.log("Row",i,r.getCell("B").value.result,r.getCell("D").value)
	row.rowNumber = i;
	row.inputNumber =r.getCell("B").value;
	if ( row.inputNumber == null ) continue;
	row.inputNumber =r.getCell("B").value.result;
	row.shortTitle =r.getCell("D").value;
	row.isOverlay = false;
	if (row.shortTitle){
		row.isOverlay  = ((r.getCell("D").value).toUpperCase().indexOf("OVERLAY"))>=0	
		row.isOverlay1 = ((r.getCell("D").value).toUpperCase().indexOf("OVERLAY 1"))>=0	
		row.isOverlay2 = ((r.getCell("D").value).toUpperCase().indexOf("OVERLAY 2"))>=0	
		row.isOverlay3 = ((r.getCell("D").value).toUpperCase().indexOf("OVERLAY 3"))>=0	
		row.isOverlay4 = ((r.getCell("D").value).toUpperCase().indexOf("OVERLAY 4"))>=0	
	}
	row.desc =r.getCell("E").value;
	if ( row.desc == null )	row.desc = "";
  	row.description = row.inputNumber+"/"+row.shortTitle+"/"+row.desc

	rows[rowCount++] = row; 
// console.log(row)
// break;
 } catch (e){console.log("last row found at ",i);console.log(e);break}

}
callback(null, rows);
}


// function tester(){
// var workbookPath = _dirname+"/../data/Plan.xlsx";
// validate(workbookPath, null, console.log)
// }

module.exports = {load:loadWorkbook}
