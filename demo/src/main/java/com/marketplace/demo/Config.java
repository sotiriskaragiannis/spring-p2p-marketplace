package com.marketplace.demo;

import java.nio.file.Paths;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.marketplace.demo.models.Category;
import com.marketplace.demo.models.Image;
import com.marketplace.demo.models.Item;
import com.marketplace.demo.models.Review;
import com.marketplace.demo.models.User;
import com.marketplace.demo.repositories.CategoryRepository;
import com.marketplace.demo.repositories.ImageRepository;
import com.marketplace.demo.repositories.ItemRepository;
import com.marketplace.demo.repositories.ReviewRepository;
import com.marketplace.demo.repositories.UserRepository;

@Configuration
public class Config {

	@Value("${images.upload-dir}")
    private String uploadDir;
	
	@Bean
	public CommandLineRunner commandLineRunner(
			UserRepository userRepository,
			ItemRepository itemRepository,
			CategoryRepository categoryRepository,
			ImageRepository imageRepository,
			ReviewRepository reviewRepository) {
		return args -> {
			User u1 = new User("geot", "George Test", "email@example.com", "password", "I am a student...", "Greece", "Thessaloniki", "6900000000");
			User u2 = new User("johnk", "John K.", "jk@example.com", "password2", "I am a programmer...", "Greece", "Athens", "6911111111");
			User u3 = new User("gk", "George K.", "gk@example.com", "password3", "", "Greece", "Ioannina", "6922222222");
			userRepository.save(u1);
			userRepository.save(u2);
			userRepository.save(u3);
			
			Category c1 = new Category("Musical Instruments");
			categoryRepository.save(c1);
			
			Category c2 = new Category("Electronics");
			categoryRepository.save(c2);
			
			Item item1 = new Item("old guitar", c1, u2, 100.0, "Old electric guitar.", "Used", false);
			itemRepository.save(item1);
			
			Item item2 = new Item("old pc", c2, u1, 250.0, "Old computer.", "Like new", false);
			itemRepository.save(item2);
			
			Item item3 = new Item("CRT display", c1, u1, 50.0, null, "Used", false);
			itemRepository.save(item3);
			
			String basePath = Paths.get(System.getProperty("user.dir"), uploadDir).toString();
			
			Image image1_1 = new Image(item1, basePath + "/test.jpg");
			imageRepository.save(image1_1);
			
			Image image1_2 = new Image(item1, basePath + "/test2.jpg");
			imageRepository.save(image1_2);
			
			item1.addImageToItem(image1_1);
			item1.addImageToItem(image1_2);
			itemRepository.save(item1);

			Image image2_1 = new Image(item2, basePath + "/test3.jpg");
			imageRepository.save(image2_1);
			
			item2.addImageToItem(image2_1);
			itemRepository.save(item2);
			
			Review review1 = new Review(u1, u2, 5, "Very nice and friendly.", LocalDate.now());
			Review review2 = new Review(u3, u1, 1, "Rude and disrespectful!", LocalDate.now());
			reviewRepository.save(review1);
			reviewRepository.save(review2);
			
			u1.addReviewToWrittenReviews(review1);
			u2.addReviewToReceivedReviews(review1);
			
			u3.addReviewToWrittenReviews(review2);
			u1.addReviewToReceivedReviews(review2);
			
			userRepository.save(u1);
			userRepository.save(u2);
			userRepository.save(u3);
			
			
		};
		
	}
	
}
