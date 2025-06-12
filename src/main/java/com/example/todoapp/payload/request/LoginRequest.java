package com.example.todoapp.payload.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}