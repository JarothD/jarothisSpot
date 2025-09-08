package com.jarothi.spot.jarothispot.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response del registro de usuario")
public class RegisterResponse {

    @Schema(description = "ID único del usuario registrado", example = "12345")
    private String id;

    @Schema(description = "Email del usuario registrado", example = "usuario@ejemplo.com")
    private String email;

    @Schema(description = "Teléfono del usuario registrado", example = "+123456789")
    private String phone;

    @Schema(description = "Mensaje de confirmación del registro", example = "Usuario registrado exitosamente")
    private String message;
}
