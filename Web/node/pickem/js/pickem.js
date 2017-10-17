var cachedTables = [];

$(document).ready(function(){

	$("label").click(function(){
		$(this).children("img").addClass("checked");
		$(this).siblings("label").children("img").removeClass("checked");

	});
	tableLink = "week_1.html";
	getTable = function(callback){
		
		$.ajax({url:"/Pickem", data: {tableFile: tableLink}}).done(function(data){
			$("#TableSection").html(data);
			$("label").click(function(){
				$(this).children("img").addClass("checked");
				$(this).siblings("label").children("img").removeClass("checked");

			});
			if(callback)
				callback();
		});

	};
	getTable(updatePicks);
	$("#TableForm").submit(function(e){
		/*if($("#UserName").val() == "")
		  e.preventDefault();*/
		/*var outputSplit = replaceAll($(this).serialize(),"%20", " ").split("&");
		  var outputString = "";
		  for(var i=0; i<outputSplit.length; i++) {
		  var titleVal = outputSplit[i].split("=");
		  outputString += titleVal[0] + ": " + titleVal[1] + "\n";
		  }
		  $("#SelectionOutput").val(outputString);
		 */
	})

	$("#WeekSelect").change(function(){
		saveTable();
		tableLink = $("select option:selected").attr("tableHtml");
		if(cachedTables[tableLink])
			setTable();
		else {
			getTable(updatePicks);
		}
	});

});
function saveTable() {
	cachedTables[tableLink] = $("#TableSection").html();
}
function setTable() {
	$("#TableSection").html(cachedTables[tableLink]);
	$("label").click(function(){
		$(this).children("img").addClass("checked");
		$(this).siblings("label").children("img").removeClass("checked");

	});

}
function updatePicks() {

	var submitData = new Object();
	submitData.Week = $("option[tableHtml='" + tableLink + "']").val();
	$.ajax({
		url: "http://173.49.219.13:3656/GetRecentPicks/",
		type: "POST",
		data: submitData,
		accept: "json"
	}).done(function(picksData) {
		for(var key in picksData) {
			//alert(picksData[key].WinnerKey);
			var label = $("input[value='" + picksData[key].WinnerKey + "']").parents("label").click();
			$(label).children("img").addClass("checked");
			$(label).siblings("label").children("img").removeClass("checked");
		}
	});
}

function replaceAll(inString,replaceString,withString) {
	var outString = inString;
	while(outString.indexOf(replaceString) >= 0) {
		outString = outString.replace(replaceString, withString);
	}
	return outString;
}
