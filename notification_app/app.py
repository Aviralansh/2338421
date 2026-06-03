import urllib.request
import json
import os
from dotenv import load_dotenv
load_dotenv()

# 1. Setup API and Weights
URL = "http://4.224.186.213/evaluation-service/notifications"
TOKEN = os.getenv("AUTH_TOKEN") 
WEIGHTS = {"Placement": 3, "Result": 2, "Event": 1}

try:
    # 2. Fetch Data
    print("Fetching notifications...\n")
    req = urllib.request.Request(URL, headers={"Authorization": f"Bearer {TOKEN}"})
    
    with urllib.request.urlopen(req) as response:
        notifications = json.loads(response.read())["notifications"]

    # 3. Sort Data (The Simple Way)
    # Python sorts tuples piece by piece. 
    # This sorts by Weight first, and if tied, falls back to the Timestamp string.
    # reverse=True means Highest Weight and Newest Date appear at the top.
    notifications.sort(
        key=lambda n: (WEIGHTS.get(n.get("Type"), 0), n.get("Timestamp", "")), 
        reverse=True
    )

    # 4. Grab Top 10 and Print
    top_10 = notifications[:10]
    
    print("--- TOP 10 PRIORITY INBOX ---")
    for i, n in enumerate(top_10):
        print(f"[{i+1}] {n['Type'].upper()} | {n['Timestamp']}")
        print(f"    Message: {n['Message']}")
        print(f"    ID: {n['ID'][:8]}...\n")

except Exception as e:
    print(f"Error: {e}")