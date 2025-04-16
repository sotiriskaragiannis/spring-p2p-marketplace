package com.marketplace.demo.models;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="REVIEWS")
public class Review {

	@Id
	@GeneratedValue(strategy=GenerationType.UUID)
	private String id;
	@ManyToOne()
	@JoinColumn(name="reviewer_id", referencedColumnName="id")
	private User reviewer;
	@ManyToOne()
	@JoinColumn(name="reviewee_id", referencedColumnName="id")
	private User reviewee;
	private Integer rating;
	private String comment;
	private LocalDate date;
	
	
	public Review(String id, User reviewer, User reviewee, Integer rating, String comment, LocalDate date) {
		this.id = id;
		this.reviewer = reviewer;
		this.reviewee = reviewee;
		this.rating = rating;
		this.comment = comment;
		this.date = date;
	}

	public Review(User reviewer, User reviewee, Integer rating, String comment, LocalDate date) {
		this.reviewer = reviewer;
		this.reviewee = reviewee;
		this.rating = rating;
		this.comment = comment;
		this.date = date;
	}

	public Review() {
		
	}

	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public User getReviewer() {
		return reviewer;
	}
	
	public void setReviewer(User reviewer) {
		this.reviewer = reviewer;
	}
	
	public User getReviewee() {
		return reviewee;
	}
	
	public void setReviewee(User reviewee) {
		this.reviewee = reviewee;
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
