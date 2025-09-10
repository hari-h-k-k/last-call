package com.bidding.backend.service;

import com.bidding.backend.entity.Room;
import com.bidding.backend.repository.ItemRepository;
import com.bidding.backend.repository.RoomRepository;
import com.bidding.backend.utils.enums.RoomStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ItemRepository itemRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public void saveRoom(Room room) {
        roomRepository.save(room);
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id).orElse(null);
    }

    public void closeRegistrationForItem(String itemId) {
        Room room = roomRepository.findByItemId(itemId);
        if(room!=null) {
            room.setStatus(RoomStatus.PENDING.name());
            roomRepository.save(room);
        }
    }

    public void openRoomForItem(String itemId) {
        Room room = roomRepository.findByItemId(itemId);
        if(room!=null) {
            room.setStatus(RoomStatus.ACTIVE.name());
            roomRepository.save(room);
        }
    }

    public void closeRoomForItem(String itemId) {
        Room room = roomRepository.findByItemId(itemId);
        if(room!=null) {
            room.setStatus(RoomStatus.CLOSED.name());
            roomRepository.save(room);
        }
    }
}
