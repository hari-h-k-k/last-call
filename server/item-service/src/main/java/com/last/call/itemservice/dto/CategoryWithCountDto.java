package com.last.call.itemservice.dto;

import com.last.call.itemservice.enums.ItemCategory;

public class CategoryWithCountDto {
    private ItemCategory category;
    private long count;

    public CategoryWithCountDto(ItemCategory category, long count) {
        this.category = category;
        this.count = count;
    }

    public ItemCategory getCategory() { return category; }
    public void setCategory(ItemCategory category) { this.category = category; }

    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }
}