package com.last.call.roomservice.repository;

import com.last.call.roomservice.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    Room findByItemId(Long itemId);
    
    List<Room> findByStatus(String status);
    
    List<Room> findByStartDateBetween(Date startDate, Date endDate);
    
    @Query("SELECT r FROM Room r WHERE r.endDate > :currentDate AND r.status = 'ACTIVE'")
    List<Room> findActiveRooms(@Param("currentDate") Date currentDate);
    
    List<Room> findByWinnerId(String winnerId);
}