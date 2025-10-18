package com.last.call.itemservice.entity;

import com.last.call.itemservice.enums.ItemCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.Date;
import java.util.List;


@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String title;

    @Size(max = 1000)
    private String description;

    @NotNull
    @Column(nullable = false, name = "seller_id")
    @JoinColumn(name = "seller_id", foreignKey = @ForeignKey(name = "fk_item_seller"))
    private Long sellerId;

    @DecimalMin("0.0")
    @Column(nullable = false, name = "starting_price")
    private double startingPrice;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemCategory category;

    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, name = "registration_closing_date")
    private Date registrationClosingDate;

    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, name = "auction_start_date")
    private Date auctionStartDate;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ItemTag> tags;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ItemSubscriber> subscribers;

    public Item() {
        this.tags = new java.util.ArrayList<>();
        this.subscribers = new java.util.ArrayList<>();
    }

    public Item(String title, String description, Long sellerId, double startingPrice, 
                ItemCategory category, Date registrationClosingDate, Date auctionStartDate) {
        this();
        this.title = title;
        this.description = description;
        this.sellerId = sellerId;
        this.startingPrice = startingPrice;
        this.category = category;
        this.registrationClosingDate = registrationClosingDate;
        this.auctionStartDate = auctionStartDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public double getStartingPrice() { return startingPrice; }
    public void setStartingPrice(double startingPrice) { this.startingPrice = startingPrice; }

    public ItemCategory getCategory() { return category; }
    public void setCategory(ItemCategory category) { this.category = category; }

    public Date getRegistrationClosingDate() { return registrationClosingDate; }
    public void setRegistrationClosingDate(Date registrationClosingDate) { this.registrationClosingDate = registrationClosingDate; }

    public Date getAuctionStartDate() { return auctionStartDate; }
    public void setAuctionStartDate(Date auctionStartDate) { this.auctionStartDate = auctionStartDate; }

    public List<ItemTag> getTags() { return tags; }
    public void setTags(List<ItemTag> tags) { this.tags = tags; }

    public List<ItemSubscriber> getSubscribers() { return subscribers; }
    public void setSubscribers(List<ItemSubscriber> subscribers) { this.subscribers = subscribers; }

    @Override
    public String toString() {
        return "Item{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", sellerId=" + sellerId +
                ", startingPrice=" + startingPrice +
                ", category=" + category +
                ", registrationClosingDate=" + registrationClosingDate +
                ", auctionStartDate=" + auctionStartDate +
                '}';
    }
}

