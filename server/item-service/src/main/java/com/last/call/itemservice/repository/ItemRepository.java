package com.last.call.itemservice.repository;

import com.last.call.itemservice.entity.Item;
import com.last.call.itemservice.enums.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    
    List<Item> findBySellerId(Long sellerId);
    
    List<Item> findByCategory(ItemCategory category);

    @Query("SELECT i FROM Item i WHERE i.registrationClosingDate > :currentDate")
    List<Item> findActiveItems(@Param("currentDate") Date currentDate);

    @Query("SELECT i.category, COUNT(i) FROM Item i GROUP BY i.category")
    List<Object[]> countByCategory();
    
    @Query("SELECT i FROM Item i WHERE i.registrationClosingDate BETWEEN :startDate AND :endDate ORDER BY i.registrationClosingDate")
    List<Item> findItemsWithRegistrationClosingBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    
    @Query("SELECT i FROM Item i WHERE " +
            "(:category IS NULL OR i.category = :category) AND " +
            "(:priceMin IS NULL OR i.startingPrice >= :priceMin) AND " +
            "(:priceMax IS NULL OR i.startingPrice <= :priceMax) AND " +
            "(:auctionStatus IS NULL OR " +
            "  (:auctionStatus = 'registration-open' AND i.registrationClosingDate > :currentDate AND i.auctionStartDate > :currentDate) OR " +
            "  (:auctionStatus = 'registration-closed' AND i.registrationClosingDate <= :currentDate AND i.auctionStartDate > :currentDate) OR " +
            "  (:auctionStatus = 'auction-started' AND i.auctionStartDate <= :currentDate)) " +
            "ORDER BY " +
            "CASE WHEN :sortBy = 'price-low' THEN i.startingPrice END ASC, " +
            "CASE WHEN :sortBy = 'price-high' THEN i.startingPrice END DESC")
    List<Item> findItemsWithFilters(@Param("category") ItemCategory category,
                                   @Param("priceMin") Double priceMin,
                                   @Param("priceMax") Double priceMax,
                                   @Param("auctionStatus") String auctionStatus,
                                   @Param("sortBy") String sortBy,
                                   @Param("currentDate") Date currentDate);
                                   
    @Query("SELECT i FROM Item i LEFT JOIN i.tags t WHERE " +
            "(LOWER(i.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(i.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(i.category) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(t.tag) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "(:category IS NULL OR i.category = :category) AND " +
            "(:priceMin IS NULL OR i.startingPrice >= :priceMin) AND " +
            "(:priceMax IS NULL OR i.startingPrice <= :priceMax) AND " +
            "(:auctionStatus IS NULL OR " +
            "  (:auctionStatus = 'registration-open' AND i.registrationClosingDate > :currentDate AND i.auctionStartDate > :currentDate) OR " +
            "  (:auctionStatus = 'registration-closed' AND i.registrationClosingDate <= :currentDate AND i.auctionStartDate > :currentDate) OR " +
            "  (:auctionStatus = 'auction-started' AND i.auctionStartDate <= :currentDate)) " +
            "ORDER BY " +
            "CASE WHEN :sortBy = 'price-low' THEN i.startingPrice END ASC, " +
            "CASE WHEN :sortBy = 'price-high' THEN i.startingPrice END DESC")
    List<Item> searchItemsWithFilters(@Param("searchTerm") String searchTerm,
                                     @Param("category") ItemCategory category,
                                     @Param("priceMin") Double priceMin,
                                     @Param("priceMax") Double priceMax,
                                     @Param("auctionStatus") String auctionStatus,
                                     @Param("sortBy") String sortBy,
                                     @Param("currentDate") Date currentDate);
}