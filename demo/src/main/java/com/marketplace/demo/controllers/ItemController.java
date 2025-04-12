package com.marketplace.demo.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marketplace.demo.models.Item;
import com.marketplace.demo.models.dto.ItemStripped;
import com.marketplace.demo.services.ItemService;

@RestController
@RequestMapping("/items")
public class ItemController {
	
	@Autowired
	ItemService itemService;
	
	@GetMapping("/")
	public List<ItemStripped> getAllItems(){
		List<Item> list = itemService.getAllItems();
		return list.stream()
				.map(item -> new ItemStripped(item))
				.collect(Collectors.toList());
	}
	
	@GetMapping("/{item_id}")
	public ItemStripped getItem(@PathVariable("item_id") String item_id) {
		Item item = itemService.getItem(item_id);
		return new ItemStripped(item);
	}
	
	

}
