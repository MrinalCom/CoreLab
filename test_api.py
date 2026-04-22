import os
from dotenv import load_dotenv
import anthropic

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=50,
    messages=[{"role": "user", "content": "Say: API key works!"}]
)

print(response.content[0].text)
