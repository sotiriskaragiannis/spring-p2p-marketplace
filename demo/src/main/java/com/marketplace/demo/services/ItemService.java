package com.marketplace.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.marketplace.demo.models.Category;
import com.marketplace.demo.models.Item;
import com.marketplace.demo.models.User;
import com.marketplace.demo.models.dto.ItemInputDTO;
import com.marketplace.demo.repositories.CategoryRepository;
import com.marketplace.demo.repositories.ItemRepository;
import com.marketplace.demo.repositories.UserRepository;

@Service
public class ItemService {
	
	@Autowired
	ItemRepository itemRepository;
	@Autowired
	CategoryRepository categoryRepository;
	@Autowired
	UserRepository userRepository;

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

	public void removeItem(String item_id) {
		Optional<Item> itemOptional = itemRepository.findById(item_id);
		
		if (itemOptional.isPresent()) {
			itemRepository.deleteById(item_id);
		} else {			
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not Found");
		}
	}

	public Item createItem(ItemInputDTO itemInput) {
		// First find and set category
		String category_id = itemInput.getCategory_id();
		Category category;
		
		if (category_id == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category id is required for an item");
		}
		
		Optional<Category> categoryOptional = categoryRepository.findById(category_id);
		
		if (!categoryOptional.isPresent()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not Found");
		}
		
		// Do the same for the seller (User)
		String seller_id = itemInput.getSeller_id();
		User seller;
		
		if (seller_id == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seller id is required for an item");
		}
		
		Optional<User> sellerOptional = userRepository.findById(seller_id);
		
		if (!sellerOptional.isPresent()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Seller not Found");

		}
		
		category = categoryOptional.get();
		seller = sellerOptional.get();
		
		Item newItem = new Item(itemInput.getTitle(), category, seller, itemInput.getPrice(), itemInput.getDescription(), itemInput.getItemCondition(), itemInput.isSold());
		
		itemRepository.save(newItem);
		
		return newItem;
	}
}
