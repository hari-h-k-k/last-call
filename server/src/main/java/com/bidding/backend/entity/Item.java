package com.bidding.backend.entity;

import com.bidding.backend.utils.enums.ItemCategory;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "items")
public class Item {

    @Id
    private String id;

    private String title;

    private String description;

    private String sellerId;

    private Date registrationClosingDate;

    private Date auctionStartDate;

    private double startingPrice;

    private ItemCategory category;

    private List<String> tags;

    private List<String> subscribersId;

    private LocationRequest location;

//    private GeoJsonPoint location = new GeoJsonPoint(0.0, 0.0);

    public Item(String title, String description, String sellerId, Date registrationClosingDate, Date auctionStartDate, double startingPrice, ItemCategory category, List<String> tags, LocationRequest location) {
        this.title = title;
        this.description = description;
        this.sellerId = sellerId;
        this.auctionStartDate = auctionStartDate;
        this.registrationClosingDate = registrationClosingDate;
        this.startingPrice = startingPrice;
        this.category = category;
        this.tags = tags;
        this.location = location;
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

    public Date getAuctionStartDate() {
        return auctionStartDate;
    }

    public void setAuctionStartDate(Date auctionStartDate) {
        this.auctionStartDate = auctionStartDate;
    }

    public double getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(double startingPrice) {
        this.startingPrice = startingPrice;
    }

    public ItemCategory getCategory() {
        return category;
    }

    public void setCategory(ItemCategory category) {
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

    public LocationRequest getLocation() {
        return location;
    }

    public void setLocation(LocationRequest location) {
        this.location = location;
    }

//    public GeoJsonPoint getLocation() {
//        return location;
//    }
//
//    public void setLocation(double lat, double lng) {
//        this.location = new GeoJsonPoint(lng, lat); // note: GeoJsonPoint expects (longitude, latitude)
//    }

    @Override
    public String toString() {
        return "Item{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", sellerId='" + sellerId + '\'' +
                ", registrationClosingDate=" + registrationClosingDate +
                ", auctionStartDate=" + auctionStartDate +
                ", startingPrice=" + startingPrice +
                ", category='" + category + '\'' +
                ", tags=" + tags +
                ", subscribersId=" + subscribersId +
                '}';
    }
}
