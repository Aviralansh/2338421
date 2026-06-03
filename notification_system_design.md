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



---



# Stage 2

**Persistent Storage Choice:**
I recommend a **Relational Database (PostgreSQL)**. Notifications are highly structured data with strict relationships to Users (Students). Furthermore, transactional integrity (ACID compliance) is critical for features like "mark as read"—we cannot risk race conditions where a notification shows as unread on one device and read on another due to eventual consistency delays typical in NoSQL databases.

**Database Schema:**
```
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY,
    student_id INT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
As the size of unread notification will increase, quering this huge database will become more slower and slower, to solve this we can move very old unread-notification to seperate storage somewhere else.

Read Notification : `UPDATE notifications SET is_read = true WHERE notification_id = ?;`




---



# Stage 3

Yes, the given query is accurate, it feteches all the unread notification from any specific student from newest to oldest.

It's slow beacuse the query is going through all the rows one by one. Also it's sorting the result as if the `where` clause wasn't already O(n) lol.

To solve this, we can use indexing.



---


# Stage 4

Reddis, we can use caching and store top 40 recent notificationis and unread count, this will reduse the load on primary db.



---



# Stage 5

The schrtcomming here is syncronisation, the for loop worrks squientially, if the one API request gets stuck, it would pause the whole program.

No, the event of sending email and inserting into DB should be kept different, as inserting into DB is faster as compare to relying on 3rd party email sender API.

### Updated Psedocode
```
async function notify_all(student_ids: array, message: str):
    save_to_db(student_ids, message)
    for student_id in student_ids:
        aysnc send_email(student_id, message)

    for student_id in student_ids:
        async push_to_app(student_id, message)

```


---



# Stage 6

We can use a rank system to give each noticiation a priority value.

Placement = 3
Result = 2
Event = 1

Then, we can sort the notification according to their weights.

If the notification have save weight, we can than further sort them according to timestamp.

![img](/img/ss.png)