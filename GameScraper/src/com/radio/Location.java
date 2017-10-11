package com.radio;

public class Location {
    public Location() {

    }

    public Location(String city) {
        City = city;
    }

    String City;

    @Override
    public String toString() {
        return "City: " + City;
    }
}
