package com.last.call.shared.dto;

import java.util.Date;

public class ItemRoomCreationDto {
    private Long itemId;
    private Double startingPrice;
    private Date registrationClosingDate;
    private Date auctionStartDate;
    
    public ItemRoomCreationDto() {}
    
    public ItemRoomCreationDto(Long itemId, Double startingPrice, Date registrationClosingDate, Date auctionStartDate) {
        this.itemId = itemId;
        this.startingPrice = startingPrice;
        this.registrationClosingDate = registrationClosingDate;
        this.auctionStartDate = auctionStartDate;
    }
    
    // Getters and setters
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    
    public Double getStartingPrice() { return startingPrice; }
    public void setStartingPrice(Double startingPrice) { this.startingPrice = startingPrice; }
    
    public Date getRegistrationClosingDate() { return registrationClosingDate; }
    public void setRegistrationClosingDate(Date registrationClosingDate) { this.registrationClosingDate = registrationClosingDate; }
    
    public Date getAuctionStartDate() { return auctionStartDate; }
    public void setAuctionStartDate(Date auctionStartDate) { this.auctionStartDate = auctionStartDate; }
}