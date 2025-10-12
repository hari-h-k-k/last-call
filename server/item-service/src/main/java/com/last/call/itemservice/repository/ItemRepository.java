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
    
    List<Item> findByAuctionStartDateBetween(Date startDate, Date endDate);
    
    @Query("SELECT i FROM Item i WHERE i.registrationClosingDate > :currentDate")
    List<Item> findActiveItems(@Param("currentDate") Date currentDate);
    
    @Query("SELECT DISTINCT i FROM Item i LEFT JOIN i.tags t WHERE " +
           "LOWER(i.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(i.category) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.tag) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY " +
           "CASE " +
           "WHEN LOWER(i.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) THEN 1 " +
           "WHEN LOWER(i.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) THEN 2 " +
           "WHEN LOWER(i.category) LIKE LOWER(CONCAT('%', :searchTerm, '%')) THEN 3 " +
           "WHEN LOWER(t.tag) LIKE LOWER(CONCAT('%', :searchTerm, '%')) THEN 4 " +
           "ELSE 5 END, i.title")
    List<Item> searchItems(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT i.category, COUNT(i) FROM Item i GROUP BY i.category")
    List<Object[]> countByCategory();
    
    @Query("SELECT i FROM Item i WHERE i.registrationClosingDate BETWEEN :startDate AND :endDate ORDER BY i.registrationClosingDate")
    List<Item> findItemsWithRegistrationClosingBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}