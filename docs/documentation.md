API Documentation

## Base URL

`http://localhost:5000/api`

---

## Endpoints

### 1. Create Overlay

**POST** `/overlays`

- **Description:** Create and save a new overlay (text, logo, etc.)
- **Body:**
  ```json
  {
    "name": "Watermark",
    "position": { "x": 100, "y": 200 },
    "size": { "width": 200, "height": 100 },
    "content": "Live Stream Overlay"
  }
  ```

Response:

{
"message": "Overlay created successfully",
"id": "66fe2b8e4d2a5b..."
}

2. Read Overlays

GET /overlays

Description: Retrieve all saved overlays.

Response:

[
{
"_id": "66fe2b8e4d2a5b...",
"name": "Watermark",
"position": { "x": 100, "y": 200 },
"content": "Live Stream Overlay"
}
]

3. Update Overlay

PUT /overlays/<id>

Description: Modify overlay properties.

Body:

{ "position": { "x": 150, "y": 250 } }

Response:

{ "message": "Overlay updated successfully" }

4. Delete Overlay

DELETE /overlays/<id>

Description: Remove an overlay.

Response:

{ "message": "Overlay deleted successfully" }
