//package com.bidding.backend.config;
//
//import com.bidding.backend.utils.jwt.JwtUtil;
//import org.springframework.http.server.ServerHttpRequest;
//import org.springframework.http.server.ServerHttpResponse;
//import org.springframework.web.socket.WebSocketHandler;
//import org.springframework.web.socket.server.HandshakeInterceptor;
//
//import java.util.Map;
//
//public class JwtHandshakeInterceptor implements HandshakeInterceptor {
//
//    private final JwtUtil jwtUtil;
//
//    public JwtHandshakeInterceptor(JwtUtil jwtUtil) {
//        this.jwtUtil = jwtUtil;
//    }
//
//    @Override
//    public boolean beforeHandshake(ServerHttpRequest request,
//                                   ServerHttpResponse response,
//                                   WebSocketHandler wsHandler,
//                                   Map<String, Object> attributes) throws Exception {
//
//        String path = request.getURI().getPath();
//
//        // Skip SockJS /info requests
//        if (path.endsWith("/info")) {
//            return true;
//        }
//
//        String authHeader = request.getHeaders().getFirst("Authorization");
//
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            String token = authHeader.substring(7);
//            String userId = jwtUtil.extractUserId(token);
//            if (userId != null) {
//                attributes.put("userId", userId);
//                return true;
//            }
//        }
//
//        return false;
//    }
//
//
//    @Override
//    public void afterHandshake(ServerHttpRequest request,
//                               ServerHttpResponse response,
//                               WebSocketHandler wsHandler,
//                               Exception exception) {
//        // no-op
//    }
//}
