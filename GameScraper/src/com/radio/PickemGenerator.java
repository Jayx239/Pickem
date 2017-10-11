package com.radio;

public class PickemGenerator {
    PickemGenerator() {

    }
    public static String generatePage(HtmlEngine engine) {
        String page = "<html>" + engine.CreateHead() + engine.CreateBody() + "</html>";
        return page;
    }


}
