from rest_framework import serializers  
from .models import *

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = "__all__"

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = "__all__"

class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = "__all__"

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
#         fields = "__all__"

# # class ReviewSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Review
# #         fields = "__all__"

# # class ListingSerializer(serializers.ModelSerializer):
# #     images = ListingImageSerializer(many=True, read_only=True)
# #     destination = DestinationSerializer(read_only=True)

# #     class Meta:
# #         model = Listing
# #         fields = "__all__"

# # class AvailabilitySerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Availability
# #         fields = "__all__"

# # class BookingSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Booking
# #         fields = "__all__"

# # class BookingDetailSerializer(serializers.ModelSerializer):
# #     listing = ListingSerializer(read_only=True)
# #     payment = PaymentSerializer(read_only=True)

# #     class Meta:
# #         model = Booking
# #         fields = "__all__"

# # class BookingCreateSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Booking
# #         fields = "__all__"

# # class BookingUpdateSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Booking
# #         fields = ["status"]
# # class ReviewSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Review
# #         fields = "__all__"

# # class ReviewCreateSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Review
# #         fields = "__all__"

# # class ReviewUpdateSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Review
# #         fields = ["rating", "comment"]
# # class PaymentCreateSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Payment
# #         fields = "__all__"
# # class PaymentUpdateSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Payment
# #         fields = ["status"]

# # class VendorCreateSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Vendor
# #         fields = "__all__"
# # class VendorUpdateSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Vendor
# #         fields = ["name", "email", "phone_number", "address"]

class DestinationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = "__all__"
class DestinationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ["name", "description", "location"]

class ListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = "__all__"
class ListingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ["title", "description", "price", "vendor", "destination"]

class AvailabilityCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = "__all__"
class AvailabilityUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ["listing", "date", "is_available"]
