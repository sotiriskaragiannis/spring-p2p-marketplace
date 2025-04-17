package com.marketplace.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.marketplace.demo.models.Review;
import com.marketplace.demo.models.User;
import com.marketplace.demo.models.dto.ReviewInputDTO;
import com.marketplace.demo.repositories.ReviewRepository;
import com.marketplace.demo.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ReviewService {

	@Autowired
	ReviewRepository reviewRepository;
	@Autowired
	UserRepository userRepository;

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

	@Transactional
	public Review createReview(ReviewInputDTO reviewInput) {
		
		if (reviewInput.getReviewee_id()==null || reviewInput.getReviewer_id()==null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reviewee id or Reviewer id should not be null!");
		}
		
		Optional<User> reviewerOptional = userRepository.findById(reviewInput.getReviewer_id());
		if (!reviewerOptional.isPresent()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reviewer not Found");
		}
		
		Optional<User> revieweeOptional = userRepository.findById(reviewInput.getReviewee_id());
		if (!revieweeOptional.isPresent()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reviewee not Found");
		}
		
		User reviewer = reviewerOptional.get();
		User reviewee = revieweeOptional.get();
		
		Review review = new Review(reviewer, reviewee, reviewInput.getRating(), reviewInput.getComment(), reviewInput.getDate());
		
		reviewer.addReviewToWrittenReviews(review);
		reviewee.addReviewToReceivedReviews(review);
		
		return review;
	}
	
}
