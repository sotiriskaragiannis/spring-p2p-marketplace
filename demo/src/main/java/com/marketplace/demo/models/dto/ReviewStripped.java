package com.marketplace.demo.models.dto;

import java.time.LocalDate;

import com.marketplace.demo.models.Review;

//Data Transfer Object for Review
//- Flattens reviewer and reviewee
//- instead of reviewer(JSON object) and reviewee(JSON object) in the result, 
//	the result has reviewer_id and reviewee_id
public class ReviewStripped {

	private String id;
	private String reviewer_id;
	private String reviewee_id;
	private Integer rating;
	private String comment;
	private LocalDate date;
	
	public ReviewStripped(Review review) {
		this.id = review.getId();
		this.reviewee_id = review.getReviewee().getId();
		this.reviewer_id = review.getReviewer().getId();
		this.rating = review.getRating();
		this.comment = review.getComment();
		this.date = review.getDate();
	}
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getReviewer_id() {
		return reviewer_id;
	}
	
	public void setReviewer_id(String reviewer_id) {
		this.reviewer_id = reviewer_id;
	}
	
	public String getReviewee_id() {
		return reviewee_id;
	}
	
	public void setReviewee_id(String reviewee_id) {
		this.reviewee_id = reviewee_id;
	}
	
	public Integer getRating() {
		return rating;
	}
	
	public void setRating(Integer rating) {
		this.rating = rating;
	}
	
	public String getComment() {
		return comment;
	}
	
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	public LocalDate getDate() {
		return date;
	}
	
	public void setDate(LocalDate date) {
		this.date = date;
	}
	
}
