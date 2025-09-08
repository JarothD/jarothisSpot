package com.jarothi.spot.jarothispot.user;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(name = "uk_users_email", columnNames = "email")
})
public class User {

  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id = UUID.randomUUID();

  @Column(name = "email", nullable = false)
  private String email;

  @Column(name = "password_hash", nullable = false)
  private String passwordHash;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
  @Column(name = "role", nullable = false)
  @Enumerated(EnumType.STRING)
  private Set<Role> roles = new HashSet<>();

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public enum Role { ADMIN, USER }

  // Getters/Setters/constructores vacíos
  public User() {
    // This constructor is intentionally empty. Required by JPA specification.
  }
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
  public Set<Role> getRoles() { return roles; }
  public void setRoles(Set<Role> roles) { this.roles = roles; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
