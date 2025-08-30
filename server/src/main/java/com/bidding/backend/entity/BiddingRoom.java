package com.bidding.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "bidding_rooms")
public class BiddingRoom {

    @Id
    private String id;

    private String itemId;

    private Date startDate;

    private Date endDate;

    private String status;

    private List<Integer> listOfUserIds;

    private double currentPrice;

    private Date createdAt;

    private Date updatedAt;

    private String winnerId;

    public BiddingRoom(String itemId, Date startDate, Date endDate, String status, List<Integer> listOfUserIds, double currentPrice, Date createdAt, Date updatedAt, String winnerId) {
        this.itemId = itemId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.listOfUserIds = listOfUserIds;
        this.currentPrice = currentPrice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.winnerId = winnerId;
    }

    public BiddingRoom() {
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

    public List<Integer> getListOfUserIds() {
        return listOfUserIds;
    }

    public void setListOfUserIds(List<Integer> listOfUserIds) {
        this.listOfUserIds = listOfUserIds;
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
        return "BiddingRoom{" +
                "id=" + id +
                ", itemId=" + itemId +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", status='" + status + '\'' +
                ", listOfUserIds=" + listOfUserIds +
                ", currentPrice=" + currentPrice +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", winnerId=" + winnerId +
                '}';
    }
}
