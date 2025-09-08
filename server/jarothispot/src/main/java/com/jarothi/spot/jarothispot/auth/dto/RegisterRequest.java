package com.jarothi.spot.jarothispot.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request para registrar un nuevo usuario")
public class RegisterRequest {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    @Schema(description = "Email del usuario", example = "usuario@ejemplo.com")
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^\\+?[0-9\\-\\s]{7,15}$", message = "El teléfono debe tener un formato válido")
    @Schema(description = "Número de teléfono del usuario", example = "+123456789")
    private String phone;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Schema(description = "Contraseña del usuario", example = "miContraseña123", minLength = 8)
    private String password;

    @NotBlank(message = "La confirmación de contraseña es obligatoria")
    @Schema(description = "Confirmación de la contraseña", example = "miContraseña123")
    private String confirmPassword;
}
