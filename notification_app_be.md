# Stage 1

## Core Actions
The notification platform must support the following core actions for logged-in students:
1. **Fetch Notifications:** Retrieve list of notifications both read and unread.
2. **Fetch Unread Count:** Retrieve the total number of unread notifications for badge displays.
3. **Mark as Read:** Update the status of a specific notification from unread to read.
4. **Mark All as Read:** Update all unread notifications for the user to read in a single action.



## REST API Endpoints

### 1. Fetch User Notifications
Retrieves a paginated list of notifications for the authenticated user.

* **Endpoint:** `GET /api/v1/notifications`
* **Query Parameters:**
  * `page` (integer, default: 1)
  * `limit` (integer, default: 20)
  * `isRead` (boolean, optional filter)
* **Headers:**
  * `Authorization: Bearer <JWT_TOKEN>`
  * `Content-Type: application/json`