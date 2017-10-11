package com.radio;

public class Team {
    public Team() {

    }

    public Team(String name, Location location, Record record) {
        Name = name;
        TeamLocation = location;
        TeamRecord = record;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public Location getTeamLocation() {
        return TeamLocation;
    }

    public void setTeamLocation(Location teamLocation) {
        TeamLocation = teamLocation;
    }

    public Record getTeamRecord() {
        return TeamRecord;
    }

    public void setTeamRecord(Record teamRecord) {
        TeamRecord = teamRecord;
    }

    String Name;
    Location TeamLocation;
    Record TeamRecord;
    @Override
    public String toString() {
        return "Name: " + Name + "\n" + TeamLocation.toString() + "\n" + TeamRecord.toString();
    }
}
