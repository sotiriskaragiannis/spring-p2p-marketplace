package com.marketplace.demo.models.dto;

import java.util.List;

import com.marketplace.demo.models.Image;
import com.marketplace.demo.models.Item;


//Data Transfer Object for Item
//	- Flattens seller and category
//  - instead of seller(JSON object) and category(JSON object) in the result, 
//		the result has seller_id and category_id
public class ItemStripped {

	public String id;
	public String title;
	public String category_id;
	public String seller_id;
	public double price;
	public String description;
	public String itemCondition;
	public boolean sold;
	public List<Image> images;
	
	
	public ItemStripped(Item item) {
		this.id = item.getId();
		this.title = item.getTitle();
		this.category_id = item.getCategory().getId();
		this.seller_id = item.getSeller().getId();
		this.price = item.getPrice();
		this.description = item.getDescription();
		this.itemCondition = item.getItemCondition();
		this.sold = item.isSold();
		this.images = item.getImages();
	}

	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getCategory_id() {
		return category_id;
	}
	
	public void setCategory_id(String category_id) {
		this.category_id = category_id;
	}
	
	public String getSeller_id() {
		return seller_id;
	}
	
	public void setSeller_id(String seller_id) {
		this.seller_id = seller_id;
	}
	
	public double getPrice() {
		return price;
	}
	
	public void setPrice(double price) {
		this.price = price;
	}
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public String getItemCondition() {
		return itemCondition;
	}
	
	public void setItemCondition(String itemCondition) {
		this.itemCondition = itemCondition;
	}
	
	public boolean isSold() {
		return sold;
	}
	
	public void setSold(boolean sold) {
		this.sold = sold;
	}

	public List<Image> getImages() {
		return images;
	}

	public void setImages(List<Image> images) {
		this.images = images;
	}
	
}
