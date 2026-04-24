from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings

BASE_URL = settings.COMFYUI_URL

class ImageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("images", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("images", self.channel_name)

    async def send_image(self, event):
        await self.send(text_data=json.dumps(event["data"]))

import requests


class ActiveConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("active", self.channel_name)
        await self.accept()

        # 🔥 enviar estado actual al conectar
        try:
            res = requests.get(f"{BASE_URL}/queue").json()

            running = len(res.get("queue_running", [])) > 0
            pending = len(res.get("queue_pending", [])) > 0

            active = running or pending

            await self.send(text_data=json.dumps({
                "active": active
            }))

        except Exception as e:
            print("Error enviando estado inicial:", e)
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("active", self.channel_name)

    async def send_active(self, event):
        await self.send(text_data=json.dumps(event["data"]))