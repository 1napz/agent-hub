Here's a summary of the key points from the Claude on Google Cloud Agent Platform (formerly Vertex AI) documentation:

Core Differences from Standard Anthropic API

When using Claude via Google Cloud's Agent Platform, the API is nearly identical to the standard Messages API with two key differences:

1. Model specification: `model` is not passed in the request body — it's specified in the Google Cloud endpoint URL instead
2. API version: `anthropic_version` is passed in the request body (not as a header) and must be set to `vertex-2023-10-16`

Python Quick Start

```python
from anthropic import AnthropicVertex

project_id = "MY_PROJECT_ID"
region = "global"

client = AnthropicVertex(project_id=project_id, region=region)

message = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hey Claude!",
        }
    ],
)
print(message)
```

Prerequisite: Run `gcloud auth application-default login` to authenticate with Google Cloud before making requests.

Endpoint Types

Type	Region Value	Use Case	Pricing	
Global (recommended)	`"global"`	Max availability, dynamic routing	Standard	
Multi-region	`"us"` or `"eu"`	Data residency within broad geography	+10% premium	
Regional	`"us-east1"`, `"europe-west1"`, etc.	Strict compliance, provisioned throughput	+10% premium	

Supported Features

- ✅ Messages API, prompt caching, extended thinking
- ✅ Tool use (Bash, Computer use, Memory, Text editor)
- ✅ Web search tool, citations, structured outputs
- ❌ Input sources (URL sources, Files API), server-side tools, agent infrastructure, message batches, Claude Managed Agents

Model Availability

- 1M context window: Claude Fable 5, Opus 4.8/4.7/4.6, Sonnet 4.6
- 200K context window: Sonnet 4.5, Sonnet 4 (deprecated), and others
- Payload limit: 30 MB per request

Data & Logging

- Data handling is governed by Google Cloud
- Anthropic recommends enabling request-response logging on at least a 30-day rolling basis for misuse investigation
- Enabling logging does not give Google or Anthropic access to your content

Is there a specific section you'd like me to dive deeper into, or are you looking to set this up for a particular use case?
