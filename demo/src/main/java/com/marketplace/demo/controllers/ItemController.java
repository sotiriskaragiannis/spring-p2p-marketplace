package com.marketplace.demo.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.marketplace.demo.models.Item;
import com.marketplace.demo.models.dto.ItemInputDTO;
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
	
	@DeleteMapping("{item_id}")
	public void removeItem(@PathVariable("item_id") String item_id) {
		itemService.removeItem(item_id);
	}
	
	@PostMapping("/")
	public ItemStripped createItem(@RequestBody ItemInputDTO itemInput) {
		Item item = itemService.createItem(itemInput);
		return new ItemStripped(item);
	}
	
	@PutMapping("/{item_id}")
	public ItemStripped updateItem(@PathVariable("item_id") String item_id, @RequestBody ItemInputDTO itemInput) {
		Item item = itemService.updateItem(item_id, itemInput);
		return new ItemStripped(item);
	}
	
	@PostMapping(path = "/{item_id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ItemStripped uploadImageToItem(@PathVariable("item_id") String item_id, @RequestPart("image_file") MultipartFile image_file) {
		Item item = itemService.uploadImageToItem(item_id, image_file);
		return new ItemStripped(item);
	}

}
