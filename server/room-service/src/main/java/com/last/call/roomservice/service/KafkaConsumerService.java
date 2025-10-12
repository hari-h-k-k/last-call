package com.last.call.roomservice.service;

import com.last.call.roomservice.entity.Room;
import com.last.call.roomservice.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

@Service
public class KafkaConsumerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);

    private final RoomRepository roomRepository;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaConsumerService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @KafkaListener(topics = "room-creation", groupId = "room-service-group")
    public void handleRoomCreation(String itemId) {
        System.out.println("📥 Received Kafka message for item ID: " + itemId);
        try {
            Long id = Long.parseLong(itemId);

            // Check if room already exists for this item
            if (roomRepository.findByItemId(id).isPresent()) {
                logger.warn("Room already exists for item ID: {}", id);
                return;
            }

            // Request latest item details via Kafka
            kafkaTemplate.send("item-details-request", id.toString());
            System.out.println("📞 Requested latest item details for ID: " + id);
            
            Room room = new Room();
            room.setItemId(id);
            room.setStartDate(new java.util.Date());
            room.setEndDate(new java.util.Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000));
            room.setStatus("ACTIVE");
            room.setCurrentPrice(0.0);
            room.setCreatedAt(new java.util.Date());
            room.setUpdatedAt(new java.util.Date());

            roomRepository.save(room);

            logger.info("Room created for item ID: {}", id);
            System.out.println("✅ Room successfully created for item ID: " + id);
        } catch (Exception e) {
            logger.error("Error creating room for item ID: {}", itemId, e);
        }
    }

    @KafkaListener(topics = "item-details-response", groupId = "room-service-group")
    public void handleItemDetailsResponse(Object itemDetails) {
        System.out.println("📥 Received item details, creating room");
        // Extract itemId and create room with details
        // TODO: Parse itemDetails and create room
    }
}