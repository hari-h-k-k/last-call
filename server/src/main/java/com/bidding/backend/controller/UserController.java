package com.bidding.backend.controller;

import com.bidding.backend.entity.User;
import com.bidding.backend.service.RoomService;
import com.bidding.backend.service.UserService;
import com.bidding.backend.utils.common.ResponseBuilder;
import com.bidding.backend.utils.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final RoomService roomService;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserController(UserService userService, RoomService roomService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.roomService = roomService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<Object> placeBid(@RequestParam String roomId, @RequestParam Double amount, @RequestHeader(value = "Authorization", required = false) String token) {

        String userId = null;

        if (token != null && token.startsWith("Bearer ")) {
            userId = jwtUtil.extractUserId(token.substring(7));
        }

        userService.placeBid(roomId, userId, amount);
        roomService.updateCurrentBid(roomId, userId, amount);

        Map<String, Object> response = new ResponseBuilder()
                .setStatus("success")
                .setMessage("Item removed successfully!")
                .build();
        return ResponseEntity.status(200).body(response);
    }
}