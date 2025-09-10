package com.bidding.backend.service;

import com.bidding.backend.entity.Item;
import com.bidding.backend.entity.Room;
import com.bidding.backend.repository.ItemRepository;
import com.bidding.backend.repository.RoomRepository;
import com.bidding.backend.utils.enums.RoomStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

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

    public void createRoom(Item item) {
        if(item == null) {
            return;
        }
        Room room = new Room.Builder()
                .itemId(item.getId())
                .startDate(item.getAuctionStartDate())
                .status(RoomStatus.PENDING.name())
                .currentPrice(item.getStartingPrice())
                .listOfUserIds(item.getSubscribersId())
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();

        roomRepository.save(room);
    }


    public void openRoomForItem(String itemId) {
        Room room = roomRepository.findByItemId(itemId);
        if(room!=null) {
            room.setStatus(RoomStatus.ACTIVE.name());
            room.setUpdatedAt(new Date());
            roomRepository.save(room);
        }
    }

    public void closeRoomForItem(String itemId) {
        Room room = roomRepository.findByItemId(itemId);
        if(room!=null) {
            room.setStatus(RoomStatus.CLOSED.name());
            room.setUpdatedAt(new Date());
            roomRepository.save(room);
        }
    }

    public void updateCurrentBid(String roomId, String userId, double currentPrice) {
        Room room = roomRepository.findById(roomId).orElse(null);
        if(room != null) {
            room.updateRoomBid(userId, currentPrice);
            room.setUpdatedAt(new Date());
            roomRepository.save(room);
        }
    }
}
