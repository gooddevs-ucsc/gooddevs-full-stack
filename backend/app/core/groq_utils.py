import json
from groq import Groq
from app.core.config import settings
from fastapi import HTTPException

client = Groq(api_key=settings.GROQ_API_KEY)

async def generate_project_details(prompt: str) -> dict:
    # These valid enums must match your database models exactly
    valid_types = ["WEBSITE", "MOBILE_APP", "DATABASE", "API", "DESKTOP_APP", "OTHER"]
    valid_timelines = ["LESS_THAN_1_MONTH", "ONE_TO_THREE_MONTHS", "THREE_TO_SIX_MONTHS", "MORE_THAN_SIX_MONTHS"]

    # The system prompt remains the same, but we will pass it differently to the Groq API
    system_prompt = f"""
    You are an expert technical project manager. Your task is to analyze a user's project idea and structure it into a JSON format.

    **Analysis and Validation:**
    1. First, analyze the user's prompt to determine if it contains a coherent project idea.
    2. If the prompt is nonsensical, too short (less than 10 words), or does not describe a project, you MUST NOT invent a project.

    **Output Rules:**
    - If the prompt is valid, fill in all the fields based on the user's input.
    - If the prompt is invalid or insufficient, you MUST return a JSON object with an "error" field explaining the problem, and all other fields as null.

    **Valid JSON Structure (on success):**
    {{
        "title": "A concise, descriptive title for the project.",
        "description": "A detailed, well-structured description of the project.",
        "project_type": "Choose ONE of: {valid_types}",
        "technologies": ["A list of suggested technologies"],
        "estimated_timeline": "Choose ONE of: {valid_timelines}"
    }}

    **Invalid Input JSON Structure (on failure):**
    {{
        "title": null,
        "description": null,
        "project_type": null,
        "technologies": null,
        "estimated_timeline": null,
        "error": "The provided text was not clear enough to generate a project. Please provide more detail."
    }}

    Respond ONLY with a valid JSON object.
    """

    
    try:
        chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3.1-8b-instant",
        response_format={"type": "json_object"},
        )

        response_content = chat_completion.choices[0].message.content
    
        response_json = json.loads(response_content)
        if response_json.get("error"):
            # Raise an exception with a specific message that we can catch in the API route.
            raise ValueError(response_json["error"])
    
        if not response_json.get("title") or not response_json.get("description"):
            raise ValueError("The generated project details were incomplete. Please try again with a more detailed prompt.")

        return response_json
    
    except ValueError as e:
        # Re-raise our specific validation errors as HTTP 400 errors
        raise 

    except json.JSONDecodeError as e:
        # JSON parsing error - this is a server error
        raise Exception("Failed to process AI response")
    
    except Exception as e:
        # Any other error (API failure, network issues, etc.) - this is a server error
        raise Exception("Failed to generate project details from AI service")