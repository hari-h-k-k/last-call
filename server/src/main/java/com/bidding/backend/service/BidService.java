package com.bidding.backend.service;

import com.bidding.backend.entity.Bid;
import com.bidding.backend.repository.BidRepository;
import com.bidding.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class BidService {

    private final BidRepository bidRepository;

    private final UserRepository userRepository;

    public BidService(BidRepository bidRepository, UserRepository userRepository) {
        this.bidRepository = bidRepository;
        this.userRepository = userRepository;
    }

    public Bid placeBid(String roomId, String userId, double amount) {
        String username = userRepository.findById(userId).get().getUsername();
        Bid bid = new Bid(roomId, userId, username, amount, new Date());
        return bidRepository.save(bid);
    }

    public List<Bid> getBidHistory(String roomId) {
        return bidRepository.findByRoomIdOrderByTimestampDesc(roomId);
    }

    public List<Bid> getTop5Bids(String roomId) {
        return bidRepository.findTop5UniqueByRoomId(roomId);
    }

    public Bid getUserLatestBid(String roomId, String userId) {
        return bidRepository.findFirstByRoomIdAndUserIdOrderByTimestampDesc(roomId, userId);
    }

    public Bid getUserHighestBid(String roomId, String userId) {
        return bidRepository.findFirstByRoomIdAndUserIdOrderByAmountDesc(roomId, userId);
    }
}
