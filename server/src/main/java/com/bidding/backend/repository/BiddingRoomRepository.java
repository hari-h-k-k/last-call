package com.bidding.backend.repository;

import com.bidding.backend.entity.BiddingRoom;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BiddingRoomRepository extends MongoRepository<BiddingRoom, String> {
}
