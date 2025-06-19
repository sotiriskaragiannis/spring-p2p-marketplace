package com.marketplace.demo.models.dto;

public class LoginResponseDTO {
    
    private boolean success;
    private String message;
    private UserStripped user;
    
    public LoginResponseDTO() {
    }
    
    public LoginResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public LoginResponseDTO(boolean success, String message, UserStripped user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public UserStripped getUser() {
        return user;
    }
    
    public void setUser(UserStripped user) {
        this.user = user;
    }
}