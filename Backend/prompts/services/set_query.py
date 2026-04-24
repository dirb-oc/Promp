# sets/services/set_query.py

from django.db.models import Count, Q, Case, When, Value, CharField, F

def with_estado(queryset):
    return queryset.annotate(
        total_prompts=Count('prompts'),
        terminados=Count('prompts', filter=Q(prompts__categoria='terminado')),
        en_revision=Count('prompts', filter=Q(prompts__categoria='revision')),
    ).annotate(
        estado_calc=Case(
            When(total_prompts=0, then=Value('vacio')),
            When(fecha_entrega__isnull=False, then=Value('entregado')),
            When(terminados=F('total_prompts'), then=Value('terminado')),
            When(en_revision__gt=0, then=Value('revision')),
            default=Value('pendiente'),
            output_field=CharField()
        )
    )