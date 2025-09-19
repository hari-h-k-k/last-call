package com.last.call.userservice.dto;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private int statusCode;

    private ApiResponse(Builder<T> builder) {
        this.success = builder.success;
        this.message = builder.message;
        this.data = builder.data;
        this.statusCode = builder.statusCode;
    }

    public static <T> Builder<T> builder() {
        return new Builder<>();
    }

    public static class Builder<T> {
        private boolean success = true;
        private String message;
        private T data;
        private int statusCode = 200;

        public Builder<T> success(boolean success) {
            this.success = success;
            return this;
        }

        public Builder<T> message(String message) {
            this.message = message;
            return this;
        }

        public Builder<T> data(T data) {
            this.data = data;
            return this;
        }

        public Builder<T> statusCode(int statusCode) {
            this.statusCode = statusCode;
            return this;
        }

        public ApiResponse<T> build() {
            return new ApiResponse<>(this);
        }
    }
}