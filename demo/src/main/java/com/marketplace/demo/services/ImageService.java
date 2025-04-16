package com.marketplace.demo.services;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.marketplace.demo.models.Image;
import com.marketplace.demo.repositories.ImageRepository;

@Service
public class ImageService {

	@Autowired
	ImageRepository imageRepository;

	public ResponseEntity<Resource> getImageFile(String image_id) {
		try {
	    	
	    	Optional<Image> imageOptional = imageRepository.findById(image_id);
	    	if (!imageOptional.isPresent()) {
	    		throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not Found");
	    	}
	    	
	    	Image image = imageOptional.get();
	    	
	        Path filePath = Paths.get(image.getImage_path());
	        Resource resource = new UrlResource(filePath.toUri());

	        if (resource.exists()) {
	            // Optional: detect the content type dynamically
	            String contentType = Files.probeContentType(filePath);
	            if (contentType == null) {
	                contentType = "application/octet-stream";
	            }

	            return ResponseEntity.ok()
	                    .contentType(MediaType.parseMediaType(contentType))
	                    .body(resource);
	        } else {
	        	throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not Found");
	        }
	    } catch (MalformedURLException e) {
	        e.printStackTrace();
	        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "There was an error while obtaining the image");
	    } catch (IOException e) {
	        e.printStackTrace();
	        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "There was an error while obtaining the image");
	    }
	}
	

}
