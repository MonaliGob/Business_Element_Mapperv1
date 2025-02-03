import pytest
import requests
import json

def test_get_all_database_configs(base_url, test_headers):
    response = requests.get(f"{base_url}/database-configs", headers=test_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_database_config(base_url, test_headers, sample_database_config):
    response = requests.post(
        f"{base_url}/database-configs",
        headers=test_headers,
        json=sample_database_config
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == sample_database_config["name"]
    assert data["connectionUrl"] == sample_database_config["connectionUrl"]
    assert "id" in data

def test_update_database_config(base_url, test_headers, sample_database_config):
    # First create a config
    create_response = requests.post(
        f"{base_url}/database-configs",
        headers=test_headers,
        json=sample_database_config
    )
    config_id = create_response.json()["id"]

    # Update it
    updated_data = {**sample_database_config, "name": "Updated Config"}
    response = requests.patch(
        f"{base_url}/database-configs/{config_id}",
        headers=test_headers,
        json=updated_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Config"

def test_delete_database_config(base_url, test_headers, sample_database_config):
    # First create a config
    create_response = requests.post(
        f"{base_url}/database-configs",
        headers=test_headers,
        json=sample_database_config
    )
    config_id = create_response.json()["id"]

    # Delete it
    response = requests.delete(f"{base_url}/database-configs/{config_id}", headers=test_headers)
    assert response.status_code == 204