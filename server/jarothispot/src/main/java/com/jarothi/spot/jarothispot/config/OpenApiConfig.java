package com.jarothi.spot.jarothispot.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI/Swagger configuration
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI jarothiSpotOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("JarothiSpot API")
                .description("REST API for JarothiSpot catalog management system")
                .version("v1.0")
                .license(new License().name("MIT").url("https://opensource.org/licenses/MIT")))
            .components(new Components()
                .addSecuritySchemes("bearerAuth", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("JWT token for authentication. Use the login endpoint to get a token.")));
    }
}
