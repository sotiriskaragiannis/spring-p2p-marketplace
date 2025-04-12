package com.marketplace.demo.models.dto;

import com.marketplace.demo.models.Category;
import com.marketplace.demo.models.Item;
import com.marketplace.demo.models.User;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

//Data Transfer Object for Item
//	- Flattens seller and category
//  - instead of seller(json object) and category(json object) in the result, 
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
	
	
	public ItemStripped(Item item) {
		this.id = item.getId();
		this.title = item.getTitle();
		this.category_id = item.getCategory().getId();
		this.seller_id = item.getSeller().getId();
		this.price = item.getPrice();
		this.description = item.getDescription();
		this.itemCondition = item.getItemCondition();
		this.sold = item.isSold();
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
	
}
