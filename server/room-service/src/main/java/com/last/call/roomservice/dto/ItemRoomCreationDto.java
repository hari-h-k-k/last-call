package com.last.call.roomservice.dto;

import java.util.Date;

public class ItemRoomCreationDto {
    private Long id;
    private Double startingPrice;
    private Date registrationClosingDate;
    private Date auctionStartDate;

    public ItemRoomCreationDto(Long id, Double startingPrice, Date registrationClosingDate, Date auctionStartDate) {
        this.id = id;
        this.startingPrice = startingPrice;
        this.registrationClosingDate = registrationClosingDate;
        this.auctionStartDate = auctionStartDate;
    }

    public Long getId() { return id; }
    public Double getStartingPrice() { return startingPrice; }
    public Date getRegistrationClosingDate() { return registrationClosingDate; }
    public Date getAuctionStartDate() { return auctionStartDate; }
}
