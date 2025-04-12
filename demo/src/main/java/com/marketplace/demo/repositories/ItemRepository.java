package com.marketplace.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marketplace.demo.models.Item;

@Repository
public interface ItemRepository  extends JpaRepository<Item, String>{

}
