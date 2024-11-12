import praw
import pandas as pd
from datetime import datetime

# Initialize the Reddit API client
reddit = praw.Reddit(
    client_id="_hkjapk1Hq9vQeye_jb30g",
    client_secret="TbyPA7mY9iaz3013Gzmq94JpSRg8Yg",
    user_agent="firepakistan/1.0 by Impressive-Low1594"
)

def get_subreddit_data(subreddit_name, limit=100):
    # Access the subreddit
    subreddit = reddit.subreddit(subreddit_name)

    # Create lists to store the data
    posts = []

    # Iterate through the top posts
    for post in subreddit.top(limit=limit):
        posts.append({
            'title': post.title,
            'score': post.score,
            'id': post.id,
            'url': post.url,
            'num_comments': post.num_comments,
            'created_utc': datetime.fromtimestamp(post.created_utc).strftime('%Y-%m-%d %H:%M:%S'),
            'author': str(post.author),
            'subreddit': post.subreddit.display_name
        })

    # Create a DataFrame from the posts
    df = pd.DataFrame(posts)

    return df

# Example usage
subreddit_name = "firepakistan"
data = get_subreddit_data(subreddit_name, limit=500)

# Print the first few rows
print(data.head())

# Save to CSV (optional)
data.to_csv(f"{subreddit_name}_data.csv", index=False)