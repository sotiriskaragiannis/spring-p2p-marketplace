package com.marketplace.demo.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marketplace.demo.models.User;
import com.marketplace.demo.models.dto.UserStripped;
import com.marketplace.demo.services.UserService;


@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	UserService userService;

	@GetMapping("/")
	public List<UserStripped> getAllUsers(){
		List<User> list = userService.getAllUsers();
		return list.stream()
				.map(u -> new UserStripped(u.getId(), u.getUsername(), u.getFull_name(), u.getEmail(), u.getBio(), u.getCountry(), u.getCity(), u.getPhone_number()))
				.collect(Collectors.toList());
	}
	
	@GetMapping("/{user_id}")
	public UserStripped getUser(@PathVariable("user_id") String user_id) {
		User u = userService.getUser(user_id);
		return new UserStripped(u.getId(), u.getUsername(), u.getFull_name(), u.getEmail(), u.getBio(), u.getCountry(), u.getCity(), u.getPhone_number());
	}
	
	@DeleteMapping("/{user_id}")
	public void deleteUser(@PathVariable("user_id") String user_id) {
		userService.removeUser(user_id);
	}
	
	@PostMapping("/")
	public UserStripped createUser(@RequestBody User user) {
		User u = userService.createUser(user);
		return new UserStripped(u.getId(), u.getUsername(), u.getFull_name(), u.getEmail(), u.getBio(), u.getCountry(), u.getCity(), u.getPhone_number());
	}
	
	@PutMapping("/{user_id}")
	public UserStripped updateUser(@PathVariable("user_id") String user_id, @RequestBody User userUpdates) {	
		User u = userService.updateUser(user_id, userUpdates);
		return new UserStripped(u.getId(), u.getUsername(), u.getFull_name(), u.getEmail(), u.getBio(), u.getCountry(), u.getCity(), u.getPhone_number());
	}

}
