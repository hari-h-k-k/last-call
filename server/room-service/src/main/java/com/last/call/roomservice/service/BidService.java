package com.last.call.roomservice.service;

import com.last.call.roomservice.dto.BidUpdateMessage;
import com.last.call.roomservice.dto.LeaderboardEntry;
import com.last.call.roomservice.entity.Bid;
import com.last.call.roomservice.entity.Room;
import com.last.call.roomservice.repository.BidRepository;
import com.last.call.roomservice.repository.RoomRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BidService {

    private final BidRepository bidRepository;

    public BidService(BidRepository bidRepository) {
        this.bidRepository = bidRepository;
    }

    @Transactional
    public Bid saveBid(Bid bid) {
        return bidRepository.save(bid);
    }

    public void updateUserBid(Long userId, Double bidAmount, Long roomId) {

    }

    public List<Bid> getBidHistory(Long roomId) {
        return bidRepository.findByRoomIdOrderByCreatedAtDesc(roomId);
    }

    public List<LeaderboardEntry> getLeaderboard(Long roomId) {
        List<Bid> topBids = bidRepository.findTopBidsByRoom(roomId);
        return topBids.stream()
                .map(bid -> new LeaderboardEntry("User " + bid.getUserId(), bid.getAmount(), bid.getUserId()))
                .collect(Collectors.toList());
    }
}