package com.last.call.itemservice.dto;

import java.util.Date;

public class ItemScheduleDto {
    private Long id;
    private String title;
    private Date registrationClosingDate;
    private Date auctionStartDate;

    public ItemScheduleDto(Long id, String title, Date registrationClosingDate, Date auctionStartDate) {
        this.id = id;
        this.title = title;
        this.registrationClosingDate = registrationClosingDate;
        this.auctionStartDate = auctionStartDate;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public Date getRegistrationClosingDate() { return registrationClosingDate; }
    public Date getAuctionStartDate() { return auctionStartDate; }
}