package com.marketplace.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marketplace.demo.models.Item;
import com.marketplace.demo.models.User;

@Repository
public interface ItemRepository  extends JpaRepository<Item, String>{
	
	List<Item> findBySeller(User user);
}
