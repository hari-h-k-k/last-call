package com.last.call.roomservice.entity;

import com.last.call.roomservice.enums.RoomStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false, name = "item_id")
    @JoinColumn(name = "item_id", foreignKey = @ForeignKey(name = "fk_room_item"))
    private Long itemId;

    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, name = "auction_start_date")
    private Date auctionStartDate;

    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, name = "end_date")
    private Date endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status = RoomStatus.PENDING;

    @DecimalMin("0.0")
    @Column(nullable = false, name = "current_price")
    private double currentPrice;

    @Column(name = "winner_id")
    @JoinColumn(name = "winner_id", foreignKey = @ForeignKey(name = "fk_room_winner"))
    private Long winnerId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Bid> bids;

    public Room() {}

    public Room(Long itemId, Date auctionStartDate, Date endDate, RoomStatus status, double currentPrice) {
        this.itemId = itemId;
        this.auctionStartDate = auctionStartDate;
        this.endDate = endDate;
        this.status = status;
        this.currentPrice = currentPrice;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public Date getAuctionStartDate() { return auctionStartDate; }
    public void setAuctionStartDate(Date startDate) { this.auctionStartDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public RoomStatus getStatus() { return status; }
    public void setStatus(RoomStatus status) { 
        this.status = status;
        this.updatedAt = new Date();
    }

    public double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(double currentPrice) { this.currentPrice = currentPrice; }

    public Long getWinnerId() { return winnerId; }
    public void setWinnerId(Long winnerId) { this.winnerId = winnerId; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public List<Bid> getBids() { return bids; }
    public void setBids(List<Bid> bids) { this.bids = bids; }
}

