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
class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    def get_permissions(self):
        if self.action in ["create"]:
            return [permissions.IsAuthenticated()]
        elif self.action in ["approve_vendor"]:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def approve_vendor(self, request, pk=None):
        vendor = self.get_object()
        vendor.is_approved = True
        vendor.save()
        return Response({"status": "Vendor approved"})
class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]
    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsVendor()]
        return [permissions.AllowAny()]
    def perform_create(self, serializer):
        vendor = Vendor.objects.get(user=self.request.user)
        serializer.save(vendor=vendor)
    def get_queryset(self):
        queryset = Listing.objects.filter(is_active=True)
        destination_id = self.request.query_params.get("destination")
        if destination:
            queryset = queryset.filter(destination_name_icontains=destination)
        return queryset
class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [IsVendor]
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.IsAuthenticated()]
        elif self.action in ["confirm_booking", "decline_booking"]:
            return [IsVendor()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        if user.role == "vendor":
            return Booking.objects.filter(listing__vendor__user=user)
        return Booking.objects.filter(user=user)

    def perform_create(self, serializer):
        listing_id = self.request.data.get("listing")
        listing = Listing.objects.get(id=listing_id)

        number_of_people = int(self.request.data.get("number_of_people"))
        total_price = listing.price_per_person * number_of_people

        serializer.save(
            user=self.request.user,
            listing=listing,
            total_price=total_price
        )

    @action(detail=True, methods=["post"])
    def confirm_booking(self, request, pk=None):
        booking = self.get_object()
        booking.status = "confirmed"
        booking.save()
        return Response({"status": "Booking confirmed"})

    @action(detail=True, methods=["post"])
    def decline_booking(self, request, pk=None):
        booking = self.get_object()
        booking.status = "declined"
        booking.save()
        return Response({"status": "Booking declined"})
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        booking_id = self.request.data.get("booking")
        booking = Booking.objects.get(id=booking_id)

        serializer.save(
            booking=booking,
            amount=booking.total_price,
            status="successful"  # later connect real payment gateway
        )