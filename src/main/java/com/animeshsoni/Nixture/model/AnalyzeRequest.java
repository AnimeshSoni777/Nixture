package com.animeshsoni.Nixture.model;

public class AnalyzeRequest {
    private String url;

    // Default constructor needed for Spring Boot to parse JSON
    public AnalyzeRequest() {}

    public AnalyzeRequest(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}