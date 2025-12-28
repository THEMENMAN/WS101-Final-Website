package com.service;

import com.dto.AuthRequest;
import com.dto.AuthResponse;
import com.model.User;
import com.model.UserRole;
import com.repository.UserRepository;
import com.security.JwtUtil;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public AuthResponse authenticate(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken((org.springframework.security.core.userdetails.User) authentication.getPrincipal());
        
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new AuthResponse(
            jwt,
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole().name(),
            user.getId()
        );
    }
    
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Validate UEP email
        if (!request.getEmail().toLowerCase().endsWith("@uep.edu.ph")) {
            throw new RuntimeException("Please use a valid UEP email address (@uep.edu.ph)");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getFirstName());
        user.setRole(UserRole.valueOf(request.getRole().toUpperCase()));
        user.setIsVerified(false);

        User savedUser = userRepository.save(user);

        String jwt = jwtUtil.generateToken(
            new org.springframework.security.core.userdetails.User(
                savedUser.getEmail(),
                savedUser.getPassword(),
                java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + savedUser.getRole().name()))
            )
        );

        return new AuthResponse(
            jwt,
            savedUser.getEmail(),
            savedUser.getFirstName(),
            savedUser.getLastName(),
            savedUser.getRole().name(),
            savedUser.getId()
        );
    }
    
    // Demo accounts initialization
    @PostConstruct
    public void initDemoAccounts() {
        if (!userRepository.existsByEmail("admin@uep.edu.ph")) {
            User admin = new User();
            admin.setEmail("admin@uep.edu.ph");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(UserRole.ADMIN);
            admin.setIsVerified(true);
            userRepository.save(admin);
        }
        
        if (!userRepository.existsByEmail("client@uep.edu.ph")) {
            User client = new User();
            client.setEmail("client@uep.edu.ph");
            client.setPassword(passwordEncoder.encode("password123"));
            client.setFirstName("Client");
            client.setLastName("User");
            client.setRole(UserRole.CLIENT);
            client.setCompany("Demo Company");
            client.setIsVerified(true);
            userRepository.save(client);
        }
        
        if (!userRepository.existsByEmail("student@uep.edu.ph")) {
            User student = new User();
            student.setEmail("student@uep.edu.ph");
            student.setPassword(passwordEncoder.encode("password123"));
            student.setFirstName("Student");
            student.setLastName("User");
            student.setRole(UserRole.STUDENT);
            student.setSkills("Web Development, Graphic Design");
            student.setBio("Creative student passionate about technology");
            student.setIsVerified(true);
            userRepository.save(student);
        }
    }
}