import json
import random
import uuid
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings

BASE_URL = settings.COMFYUI_URL

POSITIVE_ID = "6"
NEGATIVE_ID = "7"
KSampler_ID = "3"

def cargar_workflow():
    ruta = os.path.join(
        settings.BASE_DIR,
        "launcher",
        "workflows",
        "Prueba.json"
    )

    with open(ruta, "r", encoding="utf-8") as f:
        return json.load(f)

@csrf_exempt
def Prompt(request):
    if request.method != "POST":
        return JsonResponse({"error": "Solo POST permitido"}, status=405)

    try:
        body = json.loads(request.body)

        prompt_text = body.get("prompt", "")
        negative_text = body.get("negative_prompt", "")

        # 🆕 nuevos parámetros
        width = int(body.get("width", ""))
        height = int(body.get("height", ""))

        # 🔥 cargar workflow base
        workflow = cargar_workflow()

        # 🔥 inyectar prompts
        workflow[POSITIVE_ID]["inputs"]["text"] = prompt_text
        workflow[NEGATIVE_ID]["inputs"]["text"] = negative_text or "Patreon, text"

        # 🔥 tamaño de imagen (nodo 5)
        workflow["5"]["inputs"]["width"] = width
        workflow["5"]["inputs"]["height"] = height

        # 🔥 seed aleatoria
        seed = random.randint(0, 10**14)
        workflow[KSampler_ID]["inputs"]["seed"] = seed

        data = {
            "prompt": workflow,
            "client_id": str(uuid.uuid4())
        }

        # 🚀 envío a ComfyUI
        response = requests.post(f"{BASE_URL}/prompt", json=data)
        res_json = response.json()

        if "prompt_id" not in res_json:
            return JsonResponse({
                "error": "Error en ComfyUI",
                "details": res_json
            }, status=500)

        return JsonResponse({
            "prompt_id": res_json["prompt_id"],
            "seed": seed,
            "width": width,
            "height": height
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)