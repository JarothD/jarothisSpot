package com.jarothi.spot.jarothispot.config;


import com.jarothi.spot.jarothispot.auth.jwt.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;


import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String API_PRODUCTS_PATTERN = "/api/products/**";
    private static final String API_ROLE_ADM_STRING = "ADMIN";

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
          .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
          .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
          .requestMatchers("/api/auth/**").permitAll()
          .requestMatchers("/actuator/**").permitAll()
          .requestMatchers("/v3/api-docs/**").permitAll()
          .requestMatchers("/swagger-ui/**").permitAll()
          .requestMatchers(HttpMethod.GET, API_PRODUCTS_PATTERN).permitAll()
          .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
          .requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()
          .requestMatchers(HttpMethod.POST, API_PRODUCTS_PATTERN).hasRole(API_ROLE_ADM_STRING)
          .requestMatchers(HttpMethod.PUT, API_PRODUCTS_PATTERN).hasRole(API_ROLE_ADM_STRING)
          .requestMatchers(HttpMethod.PATCH, API_PRODUCTS_PATTERN).hasRole(API_ROLE_ADM_STRING)
          .requestMatchers(HttpMethod.DELETE, API_PRODUCTS_PATTERN).hasRole(API_ROLE_ADM_STRING)
          .requestMatchers(HttpMethod.POST, "/api/categories").hasRole(API_ROLE_ADM_STRING)
          .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole(API_ROLE_ADM_STRING)
          .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole(API_ROLE_ADM_STRING)
          .requestMatchers("/api/cart/**").authenticated()
          .anyRequest().authenticated()
      )
      
      .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
      .cors(cors -> cors.configurationSource(corsConfigurationSource()));
    return http.build();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    
    return config.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.setAllowedOrigins(List.of(
      "http://localhost",        // Docker/Nginx :80
      "http://localhost:80",
      "http://127.0.0.1",
      "http://localhost:5173"   // Vite dev server
      ));
    cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
    cfg.setAllowedHeaders(List.of("Authorization","Content-Type","X-Requested-With","Accept","Origin"));
    cfg.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", cfg);
    return source;
  }
}