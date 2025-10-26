package com.last.call.roomservice.dto;

public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T subject;
    private int statusCode;

    private ApiResponse(Builder<T> builder) {
        this.success = builder.success;
        this.message = builder.message;
        this.subject = builder.subject;
        this.statusCode = builder.statusCode;
    }

    public static <T> Builder<T> builder() {
        return new Builder<>();
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public T getSubject() { return subject; }
    public int getStatusCode() { return statusCode; }

    @Override
    public String toString() {
        return "ApiResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", subject=" + subject +
                ", statusCode=" + statusCode +
                '}';
    }

    public static class Builder<T> {
        private boolean success = true;
        private String message;
        private T subject;
        private int statusCode = 200;

        public Builder<T> success(boolean success) {
            this.success = success;
            return this;
        }

        public Builder<T> message(String message) {
            this.message = message;
            return this;
        }

        public Builder<T> subject(T subject) {
            this.subject = subject;
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