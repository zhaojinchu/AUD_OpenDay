from django.shortcuts import render

def hanoi_page(request):
    return render(request, "hanoi.html")