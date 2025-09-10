package com.bidding.backend.strategy;

import com.bidding.backend.entity.User;

import java.util.List;

public interface NotificationStrategy {

    void sendNotification(User user, List<String> alerts);
}
