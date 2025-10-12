package com.last.call.gatewayservice.filter;

import com.last.call.gatewayservice.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import org.springframework.http.MediaType;
import java.nio.charset.StandardCharsets;
import java.util.Set;

@Component
public class JwtAuthenticationFilter implements WebFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final Set<String> PUBLIC_PATHS = Set.of(
        "/user/register", "/user/login", "/item/categories", "/room/live-auctions", "/room/auction-of-the-day"
    );
    private static final Set<String> PERMITTED_PATHS = Set.of(
            "/item/search-items", "/item/last-call-to-register"
    );

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();
        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        logger.info("Processing request: {}", path);
//        logger.info("Processing authHeader: {}", authHeader);
        
        // Handle WebSocket upgrade requests
        if (path.startsWith("/ws-auction") && isWebSocketUpgrade(exchange)) {
            return handleWebSocketAuth(exchange, chain, authHeader);
        }

        if (PUBLIC_PATHS.stream().anyMatch(path::startsWith)) {
            logger.info("Bypassing JWT validation for path: {}", path);
            return chain.filter(exchange);
        }

        if (PERMITTED_PATHS.stream().anyMatch(path::startsWith) && (authHeader == null || !authHeader.startsWith("Bearer "))) {
            logger.info("Bypassing JWT validation for path: {}", path);
            return chain.filter(exchange);
        }

        boolean isPermittedPath = PERMITTED_PATHS.stream().anyMatch(path::startsWith);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            if (!isPermittedPath) {
                logger.warn("Missing or invalid Authorization header for path: {}", path);
                return unauthorizedResponse(exchange, "Missing or invalid Authorization header");
            }
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            if (!isPermittedPath) {
                logger.warn("Invalid or expired token for path: {}", path);
                return unauthorizedResponse(exchange, "Invalid or expired token");
            }
        }

        // Add user ID to request headers for downstream services
        String userId = jwtUtil.extractUserId(token);
        logger.debug("Valid token for user: {} on path: {}", userId, path);
        ServerWebExchange modifiedExchange = exchange.mutate()
                .request(exchange.getRequest().mutate()
                        .header("X-User-Id", userId)
                        .build())
                .build();

        return chain.filter(modifiedExchange);
    }
    
    private boolean isWebSocketUpgrade(ServerWebExchange exchange) {
        return "websocket".equalsIgnoreCase(
            exchange.getRequest().getHeaders().getFirst("Upgrade"));
    }
    
    private Mono<Void> handleWebSocketAuth(ServerWebExchange exchange, WebFilterChain chain, String authHeader) {
        String token = null;
        
        // Debug logging
        logger.info("Query params: {}", exchange.getRequest().getQueryParams());
        logger.info("URI: {}", exchange.getRequest().getURI());
        
        // Try header first, then query parameter
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else {
            token = exchange.getRequest().getQueryParams().getFirst("token");
        }
        
        logger.info("Extracted token: {}", token != null ? "[PRESENT]" : "[MISSING]");
        
        if (token == null) {
            logger.warn("WebSocket connection denied: Missing token");
            return unauthorizedResponse(exchange, "Missing token");
        }
        if (!jwtUtil.validateToken(token)) {
            logger.warn("WebSocket connection denied: Invalid token");
            return unauthorizedResponse(exchange, "Invalid token");
        }
        
        String userId = jwtUtil.extractUserId(token);
        ServerWebExchange modifiedExchange = exchange.mutate()
                .request(exchange.getRequest().mutate()
                        .header("X-User-Id", userId)
                        .build())
                .build();
        
        logger.info("WebSocket connection authorized for user: {}", userId);
        return chain.filter(modifiedExchange);
    }

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        byte[] bytes = ("{\"error\":\"" + message + "\"}").getBytes(StandardCharsets.UTF_8);
        return exchange.getResponse().writeWith(Mono.just(exchange.getResponse()
                .bufferFactory().wrap(bytes)));
    }

}