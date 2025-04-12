package com.marketplace.demo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="IMAGES")
public class Image {
	
	@Id
	@GeneratedValue(strategy=GenerationType.UUID)
	String id;
	@ManyToOne
	@JoinColumn(name="item_id", referencedColumnName="id")
	@JsonIgnore
	Item item;
	@JsonIgnore
	String image_path;
	
	
	public Image(String id, Item item, String image_path) {
		this.id = id;
		this.item = item;
		this.image_path = image_path;
	}
	
	public Image(Item item, String image_path) {
		this.item = item;
		this.image_path = image_path;
	}
	
	public Image() {
		
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Item getItem() {
		return item;
	}

	public void setItem(Item item) {
		this.item = item;
	}

	public String getImage_path() {
		return image_path;
	}

	public void setImage_path(String image_path) {
		this.image_path = image_path;
	}
	
}
