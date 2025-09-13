package com.bidding.backend.utils.jwt;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    public JwtChannelInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        StompCommand command = accessor.getCommand();
        if (command != null) {
            System.out.println("STOMP command: " + command); // debug
        }

        if (StompCommand.CONNECT.equals(command)) {
            String token = accessor.getFirstNativeHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                if (!jwtUtil.validateToken(token)) {
                    throw new IllegalArgumentException("Invalid JWT token");
                }
                accessor.setUser(jwtUtil.getAuthentication(token));
            } else {
                throw new IllegalArgumentException("Missing Authorization header");
            }
        }

        return message;
    }

}

