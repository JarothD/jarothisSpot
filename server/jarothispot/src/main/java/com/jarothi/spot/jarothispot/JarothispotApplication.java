package com.jarothi.spot.jarothispot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class JarothispotApplication {

	public static void main(String[] args) {
		SpringApplication.run(JarothispotApplication.class, args);
	}

}
