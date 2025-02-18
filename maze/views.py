from django.shortcuts import render

def maze_page(request):
    return render(request, "maze.html")