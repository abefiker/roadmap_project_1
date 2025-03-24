import prompt from "prompt-sync";

const input = prompt();
const fetchGithubActivity = async (username) => {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/events`);
        if (!response.ok) {
            throw new Error(`Error fetching events for ${response.statusText}`);
        }
        const events = await response.json();
        if (events.length === 0) {
            console.log(`No recent activity found for ${username}`);
            return;
        }
        console.log(`Recent activity for ${username}:`);
        events.slice(0, 5).forEach(event => {
            switch (event.type) {
                case "PushEvent":
                    console.log(`- Pushed ${event.payload.commits.length} commits to ${event.repo.name}`);
                    break;
                case "IssuesEvent":
                    console.log(`- Opened a new issue in ${event.repo.name}`);
                    break;
                case "WatchEvent":
                    console.log(`- Starred ${event.repo.name}`);
                    break;
                case "ForkEvent":
                    console.log(`- Forked ${event.repo.name}`);
                    break;
                case "PullRequestEvent":
                    console.log(`- Opened a pull request in ${event.repo.name}`);
                    break;
                default:
                    console.log(`- ${event.type} in ${event.repo.name}`);
            }
        });
    } catch (error) {
        console.error(`Error fetching activity for ${username}:`, error);
    }
}
const username = input("Enter your github username: ");
fetchGithubActivity(username);
