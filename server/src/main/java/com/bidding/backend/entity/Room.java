package com.bidding.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Document(collection = "rooms")
public class Room {

    @Id
    private String id;

    private String itemId;

    private Date startDate;

    private Date endDate;

    private String status;

    private List<String> listOfUserIds;

    private Map<String, Double> bids;

    private double currentPrice;

    private Date createdAt;

    private Date updatedAt;

    private String winnerId;

    public Room(String itemId, Date startDate, Date endDate, String status,
                List<String> listOfUserIds, Map<String, Double> bids,
                double currentPrice, Date createdAt, Date updatedAt, String winnerId) {
        this.itemId = itemId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.listOfUserIds = listOfUserIds;
        this.bids = bids;
        this.currentPrice = currentPrice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.winnerId = winnerId;
    }

    public Room() {
    }

    public static class Builder {
        private String itemId;
        private Date startDate;
        private Date endDate;
        private String status;
        private List<String> listOfUserIds;
        private Map<String, Double> bids;
        private double currentPrice;
        private Date createdAt;
        private Date updatedAt;
        private String winnerId;

        public Builder itemId(String itemId) { this.itemId = itemId; return this; }
        public Builder startDate(Date startDate) { this.startDate = startDate; return this; }
        public Builder endDate(Date endDate) { this.endDate = endDate; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder listOfUserIds(List<String> listOfUserIds) { this.listOfUserIds = listOfUserIds; return this; }
        public Builder bids(Map<String, Double> bids) { this.bids = bids; return this; }
        public Builder currentPrice(double currentPrice) { this.currentPrice = currentPrice; return this; }
        public Builder createdAt(Date createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Date updatedAt) { this.updatedAt = updatedAt; return this; }
        public Builder winnerId(String winnerId) { this.winnerId = winnerId; return this; }

        public Room build() {
            Room room = new Room();
            room.itemId = this.itemId;
            room.startDate = this.startDate;
            room.endDate = this.endDate;
            room.status = this.status;
            room.listOfUserIds = this.listOfUserIds;
            room.bids = this.bids;
            room.currentPrice = this.currentPrice;
            room.createdAt = this.createdAt;
            room.updatedAt = this.updatedAt;
            room.winnerId = this.winnerId;
            return room;
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getListOfUserIds() {
        return listOfUserIds;
    }
    public void setListOfUserIds(List<String> listOfUserIds) {
        this.listOfUserIds = listOfUserIds;
    }

    public Map<String, Double> getBids() {
        return bids;
    }
    public void setBids(Map<String, Double> bids) {
        this.bids = bids;
    }

    public void updateRoomBid(String userId, double bidAmount) {
        if (bids == null) {
            bids = new java.util.HashMap<>();
        }
        bids.put(userId, bidAmount);
    }

    public double getCurrentPrice() {
        return currentPrice;
    }
    public void setCurrentPrice(double currentPrice) {
        this.currentPrice = currentPrice;
    }

    public Date getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getWinnerId() {
        return winnerId;
    }
    public void setWinnerId(String winnerId) {
        this.winnerId = winnerId;
    }

    @Override
    public String toString() {
        return "Room{" +
                "id='" + id + '\'' +
                ", itemId='" + itemId + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", status='" + status + '\'' +
                ", listOfUserIds=" + listOfUserIds +
                ", bids=" + bids +
                ", currentPrice=" + currentPrice +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", winnerId='" + winnerId + '\'' +
                '}';
    }
}
