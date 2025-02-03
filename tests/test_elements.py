import pytest
import requests
import json

def test_get_all_elements(base_url, test_headers):
    response = requests.get(f"{base_url}/elements", headers=test_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_element(base_url, test_headers, sample_element):
    response = requests.post(
        f"{base_url}/elements",
        headers=test_headers,
        json=sample_element
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == sample_element["name"]
    assert data["description"] == sample_element["description"]
    assert "id" in data

def test_get_element_by_id(base_url, test_headers, sample_element):
    # First create an element
    create_response = requests.post(
        f"{base_url}/elements",
        headers=test_headers,
        json=sample_element
    )
    element_id = create_response.json()["id"]

    # Then get it by ID
    response = requests.get(f"{base_url}/elements/{element_id}", headers=test_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == element_id
    assert data["name"] == sample_element["name"]

def test_update_element(base_url, test_headers, sample_element):
    # First create an element
    create_response = requests.post(
        f"{base_url}/elements",
        headers=test_headers,
        json=sample_element
    )
    element_id = create_response.json()["id"]

    # Update it
    updated_data = {**sample_element, "name": "Updated Name"}
    response = requests.patch(
        f"{base_url}/elements/{element_id}",
        headers=test_headers,
        json=updated_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"

def test_delete_element(base_url, test_headers, sample_element):
    # First create an element
    create_response = requests.post(
        f"{base_url}/elements",
        headers=test_headers,
        json=sample_element
    )
    element_id = create_response.json()["id"]

    # Delete it
    response = requests.delete(f"{base_url}/elements/{element_id}", headers=test_headers)
    assert response.status_code == 204

    # Verify it's gone
    get_response = requests.get(f"{base_url}/elements/{element_id}", headers=test_headers)
    assert get_response.status_code == 404