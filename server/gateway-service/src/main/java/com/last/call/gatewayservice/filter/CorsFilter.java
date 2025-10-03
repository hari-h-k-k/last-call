package com.last.call.gatewayservice.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class CorsFilter implements WebFilter {

    private static final Logger logger = LoggerFactory.getLogger(CorsFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();
        String method = exchange.getRequest().getMethod().toString();
        logger.debug("CORS filter processing: {} {}", method, path);
        
        HttpHeaders headers = exchange.getResponse().getHeaders();
        
        headers.add("Access-Control-Allow-Origin", "http://localhost:3000");
        headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Authorization, Content-Type");
        headers.add("Access-Control-Allow-Credentials", "true");

        if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) {
            logger.info("Handling OPTIONS preflight request for: {}", path);
            exchange.getResponse().setStatusCode(HttpStatus.OK);
            return exchange.getResponse().setComplete();
        }

        return chain.filter(exchange)
                .onErrorResume(throwable -> {
                    logger.error("Error in CORS filter for {} {}: {}", method, path, throwable.getMessage());
                    exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
                    return exchange.getResponse().setComplete();
                });
    }
}