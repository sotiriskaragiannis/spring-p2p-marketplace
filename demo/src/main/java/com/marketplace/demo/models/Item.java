package com.marketplace.demo.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
	@ManyToOne
	@JoinColumn(name="seller_id", referencedColumnName="id")
	public User seller;
	public double price;
	public String description;
	public String itemCondition;
	public boolean sold;
	@OneToMany(mappedBy="item", cascade=CascadeType.ALL)
	public List<Image> images = new ArrayList<Image>();
	private int favoriteCount = 0;	
	
	
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

	public List<Image> getImages() {
		return images;
	}

	public void setItemImages(List<Image> images) {
		this.images = images;
	}
	
	public void addImageToItem(Image image) {
		this.images.add(image);
	}
	
	public void removeImageFromItem(Image image) {
		this.images.remove(image);
	}
	
	public int getFavoriteCount() {
	    return favoriteCount;
	}

	public void setFavoriteCount(int favoriteCount) {
	    this.favoriteCount = favoriteCount;
	}

	public void incrementFavoriteCount() {
	    this.favoriteCount++;
	}

	public void decrementFavoriteCount() {
	    if (this.favoriteCount > 0) {
	        this.favoriteCount--;
	    }
	}

}
