import json
from django.shortcuts import render
from django.http import JsonResponse
from ciphey import decrypt
from ciphey.iface import Config

def cipher_page(request):
    """
    Renders the main Cipher page with a form for decryption.
    """
    return render(request, 'cipher.html')

def decrypt_text(request):
    """
    Handles AJAX requests for decrypting text using Ciphey.
    """
    if request.method == "POST":
        input_text = request.POST.get("cipher_text", "")

        try:
            # Use Ciphey to decrypt
            result = decrypt(Config(text=input_text, verbose=True))

            # Convert the result to a JSON-friendly format
            response_data = {
                "status": "success",
                "decrypted_text": result
            }
        except Exception as e:
            response_data = {
                "status": "error",
                "error": str(e)
            }

        return JsonResponse(response_data)

    return JsonResponse({"status": "error", "error": "Invalid request"}, status=400)
