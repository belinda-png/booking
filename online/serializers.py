from rest_framework import serializers

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


# =========================
# USER
# =========================

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        required=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "password",
            "role",
        ]

    def validate_role(self, value):

        if value == "admin":
            raise serializers.ValidationError(
                "Admin accounts cannot be created through registration."
            )

        return value

    def create(self, validated_data):

        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        return user


# =========================
# VENDOR
# =========================

class VendorSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = Vendor
        fields = [
            "id",
            "user",
            "business_name",
            "vendor_type",
            "description",
            "phone_number",
            "address",
            "is_approved",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "is_approved",
            "created_at",
        ]


class VendorCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vendor
        fields = [
            "id",
            "business_name",
            "vendor_type",
            "description",
            "phone_number",
            "address",
        ]
        read_only_fields = [
            "id",
        ]


# =========================
# DESTINATION
# =========================

class DestinationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Destination
        fields = [
            "id",
            "name",
            "country",
            "description",
            "image",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]


# =========================
# HOTEL
# =========================

class HotelSerializer(serializers.ModelSerializer):

    vendor = VendorSerializer(read_only=True)

    class Meta:
        model = Hotel
        fields = [
            "id",
            "vendor",
            "destination",
            "name",
            "description",
            "address",
            "price_per_night",
            "rooms_available",
            "rating",
            "is_active",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "vendor",
            "rating",
            "created_at",
        ]


class HotelRoomSerializer(serializers.ModelSerializer):

    hotel = serializers.PrimaryKeyRelatedField(
        queryset=Hotel.objects.all()
    )

    class Meta:
        model = HotelRoom
        fields = [
            "id",
            "hotel",
            "room_type",
            "room_number",
            "price_per_night",
            "is_available",
        ]

        read_only_fields = [
            "id",
        ]


# =========================
# FLIGHT
# =========================

class FlightSerializer(serializers.ModelSerializer):

    vendor = VendorSerializer(read_only=True)

    class Meta:
        model = Flight
        fields = [
            "id",
            "vendor",
            "airline_name",
            "flight_number",
            "departure_city",
            "arrival_city",
            "departure_date",
            "departure_time",
            "arrival_date",
            "arrival_time",
            "price",
            "available_seats",
            "is_active",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "vendor",
            "created_at",
        ]


# =========================
# CAR
# =========================

class CarSerializer(serializers.ModelSerializer):

    vendor = VendorSerializer(read_only=True)

    class Meta:
        model = Car
        fields = [
            "id",
            "vendor",
            "brand",
            "model",
            "year",
            "registration_number",
            "seats",
            "price_per_day",
            "location",
            "is_available",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "vendor",
            "created_at",
        ]


# =========================
# TOUR
# =========================

class TourSerializer(serializers.ModelSerializer):

    vendor = VendorSerializer(read_only=True)

    class Meta:
        model = Tour
        fields = [
            "id",
            "vendor",
            "destination",
            "title",
            "description",
            "duration_days",
            "price_per_person",
            "available_slots",
            "is_active",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "vendor",
            "created_at",
        ]


# =========================
# BOOKING
# =========================

class BookingSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    hotel = HotelSerializer(read_only=True)

    flight = FlightSerializer(read_only=True)

    car = CarSerializer(read_only=True)

    tour = TourSerializer(read_only=True)

    class Meta:
        model = Booking

        fields = [
            "id",
            "user",
            "booking_type",
            "hotel",
            "flight",
            "car",
            "tour",
            "booking_date",
            "number_of_people",
            "total_price",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "total_price",
            "status",
            "created_at",
        ]


class BookingCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking

        fields = [
            "booking_type",
            "hotel",
            "flight",
            "car",
            "tour",
            "booking_date",
            "number_of_people",
        ]

    def validate(self, data):

        booking_type = data.get("booking_type")

        hotel = data.get("hotel")
        flight = data.get("flight")
        car = data.get("car")
        tour = data.get("tour")

        selected = {
            "hotel": hotel,
            "flight": flight,
            "car": car,
            "tour": tour,
        }

        if selected.get(booking_type) is None:
            raise serializers.ValidationError(
                f"You must select a {booking_type}."
            )

        for key, value in selected.items():

            if key != booking_type and value is not None:
                raise serializers.ValidationError(
                    f"Only {booking_type} should be selected."
                )

        if data.get("number_of_people", 0) < 1:
            raise serializers.ValidationError(
                "Number of people must be at least 1."
            )

        return data


# =========================
# PAYMENT
# =========================

class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment

        fields = [
            "id",
            "booking",
            "amount",
            "method",
            "transaction_id",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "amount",
            "status",
            "created_at",
        ]


# =========================
# REVIEW
# =========================

class ReviewSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = Review

        fields = [
            "id",
            "user",
            "hotel",
            "tour",
            "rating",
            "comment",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
        ]

    def validate(self, data):

        hotel = data.get("hotel")
        tour = data.get("tour")

        if hotel and tour:
            raise serializers.ValidationError(
                "A review can be for a hotel or a tour, not both."
            )

        if not hotel and not tour:
            raise serializers.ValidationError(
                "You must select a hotel or a tour."
            )

        return data

    def validate_rating(self, value):

        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5."
            )

        return value