package com.jarothi.spot.jarothispot;

import org.springframework.boot.SpringApplication;

public class TestJarothispotApplication {

	public static void main(String[] args) {
		SpringApplication.from(JarothispotApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
