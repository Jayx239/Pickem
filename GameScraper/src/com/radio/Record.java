package com.radio;

public class Record {
    public Record() {

    }

    public Record(String recordString ) {
        Wins = 0;
        Losses = 0;
        Ties = 0;
        parseRecord(recordString);
    }

    int Wins;
    int Losses;
    int Ties;

    void parseRecord(String recordString) {

        String sanitizedString = recordString.replace("(","");
        sanitizedString = sanitizedString.replace(")","");
        String[] recordElements = sanitizedString.split("-");
        if(recordElements.length > 1) {
            Wins = Integer.parseInt(recordElements[0]);
            Losses = Integer.parseInt(recordElements[1]);
        }

        if(recordElements.length > 2) {
            Ties = Integer.parseInt(recordElements[2]);
        }
    }

    @Override
    public String toString() {
        return "Wins: " + Wins + "\nLoses: " + Losses + "\nTies: " + Ties;
    }
}
