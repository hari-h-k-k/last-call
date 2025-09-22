package com.last.call.itemservice.repository;

import com.last.call.itemservice.entity.ItemSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemSubscriberRepository extends JpaRepository<ItemSubscriber, Long> {
    
    @Query("SELECT COUNT(s) > 0 FROM ItemSubscriber s WHERE s.item.id = :itemId AND s.userId = :userId")
    boolean existsByItemIdAndUserId(@Param("itemId") Long itemId, @Param("userId") String userId);
}