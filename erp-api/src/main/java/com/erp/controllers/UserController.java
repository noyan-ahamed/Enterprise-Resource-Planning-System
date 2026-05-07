package com.erp.controllers;

import com.erp.dto.UserDTO;
import com.erp.enities.Users;
import com.erp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostConstruct
    public void initUserAndRole() {
        userService.initUserAndRole();
    }

    @PostMapping
    public ResponseEntity<Users> createUser(
            @RequestBody Users user
    ) {

        return ResponseEntity.ok(
                userService.createUser(user)
        );
    }

    @GetMapping
    public ResponseEntity<List<Users>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUser()
        );
    }

    @PutMapping("/upload-profile-image")
    public ResponseEntity<String> uploadProfileImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        userService.uploadProfileImage(file);

        return ResponseEntity.ok(
                "Profile image uploaded successfully"
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {

        return ResponseEntity.ok(
                userService.getCurrentUser()
        );
    }
}