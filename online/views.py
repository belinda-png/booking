from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    User,
    Vendor,
    Destination,
    Listing,
    Availability,
    Booking,
    Payment,
    Review,
)

from .serializers import (
    UserSerializer,
    VendorSerializer,
    DestinationSerializer,
    ListingSerializer,
    ListingImageSerializer,
    AvailabilitySerializer,
    BookingSerializer,
    BookingDetailSerializer,
    BookingCreateSerializer,
    BookingUpdateSerializer,
    PaymentSerializer,
    PaymentCreateSerializer,
    PaymentUpdateSerializer,
    ReviewSerializer,
    ReviewCreateSerializer,
    ReviewUpdateSerializer,
)


# =========================
# PERMISSIONS
# =========================

class IsVendor(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "vendor"
        )


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "admin"
        )


# =========================
# USER
# =========================

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]

        return [
            permissions.IsAuthenticated(),
            IsAdmin(),
        ]

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated and user.role == "admin":
            return User.objects.all()

        return User.objects.filter(id=user.id)


# =========================
# VENDOR
# =========================

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.IsAuthenticated()]

        if self.action == "approve_vendor":
            return [IsAdmin()]

        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Vendor.objects.none()

        if user.role == "admin":
            return Vendor.objects.all()

        return Vendor.objects.filter(user=user)

    @action(detail=True, methods=["post"])
    def approve_vendor(self, request, pk=None):
        vendor = self.get_object()

        vendor.is_approved = True
        vendor.save()

        return Response({
            "status": "Vendor approved"
        })


# =========================
# DESTINATION
# =========================

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsAdmin,
    ]


# =========================
# LISTING
# =========================

class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

    def get_permissions(self):
        if self.action in [
            "create",
            "update",
            "partial_update",
            "destroy",
        ]:
            return [IsVendor()]

        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Listing.objects.filter(is_active=True)

        destination = self.request.query_params.get("destination")

        if destination:
            queryset = queryset.filter(
                destination__name__icontains=destination
            )

        return queryset

    def perform_create(self, serializer):
        vendor = Vendor.objects.get(
            user=self.request.user
        )

        serializer.save(vendor=vendor)


# =========================
# AVAILABILITY
# =========================

class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [IsVendor]

    def get_queryset(self):
        user = self.request.user

        return Availability.objects.filter(
            listing__vendor__user=user
        )


# =========================
# BOOKING
# =========================

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.IsAuthenticated()]

        if self.action in [
            "confirm_booking",
            "decline_booking",
        ]:
            return [IsVendor()]

        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "create":
            return BookingCreateSerializer

        if self.action in [
            "confirm_booking",
            "decline_booking",
        ]:
            return BookingSerializer

        return BookingSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == "vendor":
            return Booking.objects.filter(
                listing__vendor__user=user
            )

        return Booking.objects.filter(
            user=user
        )

    def perform_create(self, serializer):
        listing_id = self.request.data.get("listing")

        listing = Listing.objects.get(
            id=listing_id
        )

        number_of_people = int(
            self.request.data.get("number_of_people")
        )

        total_price = (
            listing.price_per_person
            * number_of_people
        )

        serializer.save(
            user=self.request.user,
            listing=listing,
            total_price=total_price,
        )

    @action(detail=True, methods=["post"])
    def confirm_booking(self, request, pk=None):
        booking = self.get_object()

        booking.status = "confirmed"
        booking.save()

        return Response({
            "status": "Booking confirmed"
        })

    @action(detail=True, methods=["post"])
    def decline_booking(self, request, pk=None):
        booking = self.get_object()

        booking.status = "declined"
        booking.save()

        return Response({
            "status": "Booking declined"
        })


# =========================
# PAYMENT
# =========================

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_serializer_class(self):
        if self.action == "create":
            return PaymentCreateSerializer

        if self.action in [
            "update",
            "partial_update",
        ]:
            return PaymentUpdateSerializer

        return PaymentSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == "admin":
            return Payment.objects.all()

        if user.role == "vendor":
            return Payment.objects.filter(
                booking__listing__vendor__user=user
            )

        return Payment.objects.filter(
            booking__user=user
        )

    def perform_create(self, serializer):
        booking_id = self.request.data.get("booking")

        booking = Booking.objects.get(
            id=booking_id
        )

        serializer.save(
            booking=booking,
            amount=booking.total_price,
            status="successful",
        )


# =========================
# REVIEW
# =========================

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_serializer_class(self):
        if self.action == "create":
            return ReviewCreateSerializer

        if self.action in [
            "update",
            "partial_update",
        ]:
            return ReviewUpdateSerializer

        return ReviewSerializer

    def get_queryset(self):
        queryset = Review.objects.all()

        listing_id = self.request.query_params.get(
            "listing"
        )

        if listing_id:
            queryset = queryset.filter(
                listing_id=listing_id
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )