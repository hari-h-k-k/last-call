//package com.last.call.roomservice.dto;
//
//import jakarta.validation.constraints.DecimalMin;
//import jakarta.validation.constraints.NotNull;
//
//public class BidRequest {
//    @NotNull
//    @DecimalMin("0.01")
//    private Double bidAmount;
//
//    public BidRequest() {}
//
//    public BidRequest(Double bidAmount) {
//        this.bidAmount = bidAmount;
//    }
//
//    public Double getBidAmount() { return bidAmount; }
//    public void setBidAmount(Double bidAmount) { this.bidAmount = bidAmount; }
//}