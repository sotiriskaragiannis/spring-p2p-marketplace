package com.marketplace.demo.models.dto;

import com.marketplace.demo.models.User;

// Data Transfer Object for User
// 		- Without password
public class UserStripped {


	private String id;
	private String username;
	private String full_name;
	private String email;
	private String bio;
	private String country;
	private String city;
	private String phone_number;
	
	
	public UserStripped(User user) {
		this.id = user.getId();
		this.username = user.getUsername();
		this.full_name = user.getFull_name();
		this.email = user.getEmail();
		this.bio = user.getBio();
		this.country = user.getCountry();
		this.city = user.getCity();
		this.phone_number = user.getPhone_number();
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
	
	
}
