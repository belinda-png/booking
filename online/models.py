from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    ROLE_CHOICES = [
        ("user", "User"),
        ("vendor", "Vendor"),
        ("admin", "Admin"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(unique=True)

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=255)
    description = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.business_name
    
class Destination(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
    
class Listing(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, null=True)

    title = models.CharField(max_length=255)
    description = models.TextField()
    price_per_person = models.DecimalField(max_digits=10, decimal_places=2)

    location = models.CharField(max_length=255)
    duration_days = models.IntegerField(default=1)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title