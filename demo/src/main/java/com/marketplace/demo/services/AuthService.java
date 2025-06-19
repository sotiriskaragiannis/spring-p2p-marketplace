package com.marketplace.demo.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.marketplace.demo.models.User;
import com.marketplace.demo.models.dto.LoginRequestDTO;
import com.marketplace.demo.models.dto.LoginResponseDTO;
import com.marketplace.demo.models.dto.UserStripped;
import com.marketplace.demo.repositories.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public LoginResponseDTO authenticate(LoginRequestDTO loginRequest) {
        if (loginRequest.getUsername() == null || loginRequest.getUsername().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }

        if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (!userOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid username or password");
        }

        User user = userOptional.get();

        // Simple password comparison (in production, you should use password hashing)
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid username or password");
        }

        // Authentication successful
        UserStripped userStripped = new UserStripped(user);
        return new LoginResponseDTO(true, "Login successful", userStripped);
    }
}
