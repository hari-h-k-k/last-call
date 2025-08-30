package com.bidding.backend.repository;

import com.bidding.backend.entity.BidItem;
import com.bidding.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BidItemRepository extends MongoRepository<BidItem, String> {
}
