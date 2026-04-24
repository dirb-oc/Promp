from django.db import models
from .services.set_query import with_estado

class SetQuerySet(models.QuerySet):
    def with_estado(self):
        return with_estado(self)

class Set(models.Model):
    nombre = models.CharField(max_length=255)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_entrega = models.DateTimeField(blank=True, null=True)

    objects = SetQuerySet.as_manager()

    def __str__(self):
        return self.nombre

    @property
    def imagen_referencia(self):
        prompt = self.prompts.filter(imagen__isnull=False).first()
        return prompt.imagen.url if prompt and prompt.imagen else None

    
class Prompt(models.Model):

    R_OPCIONES = [
        ('pendiente', 'Pendiente'),
        ('revision', 'Revision'),
        ('accion', 'Acción'),
        ('terminado', 'terminado'),
    ]

    titulo = models.CharField(max_length=255)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    prompt = models.TextField()
    negative_prompt = models.TextField(blank=True, null=True)
    categoria = models.CharField(max_length=50,choices=R_OPCIONES,default='pendiente')
    set = models.ForeignKey(Set,on_delete=models.CASCADE,related_name='prompts')
    imagen = models.ImageField(upload_to='prompts/',blank=True,null=True)

    def __str__(self):
        return self.titulo
    
