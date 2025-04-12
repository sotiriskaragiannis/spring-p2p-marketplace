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

import com.marketplace.demo.models.Item;
import com.marketplace.demo.models.User;
import com.marketplace.demo.models.dto.ItemStripped;
import com.marketplace.demo.models.dto.UserStripped;
import com.marketplace.demo.services.ItemService;
import com.marketplace.demo.services.UserService;


@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	UserService userService;
	@Autowired
	ItemService itemService;

	@GetMapping("/")
	public List<UserStripped> getAllUsers(){
		List<User> list = userService.getAllUsers();
		return list.stream()
				.map(u -> new UserStripped(u))
				.collect(Collectors.toList());
	}
	
	@GetMapping("/{user_id}")
	public UserStripped getUser(@PathVariable("user_id") String user_id) {
		User u = userService.getUser(user_id);
		return new UserStripped(u);
	}
	
	@GetMapping("/{user_id}/items/")
	public List<ItemStripped> getItemsOfUser(@PathVariable("user_id") String user_id){
		User u = userService.getUser(user_id);
		List<Item> list = itemService.getItemsOfUser(u);
		return list.stream()
				.map(i -> new ItemStripped(i))
				.collect(Collectors.toList());
	}
	
	@DeleteMapping("/{user_id}")
	public void removeUser(@PathVariable("user_id") String user_id) {
		userService.removeUser(user_id);
	}
	
	@PostMapping("/")
	public UserStripped createUser(@RequestBody User user) {
		User u = userService.createUser(user);
		return new UserStripped(u);
	}
	
	@PutMapping("/{user_id}")
	public UserStripped updateUser(@PathVariable("user_id") String user_id, @RequestBody User userUpdates) {	
		User u = userService.updateUser(user_id, userUpdates);
		return new UserStripped(u);
	}

}
