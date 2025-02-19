import asyncio
import subprocess
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class CipheyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Accept WebSocket connection."""
        await self.accept()
        await self.send(json.dumps({"status": "connected", "message": "Connected to Ciphey WebSocket"}))

    async def disconnect(self, close_code):
        """Handle WebSocket disconnect."""
        await self.send(json.dumps({"status": "disconnected", "message": "Disconnected from server"}))

    async def receive(self, text_data):
        """Receive cipher text, process with Ciphey, and stream results."""
        try:
            data = json.loads(text_data)
            cipher_text = data.get("cipher_text")

            if not cipher_text:
                await self.send(json.dumps({"status": "error", "message": "No text provided."}))
                return

            # Notify frontend that decryption is starting
            await self.send(json.dumps({"status": "processing", "message": "Starting decryption..."}))

            # Use create_subprocess_shell for better compatibility on Windows
            process = await asyncio.create_subprocess_shell(
                f"ciphey -t \"{cipher_text}\" -q",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            stdout, stderr = await process.communicate()

            if stdout:
                await self.send(json.dumps({"status": "output", "message": stdout.decode().strip()}))
            
            if stderr:
                await self.send(json.dumps({"status": "error", "message": stderr.decode().strip()}))

            # Notify frontend that decryption is complete
            await self.send(json.dumps({"status": "done", "message": "Decryption Complete."}))

        except Exception as e:
            await self.send(json.dumps({"status": "error", "message": str(e)}))

