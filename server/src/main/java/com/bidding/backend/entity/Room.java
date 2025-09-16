package com.bidding.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Document(collection = "rooms")
public class Room {

    @Id
    private String id;

    private String itemId;

    private Date startDate;

    private Date endDate;

    private String status;

    private List<String> listOfUserIds;

    private Map<String, Double> leaderboard;

    private double currentPrice;

    private Date createdAt;

    private Date updatedAt;

    private String winnerId;

    public Room(String itemId, Date startDate, Date endDate, String status,
                List<String> listOfUserIds, Map<String, Double> leaderboard,
                double currentPrice, Date createdAt, Date updatedAt, String winnerId) {
        this.itemId = itemId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.listOfUserIds = listOfUserIds;
        this.leaderboard = leaderboard;
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
        private Map<String, Double> leaderboard;
        private double currentPrice;
        private Date createdAt;
        private Date updatedAt;
        private String winnerId;

        public Builder itemId(String itemId) { this.itemId = itemId; return this; }
        public Builder startDate(Date startDate) { this.startDate = startDate; return this; }
        public Builder endDate(Date endDate) { this.endDate = endDate; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder listOfUserIds(List<String> listOfUserIds) { this.listOfUserIds = listOfUserIds; return this; }
        public Builder leaderboard(Map<String, Double> leaderboard) { this.leaderboard = leaderboard; return this; }
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
            room.leaderboard = this.leaderboard;
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

    public Map<String, Double> getLeaderboard() {
        return leaderboard;
    }
    public void setLeaderboard(Map<String, Double> leaderboard) {
        this.leaderboard = leaderboard;
    }

    public List<Map.Entry<String, Double>> getTop5Leaderboard() {
        if (leaderboard == null || leaderboard.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        return leaderboard.entrySet().stream()
                .sorted((e1, e2) -> Double.compare(e2.getValue(), e1.getValue())) // sort descending
                .limit(5) // take top 5
                .collect(Collectors.toList());
    }

    public boolean updateRoomBid(String userId, double bidAmount) {
        if (leaderboard == null) {
            leaderboard = new java.util.HashMap<>();
        }

        // Check if this user's bid is valid
        if (leaderboard.containsKey(userId)) {
            double currentBid = leaderboard.get(userId);
            if (bidAmount <= currentBid) {
                throw new IllegalArgumentException("Bid amount must be higher than the current bid.");
            }
        }

        // Find the current highest bid in the room
        double highestBid = leaderboard.values().stream()
                .max(Double::compare)
                .orElse(0.0);

        leaderboard.put(userId, bidAmount);

        // Return true only if this bid is now the new highest
        return bidAmount > highestBid;
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
                ", leaderboard=" + leaderboard +
                ", currentPrice=" + currentPrice +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", winnerId='" + winnerId + '\'' +
                '}';
    }
}
