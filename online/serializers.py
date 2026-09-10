from rest_framework import serializers
from .models import (
    User,
    Vendor,
    Destination,
    Listing,
    ListingImage,
    Availability,
    Booking,
    Payment,
    Review,
)


# =========================
# USER
# =========================

class UserSerializer(serializers.ModelSerializer):
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
        extra_kwargs = {
            "password": {"write_only": True}
        }

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
            "description",
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
            "business_name",
            "description",
        ]


class VendorUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = [
            "business_name",
            "description",
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
        ]
        read_only_fields = ["id"]


class DestinationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = [
            "name",
            "country",
            "description",
        ]


class DestinationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = [
            "name",
            "country",
            "description",
        ]


# =========================
# LISTING IMAGE
# =========================

class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = [
            "id",
            "listing",
            "image",
        ]
        read_only_fields = ["id"]


# =========================
# LISTING
# =========================

class ListingSerializer(serializers.ModelSerializer):
    images = ListingImageSerializer(many=True, read_only=True)
    destination = DestinationSerializer(read_only=True)

    class Meta:
        model = Listing
        fields = [
            "id",
            "vendor",
            "destination",
            "title",
            "description",
            "price_per_person",
            "location",
            "duration_days",
            "is_active",
            "created_at",
            "images",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "images",
        ]


class ListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = [
            "vendor",
            "destination",
            "title",
            "description",
            "price_per_person",
            "location",
            "duration_days",
        ]


class ListingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = [
            "title",
            "description",
            "price_per_person",
            "location",
            "duration_days",
            "destination",
            "is_active",
        ]


# =========================
# AVAILABILITY
# =========================

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = [
            "id",
            "listing",
            "date",
            "available_slots",
        ]
        read_only_fields = ["id"]


class AvailabilityCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = [
            "listing",
            "date",
            "available_slots",
        ]


class AvailabilityUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = [
            "listing",
            "date",
            "available_slots",
        ]


# =========================
# BOOKING
# =========================

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "listing",
            "date",
            "number_of_people",
            "total_price",
            "status",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "status",
        ]


class BookingDetailSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only=True)
    payment = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "listing",
            "date",
            "number_of_people",
            "total_price",
            "status",
            "created_at",
            "payment",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "status",
            "payment",
        ]

    def get_payment(self, obj):
        payment = getattr(obj, "payment", None)

        if payment:
            return PaymentSerializer(payment).data

        return None


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "listing",
            "date",
            "number_of_people",
        ]


class BookingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "status",
        ]


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
            "status",
            "created_at",
        ]


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "booking",
            "amount",
            "method",
            "transaction_id",
        ]


class PaymentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "status",
        ]


# =========================
# REVIEW
# =========================

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "id",
            "user",
            "listing",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "listing",
            "rating",
            "comment",
        ]


class ReviewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "rating",
            "comment",
        ]