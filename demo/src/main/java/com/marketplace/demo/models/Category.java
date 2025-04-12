package com.marketplace.demo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="CATEGORIES")
public class Category {

	@Id
	@GeneratedValue(strategy=GenerationType.UUID)
	public String id;
	public String name;
	
	
	public Category(String id, String name) {
		this.id = id;
		this.name = name;
	}
	
	public Category() {
		
	}
	
	public Category(String name) {
		this.name = name;
	}

	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	
}
