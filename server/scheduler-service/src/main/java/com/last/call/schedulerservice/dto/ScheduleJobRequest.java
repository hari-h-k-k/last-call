package com.last.call.schedulerservice.dto;

import java.util.Date;

public class ScheduleJobRequest {
    private String eventType;
    private Long entityId;
    private Date scheduleTime;

    public ScheduleJobRequest() {}

    public ScheduleJobRequest(String eventType, Long entityId, Date scheduleTime) {
        this.eventType = eventType;
        this.entityId = entityId;
        this.scheduleTime = scheduleTime;
    }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public Date getScheduleTime() { return scheduleTime; }
    public void setScheduleTime(Date scheduleTime) { this.scheduleTime = scheduleTime; }
}