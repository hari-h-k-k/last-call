package com.last.call.roomservice.dto;

public class LeaderboardEntry {
    private Double bidAmount;
    private Long userId;

    public LeaderboardEntry() {}

    public LeaderboardEntry(String bidderName, Double bidAmount, Long userId) {
        this.bidAmount = bidAmount;
        this.userId = userId;
    }

    public Double getBidAmount() { return bidAmount; }
    public void setBidAmount(Double bidAmount) { this.bidAmount = bidAmount; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}