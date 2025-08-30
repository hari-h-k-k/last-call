package com.bidding.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "bid_items")
public class BidItem {

    @Id
    private String id;

    private String title;

    private String description;

    private String sellerId;

    private double startingPrice;

    private String category;

    private List<String> tags;

    public BidItem(String title, String description, String sellerId, double startingPrice, String category, List<String> tags) {
        this.title = title;
        this.description = description;
        this.sellerId = sellerId;
        this.startingPrice = startingPrice;
        this.category = category;
        this.tags = tags;
    }

    public BidItem() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public double getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(double startingPrice) {
        this.startingPrice = startingPrice;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    @Override
    public String toString() {
        return "BidItem{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", sellerId=" + sellerId +
                ", startingPrice=" + startingPrice +
                ", category='" + category + '\'' +
                ", tags=" + tags +
                '}';
    }
}
