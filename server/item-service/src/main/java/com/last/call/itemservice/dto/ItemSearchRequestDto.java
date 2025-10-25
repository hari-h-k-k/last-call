package com.last.call.itemservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ItemSearchRequestDto {
    private String query;
    private String category;
    private String registered;
    private String priceMin;
    private String priceMax;
    private String sortBy;
    private String auctionStatus;

    public ItemSearchRequestDto() {}

    public ItemSearchRequestDto(String query, String category, String registered, String priceMin, String priceMax, String sortBy, String auctionStatus) {
        this.query = query;
        this.category = category;
        this.registered = registered;
        this.priceMin = priceMin;
        this.priceMax = priceMax;
        this.sortBy = sortBy;
        this.auctionStatus = auctionStatus;
    }

    @JsonProperty("query")
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    @JsonProperty("category")
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    @JsonProperty("registered")
    public String getRegistered() { return registered; }
    public void setRegistered(String registered) { this.registered = registered; }

    @JsonProperty("priceMin")
    public String getPriceMin() { return priceMin; }
    public void setPriceMin(String priceMin) { this.priceMin = priceMin; }

    @JsonProperty("priceMax")
    public String getPriceMax() { return priceMax; }
    public void setPriceMax(String priceMax) { this.priceMax = priceMax; }

    @JsonProperty("sortBy")
    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }

    @JsonProperty("auctionStatus")
    public String getAuctionStatus() { return auctionStatus; }
    public void setAuctionStatus(String auctionStatus) { this.auctionStatus = auctionStatus; }

    @Override
    public String toString() {
        return "ItemSearchRequestDto{" +
                "query='" + query + '\'' +
                ", category='" + category + '\'' +
                ", registered='" + registered + '\'' +
                ", priceMin='" + priceMin + '\'' +
                ", priceMax='" + priceMax + '\'' +
                ", sortBy='" + sortBy + '\'' +
                ", auctionStatus='" + auctionStatus + '\'' +
                '}';
    }
}