from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Lead
from .serializers import LeadSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

# Utility function to send email notification when a new lead is created
def send_email_notification(lead):
    subject = f"New Lead Registered: {lead.name}"
    message = f"""
    Lead Details:
    Name: {lead.name}
    Email: {lead.email}
    Phone: {lead.phone_number}
    Company: {lead.company}
    Description: {lead.description}
    """
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [settings.ADMIN_EMAIL])
# class LoginView(APIView):
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')

#         if username == 'admin' and password == 'admin@123':  # Static login for testing
#             user = authenticate(username=username, password=password)
#             if user:
#                 token, _ = Token.objects.get_or_create(user=user)
#                 role = 'admin' if user.is_superuser else 'partner'
#                 return Response({'token': token.key, 'role': role})
#             return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
#         user = authenticate(username=username, password=password)
#         if user:
#             token, _ = Token.objects.get_or_create(user=user)
#             role = 'admin' if user.is_superuser else 'partner'
#             return Response({'token': token.key, 'role': role})

#         return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
class LoginView(APIView):
    def post(self, request):
        # You can skip authentication here as per your requirement
        token = "mock_token"  # Replace with actual logic if needed
        role = "admin"  # Assuming you want to navigate to the admin page by default

        return Response({'token': token, 'role': role})

class LeadCreateView(generics.CreateAPIView):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        lead = serializer.save(status="Pending", created_by=self.request.user)
        send_email_notification(lead)

# Lead List View - Admin sees all leads, others see only their own
class LeadListView(generics.ListAPIView):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Lead.objects.all()
        return Lead.objects.filter(created_by=user)

# Update Lead Status View - Allows updating lead status and sends email
class LeadUpdateStatusView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        lead = get_object_or_404(Lead, pk=pk)
        status = request.data.get('status')
        comments = request.data.get('comments', '')
        lead.status = status
        lead.comments = comments
        lead.save()

        send_mail(
            f"Lead {lead.status}",
            f"Your lead {lead.name} has been {lead.status}. Comments: {lead.comments}",
            settings.DEFAULT_FROM_EMAIL,
            [lead.created_by.email]
        )
        return Response({'message': 'Status updated'})

# CreatePartnerView - Handles partner creation
class CreatePartnerView(APIView):
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(email=email).exists():
            return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=email, email=email, password=password)
        user.first_name = name
        user.save()
        return Response({'message': 'Partner created successfully'}, status=status.HTTP_201_CREATED)

# CSRF exempt function for external partner creation
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json 

@csrf_exempt
def create_partner(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # Logic to handle partner creation can be similar to CreatePartnerView
        return JsonResponse({'message': 'Partner created successfully'})
    return JsonResponse({'error': 'Invalid request'}, status=400)
