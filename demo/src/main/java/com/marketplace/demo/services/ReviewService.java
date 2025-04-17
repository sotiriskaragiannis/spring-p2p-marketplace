package com.marketplace.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.marketplace.demo.models.Review;
import com.marketplace.demo.repositories.ReviewRepository;

@Service
public class ReviewService {

	@Autowired
	ReviewRepository reviewRepository;

	public List<Review> getAllReviews() {
		return reviewRepository.findAll();
	}

	public Review getReview(String review_id) {
		Optional<Review> reviewOptional = reviewRepository.findById(review_id);
		
		if (reviewOptional.isPresent()) {
			return reviewOptional.get();
		} else {			
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not Found");
		}
		
	}

	public void removeReview(String review_id) {
		Optional<Review> reviewOptional = reviewRepository.findById(review_id);
		
		if (reviewOptional.isPresent()) {
			reviewRepository.deleteById(review_id);;
		} else {			
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not Found");
		}
		
	}
	
}
