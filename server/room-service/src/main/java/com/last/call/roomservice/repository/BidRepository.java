package com.last.call.roomservice.repository;

import com.last.call.roomservice.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    
    List<Bid> findByRoomIdOrderByAmountDesc(Long roomId);
    
    List<Bid> findByRoomIdOrderByCreatedAtDesc(Long roomId);
    
    List<Bid> findByUserId(Long userId);
    
    @Query("SELECT b FROM Bid b WHERE b.room.id = :roomId ORDER BY b.amount DESC")
    List<Bid> findTopBidsByRoom(@Param("roomId") Long roomId);
    
    @Query("SELECT MAX(b.amount) FROM Bid b WHERE b.room.id = :roomId")
    Double findHighestBidByRoom(@Param("roomId") Long roomId);
}