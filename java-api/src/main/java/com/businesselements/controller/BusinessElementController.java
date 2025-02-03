package com.businesselements.controller;

import com.businesselements.dto.BusinessElementDTO;
import com.businesselements.service.BusinessElementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elements")
@CrossOrigin(origins = "*")
public class BusinessElementController {

    @Autowired
    private BusinessElementService service;

    @GetMapping
    public ResponseEntity<List<BusinessElementDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessElementDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<BusinessElementDTO> create(@RequestBody BusinessElementDTO element) {
        return ResponseEntity.ok(service.create(element));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BusinessElementDTO> update(
            @PathVariable Long id, 
            @RequestBody BusinessElementDTO element) {
        return ResponseEntity.ok(service.update(id, element));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
