package com.marketplace.demo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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
		super();
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
	
	
	
	
}
