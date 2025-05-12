package com.marketplace.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.marketplace.demo.models.Item;
import com.marketplace.demo.models.User;
import com.marketplace.demo.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
	
	@Autowired
	UserRepository userRepository;

	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	public User getUser(String user_id) {
		Optional<User> userOptional = userRepository.findById(user_id);
		
		if (userOptional.isPresent()) {
			return userOptional.get();
		} else {			
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not Found");
		}
		
		
	}

	public void removeUser(String user_id) {
		Optional<User> userOptional = userRepository.findById(user_id);
		
		if (userOptional.isPresent()) {
			userRepository.deleteById(user_id);
		} else {			
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not Found");
		}
		
	}

	public User createUser(User user) {
		if (user.getId() != null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'id' field must not be provided when creating a new resource.");
		}
		userRepository.save(user);
		return user;
	}

	@Transactional
	public User updateUser(String user_id, User userUpdates) {
		Optional<User> userOptional = userRepository.findById(user_id);
		
		if (userOptional.isPresent()) {
			User user = userOptional.get();
			// Don't allow user to update the id of a record
			if (userUpdates.getId() != null && !user.getId().equals(userUpdates.getId())) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'id' in the request body does not match the resource ID in the URL. The 'id' field cannot be modified.");
			}
			
			if (userUpdates.getUsername() != null) user.setUsername(userUpdates.getUsername());
			if (userUpdates.getFull_name() != null) user.setFull_name(userUpdates.getFull_name());
			if (userUpdates.getEmail() != null) user.setEmail(userUpdates.getEmail());
			if (userUpdates.getPassword() != null) user.setPassword(userUpdates.getPassword());
			if (userUpdates.getBio() != null) user.setBio(userUpdates.getPassword());
			if (userUpdates.getCountry() != null) user.setCountry(userUpdates.getCountry());
			if (userUpdates.getCity() != null) user.setCity(userUpdates.getCity());
			if (userUpdates.getPhone_number() != null) user.setPhone_number(userUpdates.getPhone_number());
			
			return user;
		} else {			
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not Found");
		}
		
	}
	@Transactional
	public void addItemToUserFavorites(User u, Item i) {
		if (!u.isItemInUserItems(i)) {			 // checks if item is not in user's items 
			if (!u.isItemInFavorites(i) ) {		// checks if item is not already in user's favorites to eliminate duplicates
				u.addFavoriteItem(i);
				i.incrementFavoriteCount();
			}
		} else {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot set item of user as his favorite");
		}
	}

	@Transactional
	public void removeItemFromUserFavorites(User u, Item i) {
		if (u.isItemInFavorites(i)) {			
			u.removeFavoriteItem(i);
			i.decrementFavoriteCount();
		} else {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item is not in User's favorite items");
		}
	}

	@Transactional
	public List<Item> getUserFavorites(User u) {
		return u.getFavoriteItems();
	}

}
