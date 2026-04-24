import os
import requests
from urllib.parse import urlparse

# CONFIG
API_URL = "http://localhost:8000/api/prompts/"
MEDIA_PATH = "/home/arc/Proyectos/Promp/Backend/media/prompts"

def get_images_from_api():
    response = requests.get(API_URL)
    response.raise_for_status()
    data = response.json()

    image_names = set()

    for prompt in data:
        # Ajusta esto según tu modelo
        image_url = prompt.get("imagen") or prompt.get("image")

        if image_url:
            path = urlparse(image_url).path
            filename = os.path.basename(path)
            image_names.add(filename)

    return image_names


def get_local_images():
    return set(os.listdir(MEDIA_PATH))


def main():
    api_images = get_images_from_api()
    local_images = get_local_images()

    unused_images = local_images - api_images

    print("=== Imágenes NO utilizadas ===")
    for img in unused_images:
        print(img)

    print(f"\nTotal huérfanas: {len(unused_images)}")


if __name__ == "__main__":
    main()