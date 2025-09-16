package com.bidding.backend.repository;

import com.bidding.backend.entity.Bid;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BidRepository extends MongoRepository<Bid, String> {

    List<Bid> findByRoomIdOrderByTimestampDesc(String roomId);

    @Aggregation(pipeline = {
            "{ '$match': { 'roomId': ?0 } }",
            "{ '$sort': { 'amount': -1 } }",
            "{ '$group': { '_id': '$userId', 'maxBid': { '$first': '$$ROOT' } } }",
            "{ '$replaceRoot': { 'newRoot': '$maxBid' } }",
            "{ '$sort': { 'amount': -1 } }",
            "{ '$limit': 5 }"
    })
    List<Bid> findTop5UniqueByRoomId(String roomId);

    Bid findFirstByRoomIdAndUserIdOrderByTimestampDesc(String roomId, String userId);

    Bid findFirstByRoomIdAndUserIdOrderByAmountDesc(String roomId, String userId);
}
