from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter

from prompts.views import PromptViewSet, SetViewSet, SetFilterView


# 🔹 Router DRF
router = DefaultRouter()
router.register(r'prompts', PromptViewSet)
router.register(r'sets', SetViewSet)


# 🔹 URLs principales
urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API
    path('api/sets/filter/', SetFilterView.as_view(), name='sets-filter'),
    path('api/', include(router.urls)),
    path('api/launcher/', include('launcher.urls')),

    # Otras apps
    path('gallery/', include('gallery.urls')),
]


# 🔹 Archivos estáticos y media (solo en desarrollo)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)