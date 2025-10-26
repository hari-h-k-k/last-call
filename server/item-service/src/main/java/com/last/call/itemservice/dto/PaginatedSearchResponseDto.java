package com.last.call.itemservice.dto;

import java.util.List;

public class PaginatedSearchResponseDto {
    private List<ItemWithSubscriptionDto> items;
    private long totalCount;

    public PaginatedSearchResponseDto(List<ItemWithSubscriptionDto> items, long totalCount) {
        this.items = items;
        this.totalCount = totalCount;
    }

    public List<ItemWithSubscriptionDto> getItems() {
        return items;
    }

    public void setItems(List<ItemWithSubscriptionDto> items) {
        this.items = items;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }
}