package com.radio;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;

import java.io.IOException;
import java.util.List;
import java.util.Vector;

public class GoogleScraper {
    public GoogleScraper() {

    }}
    /*int NumTeams = 32;
    int TeamDataRowIndex = 1;
    int TeamCityIndex = 1;
    public Vector<NFLGame> scrapeGames2(int week) throws IOException {
        Connection connection = Jsoup.connect("https://www.google.com/search?q=nfl+schedule&oq=nfl+schedule");
        Document doc = connection.get();
        Parser webParser = Parser.htmlParser();
        Vector<NFLGame> games = new Vector<NFLGame>();

        for(int gameIndex=1; gameIndex<(NumTeams/2) - 1; gameIndex++) {
            /*System.out.println("------------------------------One----------------------------------------- ");
            System.out.println(doc.getElementsByAttribute("data-index").get(week).select("table").text());

            System.out.println("------------------------------Two----------------------------------------- ");
            System.out.println(doc.getElementsByAttribute("data-index").get(week).select("table").get(0).select("tbody").get(0).select("table").get(0).html());
            System.out.println("------------------------------Three----------------------------------------- ");

            System.out.println(doc.getElementsByAttribute("data-index").get(week).select("table").get(gameIndex));
            *//*Element gameData = doc.getElementsByAttribute("data-index").get(week).select("table").get(gameIndex).select("tbody").get(0);
            Team[] teams = new Team[2];
            for(int teamIndex=0; teamIndex<2; teamIndex++) {

                Element AllTeamData = gameData.select("table").size() > teamIndex ? gameData.select("table").get(teamIndex) : null;
                if(AllTeamData == null)
                    break;

                Element TeamData = AllTeamData.select("td").get(TeamDataRowIndex);
                List<Element> dataDivs = TeamData.select("div");
                if(dataDivs.size() == 0) {
                    TeamData = AllTeamData.select("td").get(0);
                    dataDivs = TeamData.select("div");
                }
                Location location = new Location(dataDivs.get(0).text());
                List<Element> teamNameRecord = dataDivs.get(1).select("div");

                String teamName = teamNameRecord.get(0).text();
                String recordString = teamNameRecord.get(1).text();
                Record record = new Record(recordString);
                teams[teamIndex] = new Team(teamName,location,record);
                System.out.println(teams[teamIndex].toString());
            }
            if(teams[0] != null && teams[1] != null) {
                NFLGame nextGame = new NFLGame(teams[0], teams[1], week);
                games.add(nextGame);
                System.out.println(nextGame.toString());
            }
        }

        return games;
    }

    public Vector<NFLGame> scrapeGames(int week) throws IOException {
        Connection connection = Jsoup.connect("https://www.google.com/search?q=nfl+schedule&oq=nfl+schedule");
        Document doc = connection.get();
        Parser webParser = Parser.htmlParser();
        Vector<NFLGame> games = new Vector<NFLGame>();
        //printElements(doc.getElementsByAttribute("data-index").get(2).select("table > tbody > tr > td > table"));
        System.out.println(doc.getElementsByAttribute("data-index").get(2).select("table > tbody").get(3).html());
        for(int gameIndex=0; gameIndex<(NumTeams/2) - 1; gameIndex++) {
            //System.out.println("------------------------------One----------------------------------------- ");
            //System.out.println(doc.getElementsByAttribute("data-index").get(week).select("tr").get(0).select("tr").get(gameIndex + 3).html());
            //System.out.println("------------------------------Two----------------------------------------- ");
            //System.out.println(doc.getElementsByAttribute("data-index").get(week).select("table").get(0).select("tbody").get(0).select("table").get(0).html());
            //System.out.println("------------------------------Three----------------------------------------- ");

            //System.out.println(doc.getElementsByAttribute("data-index").get(week).select("table").get(0).select("tr").get(3).select("table").get(0));
            Element gameData = doc.getElementsByAttribute("data-index").get(2).select("table > tbody > tr > td > table ").get(gameIndex);
            Team[] teams = new Team[2];
            for(int teamIndex=0; teamIndex<2; teamIndex++) {

                List<Element> TeamData = gameData.select("div > table > tbody > tr").get(teamIndex).select("td > div");
                int index = 0;
                for(Element elem : gameData.select("tr").get(2).select("tbody")) {
                //    System.out.println(index++ + ": " + elem.html());
                }

                Location location = new Location(TeamData.get(0).text());
                List<Element> teamNameRecord = TeamData.get(1).select("div > div");
                if( teamNameRecord.size() == 0)
                    teamNameRecord = TeamData.get(1).select("div");
                String teamName = teamNameRecord.get(0).text();
                String recordString = "";
                if(teamNameRecord.size() > 1)
                    recordString = teamNameRecord.get(1).text();
                Record record = new Record(recordString);
                teams[teamIndex] = new Team(teamName,location,record);
                System.out.println(teams[teamIndex].toString());
            }
            if(teams[0] != null && teams[1] != null) {
                NFLGame nextGame = new NFLGame(teams[0], teams[1], week);
                games.add(nextGame);
                //System.out.println(nextGame.toString());
            }
        }

        return games;
    }

    void printElements(List<Element> elements) {
        int index = 0;
        for(Element elem : elements) {
            System.out.println("-------------- Element " + index++ + "------------------------------------");
            System.out.println(elem.html());
        }

    }
}*/
