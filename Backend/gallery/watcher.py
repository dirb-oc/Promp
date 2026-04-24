import time
import requests
from .utils import notify_new_image
import asyncio
from channels.layers import get_channel_layer
from django.conf import settings

def get_base_url():
    return settings.COMFYUI_URL


def fetch_images():
    res = requests.get(f"{get_base_url()}/history")
    data = res.json()

    imgs = []

    for item in data.values():
        prompt = item.get("prompt")

        workflow = None
        if isinstance(prompt, list) and len(prompt) > 2:
            workflow = prompt[2]

        positive, negative = extract_prompts_from_item(item)

        if "outputs" in item:
            for output in item["outputs"].values():
                if "images" in output:
                    for img in output["images"]:
                        imgs.append({
                            "filename": img["filename"],
                            "subfolder": img["subfolder"],
                            "type": img["type"],
                            "positive": positive,
                            "negative": negative,
                        })

    return imgs


def start_watcher():
    seen = set()

    while True:
        try:
            images = fetch_images()

            for img in images:
                if img["filename"] not in seen:
                    seen.add(img["filename"])

                    notify_new_image({
                    "filename": img["filename"],
                    "subfolder": img["subfolder"],
                    "type": img["type"],
                    "positive": img["positive"],   # 👈 agregar
                    "negative": img["negative"],   # 👈 agregar
                })
        except Exception as e:
            print("Watcher error:", e)

        time.sleep(3)

def extract_prompts_from_item(item):
    try:
        prompt = item.get("prompt")

        # Igual que en React → data[2]
        workflow = prompt[2]

        positive = workflow["6"]["inputs"]["text"]
        negative = workflow["7"]["inputs"]["text"]

        return positive, negative

    except Exception as e:
        print("Error extrayendo prompts:", e)
        return "", ""
    
def get_prompt_data(item):
    # 🔥 Caso principal: prompt (lista)
    prompt = item.get("prompt")
    if isinstance(prompt, list) and len(prompt) > 2:
        return prompt[2]  # 👈 AQUÍ está el fix real

    # 🔥 Caso alterno: workflow directo
    if isinstance(item.get("workflow"), dict):
        return item["workflow"]

    # 🔥 Caso extra_pnginfo
    extra = item.get("extra_pnginfo", {})
    if isinstance(extra, dict):
        workflow = extra.get("workflow")
        if isinstance(workflow, dict):
            return workflow

    return None

async def watch_active():
    channel_layer = get_channel_layer()

    last_state = None  # para evitar spam

    while True:
        try:
            res = requests.get(f"{get_base_url()}/queue").json()

            running = len(res.get("queue_running", [])) > 0
            active = running

            # 🔥 solo enviar si cambia
            if active != last_state:
                last_state = active

                await channel_layer.group_send(
                    "active",
                    {
                        "type": "send_active",
                        "data": {
                            "active": running
                        }
                    }
                )

        except Exception as e:
            print("Error active watcher:", e)

        await asyncio.sleep(1)