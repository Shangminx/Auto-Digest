import requests
from datetime import datetime
from datetime import timedelta
import json
import sys

tries = 3
for retrytimes in range(tries):
    try:
        headers = {
            "Accept": "application/vnd.github+json",
        }
        baseurl = "https://api.github.com/repos/MicrosoftEdge/WebView2Feedback/issues"

        scandays = 1
        if (sys.argv[1] == 'weekly'):
            scandays = 7
        utcdate = (datetime.utcnow() - timedelta(days = scandays)).date()
        issueList = []
        scanover = False
        page = 1

        while(not scanover):
            url = baseurl + '?page=' + str(page)
            response = requests.get(url, headers=headers)
            issues = response.json()
            for item in issues:
                date_object = datetime.strptime(item['created_at'], '%Y-%m-%dT%H:%M:%SZ').date()

                if(date_object < utcdate):
                    scanover = True
                    break

                if item.__contains__('pull_request'):
                    continue
                    
                newissue = {}
                newissue['issueName'] = item['title']
                newissue['issueLink'] = item['html_url']
                tags = []
                for label in item['labels']:
                    tags.append(label['name'])
                newissue['issueTags'] = tags
                if(item['assignee'] is not None):
                    newissue['issueAssignee'] = item['assignee']['login']
                else:newissue['issueAssignee'] = None

                if(date_object >= utcdate):
                    issueList.append(newissue)

            page = page + 1

        result = {'total': len(issueList), 'issueList': issueList}
        resultjson = json.dumps(result)
        print(resultjson)
    except Exception as e:
        if retrytimes < tries - 1:
            continue
        else:
            raise
    break
