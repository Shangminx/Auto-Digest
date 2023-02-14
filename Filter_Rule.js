const { includes } = require("resium");

const first_filter_comb = ["safety", "security", "concern"];
const second_filter_comb = ["data", "password", "profile"];
const filter_kw = "privacy";

const env_title = "data concern"
const env_body = "data concern details"
const env_time = "2023-02-14T08:15:13Z"
const env_url = "https://"

if (env_title.includes(filter_kw) || env_body.includes(filter_kw))
{
    console.log("Issue needs Attention!",env_title,env_time)
}

for (let item1 of first_filter_comb) {
    for (let item2 of second_filter_comb) {
        if ((env_title.includes(item1) && env_title.includes(item2)) || 
        (env_body.includes(item1) && env_body.includes(item2)))
        {
            console.log("Issue needs Attention!",env_title,env_time)
        }
    }
};

// fetch(url)
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//     const openIssues = data.filter(issue => !issue.closed_at);
//     const filteredIssues = openIssues.filter(issue => checkCombinationInIssue(issue, first_filter_comb, second_filter_comb));
//     console.log("Filtered Issues:");
//     filteredIssues.forEach(issue => {
//         console.log("- ${issue.title}")
//     })

//   })
//   .catch(error => {
//     console.error(error);
//   });