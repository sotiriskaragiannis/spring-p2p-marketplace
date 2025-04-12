package com.marketplace.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.marketplace.demo.models.Item;
import com.marketplace.demo.repositories.ItemRepository;

@Service
public class ItemService {
	
	@Autowired
	ItemRepository itemRepository;

	public List<Item> getAllItems() {
		return itemRepository.findAll();
	}
}
