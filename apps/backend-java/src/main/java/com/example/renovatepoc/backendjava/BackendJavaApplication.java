package com.example.renovatepoc.backendjava;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class BackendJavaApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendJavaApplication.class, args);
    }

    @GetMapping("/health")
    public HealthResponse health() {
        return new HealthResponse("backend-java", "ok");
    }

    public static class HealthResponse {
        private final String service;
        private final String status;

        public HealthResponse(String service, String status) {
            this.service = service;
            this.status = status;
        }

        public String getService() {
            return service;
        }

        public String getStatus() {
            return status;
        }
    }
}
