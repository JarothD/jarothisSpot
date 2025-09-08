package com.jarothi.spot.jarothispot.config;

import com.jarothi.spot.jarothispot.bootstrap.AdminBootstrapProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(AdminBootstrapProperties.class)
public class AppConfig {}