package com.jarothi.spot.jarothispot.bootstrap;

import com.jarothi.spot.jarothispot.user.User;
import com.jarothi.spot.jarothispot.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnProperty(prefix = "app.bootstrap.admin", name = "enabled", havingValue = "true")
public class AdminBootstrapRunner implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private final AdminBootstrapProperties props;
    private final UserRepository users;
    private final PasswordEncoder encoder;

    public AdminBootstrapRunner(AdminBootstrapProperties props, 
                              UserRepository users,
                              PasswordEncoder encoder) {
        this.props = props;
        this.users = users;
        this.encoder = encoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (props.getEmail() == null || props.getPassword() == null) {
            log.warn("Admin bootstrap enabled but email/password missing");
            return;
        }

        if (users.existsByEmail(props.getEmail())) {
            log.info("Admin already exists: {}", props.getEmail());
            return;
        }

        User admin = new User();
        admin.setEmail(props.getEmail());
        admin.setPasswordHash(encoder.encode(props.getPassword()));
        admin.setRoles(java.util.Collections.singleton(User.Role.ADMIN));
        users.save(admin);
        log.info("Admin created: {}", props.getEmail());
    }
}