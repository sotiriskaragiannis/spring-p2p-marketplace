package com.marketplace.demo.services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.marketplace.demo.models.Category;
import com.marketplace.demo.models.Image;
import com.marketplace.demo.models.Item;
import com.marketplace.demo.models.User;
import com.marketplace.demo.models.dto.ItemInputDTO;
import com.marketplace.demo.repositories.CategoryRepository;
import com.marketplace.demo.repositories.ImageRepository;
import com.marketplace.demo.repositories.ItemRepository;
import com.marketplace.demo.repositories.UserRepository;

@Service
public class ItemService {
	
	@Autowired
	ItemRepository itemRepository;
	@Autowired
	CategoryRepository categoryRepository;
	@Autowired
	UserRepository userRepository;
	@Autowired
	ImageRepository imageRepository;
	
	@Value("${images.upload-dir}")
    private String uploadDir;

	public List<Item> getAllItems() {
		return itemRepository.findAll();
	}

	public Item getItem(String item_id) {
		Optional<Item> itemOptional = itemRepository.findById(item_id);
		
		if (itemOptional.isPresent()) {
			return itemOptional.get();
		} else {			
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not Found");
		}
	}

	public List<Item> getItemsOfUser(User u) {
		return itemRepository.findBySeller(u);
	}

	public void removeItem(String item_id) {
		Optional<Item> itemOptional = itemRepository.findById(item_id);
		
		if (itemOptional.isPresent()) {
			itemRepository.deleteById(item_id);
		} else {			
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not Found");
		}
	}

	public Item createItem(ItemInputDTO itemInput) {
		// First find and set category
		String category_id = itemInput.getCategory_id();
		Category category;
		
		if (category_id == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category id is required for an item");
		}
		
		Optional<Category> categoryOptional = categoryRepository.findById(category_id);
		
		if (!categoryOptional.isPresent()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not Found");
		}
		
		// Do the same for the seller (User)
		String seller_id = itemInput.getSeller_id();
		User seller;
		
		if (seller_id == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seller id is required for an item");
		}
		
		Optional<User> sellerOptional = userRepository.findById(seller_id);
		
		if (!sellerOptional.isPresent()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Seller not Found");

		}
		
		category = categoryOptional.get();
		seller = sellerOptional.get();
		
		Item newItem = new Item(itemInput.getTitle(), category, seller, itemInput.getPrice(), itemInput.getDescription(), itemInput.getItemCondition(), itemInput.isSold());
		
		itemRepository.save(newItem);
		
		return newItem;
	}

	public Item updateItem(String item_id, ItemInputDTO itemInput) {
		Optional<Item> itemOptional = itemRepository.findById(item_id);
		if (itemOptional.isPresent()) {
			Item item = itemOptional.get();
			// Don't allow user to update the id of a record
			if (itemInput.getId() != null && !item.getId().equals(itemInput.getId())) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The 'id' in the request body does not match the resource ID in the URL. The 'id' field cannot be modified.");
			}
			// Don't allow user to change the seller of item
			if (itemInput.getSeller_id() != null && item.getSeller().getId().equals(itemInput.getSeller_id())) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot change the seller of an item.");
			}
			
			// Update Category
			if (itemInput.getCategory_id() != null) {
				Optional<Category> categoryOptional = categoryRepository.findById(itemInput.getCategory_id()); 
				if (!categoryOptional.isPresent()) {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not Found");
				}
				item.setCategory(categoryOptional.get());
			}
			
			
			// Update simple fields
			if (itemInput.getTitle() != null) item.setTitle(itemInput.getTitle());
			if (itemInput.getPrice() != null) item.setPrice(itemInput.getPrice());
			if (itemInput.getDescription() != null) item.setDescription(itemInput.getDescription());
			if (itemInput.getItemCondition() != null) item.setItemCondition(itemInput.getItemCondition());
			if (itemInput.isSold() != null) item.setSold(itemInput.isSold());
			
			itemRepository.save(item);
			
			return item;
		} else {			
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not Found");
		}
	}



	public Item uploadImageToItem(String item_id, MultipartFile image_file) {
	    Optional<Item> itemOptional = itemRepository.findById(item_id);
	    if (!itemOptional.isPresent()) {
	        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not Found");
	    }

	    Item item = itemOptional.get();

	    try {
	        // Resolve the path relative to the project root
	        String absolutePath = Paths.get(System.getProperty("user.dir"), uploadDir).toString();
	        System.out.println("Resolved upload directory: " + absolutePath);

	        // Create directory if it doesn't exist
	        File dir = new File(absolutePath);
	        if (!dir.exists()) {
	            dir.mkdirs();
	        }

	        // Create image object and record
	        Image image = new Image(item);
	        
	        // Save image record to get the id
	        imageRepository.save(image);

	        // Create a unique filename
	        String filename = image.getId() + "_" + image_file.getOriginalFilename();

	        // Full path to save the file
	        Path filePath = Paths.get(absolutePath, filename);
	        // Save file
	        image_file.transferTo(filePath.toFile());

	        image.setImage_path(filePath.toString());
	        item.addImageToItem(image);
	        
	        imageRepository.save(image);
	        itemRepository.save(item);
	        return item;

	    } catch (IOException e) {
	        System.out.println("Failed to upload image: " + e.getMessage());
	        e.printStackTrace();
	        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image", e);
	    }
	}


}
