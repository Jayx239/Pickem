package com.radio;

import java.util.Vector;

public class PickemEngine extends HtmlEngine {
    public PickemEngine() {

    }

    public Vector<NFLGame> getGames() {
        return games;
    }

    public void setGames(Vector<NFLGame> games) {
        this.games = games;
    }

    Vector<NFLGame> games;

    @Override
    public String CreateHead() {
        return CreateHead("\n" +
                "<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js\"></script>\n" +
                "                                                                                 <script>\n" +
                "                                                                                 $(document).ready(function(){\n" +
                "$(\"label\").click(function(){\n" +
                "    $(this).children(\"img\").addClass(\"checked\");\n" +
                "    $(this).siblings(\"label\").children(\"img\").removeClass(\"checked\");\n" +
                "\n" +
                "});\n" +
                "});\n" +
                "</script>\n" +
                "  <style>\n" +
                "  input[type='radio'] {\n" +
                "      display: none;\n" +
                "  }\n" +
                "label img.checked {\n" +
                "    border-style: inset;\n" +
                "    border-width: 2px;\n" +
                "    border-color: #47a0d1;\n" +
                "    background-color: #47a0d1;\n" +
                "}\n" +
                "\n" +
                "table, table thead, table tbody {\n" +
                "    border-style: groove;\n" +
                "    border-width: 2px;\n" +
                "    border-color: rgb(0, 73, 83);\n" +
                "    color: silver;\n" +
                "}\n" +
                "\n" +
                "tr {\n" +
                "    background-color: #004955;\n" +
                "\n" +
                "}\n" +
                "\n" +
                "td {\n" +
                "    text-align: center;\n" +
                "    min-width: 150px;\n" +
                "}\n" +
                "\n" +
                "input[type='submit'] {\n" +
                "    margin-top: 15px;\n" +
                "    margin-bottom; 100px;\n" +
                "    font-size: 24px;\n" +
                "    width: 100px;\n" +
                "    height: 180px;\n" +
                "\n" +
                "}\n" +
                "h1, h2 {\n" +
                "    text-align: center;\n" +
                "}\n" +
                "\n" +
                "html {\n" +
                "    background-image: -webkit-linear-gradient(left, #a8a8a8, #e8e8e8, #fff); /* For Chrome and Safari */\n" +
                "    background-image:    -moz-linear-gradient(left, #a8a8a8, #e8e8e8, #fff); /* For old Fx (3.6 to 15) */\n" +
                "    background-image:     -ms-linear-gradient(left, #a8a8a8, #e8e8e8, #fff); /* For pre-releases of IE 10*/\n" +
                "    background-image:      -o-linear-gradient(left, #a8a8a8, #e8e8e8, #fff); /* For old Opera (11.1 to 12.0) */\n" +
                "    background-image:         linear-gradient(to right, #a8a8a8, #e8e8e8, #fff); /* Standard syntax; must be last */\n" +
                "    color:transparent;\n" +
                "    -webkit-background-clip: text;\n" +
                "    background-clip: text;\n" +
                "}\n" +
                "\n" +
                "table, input[type='submit']{\n" +
                "    margin-left: 25%;\n" +
                "    margin-right: 25%\n" +
                "}\n" +
                "\n" +
                "h1, h2 {\n" +
                "    color: #000000;\n" +
                "}\n" +
                "\n" +
                "</style>\n" +
                "  <title>Pickem! 2017</title>");
    }
    public String CreateHead(String headerContent){
        String headString = "<head>";
        headString += headerContent;
        headString +="</head>";
        return headString;
    }

    @Override
    public String CreateBody() {
        String bodyString = "<body>";
        // --------------- Title section TODO: implement ----------
        bodyString += "\n" +
                "    <h1>Pickem 2017</h1>\n" +
                "    <h2>Week " + games.firstElement().getWeek() +"</h2>";
        // --------------- End title ------------------------------
        bodyString +="<form>";
        bodyString += createPickemTable();
        bodyString += "<input type='submit'/>";
        bodyString +="</form>";
        bodyString+= "</body>";
        return bodyString;
    }

    public String createPickemTable() {
        String tableString = "<table>";
        tableString += "<thead><tr><th>Home Team</th><th>Away Team</th><th>Pick'em</th></tr></thead>\n";
        tableString += "<tbody>";
        for(NFLGame game : games)
            tableString+= createPickemTableRow(game);

        tableString += "</tbody></table>";
        return tableString;
    }

    private String createPickemTableRow(NFLGame game) {
        String rowString = "<tr>";

        ESPNTeam teamOne = game.getTeamOne();

        ESPNTeam teamTwo = game.getTeamTwo();


        rowString += "<td>";
        rowString+=teamOne.getName();
        rowString += "</td>";
        rowString += "<td>";
        rowString+= teamTwo.getName();
        rowString += "</td>";
        rowString += "<td><label><input type='radio' value='" + teamOne.getName() + "' name='" + teamOne.getName() + "-" + teamTwo.getName() + "'>" + teamOne.getImageSource() + "</input></label><label><input type='radio' value='" + teamTwo.getName() + "' name='" + teamOne.getName() + "-" + teamTwo.getName() + "'>" + teamTwo.getImageSource() + "</input></label></td>";

        rowString+="</tr>";
        return rowString;
    }


}
