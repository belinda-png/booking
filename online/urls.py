from rest_framework.routers import DefaultRouter

from .views import (
    UserViewSet,
    VendorViewSet,
    DestinationViewSet,
    HotelViewSet,
    HotelRoomViewSet,
    FlightViewSet,
    CarViewSet,
    TourViewSet,
    BookingViewSet,
    PaymentViewSet,
    ReviewViewSet,
    SendEmailOTPView,
     VerifyEmailOTPView,
)
from django.urls import path


router = DefaultRouter()
router.register(r"users", UserViewSet, basename="users")
router.register(r"vendors", VendorViewSet, basename="vendors")
router.register(
    r"destinations",
    DestinationViewSet,
    basename="destinations"
)
router.register(
    r"hotels",
    HotelViewSet,
    basename="hotels"
)
router.register(
    r"hotel-rooms",
    HotelRoomViewSet,
    basename="hotel-rooms"
)
router.register(
    r"flights",
    FlightViewSet,
    basename="flights"
)
router.register(
    r"cars",
    CarViewSet,
    basename="cars"
)
router.register(
    r"tours",
    TourViewSet,
    basename="tours"
)
router.register(
    r"bookings",
    BookingViewSet,
    basename="bookings"
)
router.register(
    r"payments",
    PaymentViewSet,
    basename="payments"
)
router.register(
    r"reviews",
    ReviewViewSet,
    basename="reviews"
)


urlpatterns = router.urls + [
    path(
        "auth/send-email-otp/",
        SendEmailOTPView.as_view(),
        name="send-email-otp",
    ),
    path(
        "auth/verify-email-otp/",
        VerifyEmailOTPView.as_view(),
        name="verify-email-otp",
    ),
]
