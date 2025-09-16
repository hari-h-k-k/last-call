package com.bidding.backend.repository;

import com.bidding.backend.entity.Bid;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BidRepository extends MongoRepository<Bid, String> {

    List<Bid> findByRoomIdOrderByTimestampDesc(String roomId);

    List<Bid> findTop5ByRoomIdOrderByAmountDesc(String roomId);

    Bid findFirstByRoomIdAndUserIdOrderByTimestampDesc(String roomId, String userId);

    Bid findFirstByRoomIdAndUserIdOrderByAmountDesc(String roomId, String userId);
}
