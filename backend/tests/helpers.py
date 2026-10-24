API = "/api/v1"


def create_subject(client, headers, name="Physics"):
    response = client.post(f"{API}/subjects", headers=headers, json={"name": name})
    assert response.status_code == 201, response.text
    return response.json()


def create_note(client, headers, title="Note", content="", subject_id=None):
    response = client.post(
        f"{API}/notes",
        headers=headers,
        json={"title": title, "content": content, "subject_id": subject_id},
    )
    assert response.status_code == 201, response.text
    return response.json()