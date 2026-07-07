package com.shelter.service;

import com.shelter.dto.AuthDTO;
import com.shelter.model.Admin;
import com.shelter.repository.AdminRepository;
import com.shelter.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin não encontrado"));

        admin.setLastLoginAt(LocalDateTime.now());
        adminRepository.save(admin);

        String token = jwtService.generateToken(admin);
        return new AuthDTO.AuthResponse(token, toInfo(admin));
    }

    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado");
        }

        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRole(Admin.Role.ADMIN);
        adminRepository.save(admin);

        String token = jwtService.generateToken(admin);
        return new AuthDTO.AuthResponse(token, toInfo(admin));
    }

    public List<AuthDTO.AdminInfo> listAdmins() {
        return adminRepository.findAll().stream().map(this::toInfo).toList();
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    private AuthDTO.AdminInfo toInfo(Admin a) {
        return new AuthDTO.AdminInfo(a.getId(), a.getName(), a.getEmail(),
                a.getRole(), a.getCreatedAt(), a.getLastLoginAt());
    }
}
