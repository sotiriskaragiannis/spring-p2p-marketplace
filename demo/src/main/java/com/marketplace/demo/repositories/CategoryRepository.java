package com.marketplace.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marketplace.demo.models.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String>{

}
