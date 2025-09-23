package com.last.call.roomservice.service;

import com.last.call.roomservice.entity.Room;
import com.last.call.roomservice.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);
    
    private final RoomRepository roomRepository;

    public KafkaConsumerService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @KafkaListener(topics = "room-creation", groupId = "room-service-group")
    public void handleRoomCreation(String itemId) {
        try {
            Long id = Long.parseLong(itemId);
            
            Room room = new Room();
            room.setItemId(id);
            room.setStartDate(new java.util.Date());
            room.setEndDate(new java.util.Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000)); // 24 hours from now
            room.setStatus("ACTIVE");
            room.setCurrentPrice(0.0);
            room.setCreatedAt(new java.util.Date());
            room.setUpdatedAt(new java.util.Date());
            
            roomRepository.save(room);
            
            logger.info("Room created for item ID: {}", id);
        } catch (Exception e) {
            logger.error("Error creating room for item ID: {}", itemId, e);
        }
    }
}