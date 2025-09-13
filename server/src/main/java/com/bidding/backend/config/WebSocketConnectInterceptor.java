//package com.bidding.backend.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.messaging.support.ChannelInterceptor;
//import org.springframework.messaging.Message;
//import org.springframework.messaging.MessageChannel;
//import org.springframework.stereotype.Component;
//
//import java.util.Map;
//
//@Component
//public class WebSocketConnectInterceptor implements ChannelInterceptor {
//
//    private final SimpMessagingTemplate messagingTemplate;
//
//    @Autowired
//    public WebSocketConnectInterceptor(SimpMessagingTemplate messagingTemplate) {
//        this.messagingTemplate = messagingTemplate;
//    }
//
//    @Override
//    public Message<?> preSend(Message<?> message, MessageChannel channel) {
//        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
//
//        if (accessor.getCommand() != null && accessor.getCommand().name().equals("CONNECT")) {
//            String sessionId = accessor.getSessionId();
//
//            // Send welcome message to this user/session
//            messagingTemplate.convertAndSendToUser(
//                    sessionId,
//                    "/queue/welcome",
//                    Map.of("status", "connected", "message", "Welcome to the auction!")
//            );
//        }
//
//        return message;
//    }
//}
