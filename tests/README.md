# API Tests

This directory contains automated tests for the Business Element Manager API endpoints.

## Setup

The tests require:
- Python 3.x
- pytest
- requests
- pytest-cov

## Running Tests

1. Make sure the API server is running on http://localhost:8080
2. Run all tests:
   ```
   python tests/run.py
   ```

## Test Structure

- `conftest.py` - Common test fixtures and configurations
- `test_elements.py` - Tests for business element endpoints
- `test_database_configs.py` - Tests for database configuration endpoints
- `test_categories.py` - Tests for category endpoints
- `test_owner_groups.py` - Tests for owner group endpoints
- `test_rules.py` - Tests for data quality rule endpoints

## Coverage

The tests use pytest-cov to generate coverage reports, showing which parts of the API code are being tested.
