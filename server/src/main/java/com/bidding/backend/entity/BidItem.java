package com.bidding.backend.entity;

public class BidItem {
    private int id;
    private String itemName;
    private String description;
    private double startingPrice;

    public BidItem(String itemName, String description, double startingPrice) {
        this.itemName = itemName;
        this.description = description;
        this.startingPrice = startingPrice;
    }

    public BidItem() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(double startingPrice) {
        this.startingPrice = startingPrice;
    }
}
