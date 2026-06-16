package com.example.renovatepoc.backendjava;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendJavaApplicationTests {

    @Autowired
    private BackendJavaApplication application;

    @Test
    void healthReturnsOk() {
        BackendJavaApplication.HealthResponse response = application.health();

        assertThat(response.getService()).isEqualTo("backend-java");
        assertThat(response.getStatus()).isEqualTo("ok");
    }
}
