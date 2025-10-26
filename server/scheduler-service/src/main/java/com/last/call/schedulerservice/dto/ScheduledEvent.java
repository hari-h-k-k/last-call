package com.last.call.schedulerservice.dto;

public class ScheduledEvent {
    private String eventType;
    private Long entityId;

    public ScheduledEvent() {}

    public ScheduledEvent(String eventType, Long entityId) {
        this.eventType = eventType;
        this.entityId = entityId;
    }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
}