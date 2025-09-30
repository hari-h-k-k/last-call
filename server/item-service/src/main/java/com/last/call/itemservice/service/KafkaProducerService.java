package com.last.call.itemservice.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendRoomCreationMessage(Long itemId) {
        System.out.println("📤 Sending Kafka message for item ID: " + itemId);
        kafkaTemplate.send("room-creation", itemId.toString());
        System.out.println("✅ Kafka message sent for item ID: " + itemId);
    }
}