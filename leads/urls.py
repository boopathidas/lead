from django.urls import path
from .views import LoginView, LeadCreateView, LeadListView, LeadUpdateStatusView
from .views import CreatePartnerView

urlpatterns = [
    path('api/login/', LoginView.as_view(), name='login'),  # Ensure this is correct
    path('api/leads/', LeadListView.as_view(), name='list-leads'),  # For GET requests
    path('api/leads/', LeadCreateView.as_view(), name='create-lead'),  # For POST requests
    path('api/leads/<int:pk>/update-status/', LeadUpdateStatusView.as_view(), name='update-lead-status'),
    path('create-partner/', CreatePartnerView.as_view(), name='create-partner'),
]
