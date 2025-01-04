# leads/serializers.py
from rest_framework import serializers
from .models import Lead

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['id', 'name', 'email', 'phone_number', 'company', 'description', 'status','created_by']
        # read_only_fields = ['created_by']
def validate(self, data):
        if not data.get('name'):
            raise serializers.ValidationError("Name is required.")
        if not data.get('email'):
            raise serializers.ValidationError("Email is required.")
        if not data.get('phone_number'):
            raise serializers.ValidationError("Phone number is required.")
        if not data.get('company'):
            raise serializers.ValidationError("Company is required.")
        if not data.get('description'):
            raise serializers.ValidationError("Description is required.")
        return data