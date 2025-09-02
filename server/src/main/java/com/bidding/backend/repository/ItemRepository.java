package com.bidding.backend.repository;

import com.bidding.backend.entity.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface ItemRepository extends MongoRepository<Item, String> {

    Optional<Item> findById(String id);

    @Query("{ 'registrationClosingDate': { $gt: ?0 }, 'sellerId': { $ne: ?1 } }")
    List<Item> getItemsByRegistrationClosingDateAndNotOwnedByUser(Date date, String userId);

    @Query("{ 'registrationClosingDate': { $gt: ?0 } }")
    List<Item> getItemsByRegistrationClosingDate(Date date);
}
