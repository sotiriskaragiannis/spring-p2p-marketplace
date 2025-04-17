package com.marketplace.demo.models.dto;

import java.time.LocalDate;

public class ReviewInputDTO {
	
	private String id;
	private String reviewer_id;
	private String reviewee_id;
	private Integer rating;
	private String comment;
	private LocalDate date;
	
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
