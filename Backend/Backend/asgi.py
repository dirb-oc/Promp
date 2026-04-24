import os
import django
import asyncio
from threading import Thread
from gallery.watcher import watch_active, start_watcher
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")
django.setup()

django_asgi_app = get_asgi_application()

from gallery.consumers import ImageConsumer, ActiveConsumer

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": URLRouter([
        path("ws/images", ImageConsumer.as_asgi()),
        path("ws/active", ActiveConsumer.as_asgi()),
    ]),
})

def start_all_watchers():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    loop.create_task(watch_active())

    # correr watcher sync en thread aparte
    from threading import Thread
    Thread(target=start_watcher, daemon=True).start()

    loop.run_forever()

Thread(target=start_all_watchers, daemon=True).start()