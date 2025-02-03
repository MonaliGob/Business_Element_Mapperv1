package com.businesselements.repository;

import com.businesselements.model.BusinessElement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessElementRepository extends JpaRepository<BusinessElement, Long> {
}
