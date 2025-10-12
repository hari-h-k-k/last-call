package com.last.call.schedulerservice.dto;

import java.util.Date;

public class ItemDetailsDto {
    private Long id;
    private String title;
    private String description;
    private Long sellerId;
    private Integer startingPrice;
    private String category;
    private Date registrationClosingDate;
    private Date auctionStartDate;

    public ItemDetailsDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }
    
    public Integer getStartingPrice() { return startingPrice; }
    public void setStartingPrice(Integer startingPrice) { this.startingPrice = startingPrice; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Date getRegistrationClosingDate() { return registrationClosingDate; }
    public void setRegistrationClosingDate(Date registrationClosingDate) { this.registrationClosingDate = registrationClosingDate; }
    
    public Date getAuctionStartDate() { return auctionStartDate; }
    public void setAuctionStartDate(Date auctionStartDate) { this.auctionStartDate = auctionStartDate; }
}