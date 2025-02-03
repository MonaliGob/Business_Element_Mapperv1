import pytest
import requests
import os

@pytest.fixture
def base_url():
    return "http://localhost:5000/api"

@pytest.fixture
def test_headers():
    return {"Content-Type": "application/json"}

@pytest.fixture
def sample_element():
    return {
        "name": "Test Element",
        "description": "Test Description",
        "categoryId": 1,
        "ownerGroupId": 1
    }

@pytest.fixture
def sample_database_config():
    return {
        "name": "Test DB Config",
        "connectionUrl": "postgresql://test:test@localhost:5432/testdb",
        "description": "Test database configuration"
    }

@pytest.fixture
def sample_category():
    return {
        "name": "Test Category",
        "description": "Test category description"
    }

@pytest.fixture
def sample_owner_group():
    return {
        "name": "Test Owner Group",
        "description": "Test owner group description"
    }

@pytest.fixture
def sample_rule():
    return {
        "name": "Test Rule",
        "description": "Test rule description",
        "ruleType": "format",
        "ruleConfig": {"pattern": "^[A-Z]{2}-\\d{4}$"},
        "severity": "error"
    }