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
        "/user/register", "/user/login", "/item/search-items", "/item/categories", "/item/last-call-to-register", "/room/live-auctions", "/room/auction-of-the-day"
    );
    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();
        logger.info("Processing request: {}", path);

        if (PUBLIC_PATHS.stream().anyMatch(path::startsWith)) {
            logger.info("Bypassing JWT validation for path: {}", path);
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Missing or invalid Authorization header for path: {}", path);
            return unauthorizedResponse(exchange, "Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            logger.warn("Invalid or expired token for path: {}", path);
            return unauthorizedResponse(exchange, "Invalid or expired token");
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

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        byte[] bytes = ("{\"error\":\"" + message + "\"}").getBytes(StandardCharsets.UTF_8);
        return exchange.getResponse().writeWith(Mono.just(exchange.getResponse()
                .bufferFactory().wrap(bytes)));
    }

}