package com.bidding.backend.controller;

import com.bidding.backend.service.RoomService;
import com.bidding.backend.service.UserService;
import com.bidding.backend.utils.common.ResponseBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class RoomController {

    private RoomService roomService;

    private UserService userService;

    @Autowired
    public RoomController(RoomService roomService, UserService userService) {
        this.roomService = roomService;
        this.userService = userService;
    }

    @GetMapping("/get-room")
    public ResponseEntity<Object> getRoom(@RequestParam String roomId) {
        Map<String, Object> info = new HashMap<>();
        info.put("room", roomService.getRoomById(roomId));

        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Room fetched successfully!")
                .setInfo(info)
                .build();

        return ResponseEntity.status(200).body(response);
    }
}
