package com.businesselements.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BusinessElementDTO {
    private Long id;
    private String name;
    private String description;
    private CategoryDTO category;
    private OwnerGroupDTO ownerGroup;
    private List<DatabaseMappingDTO> mappings;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class CategoryDTO {
        private Long id;
        private String name;
    }

    @Data
    public static class OwnerGroupDTO {
        private Long id;
        private String name;
    }

    @Data
    public static class DatabaseMappingDTO {
        private Long id;
        private DatabaseConfigDTO databaseConfig;
        private String schemaName;
        private String tableName;
        private String columnName;
        private String mappingType;
        private String transformationLogic;
    }

    @Data
    public static class DatabaseConfigDTO {
        private Long id;
        private String name;
        private String connectionUrl;
    }
}