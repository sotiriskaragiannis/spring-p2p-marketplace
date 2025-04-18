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

	@Transactional
	public Review updateReview(String review_id, ReviewInputDTO reviewInput) {
		Optional<Review> reviewOptional = reviewRepository.findById(review_id);
		
		if (!reviewOptional.isPresent()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not Found");

		}
		
		Review review = reviewOptional.get();
		
		if (reviewInput.getReviewee_id()!=null && !reviewInput.getReviewee_id().equals(review.getReviewee().getId())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot change the reviewee of the review!");
		}
		
		if (reviewInput.getReviewer_id()!=null && !reviewInput.getReviewer_id().equals(review.getReviewer().getId())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot change the reviewer of the review!");
		}
		
		
		if (reviewInput.getRating() != null) review.setRating(reviewInput.getRating());
		if (reviewInput.getComment() != null) review.setComment(reviewInput.getComment());
		if (reviewInput.getDate() != null) review.setDate(reviewInput.getDate());
		
		return review;
	}

	public List<Review> getWrittenReviewsOfUser(User u) {
		return u.getWrittenReviews();
	}

	public List<Review> getReceivedReviewsOfUser(User u) {
		return u.getReceivedReviews();
	}
	
}
