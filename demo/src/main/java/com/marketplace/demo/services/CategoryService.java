package com.marketplace.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.marketplace.demo.models.Category;
import com.marketplace.demo.repositories.CategoryRepository;

@Service
public class CategoryService {
	
	@Autowired
	CategoryRepository categoryRepository;

	public List<Category> getAllItems() {
		return categoryRepository.findAll();
	}

	
}
