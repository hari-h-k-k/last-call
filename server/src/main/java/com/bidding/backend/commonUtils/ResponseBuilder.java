package com.bidding.backend.commonUtils;

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

    public ResponseBuilder setData(Object data) {
        response.put("data", data);
        return this;
    }

    public Map<String, Object> build() {
        return response;
    }

}
