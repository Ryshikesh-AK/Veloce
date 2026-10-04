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


class ConciergeMessage(BaseModel):
    role: str  # "user" | "model" | "assistant"
    content: str


class ConciergeVehicle(BaseModel):
    id: str | None = None
    name: str | None = None
    title: str | None = None
    brand: str | None = None
    category: str | None = None
    price: str | None = None
    priceAmount: float | int | None = None
    year: int | str | None = None
    fuelType: str | None = None
    status: str | None = None
    isAvailable: bool | None = None
    horsepower: str | None = None
    acceleration: str | None = None


class ConciergeChatRequest(BaseModel):
    message: str
    history: list[ConciergeMessage] | None = []
    inventory: list[ConciergeVehicle] | None = []


class ConciergeChatResponse(BaseModel):
    reply: str


@router.post("/concierge", response_model=ConciergeChatResponse)
async def concierge_chat(payload: ConciergeChatRequest):
    user_msg = (payload.message or "").strip()
    if not user_msg:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty.",
        )

    api_key = settings.gemini_api_key or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini API key is not configured on the server.",
        )

    # Format fleet inventory into structured context for the concierge
    fleet_lines = []
    for car in (payload.inventory or []):
        c_title = car.title or car.name or "Luxury Automobile"
        c_brand = car.brand or ""
        c_cat = car.category or "Exotic"
        c_price = car.price or (f"${car.priceAmount:,.0f}" if car.priceAmount else "Inquire for pricing")
        c_year = car.year or "2024"
        c_fuel = car.fuelType or ""
        c_accel = f"0-60 in {car.acceleration}" if car.acceleration else ""
        c_hp = f"{car.horsepower} HP" if car.horsepower else ""
        specs_str = ", ".join(filter(Boolean := bool, [c_year, c_cat, c_fuel, c_hp, c_accel]))
        fleet_lines.append(f"- {c_brand} {c_title} ({specs_str}) — Price: {c_price}")

    inventory_context = "\n".join(fleet_lines) if fleet_lines else (
        "- Audi RS e-tron GT (2024 Electric, 637 hp, 0-60 in 3.1s) — Price: $142,900\n"
        "- Porsche 911 Carrera (2023 Sports, 379 hp, 0-60 in 4.0s) — Price: $128,500\n"
        "- Range Rover Sport (2024 Luxury SUV, 395 hp, 0-60 in 5.4s) — Price: $106,750"
    )

    system_instruction = (
        "You are the DriveXCars AI Luxury Concierge, an elite, polished, and knowledgeable luxury car advisor.\n"
        "Your role is to guide clients through DriveXCars's exclusive showroom fleet.\n\n"
        "GUIDELINES:\n"
        "1. Recommend specific vehicle models from the current fleet with their prices and key performance highlights.\n"
        "2. Keep your answers concise, engaging, and under 3 sentences.\n"
        "3. Maintain a warm, prestigious, VIP tone.\n"
        "4. If a client asks for something outside current inventory, graciously suggest the closest match in the showroom.\n\n"
        f"CURRENT DRIVE-X SHOWROOM INVENTORY:\n{inventory_context}"
    )

    contents = []
    for h in (payload.history or []):
        r = "model" if h.role in ["assistant", "model"] else "user"
        contents.append({"role": r, "parts": [{"text": h.content}]})

    contents.append({"role": "user", "parts": [{"text": user_msg}]})

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    req_body = {
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        },
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 250,
        }
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=req_body)
            if resp.status_code != 200:
                raise HTTPException(
                    status_code=resp.status_code,
                    detail=f"Google Gen AI error: {resp.text}",
                )
            data = resp.json()
            candidates = data.get("candidates", [])
            if not candidates:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="No response returned by Gemini model.",
                )
            generated_text = (
                candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            )
            return ConciergeChatResponse(reply=generated_text.strip())
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate concierge response: {str(exc)}",
        ) from exc


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
