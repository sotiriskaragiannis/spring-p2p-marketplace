package com.marketplace.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.marketplace.demo.models.Item;
import com.marketplace.demo.models.User;
import com.marketplace.demo.repositories.ItemRepository;

@Service
public class ItemService {
	
	@Autowired
	ItemRepository itemRepository;

	public List<Item> getAllItems() {
		return itemRepository.findAll();
	}

	public Item getItem(String item_id) {
		Optional<Item> itemOptional = itemRepository.findById(item_id);
		
		if (itemOptional.isPresent()) {
			return itemOptional.get();
		} else {			
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not Found");
		}
	}

	public List<Item> getItemsOfUser(User u) {
		return itemRepository.findBySeller(u);
	}
}
