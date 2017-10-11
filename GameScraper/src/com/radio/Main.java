package com.radio;
import org.jsoup.helper.HttpConnection;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.*;
import org.jsoup.*;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Vector;

public class Main {

    public static void main(String[] args) throws IOException {
        /*Connection connection = Jsoup.connect("https://www.google.com/search?q=nfl+schedule&oq=nfl+schedule");
        Document doc = connection.get();
        Parser webParser = Parser.htmlParser();
        Element tableNode = doc.getElementsByAttribute("data-index").get(2).select("table").get(0).select("tbody").get(0).select("table").get(0).select("tbody").get(0);
        System.out.print(tableNode.toString());
*/
        ESPNScraper scraper = new ESPNScraper();

        //Vector<NFLGame> games = scraper.scrapeGames(3);
        //for(NFLGame game : games) {
            //System.out.print(game.toString());
        //}
        String weekName;
        PickemEngine engine = new PickemEngine();
        for(int i=1; i<18; i++) {
            weekName = "Week_" + i + ".html";
            File nextTableFile = new File(weekName);
            Vector<NFLGame> games = scraper.scrapeGames(i);

            engine.setGames(games);
            System.out.println(engine.createPickemTable());

            //BufferedWriter writer = Files.newBufferedWriter();// nextTableFile, Charset.forName("US-ASCII"));
        }
        //String html = PickemGenerator.generatePage(engine);
        //System.out.println(html);
    }
}
