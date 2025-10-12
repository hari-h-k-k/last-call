package com.last.call.itemservice.dto;

import com.last.call.itemservice.enums.ItemCategory;
import jakarta.validation.constraints.*;

import java.util.Date;

public class CreateItemRequestDto {
    @NotBlank
    @Size(max = 255)
    private String title;

    @Size(max = 1000)
    private String description;

    @DecimalMin("0.0")
    @NotNull
    private Double startingPrice;

    @NotNull
    private ItemCategory category;

    @NotNull
    private Date registrationClosingDate;

    @NotNull
    private Date auctionStartDate;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getStartingPrice() { return startingPrice; }
    public void setStartingPrice(Double startingPrice) { this.startingPrice = startingPrice; }

    public ItemCategory getCategory() { return category; }
    public void setCategory(ItemCategory category) { this.category = category; }

    public Date getRegistrationClosingDate() { return registrationClosingDate; }
    public void setRegistrationClosingDate(Date registrationClosingDate) { this.registrationClosingDate = registrationClosingDate; }

    public Date getAuctionStartDate() { return auctionStartDate; }
    public void setAuctionStartDate(Date auctionStartDate) { this.auctionStartDate = auctionStartDate; }
}