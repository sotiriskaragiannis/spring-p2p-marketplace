package com.marketplace.demo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="ITEMS")
public class Item {
	
	@Id
	@GeneratedValue(strategy=GenerationType.UUID)
	public String id;
	public String title;
	@ManyToOne
	@JoinColumn(name="category_id", referencedColumnName="id")
	public Category category;
	@OneToOne
	@JoinColumn(name="seller_id", referencedColumnName="id")
	public User seller;
	public double price;
	public String description;
	public String itemCondition;
	public boolean sold;
	
	
	public Item(String id, String title, Category category, User seller, double price, String description,
			String itemCondition, boolean sold) {
		this.id = id;
		this.title = title;
		this.category = category;
		this.seller = seller;
		this.price = price;
		this.description = description;
		this.itemCondition = itemCondition;
		this.sold = sold;
	}
	
	public Item(String title, Category category, User seller, double price, String description, String itemCondition,
			boolean sold) {
		this.title = title;
		this.category = category;
		this.seller = seller;
		this.price = price;
		this.description = description;
		this.itemCondition = itemCondition;
		this.sold = sold;
	}

	public Item() {
		
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
	
	public Category getCategory() {
		return category;
	}
	
	public void setCategory(Category category) {
		this.category = category;
	}
	
	public User getSeller() {
		return seller;
	}
	
	public void setSeller(User seller) {
		this.seller = seller;
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
