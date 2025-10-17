package com.last.call.roomservice.repository;

import com.last.call.roomservice.entity.Room;
import com.last.call.roomservice.enums.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    Optional<Room> findByItemId(Long itemId);
    
    List<Room> findByStatus(RoomStatus status);
    
    List<Room> findByAuctionStartDateBetween(Date startDate, Date endDate);
    
    @Query("SELECT r FROM Room r WHERE r.endDate > :currentDate AND r.status = 'ACTIVE'")
    List<Room> findActiveRooms(@Param("currentDate") Date currentDate);
    
    List<Room> findByWinnerId(Long winnerId);
    
    List<Room> findByStatusAndAuctionStartDateBefore(RoomStatus status, Date date);
    
    List<Room> findByStatusAndAuctionStartDateBetween(RoomStatus status, Date startDate, Date endDate);
}