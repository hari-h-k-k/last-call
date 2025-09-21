package com.last.call.itemservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "item_subscribers")
public class ItemSubscriber {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false, name = "user_id")
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_item_subscriber_user"))
    private String userId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false, foreignKey = @ForeignKey(name = "fk_item_subscriber_item"))
    private Item item;

    public ItemSubscriber() {}

    public ItemSubscriber(String userId, Item item) {
        this.userId = userId;
        this.item = item;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
}

