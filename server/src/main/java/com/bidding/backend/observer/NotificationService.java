package com.bidding.backend.observer;

import com.bidding.backend.entity.Item;
import com.bidding.backend.entity.User;
import com.bidding.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService implements ItemObserver {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onItemUpdated(Item item, List<String> alerts) {
        if(!item.getSubscribersId().isEmpty()) {
            for(String userId : item.getSubscribersId()) {
                userRepository.findById(userId).ifPresent(user -> {
                    notifyUser(user, alerts);
                });
            }
        }
    }

    private void notifyUser(User user, List<String> alerts) {
        System.out.printf("Notifying %s (%s): %s%n",
                user.getName(), user.getEmail(), String.join(", ", alerts));
    }
}
