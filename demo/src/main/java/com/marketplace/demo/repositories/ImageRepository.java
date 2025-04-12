package com.marketplace.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marketplace.demo.models.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, String> {

}
