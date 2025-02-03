import pytest
import requests
import json

def test_get_all_owner_groups(base_url, test_headers):
    response = requests.get(f"{base_url}/owner-groups", headers=test_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_owner_group(base_url, test_headers, sample_owner_group):
    response = requests.post(
        f"{base_url}/owner-groups",
        headers=test_headers,
        json=sample_owner_group
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == sample_owner_group["name"]
    assert data["description"] == sample_owner_group["description"]
    assert "id" in data

def test_update_owner_group(base_url, test_headers, sample_owner_group):
    # First create an owner group
    create_response = requests.post(
        f"{base_url}/owner-groups",
        headers=test_headers,
        json=sample_owner_group
    )
    group_id = create_response.json()["id"]

    # Update it
    updated_data = {**sample_owner_group, "name": "Updated Owner Group"}
    response = requests.patch(
        f"{base_url}/owner-groups/{group_id}",
        headers=test_headers,
        json=updated_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Owner Group"

def test_delete_owner_group(base_url, test_headers, sample_owner_group):
    # First create an owner group
    create_response = requests.post(
        f"{base_url}/owner-groups",
        headers=test_headers,
        json=sample_owner_group
    )
    group_id = create_response.json()["id"]

    # Delete it
    response = requests.delete(f"{base_url}/owner-groups/{group_id}", headers=test_headers)
    assert response.status_code == 204