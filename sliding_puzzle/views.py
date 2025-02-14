from django.shortcuts import render

def sliding_puzzle_page(request):
    return render(request, "sliding_puzzle.html")