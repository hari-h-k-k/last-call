package com.last.call.itemservice.dto;

import com.last.call.itemservice.entity.Item;

public class ItemWithSubscriptionDto {
    private Item item;
    private boolean registered;

    public ItemWithSubscriptionDto(Item item, boolean registered) {
        this.item = item;
        this.registered = registered;
    }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }

    public boolean isRegistered() { return registered; }
    public void setRegistered(boolean registered) { this.registered = registered; }
}