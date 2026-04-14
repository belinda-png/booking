from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from .models import *
from .serializers import *
from rest_framework.decorators import action
from rest_framework.response import Response

class IsVendor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "vendor"


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "admin"

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)