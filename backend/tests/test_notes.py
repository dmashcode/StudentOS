from tests.helpers import API, create_note, create_subject


def test_subject_crud(client, user_a):
    subject = create_subject(client, user_a, "  Physics  ")
    assert subject["name"] == "Physics"

    renamed = client.patch(
        f"{API}/subjects/{subject['id']}", headers=user_a, json={"name": "Physics 101"}
    )
    assert renamed.status_code == 200
    assert renamed.json()["name"] == "Physics 101"

    names = [s["name"] for s in client.get(f"{API}/subjects", headers=user_a).json()]
    assert names == ["Physics 101"]

    url = f"{API}/subjects/{subject['id']}"
    assert client.delete(url, headers=user_a).status_code == 204
    assert client.get(f"{API}/subjects", headers=user_a).json() == []
    assert client.delete(url, headers=user_a).status_code == 404


def test_blank_subject_name_is_rejected(client, user_a):
    response = client.post(f"{API}/subjects", headers=user_a, json={"name": "   "})
    assert response.status_code == 422


def test_note_list_has_no_content_but_detail_has(client, user_a):
    note = create_note(client, user_a, "Newton", "F = ma")
    listing = client.get(f"{API}/notes", headers=user_a).json()
    assert len(listing) == 1
    assert "content" not in listing[0]
    detail = client.get(f"{API}/notes/{note['id']}", headers=user_a).json()
    assert detail["content"] == "F = ma"


def test_patch_changes_only_the_fields_that_are_sent(client, user_a):
    subject = create_subject(client, user_a)
    note = create_note(client, user_a, "Newton", "F = ma", subject["id"])
    url = f"{API}/notes/{note['id']}"

    edited = client.patch(url, headers=user_a, json={"content": "F = ma, second law"}).json()
    assert edited["title"] == "Newton"
    assert edited["subject_id"] == subject["id"]
    assert edited["content"] == "F = ma, second law"

    unfiled = client.patch(url, headers=user_a, json={"subject_id": None}).json()
    assert unfiled["subject_id"] is None
    assert unfiled["content"] == "F = ma, second law"


def test_null_title_is_rejected(client, user_a):
    note = create_note(client, user_a, "Newton")
    response = client.patch(
        f"{API}/notes/{note['id']}", headers=user_a, json={"title": None}
    )
    assert response.status_code == 422


def test_notes_can_be_filtered_by_subject(client, user_a):
    physics = create_subject(client, user_a, "Physics")
    create_subject(client, user_a, "Maths")
    create_note(client, user_a, "In physics", subject_id=physics["id"])
    create_note(client, user_a, "Loose note")
    response = client.get(
        f"{API}/notes", headers=user_a, params={"subject_id": physics["id"]}
    )
    assert [n["title"] for n in response.json()] == ["In physics"]


def test_most_recently_edited_note_comes_first(client, user_a):
    first = create_note(client, user_a, "First")
    create_note(client, user_a, "Second")
    titles = [n["title"] for n in client.get(f"{API}/notes", headers=user_a).json()]
    assert titles == ["Second", "First"]

    client.patch(f"{API}/notes/{first['id']}", headers=user_a, json={"content": "edited"})
    titles = [n["title"] for n in client.get(f"{API}/notes", headers=user_a).json()]
    assert titles == ["First", "Second"]


def test_deleting_a_subject_keeps_its_notes(client, user_a):
    subject = create_subject(client, user_a)
    note = create_note(client, user_a, "Keep me", subject_id=subject["id"])
    assert (
        client.delete(f"{API}/subjects/{subject['id']}", headers=user_a).status_code == 204
    )
    kept = client.get(f"{API}/notes/{note['id']}", headers=user_a)
    assert kept.status_code == 200
    assert kept.json()["subject_id"] is None


def test_delete_note(client, user_a):
    note = create_note(client, user_a, "Temp")
    url = f"{API}/notes/{note['id']}"
    assert client.delete(url, headers=user_a).status_code == 204
    assert client.get(url, headers=user_a).status_code == 404


def test_note_with_unknown_subject_is_rejected(client, user_a):
    response = client.post(
        f"{API}/notes", headers=user_a, json={"title": "x", "subject_id": 99999}
    )
    assert response.status_code == 404