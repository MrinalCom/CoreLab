package com.gymapp.userservice.controller;

import com.gymapp.userservice.dto.UserProfileDto;
import com.gymapp.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getProfile(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateProfile(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(userService.updateProfile(userId, dto));
    }
}
