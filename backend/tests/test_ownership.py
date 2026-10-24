from tests.helpers import API, create_note, create_subject


def test_b_cannot_read_change_or_delete_a_note(client, user_a, user_b):
    note = create_note(client, user_a, "Secret", "private")
    url = f"{API}/notes/{note['id']}"
    assert client.get(url, headers=user_b).status_code == 404
    assert client.patch(url, headers=user_b, json={"title": "hacked"}).status_code == 404
    assert client.delete(url, headers=user_b).status_code == 404

    mine = client.get(url, headers=user_a).json()
    assert mine["title"] == "Secret"
    assert mine["content"] == "private"


def test_b_does_not_see_a_data_in_lists(client, user_a, user_b):
    subject = create_subject(client, user_a)
    create_note(client, user_a, "Secret", subject_id=subject["id"])
    assert client.get(f"{API}/notes", headers=user_b).json() == []
    filtered = client.get(
        f"{API}/notes", headers=user_b, params={"subject_id": subject["id"]}
    )
    assert filtered.json() == []
    assert client.get(f"{API}/subjects", headers=user_b).json() == []


def test_b_cannot_rename_or_delete_a_subject(client, user_a, user_b):
    subject = create_subject(client, user_a, "Physics")
    url = f"{API}/subjects/{subject['id']}"
    assert client.patch(url, headers=user_b, json={"name": "hacked"}).status_code == 404
    assert client.delete(url, headers=user_b).status_code == 404
    names = [s["name"] for s in client.get(f"{API}/subjects", headers=user_a).json()]
    assert names == ["Physics"]


def test_b_cannot_put_a_note_into_a_subject_of_a(client, user_a, user_b):
    subject = create_subject(client, user_a)
    created = client.post(
        f"{API}/notes", headers=user_b, json={"title": "x", "subject_id": subject["id"]}
    )
    assert created.status_code == 404

    mine = create_note(client, user_b, "Mine")
    moved = client.patch(
        f"{API}/notes/{mine['id']}", headers=user_b, json={"subject_id": subject["id"]}
    )
    assert moved.status_code == 404
    still = client.get(f"{API}/notes/{mine['id']}", headers=user_b).json()
    assert still["subject_id"] is None