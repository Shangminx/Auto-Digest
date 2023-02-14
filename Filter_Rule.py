import time
import requests

repo_name = "ElyssaJyu/Auto-Digest"
first_filter_comb = ["safety", "security", "concern"]
second_filter_comb = ["data", "password", "profile"]
filter_kw = "privacy"
headers = {
    "Accept": "application/vnd.github+json",
}

import json

def check_combination(list1, list2, datacontent):
    for item1 in list1:
        for item2 in list2:
            if item1 + item2 in datacontent:
                return True
    return False

# Get all open issues
while True:
    url = f"https://api.github.com/repos/ElyssaJyu/Auto-Digest/issues?state=open"
    response = requests.get(url, headers=headers)
    issues = response.json()

    now = int(time.time())
    time_interval = 300  
    start_time = now - time_interval

    for issue in issues:
        result = check_combination(first_filter_comb, second_filter_comb, issue)
        if (result or filter_kw in issue) and issue.created_at.timestamp() >= start_time:
            print(f"New issue #{issue.title}")
