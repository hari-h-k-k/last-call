package com.bidding.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "bid_items")
public class Item {

    @Id
    private String id;

    private String title;

    private String description;

    private String sellerId;

    private Date registrationClosingDate;

    private Date bidStartDate;

    private double startingPrice;

    private String category;

    private List<String> tags;

    private List<String> subscribersId;

    public Item(String title, String description, String sellerId, Date registrationClosingDate, Date bidStartDate, double startingPrice, String category, List<String> tags) {
        this.title = title;
        this.description = description;
        this.sellerId = sellerId;
        this.bidStartDate = bidStartDate;
        this.registrationClosingDate = registrationClosingDate;
        this.startingPrice = startingPrice;
        this.category = category;
        this.tags = tags;
    }

    public Item() {
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

    public Date getRegistrationClosingDate() {
        return registrationClosingDate;
    }

    public void setRegistrationClosingDate(Date registrationClosingDate) {
        this.registrationClosingDate = registrationClosingDate;
    }

    public Date getBidStartDate() {
        return bidStartDate;
    }

    public void setBidStartDate(Date bidStartDate) {
        this.bidStartDate = bidStartDate;
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

    public List<String> getSubscribersId() {
        return subscribersId;
    }

    public void setSubscribersId(List<String> subscribersId) {
        this.subscribersId = subscribersId;
    }

    public void addUserToSubscribersList(String userId) {
        subscribersId.add(userId);
    }

    public void removeUserFromSubscribersList(String userId) {
        subscribersId.remove(userId);
    }

    @Override
    public String toString() {
        return "Item{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", sellerId='" + sellerId + '\'' +
                ", registrationClosingDate=" + registrationClosingDate +
                ", bidStartDate=" + bidStartDate +
                ", startingPrice=" + startingPrice +
                ", category='" + category + '\'' +
                ", tags=" + tags +
                ", subscribersId=" + subscribersId +
                '}';
    }
}
