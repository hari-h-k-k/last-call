package com.last.call.schedulerservice.dto;

import java.util.Date;

public class ItemScheduleDto {
    private Long id;
    private String title;
    private Date registrationClosingDate;
    private Date auctionStartDate;

    public ItemScheduleDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public Date getRegistrationClosingDate() { return registrationClosingDate; }
    public void setRegistrationClosingDate(Date registrationClosingDate) { this.registrationClosingDate = registrationClosingDate; }
    
    public Date getAuctionStartDate() { return auctionStartDate; }
    public void setAuctionStartDate(Date auctionStartDate) { this.auctionStartDate = auctionStartDate; }
}