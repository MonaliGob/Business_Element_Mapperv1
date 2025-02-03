package com.businesselements.repository;

import com.businesselements.model.OwnerGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerGroupRepository extends JpaRepository<OwnerGroup, Long> {
}
