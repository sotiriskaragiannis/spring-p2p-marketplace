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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marketplace.demo.models.Item;
import com.marketplace.demo.models.Review;
import com.marketplace.demo.models.User;
import com.marketplace.demo.models.dto.ItemStripped;
import com.marketplace.demo.models.dto.ReviewStripped;
import com.marketplace.demo.models.dto.UserInputDTO;
import com.marketplace.demo.models.dto.UserStripped;
import com.marketplace.demo.services.ItemService;
import com.marketplace.demo.services.ReviewService;
import com.marketplace.demo.services.UserService;


@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	UserService userService;
	@Autowired
	ItemService itemService;
	@Autowired
	ReviewService reviewService;

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
	public UserStripped createUser(@RequestBody UserInputDTO userInput) {
		User u = userService.createUser(userInput);
		return new UserStripped(u);
	}
	
	@PutMapping("/{user_id}")
	public UserStripped updateUser(@PathVariable("user_id") String user_id, @RequestBody UserInputDTO userUpdatesInput) {	
		User u = userService.updateUser(user_id, userUpdatesInput);
		return new UserStripped(u);
	}
	
	@GetMapping("/{user_id}/writtenReviews/")
	public List<ReviewStripped> getWrittenReviewsOfUser(@PathVariable("user_id") String user_id){
		User u = userService.getUser(user_id);
		List<Review> list = reviewService.getWrittenReviewsOfUser(u);
		return list.stream()
				.map(r -> new ReviewStripped(r))
				.collect(Collectors.toList());
	}
	
	@GetMapping("/{user_id}/receivedReviews/")
	public List<ReviewStripped> getReceivedReviewsOfUser(@PathVariable("user_id") String user_id){
		User u = userService.getUser(user_id);
		List<Review> list = reviewService.getReceivedReviewsOfUser(u);
		return list.stream()
				.map(r -> new ReviewStripped(r))
				.collect(Collectors.toList());
	}
	
	@PostMapping("/{user_id}/favoriteItems/")
	public void addItemToUserFavorites(@PathVariable("user_id") String user_id, @RequestParam String item_id) {
		User u = userService.getUser(user_id);
		Item i = itemService.getItem(item_id);
		userService.addItemToUserFavorites(u, i);
	}
	
	@DeleteMapping("/{user_id}/favoriteItems/")
	public void removeItemFromUserFavorites(@PathVariable("user_id") String user_id, @RequestParam String item_id) {
		User u = userService.getUser(user_id);
		Item i = itemService.getItem(item_id);
		userService.removeItemFromUserFavorites(u, i);
	}
	
	@GetMapping("/{user_id}/favoriteItems/")
	public List<ItemStripped> getUserFavorites(@PathVariable("user_id") String user_id) {
		User u = userService.getUser(user_id);
		List<Item> list = userService.getUserFavorites(u);
		return list.stream()
				.map(i -> new ItemStripped(i))
				.collect(Collectors.toList());
	}

}
