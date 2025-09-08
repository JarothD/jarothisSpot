package com.jarothi.spot.jarothispot.config;

import com.jarothi.spot.jarothispot.user.User;
import com.jarothi.spot.jarothispot.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {
     private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminProperties adminProps;

    public AdminSeeder(
            UserRepository userRepository, 
            PasswordEncoder passwordEncoder,
            AdminProperties adminProps) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminProps = adminProps;
    }

    @Override
    public void run(String... args) {
        String adminEmail = adminProps.getEmail();
        boolean exists = userRepository.findByEmail(adminEmail).isPresent();
        log.info("[AdminSeeder] Checking for admin user: {}. Exists? {}", adminEmail, exists);
        if (!exists) {
            log.info("[AdminSeeder] Creating admin user with email: {}", adminEmail);
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode(adminProps.getPassword()));
            admin.setRoles(java.util.Collections.singleton(User.Role.ADMIN));
            userRepository.save(admin);
            log.info("[AdminSeeder] Admin user created successfully");
        } else {
            log.info("[AdminSeeder] Admin user already exists, skipping creation");
        }
    }
}