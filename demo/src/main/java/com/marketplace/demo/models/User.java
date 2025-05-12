package com.marketplace.demo.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name="USERS")
public class User {

	@Id
	@GeneratedValue(strategy=GenerationType.UUID)
	private String id;
	private String username;
	private String full_name;
	private String email;
	private String password;
	private String bio;
	private String country;
	private String city;
	private String phone_number;
	@OneToMany(mappedBy="seller", cascade=CascadeType.ALL)
	@JsonIgnore
	private List<Item> items;
	@OneToMany(mappedBy="reviewer", cascade=CascadeType.ALL)
	private List<Review> writtenReviews = new ArrayList<Review>();
	@OneToMany(mappedBy="reviewee", cascade=CascadeType.ALL)
	private List<Review> receivedReviews = new ArrayList<Review>();
	@ManyToMany
	@JoinTable(
	    name = "FAVORITES",
	    joinColumns = @JoinColumn(name = "user_id"),
	    inverseJoinColumns = @JoinColumn(name = "item_id")
	)
	@JsonIgnore
	private List<Item> favoriteItems = new ArrayList<>();
	

	public User(String id, String username, String full_name, String email, String password, String bio, String country,
			String city, String phone_number) {
		this.id = id;
		this.username = username;
		this.full_name = full_name;
		this.email = email;
		this.password = password;
		this.bio = bio;
		this.country = country;
		this.city = city;
		this.phone_number = phone_number;
	}
	
	public User(String username, String full_name, String email, String password, String bio, String country,
			String city, String phone_number) {
		this.username = username;
		this.full_name = full_name;
		this.email = email;
		this.password = password;
		this.bio = bio;
		this.country = country;
		this.city = city;
		this.phone_number = phone_number;
	}

	public User() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFull_name() {
		return full_name;
	}

	public void setFull_name(String full_name) {
		this.full_name = full_name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getPhone_number() {
		return phone_number;
	}

	public void setPhone_number(String phone_number) {
		this.phone_number = phone_number;
	}
	
	public List<Item> getItems() {
		return items;
	}

	public void setItems(List<Item> items) {
		this.items = items;
	}

	public List<Review> getWrittenReviews() {
		return writtenReviews;
	}

	public void setWrittenReviews(List<Review> writtenReviews) {
		this.writtenReviews = writtenReviews;
	}

	public List<Review> getReceivedReviews() {
		return receivedReviews;
	}

	public void setReceivedReviews(List<Review> receivedReviews) {
		this.receivedReviews = receivedReviews;
	}
	
	public void addReviewToWrittenReviews(Review review) {
		this.writtenReviews.add(review);
	}
	
	public void removeReviewFromWrittenReviews(Review review) {
		this.writtenReviews.remove(review);
	}
	
	public void addReviewToReceivedReviews(Review review) {
		this.receivedReviews.add(review);
	}
	
	public void removeReviewFromReceivedReviews(Review review) {
		this.receivedReviews.remove(review);
	}
	
	public List<Item> getFavoriteItems() {
	    return favoriteItems;
	}

	public void setFavoriteItems(List<Item> favoriteItems) {
	    this.favoriteItems = favoriteItems;
	}

	public void addFavoriteItem(Item item) {
	    this.favoriteItems.add(item);
	}

	public void removeFavoriteItem(Item item) {
	    this.favoriteItems.remove(item);
	}
	
	public boolean isItemInFavorites(Item item) {
	    return this.favoriteItems.stream()
	            .anyMatch(favItem -> favItem.getId().equals(item.getId()));
	}
	
	public boolean isItemInUserItems(Item item) {
	    return this.items.stream()
	            .anyMatch(userItem -> userItem.getId().equals(item.getId()));
	}
}
