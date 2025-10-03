package com.last.call.roomservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "room_users")
public class RoomUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false, name = "user_id")
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_room_user"))
    private String userId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_room"))
    @JsonIgnore
    private Room room;

    public RoomUser() {}

    public RoomUser(String userId, Room room) {
        this.userId = userId;
        this.room = room;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }
}
