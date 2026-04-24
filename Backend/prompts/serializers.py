from rest_framework import serializers
from .models import Prompt, Set

class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = '__all__'

class SetSerializer(serializers.ModelSerializer):
    imagen_referencia = serializers.SerializerMethodField() 
    
    class Meta:
        model = Set
        fields = '__all__'
    
    def get_imagen_referencia(self, obj):
        request = self.context.get('request')
        url = obj.imagen_referencia

        if url and request:
            return request.build_absolute_uri(url)

        return None

class SetDetailSerializer(serializers.ModelSerializer):
    prompts = serializers.SerializerMethodField()

    class Meta:
        model = Set
        fields = '__all__'

    def get_prompts(self, obj):
        prompts = obj.prompts.all().order_by('titulo')
        return PromptSerializer(
            prompts,
            many=True,
            context=self.context
        ).data