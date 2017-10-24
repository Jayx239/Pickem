function formatJson(jsonString) {
	    var output = "";
	    var nestLevel = 0;
	    for(var i=0; i<jsonString.length; i++) {
		            
		            if(jsonString[i] === "{") {
				            output+= "{\n"
				            nestLevel++;
				    	    output+= genPadding(nestLevel)
				            }
		            else if(jsonString[i] === "}") {
				                nestLevel--;
				                output+="}\n" + genPadding(nestLevel);
				            }
		            else if(jsonString[i] === ",") {
				                output+=",\n" + genPadding(nestLevel);
				            }
		  	    else{
				output += jsonString[i];
			    }
		        }
	    
	    return output;
}

function genPadding(level) {
	    var padding = ""
	    for(var i=0; i<level; i++) {
		            padding += "  ";
		        }
	    return padding
}
