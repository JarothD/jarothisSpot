package com.jarothi.spot.jarothispot.auth.service;

import com.jarothi.spot.jarothispot.user.User;
import com.jarothi.spot.jarothispot.user.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  public CustomUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // username = email
    User u = userRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

    Set<GrantedAuthority> authorities = u.getRoles().stream()
        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
        .collect(Collectors.toSet());

    return new org.springframework.security.core.userdetails.User(
        u.getEmail(),
        u.getPasswordHash(),
        true, true, true, true,
        authorities
    );
  }
}
