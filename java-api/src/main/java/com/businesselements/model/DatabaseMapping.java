package com.businesselements.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "database_mappings")
public class DatabaseMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "bigint")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "element_id", nullable = false)
    private BusinessElement element;

    @ManyToOne
    @JoinColumn(name = "database_config_id", nullable = false)
    private DatabaseConfig databaseConfig;

    @Column(name = "schema_name", nullable = false)
    private String schemaName;

    @Column(name = "table_name", nullable = false)
    private String tableName;

    @Column(name = "column_name", nullable = false)
    private String columnName;

    @Column(name = "mapping_type", nullable = false)
    private String mappingType;

    @Column(name = "transformation_logic")
    private String transformationLogic;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}