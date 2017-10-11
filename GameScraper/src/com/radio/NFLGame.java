package com.radio;

public class NFLGame {
    public NFLGame() {

    }

    public NFLGame(ESPNTeam teamOne, ESPNTeam teamTwo, int week) {
        TeamOne = teamOne;
        TeamTwo = teamTwo;
        Week = week;
    }

    public ESPNTeam getTeamOne() {
        return TeamOne;
    }

    public void setTeamOne(ESPNTeam teamOne) {
        TeamOne = teamOne;
    }

    public ESPNTeam getTeamTwo() {
        return TeamTwo;
    }

    public void setTeamTwo(ESPNTeam teamTwo) {
        TeamTwo = teamTwo;
    }

    public int getWeek() {
        return Week;
    }

    public void setWeek(int week) {
        Week = week;
    }

    ESPNTeam TeamOne;
    ESPNTeam TeamTwo;
    int Week;

    @Override
    public String toString() {
        return "Week: " + Week
                + "\n"
                + TeamOne.toString()
                + "\n"
                + TeamTwo.toString()
                + "\n";
    }
}
