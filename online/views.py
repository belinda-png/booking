from decimal import Decimal

from django.db import transaction

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import (
    User,
    Vendor,
    Destination,
    Hotel,
    HotelRoom,
    Flight,
    Car,
    Tour,
    Booking,
    Payment,
    Review,
)

from .serializers import (
    UserSerializer,
    VendorSerializer,
    VendorCreateSerializer,
    DestinationSerializer,
    HotelSerializer,
    HotelRoomSerializer,
    FlightSerializer,
    CarSerializer,
    TourSerializer,
    BookingSerializer,
    BookingCreateSerializer,
    PaymentSerializer,
    ReviewSerializer,
)


# =====================================================
# PERMISSIONS
# =====================================================

class IsVendor(permissions.BasePermission):

    def has_permission(self, request, view):

        print("USER:", request.user)
        print("USER ID:", request.user.id)
        print("ROLE:", request.user.role)
        print("AUTHENTICATED:", request.user.is_authenticated)

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

# =====================================================
# USERS
# =====================================================

class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all()

    serializer_class = UserSerializer

    def get_permissions(self):

        if self.action == "create":
            return [permissions.AllowAny()]

        return [IsAdmin()]

    def get_queryset(self):

        if self.request.user.role == "admin":
            return User.objects.all()

        return User.objects.filter(
            id=self.request.user.id
        )

# =====================================================
# VENDORS
# =====================================================

class VendorViewSet(viewsets.ModelViewSet):

    queryset = Vendor.objects.all()

    serializer_class = VendorSerializer

    def get_serializer_class(self):

        if self.action == "create":
            return VendorCreateSerializer

        return VendorSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAdmin()]

        if self.action == "approve_vendor":
            return [IsAdmin()]

        return [permissions.IsAuthenticated()]

    def get_queryset(self):

        user = self.request.user

        if not user.is_authenticated:
            return Vendor.objects.none()

        if user.role == "admin":
            return Vendor.objects.all()

        if user.role == "vendor":
            return Vendor.objects.filter(
                user=user
            )

        return Vendor.objects.none()

    def perform_create(self, serializer):

        if Vendor.objects.filter(
            user=self.request.user
        ).exists():

            raise PermissionDenied(
                "You already have a vendor profile."
            )

        serializer.save(
            user=self.request.user
        )

    @action(
        detail=True,
        methods=["post"]
    )
    def approve_vendor(self, request, pk=None):

        vendor = self.get_object()

        vendor.is_approved = True

        vendor.save()

        return Response({
            "message": "Vendor approved successfully."
        })


# =====================================================
# DESTINATIONS
# =====================================================

class DestinationViewSet(viewsets.ModelViewSet):

    queryset = Destination.objects.all()

    serializer_class = DestinationSerializer

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve"
        ]:
            return [permissions.AllowAny()]

        return [IsAdmin()]


# =====================================================
# HOTELS
# =====================================================

class HotelViewSet(viewsets.ModelViewSet):

    queryset = Hotel.objects.all()

    serializer_class = HotelSerializer

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve"
        ]:
            return [permissions.AllowAny()]

        return [IsVendor()]

    def get_queryset(self):

        queryset = Hotel.objects.all()

        if self.request.user.is_authenticated:

            if self.request.user.role == "vendor":

                queryset = queryset.filter(
                    vendor__user=self.request.user
                )

        else:

            queryset = queryset.filter(
                is_active=True
            )

        return queryset

    def perform_create(self, serializer):

        vendor = Vendor.objects.get(
            user=self.request.user
        )

        if not vendor.is_approved:

            raise PermissionDenied(
                "Your vendor account has not been approved."
            )

        serializer.save(
            vendor=vendor
        )


# =====================================================
# HOTEL ROOMS
# =====================================================

class HotelRoomViewSet(viewsets.ModelViewSet):

    queryset = HotelRoom.objects.all()

    serializer_class = HotelRoomSerializer

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve"
        ]:
            return [permissions.AllowAny()]

        return [IsVendor()]

    def get_queryset(self):

        user = self.request.user

        if user.role == "admin":
            return HotelRoom.objects.all()

        if user.role == "vendor":
            return HotelRoom.objects.filter(
                hotel__vendor__user=user
            )

        return HotelRoom.objects.filter(
            is_available=True
        )


