package com.last.call.roomservice.repository;

import com.last.call.roomservice.entity.RoomUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomUserRepository extends JpaRepository<RoomUser, Long> {
    
    List<RoomUser> findByRoomId(Long roomId);
    
    List<RoomUser> findByUserId(String userId);
    
    boolean existsByRoomIdAndUserId(Long roomId, String userId);
    
    @Query("SELECT COUNT(ru) FROM RoomUser ru WHERE ru.room.id = :roomId")
    Long countParticipantsByRoom(@Param("roomId") Long roomId);
}