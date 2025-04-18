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

import com.marketplace.demo.models.Review;
import com.marketplace.demo.models.dto.ReviewInputDTO;
import com.marketplace.demo.models.dto.ReviewStripped;
import com.marketplace.demo.services.ReviewService;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
	
	@Autowired
	ReviewService reviewService;

	@GetMapping("/")
	public List<ReviewStripped> getAllReviews(){
		List<Review> list = reviewService.getAllReviews();
		return list.stream()
				.map(review -> new ReviewStripped(review))
				.collect(Collectors.toList());
	}
	
	@GetMapping("/{review_id}")
	public ReviewStripped getReview(@PathVariable("review_id") String review_id) {
		Review review = reviewService.getReview(review_id);
		return new ReviewStripped(review);
	}
	
	@DeleteMapping("/{review_id}")
	public void removeReview(@PathVariable("review_id") String review_id) {
		reviewService.removeReview(review_id);
	}
	
	@PostMapping("/")
	public ReviewStripped createReview(@RequestBody ReviewInputDTO reviewInput) {
		Review review = reviewService.createReview(reviewInput);
		return new ReviewStripped(review);
	}
	
	@PutMapping("/{review_id}")
	public ReviewStripped updateReview(@PathVariable("review_id") String review_id, @RequestBody ReviewInputDTO reviewInput) {
		Review review = reviewService.updateReview(review_id, reviewInput);
		return new ReviewStripped(review);
	}

}
