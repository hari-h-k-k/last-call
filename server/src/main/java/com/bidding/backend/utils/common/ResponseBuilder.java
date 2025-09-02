package com.bidding.backend.utils.common;

import java.util.HashMap;
import java.util.Map;

public class ResponseBuilder {

    private Map<String, Object> response = new HashMap<>();

    public ResponseBuilder setStatus(String status) {
        response.put("status", status);
        return this;
    }

    public ResponseBuilder setMessage(String message) {
        response.put("message", message);
        return this;
    }

    public ResponseBuilder setInfo(Object info) {
        response.put("info", info);
        return this;
    }

    public Map<String, Object> build() {
        return response;
    }

}
