package com.bidding.backend.service;

import com.bidding.backend.entity.Room;
import com.bidding.backend.repository.RoomRepository;
import com.bidding.backend.utils.enums.RoomStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public void saveRoom(Room room) {
        roomRepository.save(room);
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id).orElse(null);
    }

    public void openRoomForItem(String roomId) {
        Room room= roomRepository.findById(roomId).orElse(null);
        if(room!=null) {
            room.setStatus(String.valueOf(RoomStatus.ACTIVE));
            roomRepository.save(room);
        }
    }

    public void closeRoomForItem(String roomId) {
        Room room= roomRepository.findById(roomId).orElse(null);
        if(room!=null) {
            room.setStatus(String.valueOf(RoomStatus.CLOSED));
            roomRepository.save(room);
        }
    }
}
