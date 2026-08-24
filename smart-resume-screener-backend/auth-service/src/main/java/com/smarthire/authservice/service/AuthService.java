package com.smarthire.authservice.service;

import com.smarthire.authservice.dto.AuthResponseDto;
import com.smarthire.authservice.dto.LoginRequestDto;
import com.smarthire.authservice.dto.SignupRequestDto;
import com.smarthire.authservice.entity.User;
import com.smarthire.authservice.repository.UserRepository;
import com.smarthire.authservice.security.JwtUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostConstruct
    public void seedAdmin() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("1234"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Default ADMIN account seeded successfully.");
        }
    }

    public AuthResponseDto signup(SignupRequestDto request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken.");
        }
        
        // Mock Captcha Validation: Just checking if it equals "1234" or similar logic for local dev
        if (request.getCaptcha() == null || request.getCaptcha().trim().isEmpty()) {
            throw new RuntimeException("Captcha validation failed.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("CANDIDATE");
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole(), user.getId());
        return new AuthResponseDto(token, user.getRole(), "Signup successful!");
    }

    public AuthResponseDto login(LoginRequestDto request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            throw new RuntimeException("Invalid username or password.");
        }

        User user = userOpt.get();
        String token = jwtUtils.generateToken(user.getUsername(), user.getRole(), user.getId());
        return new AuthResponseDto(token, user.getRole(), "Login successful!");
    }

    public com.smarthire.authservice.dto.UserProfileDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new com.smarthire.authservice.dto.UserProfileDto(
                user.getUsername(), user.getFirstName(), user.getLastName(), 
                user.getEmail(), user.getPhoneNumber(), user.getRole()
        );
    }

    public com.smarthire.authservice.dto.UserProfileDto updateProfile(Long userId, com.smarthire.authservice.dto.UpdateProfileRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        userRepository.save(user);
        
        return new com.smarthire.authservice.dto.UserProfileDto(
                user.getUsername(), user.getFirstName(), user.getLastName(), 
                user.getEmail(), user.getPhoneNumber(), user.getRole()
        );
    }
}
