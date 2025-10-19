package com.last.call.roomservice.dto;

public class LeaderboardEntry {
    private Double bidAmount;
    private Long userId;
    private String name;

    public LeaderboardEntry() {}

    public LeaderboardEntry(String bidderName, Double bidAmount, Long userId, String name) {
        this.bidAmount = bidAmount;
        this.userId = userId;
        this.name = name;
    }

    public Double getBidAmount() { return bidAmount; }
    public void setBidAmount(Double bidAmount) { this.bidAmount = bidAmount; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}