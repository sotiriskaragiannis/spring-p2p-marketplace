package com.marketplace.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.marketplace.demo.models.User;
import com.marketplace.demo.repositories.UserRepository;

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
		}
		
		throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not Found");
	}

}