# =====================================================
# FLIGHTS
# =====================================================

class FlightViewSet(viewsets.ModelViewSet):

    queryset = Flight.objects.all()

    serializer_class = FlightSerializer

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve"
        ]:
            return [permissions.AllowAny()]

        return [IsVendor()]

    def get_queryset(self):

        queryset = Flight.objects.all()

        if not self.request.user.is_authenticated:

            queryset = queryset.filter(
                is_active=True
            )

        elif self.request.user.role == "vendor":

            queryset = queryset.filter(
                vendor__user=self.request.user
            )

        return queryset

    def perform_create(self, serializer):

        vendor = Vendor.objects.get(
            user=self.request.user
        )

        if not vendor.is_approved:

            raise PermissionDenied(
                "Your vendor account has not been approved."
            )

        serializer.save(
            vendor=vendor
        )


# =====================================================
# CARS
# =====================================================

class CarViewSet(viewsets.ModelViewSet):

    queryset = Car.objects.all()

    serializer_class = CarSerializer

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve"
        ]:
            return [permissions.AllowAny()]

        return [IsVendor()]

    def get_queryset(self):

        queryset = Car.objects.all()

        if not self.request.user.is_authenticated:

            queryset = queryset.filter(
                is_available=True
            )

        elif self.request.user.role == "vendor":

            queryset = queryset.filter(
                vendor__user=self.request.user
            )

        return queryset

    def perform_create(self, serializer):

        vendor = Vendor.objects.get(
            user=self.request.user
        )

        if not vendor.is_approved:

            raise PermissionDenied(
                "Your vendor account has not been approved."
            )

        serializer.save(
            vendor=vendor
        )


# =====================================================
# TOURS
# =====================================================

class TourViewSet(viewsets.ModelViewSet):

    queryset = Tour.objects.all()

    serializer_class = TourSerializer

    def get_permissions(self):

        if self.action in [
            "list",
            "retrieve"
        ]:
            return [permissions.AllowAny()]

        return [IsVendor()]

    def get_queryset(self):

        queryset = Tour.objects.all()

        if not self.request.user.is_authenticated:

            queryset = queryset.filter(
                is_active=True
            )

        elif self.request.user.role == "vendor":

            queryset = queryset.filter(
                vendor__user=self.request.user
            )

        return queryset

    def perform_create(self, serializer):

        vendor = Vendor.objects.get(
            user=self.request.user
        )

        if not vendor.is_approved:

            raise PermissionDenied(
                "Your vendor account has not been approved."
            )

        serializer.save(
            vendor=vendor
        )


# =====================================================
# BOOKINGS
# =====================================================

