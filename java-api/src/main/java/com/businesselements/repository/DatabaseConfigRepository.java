package com.businesselements.repository;

import com.businesselements.model.DatabaseConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DatabaseConfigRepository extends JpaRepository<DatabaseConfig, Long> {
}
