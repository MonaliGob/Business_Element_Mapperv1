import pytest
import requests
import json

def test_get_all_categories(base_url, test_headers):
    response = requests.get(f"{base_url}/categories", headers=test_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_category(base_url, test_headers, sample_category):
    response = requests.post(
        f"{base_url}/categories",
        headers=test_headers,
        json=sample_category
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == sample_category["name"]
    assert data["description"] == sample_category["description"]
    assert "id" in data

def test_update_category(base_url, test_headers, sample_category):
    # First create a category
    create_response = requests.post(
        f"{base_url}/categories",
        headers=test_headers,
        json=sample_category
    )
    category_id = create_response.json()["id"]

    # Update it
    updated_data = {**sample_category, "name": "Updated Category"}
    response = requests.patch(
        f"{base_url}/categories/{category_id}",
        headers=test_headers,
        json=updated_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Category"

def test_delete_category(base_url, test_headers, sample_category):
    # First create a category
    create_response = requests.post(
        f"{base_url}/categories",
        headers=test_headers,
        json=sample_category
    )
    category_id = create_response.json()["id"]

    # Delete it
    response = requests.delete(f"{base_url}/categories/{category_id}", headers=test_headers)
    assert response.status_code == 204