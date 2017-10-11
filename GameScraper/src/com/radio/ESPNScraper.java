package com.radio;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;

import java.io.IOException;
import java.util.Vector;

public class ESPNScraper {
    public ESPNScraper() {

    }

    public Vector<NFLGame> scrapeGames(int week) throws IOException {

        Connection connection = Jsoup.connect("http://www.espn.com/nfl/schedule/_/week/" + week);
        Document doc = connection.get();
        Parser webParser = Parser.htmlParser();
        Vector<NFLGame> games = new Vector<NFLGame>();

        for(int gameIndex=0; gameIndex<doc.select("tbody > tr > td[class='']").size(); gameIndex++) {

            Element awayTeamNode = doc.select("tbody > tr > td[class='']").get(gameIndex);
            Element homeTeamNode = doc.select("tbody > tr > td[class='home'] > div[class='home-wrapper']").get(gameIndex);
            games.add(new NFLGame(initTeam(homeTeamNode),initTeam(awayTeamNode), week));
        }
        return games;
    }

    public ESPNTeam initTeam(Element teamNode) {
        Element teamNameBaseNode = teamNode.select("a").get(0);
        String teamName = teamNode.select("span").text();
        String teamAbbr = teamNode.select("abbr").text();
        String imgSrc = teamNode.select("div > a > img").outerHtml();
        ESPNTeam team = new ESPNTeam(teamName,imgSrc);
        return team;
    }
}
