from django.db import models
from django.contrib.auth.models import AbstractUser


# =========================
# USER
# =========================
import random
from datetime import timedelta

from django.db import models
from django.utils import timezone


class EmailVerificationOTP(models.Model):
    user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        related_name="email_verification_otps"
    )
    code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return timezone.now() < self.expires_at

    @staticmethod
    def generate_code():
        return str(random.randint(100000, 999999))

class User(AbstractUser):
    ROLE_CHOICES = [
        ("user", "User"),
        ("vendor", "Vendor"),
        ("admin", "Admin"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="user"
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username


# =========================
# VENDOR
# =========================

class Vendor(models.Model):

    VENDOR_TYPE_CHOICES = [
        ("hotel", "Hotel"),
        ("airline", "Airline"),
        ("car_rental", "Car Rental"),
        ("tour_operator", "Tour Operator"),
        ("transport", "Transport"),
        ("other", "Other"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="vendor_profile"
    )

    business_name = models.CharField(max_length=255)

    vendor_type = models.CharField(
        max_length=30,
        choices=VENDOR_TYPE_CHOICES
    )

    description = models.TextField(blank=True)

    phone_number = models.CharField(
        max_length=20,
        blank=True
    )

    address = models.CharField(
        max_length=255,
        blank=True
    )

    is_approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.business_name


# =========================
# DESTINATION
# =========================

class Destination(models.Model):

    name = models.CharField(max_length=255)

    country = models.CharField(max_length=255)

    description = models.TextField(blank=True)

    image = models.ImageField(
        upload_to="destinations/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}, {self.country}"


# =========================
# HOTEL
# =========================

class Hotel(models.Model):

    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name="hotels"
    )

    destination = models.ForeignKey(
        Destination,
        on_delete=models.SET_NULL,
        null=True,
        related_name="hotels"
    )

    name = models.CharField(max_length=255)

    description = models.TextField()

    address = models.CharField(max_length=255)

    price_per_night = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    rooms_available = models.PositiveIntegerField(
        default=0
    )

    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=0
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# =========================
# FLIGHT
# =========================

class Flight(models.Model):

    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name="flights"
    )

    airline_name = models.CharField(max_length=255)

    flight_number = models.CharField(
        max_length=50, blank=True, null=True
    )

    departure_city = models.CharField(
        max_length=255, blank=True, null=True
    )

    arrival_city = models.CharField(
        max_length=255, blank=True, null=True   
    )

    departure_date = models.DateField(blank=True, null=True)
    departure_time = models.TimeField(blank=True, null=True)
    arrival_date = models.DateField()

    arrival_time = models.TimeField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2, blank=True, null=True
    )

    available_seats = models.PositiveIntegerField(
        default=0, blank=True, null=True
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.airline_name} - {self.flight_number}"


# =========================
# CAR RENTAL
# =========================

class Car(models.Model):

    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name="cars"
    )

    brand = models.CharField(max_length=100)

    model = models.CharField(max_length=100)

    year = models.PositiveIntegerField(blank=True, null=True)

    registration_number = models.CharField(
        max_length=50,
        unique=True
    )

    seats = models.PositiveIntegerField(
        default=4, blank=True, null=True
    )

    price_per_day = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    location = models.CharField(
        max_length=255
    )

    is_available = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.brand} {self.model}"


# =========================
# TOUR
# =========================

class Tour(models.Model):

    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name="tours"
    )

    destination = models.ForeignKey(
        Destination,
        on_delete=models.SET_NULL,
        null=True,
        related_name="tours"
    )

    title = models.CharField(
        max_length=255, blank=True, null=True
    )

    description = models.TextField(blank=True, null=True)

    duration_days = models.PositiveIntegerField(
        default=1, blank=True, null=True
    )

    price_per_person = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    available_slots = models.PositiveIntegerField(
        default=0, blank=True, null=True
    )

    is_active = models.BooleanField(
        default=True, blank=True, null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True, blank=True, null=True
    )

    def __str__(self):
        return self.title


# =========================
# HOTEL ROOM
# =========================

class HotelRoom(models.Model):

    ROOM_TYPES = [
        ("single", "Single"),
        ("double", "Double"),
        ("twin", "Twin"),
        ("suite", "Suite"),
        ("family", "Family"),
    ]

    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
        related_name="rooms", blank=True, null=True
    )

    room_type = models.CharField(
        max_length=20,
        choices=ROOM_TYPES, blank=True, null=True
    )

    room_number = models.CharField(
        max_length=20, blank=True, null=True
    )

    price_per_night = models.DecimalField(
        max_digits=10,
        decimal_places=2, blank=True, null=True
    )

    is_available = models.BooleanField(
        default=True, blank=True, null=True
    )

    def __str__(self):
        return f"{self.hotel.name} - {self.room_number}"


# =========================
# BOOKINGS
# =========================

class Booking(models.Model):

    BOOKING_TYPE_CHOICES = [
        ("hotel", "Hotel"),
        ("flight", "Flight"),
        ("car", "Car"),
        ("tour", "Tour"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("declined", "Declined"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bookings", blank=True, null=True
    )

    booking_type = models.CharField(
        max_length=20,
        choices=BOOKING_TYPE_CHOICES, blank=True, null=True
    )

    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bookings"
    )

    flight = models.ForeignKey(
        Flight,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bookings"
    )

    car = models.ForeignKey(
        Car,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bookings"
    )

    tour = models.ForeignKey(
        Tour,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bookings"
    )

    booking_date = models.DateField()

    number_of_people = models.PositiveIntegerField(
        default=1, blank=True, null=True
    )

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2, blank=True, null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending", blank=True, null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True, blank=True, null=True
    )

    def __str__(self):
        return f"{self.user.username} - {self.booking_type}"


# =========================
# PAYMENT
# =========================

class Payment(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("successful", "Successful"),
        ("failed", "Failed"),
    ]

    PAYMENT_METHODS = [
        ("mobile_money", "Mobile Money"),
        ("card", "Card"),
        ("bank_transfer", "Bank Transfer"),
    ]

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name="payment", blank=True, null=True
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2, blank=True, null=True
    )

    method = models.CharField(
        max_length=30,
        choices=PAYMENT_METHODS, blank=True, null=True
    )

    transaction_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending", blank=True, null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True, blank=True, null=True
    )

    def __str__(self):
        return f"Payment - {self.booking.id}"


# =========================
# REVIEW
# =========================

class Review(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="reviews"
    )

    tour = models.ForeignKey(
        Tour,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="reviews"
    )

    rating = models.PositiveIntegerField()

    comment = models.TextField(
        blank=True, null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True, blank=True, null=True
    )

    def __str__(self):
        return f"{self.user.username} - {self.rating}/5"