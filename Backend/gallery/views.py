# gallery/views.py
import requests
from django.http import HttpResponse, JsonResponse
from django.conf import settings

BASE_URL = settings.COMFYUI_URL

def get_image(request):
    filename = request.GET.get("filename")
    subfolder = request.GET.get("subfolder")
    type_ = request.GET.get("type")

    url = f"{BASE_URL}/view?filename={filename}&subfolder={subfolder}&type={type_}"

    res = requests.get(url)

    return HttpResponse(res.content, content_type="image/png")

def list_images(request):
    try:
        res = requests.get(f"{BASE_URL}/history")
        data = res.json()

        imgs = []

        for item in data.values():
            prompt_data = item.get("prompt")

            positive, negative = extract_prompts(prompt_data)

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

        return JsonResponse(imgs[::-1], safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def extract_prompts(prompt):
    try:
        # 🔥 CASO 1: viene como lista (tu React)
        if isinstance(prompt, list) and len(prompt) > 2:
            workflow = prompt[2]

            positive = workflow.get("6", {}).get("inputs", {}).get("text", "")
            negative = workflow.get("7", {}).get("inputs", {}).get("text", "")

            return positive, negative

        # 🔥 CASO 2: viene como dict (forma clásica)
        if isinstance(prompt, dict):
            for node in prompt.values():
                if node.get("class_type") == "KSampler":
                    inputs = node.get("inputs", {})

                    pos_id = inputs.get("positive", [None])[0]
                    neg_id = inputs.get("negative", [None])[0]

                    positive = prompt.get(pos_id, {}).get("inputs", {}).get("text", "")
                    negative = prompt.get(neg_id, {}).get("inputs", {}).get("text", "")

                    return positive, negative

        return "", ""

    except Exception as e:
        print("Error extrayendo prompts:", e)
        return "", ""