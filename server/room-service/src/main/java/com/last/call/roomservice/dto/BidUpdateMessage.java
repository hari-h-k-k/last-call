package com.last.call.roomservice.dto;

import com.last.call.roomservice.entity.Bid;
import java.util.Date;
import java.util.List;

public class BidUpdateMessage {
    private Double currentPrice;
    private Bid bid;
    private Long roomId;
    private List<LeaderboardEntry> leaderboard;
    private Date newEndDate;
    private Double myBid;
    private Long winnerId;
    private String roomStatus;

    public BidUpdateMessage() {}

    public Double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(Double currentPrice) { this.currentPrice = currentPrice; }

    public Bid getBid() { return bid; }
    public void setBid(Bid bid) { this.bid = bid; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public List<LeaderboardEntry> getLeaderboard() { return leaderboard; }
    public void setLeaderboard(List<LeaderboardEntry> leaderboard) { this.leaderboard = leaderboard; }

    public Date getNewEndDate() { return newEndDate; }
    public void setNewEndDate(Date newEndDate) { this.newEndDate = newEndDate; }

    public Double getMyBid() { return myBid; }
    public void setMyBid(Double myBid) { this.myBid = myBid; }

    public Long getWinnerId() { return winnerId; }
    public void setWinnerId(Long winnerId) { this.winnerId = winnerId; }

    public String getRoomStatus() { return roomStatus; }
    public void setRoomStatus(String roomStatus) { this.roomStatus = roomStatus; }
}