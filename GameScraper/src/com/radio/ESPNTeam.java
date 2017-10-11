package com.radio;

public class ESPNTeam extends Team {
    public ESPNTeam() {

    }
    public ESPNTeam(String name, String imageSource ) {
        super(name,new Location(),new Record());
        ImageSource = imageSource;
    }

    public String getImageSource() {
        return ImageSource;
    }

    public void setImageSource(String imageSource) {
        ImageSource = imageSource;
    }

    String ImageSource;


}
