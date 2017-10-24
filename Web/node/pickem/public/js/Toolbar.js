$(document).ready(function(){
	$.ajax({
		url: "/public/header.html",
		type:"GET"
	}).done(function(toolbar){
		$("#header-field").html(toolbar);
	})

})

function setActiveMenu(id) {
	resetActiveMenu();
	$("li[id='" + id +"']").addClass("active");
}

function resetActiveMenu() {
	$("li.active").removeClass("active");
}

async function updateActiveLink(id,ms) {
	await sleep(ms);
	setActiveMenu(id);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
