package com.marketplace.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marketplace.demo.services.ImageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;

@RestController
@RequestMapping("/images/")
public class ImageController {
	
	@Autowired
	ImageService imageService;
	
	@GetMapping("/{image_id}")
	public ResponseEntity<Resource> getImageFile(@PathVariable("image_id") String image_id) {
	    return imageService.getImageFile(image_id);
	}

}