class BookingViewSet(viewsets.ModelViewSet):

    queryset = Booking.objects.all()

    serializer_class = BookingSerializer

    def get_serializer_class(self):

        if self.action == "create":
            return BookingCreateSerializer

        return BookingSerializer

    def get_permissions(self):

        return [
            permissions.IsAuthenticated()
        ]

    def get_queryset(self):

        user = self.request.user

        if user.role == "admin":

            return Booking.objects.all()

        if user.role == "vendor":

            return Booking.objects.filter(
                hotel__vendor__user=user
            ) | Booking.objects.filter(
                flight__vendor__user=user
            ) | Booking.objects.filter(
                car__vendor__user=user
            ) | Booking.objects.filter(
                tour__vendor__user=user
            )

        return Booking.objects.filter(
            user=user
        )

    @transaction.atomic
    def perform_create(self, serializer):

        data = serializer.validated_data

        booking_type = data["booking_type"]

        number_of_people = data[
            "number_of_people"
        ]

        total_price = Decimal("0.00")

        if booking_type == "hotel":

            hotel = data["hotel"]

            if not hotel.is_active:

                raise PermissionDenied(
                    "This hotel is not available."
                )

            if hotel.rooms_available < number_of_people:

                raise PermissionDenied(
                    "Not enough rooms available."
                )

            total_price = (
                hotel.price_per_night
                * number_of_people
            )

            hotel.rooms_available -= number_of_people

            hotel.save()

        elif booking_type == "flight":

            flight = data["flight"]

            if not flight.is_active:

                raise PermissionDenied(
                    "This flight is not available."
                )

            if flight.available_seats < number_of_people:

                raise PermissionDenied(
                    "Not enough seats available."
                )

            total_price = (
                flight.price
                * number_of_people
            )

            flight.available_seats -= number_of_people

            flight.save()

        elif booking_type == "car":

            car = data["car"]

            if not car.is_available:

                raise PermissionDenied(
                    "This car is not available."
                )

            total_price = (
                car.price_per_day
            )

            car.is_available = False

            car.save()

        elif booking_type == "tour":

            tour = data["tour"]

            if not tour.is_active:

                raise PermissionDenied(
                    "This tour is not available."
                )

            if tour.available_slots < number_of_people:

                raise PermissionDenied(
                    "Not enough tour slots available."
                )

            total_price = (
                tour.price_per_person
                * number_of_people
            )

            tour.available_slots -= number_of_people

            tour.save()

        serializer.save(
            user=self.request.user,
            total_price=total_price
        )

    @action(
        detail=True,
        methods=["post"]
    )
    def confirm_booking(
        self,
        request,
        pk=None
    ):

        booking = self.get_object()

        if request.user.role not in [
            "vendor",
            "admin"
        ]:

            raise PermissionDenied(
                "You do not have permission to confirm bookings."
            )

        booking.status = "confirmed"

        booking.save()

        return Response({
            "message": "Booking confirmed successfully."
        })

    @action(
        detail=True,
        methods=["post"]
    )
    def decline_booking(
        self,
        request,
        pk=None
    ):

        booking = self.get_object()

        if request.user.role not in [
            "vendor",
            "admin"
        ]:

            raise PermissionDenied(
                "You do not have permission to decline bookings."
            )

        booking.status = "declined"

        booking.save()

        return Response({
            "message": "Booking declined successfully."
        })

    @action(
        detail=True,
        methods=["post"]
    )
    def cancel_booking(
        self,
        request,
        pk=None
    ):

        booking = self.get_object()

        if booking.user != request.user:

            raise PermissionDenied(
                "You can only cancel your own booking."
            )

        if booking.status == "confirmed":

            raise PermissionDenied(
                "A confirmed booking cannot be cancelled here."
            )

        booking.status = "cancelled"

        booking.save()

        return Response({
            "message": "Booking cancelled successfully."
        })


# =====================================================
# PAYMENTS
# =====================================================

class PaymentViewSet(viewsets.ModelViewSet):

    queryset = Payment.objects.all()

    serializer_class = PaymentSerializer

    def get_permissions(self):

        return [
            permissions.IsAuthenticated()
        ]

    def get_queryset(self):

        user = self.request.user

        if user.role == "admin":

            return Payment.objects.all()

        if user.role == "vendor":

            return Payment.objects.filter(
                booking__hotel__vendor__user=user
            ) | Payment.objects.filter(
                booking__flight__vendor__user=user
            ) | Payment.objects.filter(
                booking__car__vendor__user=user
            ) | Payment.objects.filter(
                booking__tour__vendor__user=user
            )

        return Payment.objects.filter(
            booking__user=user
        )

    def perform_create(self, serializer):

        booking_id = self.request.data.get(
            "booking"
        )

        try:

            booking = Booking.objects.get(
                id=booking_id,
                user=self.request.user
            )

        except Booking.DoesNotExist:

            raise PermissionDenied(
                "Booking not found or does not belong to you."
            )

        if hasattr(booking, "payment"):

            raise PermissionDenied(
                "This booking already has a payment."
            )

        serializer.save(
            booking=booking,
            amount=booking.total_price,
            status="successful"
        )


# =====================================================
# REVIEWS
# =====================================================

class ReviewViewSet(viewsets.ModelViewSet):

    queryset = Review.objects.all()

    serializer_class = ReviewSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):

        queryset = Review.objects.all()

        hotel_id = self.request.query_params.get(
            "hotel"
        )

        tour_id = self.request.query_params.get(
            "tour"
        )

        if hotel_id:

            queryset = queryset.filter(
                hotel_id=hotel_id
            )

        if tour_id:

            queryset = queryset.filter(
                tour_id=tour_id
            )

        return queryset

    def perform_create(self, serializer):

        serializer.save(
            user=self.request.user
        )