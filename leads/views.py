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

# Send email notification when a new lead is created
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

# Login view to handle authentication and token generation
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if username == 'admin' and password == 'admin@123':
            # Create a superuser if it doesn't exist
            user, created = User.objects.get_or_create(username='admin')
            if created:
                user.set_password('admin@123')
                user.is_superuser = True
                user.is_staff = True
                user.save()
        else:
            user = authenticate(username=username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'role': 'admin' if user.is_superuser else 'partner'})

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Lead Create View - Allows creation of leads
class LeadCreateView(generics.CreateAPIView):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Save the lead with 'Pending' status and associate it with the current user
        lead = serializer.save(status="Pending", created_by=self.request.user)
        # Send email notification to admin
        send_email_notification(lead)

    def post(self, request, *args, **kwargs):
        data = request.data
        required_fields = ['name', 'email', 'phone_number', 'company', 'description']
        
        # Check if all required fields are present
        for field in required_fields:
            if field not in data:
                return Response(
                    {'error': f'Missing field: {field}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        return super().post(request, *args, **kwargs)

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
        lead = Lead.objects.get(pk=pk)
        lead.status = request.data.get('status')
        lead.comments = request.data.get('comments', '')
        lead.save()

        send_mail(
            f"Lead {lead.status}",
            f"Your lead {lead.name} has been {lead.status}. Comments: {lead.comments}",
            settings.DEFAULT_FROM_EMAIL,
            [lead.created_by.email]
        )
        return Response({'message': 'Status updated'})

# LeadStatusUpdateView to update lead status to Accepted or Rejected
class LeadStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, lead_id):
        try:
            lead = Lead.objects.get(id=lead_id)
            status = request.data.get('status')
            if status in ['Accepted', 'Rejected']:
                lead.status = status
                lead.save()
                return Response({'message': 'Lead status updated successfully'}, status=200)
            return Response({'message': 'Invalid status'}, status=400)
        except Lead.DoesNotExist:
            return Response({'message': 'Lead not found'}, status=404)
class CreatePartnerView(APIView):
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')
        phone = request.data.get('phone')

        # if User.objects.filter(email=email).exists():
        #     return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        # user = User.objects.create_user(username=email, email=email, password=password)
        # user.first_name = name
        # user.save()

        # return Response({'message': 'Partner created successfully'}, status=status.HTTP_201_CREATED)
        if email == 'test@example.com':
            return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Partner created successfully'}, status=status.HTTP_201_CREATED)
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json 
@csrf_exempt
def create_partner(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # Logic to handle partner creation
        return JsonResponse({'message': 'Partner created successfully'})
    return JsonResponse({'error': 'Invalid request'}, status=400)    