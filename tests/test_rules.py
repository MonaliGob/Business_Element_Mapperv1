import pytest
import requests
import json

def test_get_element_rules(base_url, test_headers, sample_element, sample_rule):
    # First create an element
    create_element_response = requests.post(
        f"{base_url}/elements",
        headers=test_headers,
        json=sample_element
    )
    element_id = create_element_response.json()["id"]

    # Get its rules
    response = requests.get(f"{base_url}/elements/{element_id}/rules", headers=test_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_rule(base_url, test_headers, sample_element, sample_rule):
    # First create an element
    create_element_response = requests.post(
        f"{base_url}/elements",
        headers=test_headers,
        json=sample_element
    )
    element_id = create_element_response.json()["id"]

    # Create a rule for it
    response = requests.post(
        f"{base_url}/elements/{element_id}/rules",
        headers=test_headers,
        json=sample_rule
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == sample_rule["name"]
    assert data["ruleType"] == sample_rule["ruleType"]
    assert "id" in data

def test_update_rule(base_url, test_headers, sample_element, sample_rule):
    # First create an element and a rule
    create_element_response = requests.post(
        f"{base_url}/elements",
        headers=test_headers,
        json=sample_element
    )
    element_id = create_element_response.json()["id"]

    create_rule_response = requests.post(
        f"{base_url}/elements/{element_id}/rules",
        headers=test_headers,
        json=sample_rule
    )
    rule_id = create_rule_response.json()["id"]

    # Update the rule
    updated_data = {**sample_rule, "name": "Updated Rule"}
    response = requests.patch(
        f"{base_url}/rules/{rule_id}",
        headers=test_headers,
        json=updated_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Rule"

def test_delete_rule(base_url, test_headers, sample_element, sample_rule):
    # First create an element and a rule
    create_element_response = requests.post(
        f"{base_url}/elements",
        headers=test_headers,
        json=sample_element
    )
    element_id = create_element_response.json()["id"]

    create_rule_response = requests.post(
        f"{base_url}/elements/{element_id}/rules",
        headers=test_headers,
        json=sample_rule
    )
    rule_id = create_rule_response.json()["id"]

    # Delete the rule
    response = requests.delete(f"{base_url}/rules/{rule_id}", headers=test_headers)
    assert response.status_code == 204