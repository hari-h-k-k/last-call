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

}