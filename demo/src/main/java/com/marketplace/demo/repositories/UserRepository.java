package com.marketplace.demo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marketplace.demo.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, String>{
	
	Optional<User> findByUsername(String username);

}
