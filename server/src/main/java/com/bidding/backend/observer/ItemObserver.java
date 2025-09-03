package com.bidding.backend.observer;

import com.bidding.backend.entity.Item;

import java.util.List;

public interface ItemObserver {

    public void onItemUpdated(Item item, List<String> alerts);
}
