from rest_framework.routers import DefaultRouter
from .views import *
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'vendors', VendorViewSet)
router.register(r'destinations', DestinationViewSet)
router.register(r'listings', ListingViewSet)
router.register(r'availability', AvailabilityViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = router.urls