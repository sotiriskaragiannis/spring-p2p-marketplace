package com.marketplace.demo.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
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
}
