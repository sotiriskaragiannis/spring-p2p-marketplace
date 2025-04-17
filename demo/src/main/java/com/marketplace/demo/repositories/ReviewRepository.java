package com.marketplace.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marketplace.demo.models.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String>{

}
