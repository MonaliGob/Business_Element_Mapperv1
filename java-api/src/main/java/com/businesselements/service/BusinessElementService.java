package com.businesselements.service;

import com.businesselements.model.BusinessElement;
import com.businesselements.repository.BusinessElementRepository;
import com.businesselements.dto.BusinessElementDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BusinessElementService {

    @Autowired
    private BusinessElementRepository repository;

    public List<BusinessElementDTO> findAll() {
        return repository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public BusinessElementDTO findById(Long id) {
        return repository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new RuntimeException("Business Element not found"));
    }

    public BusinessElementDTO create(BusinessElementDTO dto) {
        BusinessElement element = new BusinessElement();
        BeanUtils.copyProperties(dto, element);
        return convertToDTO(repository.save(element));
    }

    public BusinessElementDTO update(Long id, BusinessElementDTO dto) {
        BusinessElement element = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Business Element not found"));
        
        BeanUtils.copyProperties(dto, element, "id");
        return convertToDTO(repository.save(element));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private BusinessElementDTO convertToDTO(BusinessElement element) {
        BusinessElementDTO dto = new BusinessElementDTO();
        BeanUtils.copyProperties(element, dto);
        return dto;
    }
}
