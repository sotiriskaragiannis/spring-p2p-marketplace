package com.marketplace.demo.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marketplace.demo.models.User;
import com.marketplace.demo.models.dto.UserStripped;
import com.marketplace.demo.services.UserService;

import jakarta.websocket.server.PathParam;

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
		User student = userService.getUser(user_id);
		return new UserStripped(student.getId(), student.getUsername(), student.getFull_name(), student.getEmail(), student.getBio(), student.getCountry(), student.getCity(), student.getPhone_number());
	}
}
