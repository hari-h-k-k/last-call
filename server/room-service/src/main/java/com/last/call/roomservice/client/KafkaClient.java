package com.last.call.roomservice.client;

import com.last.call.roomservice.entity.Room;
import com.last.call.shared.dto.ItemRoomCreationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class KafkaClient {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void scheduleRoomClose(Long roomId, Date auctionEndDate) {
        kafkaTemplate.send("schedule-room-close", roomId.toString(), auctionEndDate);
        System.out.println("✅ Scheduled jobs for room ID: " + roomId);
    }
}
