package com.last.call.roomservice.dto;

import com.last.call.roomservice.entity.Bid;
import com.last.call.roomservice.entity.Room;
import com.last.call.roomservice.enums.RoomStatus;

import java.util.Date;
import java.util.List;

public class BidUpdateMessage {
    private Double currentPrice;
    private Bid bid;
    private Long roomId;
    private List<LeaderboardEntry> leaderboard;
    private List<Bid> bidHistory;
    private Date newEndDate;
    private Double myBid;
    private Long winnerId;
    private RoomStatus roomStatus;

    public BidUpdateMessage() {}

    public Double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(Double currentPrice) { this.currentPrice = currentPrice; }

    public Bid getBid() { return bid; }
    public void setBid(Bid bid) { this.bid = bid; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public List<LeaderboardEntry> getLeaderboard() { return leaderboard; }
    public void setLeaderboard(List<LeaderboardEntry> leaderboard) { this.leaderboard = leaderboard; }

    public List<Bid> getBidHistory() { return bidHistory; }
    public void setBidHistory(List<Bid> bidHistory) { this.bidHistory = bidHistory; }

    public Date getNewEndDate() { return newEndDate; }
    public void setNewEndDate(Date newEndDate) { this.newEndDate = newEndDate; }

    public Double getMyBid() { return myBid; }
    public void setMyBid(Double myBid) { this.myBid = myBid; }

    public Long getWinnerId() { return winnerId; }
    public void setWinnerId(Long winnerId) { this.winnerId = winnerId; }

    public RoomStatus getRoomStatus() { return roomStatus; }
    public void setRoomStatus(RoomStatus roomStatus) { this.roomStatus = roomStatus; }
}