from rest_framework.viewsets import ModelViewSet
from .models import Prompt, Set
from .serializers import PromptSerializer, SetSerializer, SetDetailSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.paginator import Paginator
from .services.set_query import with_estado

class PromptViewSet(ModelViewSet):
    queryset = Prompt.objects.all()
    serializer_class = PromptSerializer

    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        categoria = self.request.query_params.get('categoria')
        if categoria:
            return Prompt.objects.filter(categoria=categoria)
        return super().get_queryset()

class SetViewSet(ModelViewSet):
    queryset = Set.objects.all().order_by('-fecha_creacion')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SetDetailSerializer
        return SetSerializer

class SetFilterView(APIView):

    def get(self, request):
        nombre = request.GET.get('nombre')
        tipo = request.GET.get('tipo')
        orden = request.GET.get('orden', 'az')
        page = int(request.GET.get('page', 1))

        queryset = Set.objects.all()

        # 🔥 estado calculado
        queryset = with_estado(queryset)

        # 🔍 filtros
        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)

        if tipo:
            queryset = queryset.filter(estado_calc=tipo)

        # 📊 orden
        if orden == 'az':
            queryset = queryset.order_by('nombre')
        elif orden == 'za':
            queryset = queryset.order_by('-nombre')
        elif orden == 'recientes':
            queryset = queryset.order_by('-fecha_creacion')
        elif orden == 'antiguos':
            queryset = queryset.order_by('fecha_creacion')

        # 📄 paginación
        paginator = Paginator(queryset, 20)
        page_obj = paginator.get_page(page)

        data = [
            {
                "id": s.id,
                "nombre": s.nombre,
                "estado": s.estado_calc,
                "fecha_creacion": s.fecha_creacion,
                "imagen_referencia": request.build_absolute_uri(s.imagen_referencia) if s.imagen_referencia else None
            }
            for s in page_obj
        ]

        return Response({
            "results": data,
            "total": paginator.count,
            "pages": paginator.num_pages,
            "current": page
        })