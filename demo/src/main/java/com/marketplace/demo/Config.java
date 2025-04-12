package com.marketplace.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.marketplace.demo.models.Category;
import com.marketplace.demo.models.Item;
import com.marketplace.demo.models.User;
import com.marketplace.demo.repositories.CategoryRepository;
import com.marketplace.demo.repositories.ItemRepository;
import com.marketplace.demo.repositories.UserRepository;

@Configuration
public class Config {

	
	@Bean
	public CommandLineRunner commandLineRunner(
			UserRepository userRepository,
			ItemRepository itemRepository,
			CategoryRepository categoryRepository) {
		return args -> {
			User u1 = new User("geot", "George Test", "email@example.com", "password", "I am a student...", "Greece", "Thessaloniki", "6900000000");
			User u2 = new User("johnk", "John K.", "jk@example.com", "password2", "I am a programmer...", "Greece", "Athens", "6911111111");
			userRepository.save(u1);
			userRepository.save(u2);
			
			Category c1 = new Category("Musical Instruments");
			categoryRepository.save(c1);
			
			Item i1 = new Item("old guitar", c1, u2, 100.0, "Old electric guitar.", "Used", false);
			itemRepository.save(i1);
		};
		
	}
	
}
