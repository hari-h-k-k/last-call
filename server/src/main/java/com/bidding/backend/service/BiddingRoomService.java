package com.bidding.backend.service;

import com.bidding.backend.entity.BiddingRoom;
import com.bidding.backend.repository.BiddingRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BiddingRoomService {

    @Autowired
    private BiddingRoomRepository biddingRoomRepository;

    public BiddingRoomService(BiddingRoomRepository biddingRoomRepository) {
        this.biddingRoomRepository = biddingRoomRepository;
    }

    public void saveBiddingRoom(BiddingRoom biddingRoom) {
        biddingRoomRepository.save(biddingRoom);
    }

    public void startBiddingRoom() {
        // Implement logic to start a bidding room
    }

}
