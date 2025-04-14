package com.marketplace.demo.models.dto;


// A Data Transfer Object for creating or updating an item
// Gets seller_id and category_id instead of objects for them
public class ItemInputDTO {
	
	public String id;
	public String title;
	public String category_id;
	public String seller_id;
	public Double price;
	public String description;
	public String itemCondition;
	public Boolean sold;
	
	
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
	
	public Double getPrice() {
		return price;
	}
	
	public void setPrice(Double price) {
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
	
	public Boolean isSold() {
		return sold;
	}
	
	public void setSold(Boolean sold) {
		this.sold = sold;
	}
	
}

