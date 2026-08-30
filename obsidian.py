import requests
import json

BASE_URL = "http://localhost:27123" # เปลี่ยน PORT ได้
API_KEY = "your_api_key_here" # เอาจาก Obsidian > Settings > Local REST API

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def list_notes(folder=""):
    """ดึงรายชื่อโน้ตทั้งหมด"""
    url = f"{BASE_URL}/api/v1/notes"
    params = {"folder": folder} if folder else {}
    res = requests.get(url, headers=headers, params=params)
    res.raise_for_status()
    return res.json()

def get_note(path):
    """ดึงเนื้อหา 1 โน้ต"""
    url = f"{BASE_URL}/api/v1/notes/{path}"
    res = requests.get(url, headers=headers)
    res.raise_for_status()
    return res.json() # มี content, frontmatter, name

def create_note(path, content, tags=None):
    """สร้างโน้ตใหม่"""
    url = f"{BASE_URL}/api/v1/notes/{path}"
    payload = {"content": content}
    if tags: payload["tags"] = tags
    res = requests.post(url, headers=headers, data=json.dumps(payload))
    res.raise_for_status()
    return res.json()

def update_note(path, content):
    """อัปเดตเนื้อหาโน้ต"""
    url = f"{BASE_URL}/api/v1/notes/{path}"
    payload = {"content": content}
    res = requests.put(url, headers=headers, data=json.dumps(payload))
    res.raise_for_status()
    return res.json()

def delete_note(path):
    """ลบโน้ต"""
    url = f"{BASE_URL}/api/v1/notes/{path}"
    res = requests.delete(url, headers=headers)
    res.raise_for_status()
    return res.status_code == 204

# --- ตัวอย่างการใช้งาน ---
if __name__ == "__main__":
    try:
        print("1. List Notes")
        notes = list_notes("CrystalCastle")
        for note in notes:
            print(f"- {note['name']} (ID: {note['id']})")

        print("\n2. Get Note Content")
        note_data = get_note("CrystalCastle/Release Plan.md")
        print(note_data['content'][:200]) # print 200 ตัวแรก

        print("\n3. Create Note")
        create_note("CrystalCastle/Auto Generated.md", "# Auto Note\nสร้างจาก Python", tags=["auto"])

    except requests.exceptions.RequestException as e:
        print("API Error:", e)
    except Exception as e:
        print("Error:", e)
