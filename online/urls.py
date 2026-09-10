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
)


router = DefaultRouter()

# Users
router.register(r"users", UserViewSet, basename="users")

# Vendors
router.register(r"vendors", VendorViewSet, basename="vendors")

# Destinations
router.register(
    r"destinations",
    DestinationViewSet,
    basename="destinations"
)

# Hotels
router.register(
    r"hotels",
    HotelViewSet,
    basename="hotels"
)

# Hotel Rooms
router.register(
    r"hotel-rooms",
    HotelRoomViewSet,
    basename="hotel-rooms"
)

# Flights
router.register(
    r"flights",
    FlightViewSet,
    basename="flights"
)

# Cars
router.register(
    r"cars",
    CarViewSet,
    basename="cars"
)

# Tours
router.register(
    r"tours",
    TourViewSet,
    basename="tours"
)

# Bookings
router.register(
    r"bookings",
    BookingViewSet,
    basename="bookings"
)

# Payments
router.register(
    r"payments",
    PaymentViewSet,
    basename="payments"
)

# Reviews
router.register(
    r"reviews",
    ReviewViewSet,
    basename="reviews"
)


urlpatterns = router.urls