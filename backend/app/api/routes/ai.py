import os
import httpx
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.config import settings

router = APIRouter()


class GenerateDescriptionRequest(BaseModel):
    name: str
    brand: str
    category: str | None = "Luxury"
    year: int | str | None = None
    horsepower: str | None = None
    acceleration: str | None = None
    features: str | None = None


class GenerateDescriptionResponse(BaseModel):
    description: str


@router.post("/generate-description", response_model=GenerateDescriptionResponse)
async def generate_description(payload: GenerateDescriptionRequest):
    if not payload.name or not payload.brand:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle name and brand are required.",
        )

    api_key = settings.gemini_api_key or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini API key is not configured on the server.",
        )

    prompt = (
        f"You are a world-class luxury automotive copywriter for DriveXCars, an elite dealership.\n"
        f"Generate an engaging, evocative, and prestigious vehicle description / story for the following car:\n\n"
        f"- Vehicle: {payload.brand} {payload.name}\n"
        f"- Category: {payload.category or 'Luxury'}\n"
        f"- Model Year: {payload.year or 'Current'}\n"
    )
    if payload.horsepower:
        prompt += f"- Horsepower: {payload.horsepower}\n"
    if payload.acceleration:
        prompt += f"- 0-60 mph Acceleration: {payload.acceleration}\n"
    if payload.features:
        prompt += f"- Key Features: {payload.features}\n"

    prompt += (
        "\nWrite a captivating 2-3 paragraph detailed overview/story that highlights what makes driving this automobile "
        "an unparalleled luxury experience. Emphasize performance, craftsmanship, emotion, and prestige. "
        "Do not include markdown headers or bullet points; output only the compelling narrative paragraphs."
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    req_body = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=req_body)
            if resp.status_code != 200:
                raise HTTPException(
                    status_code=resp.status_code,
                    detail=f"Google Gen AI API error: {resp.text}",
                )
            data = resp.json()
            candidates = data.get("candidates", [])
            if not candidates:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="No description candidates returned by Gemini.",
                )
            generated_text = (
                candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            )
            return GenerateDescriptionResponse(description=generated_text.strip())
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate description: {str(exc)}",
        ) from exc
