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

            # Run Ciphey without --json
            process = await asyncio.create_subprocess_exec(
                "ciphey", "-t", cipher_text, "-q",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            # Read output in real-time
            while True:
                stdout_line = await process.stdout.readline()
                stderr_line = await process.stderr.readline()

                if stdout_line:
                    output_text = stdout_line.decode().strip()
                    await self.send(json.dumps({"status": "output", "message": output_text}))

                if stderr_line:  # Capture errors
                    error_text = stderr_line.decode().strip()
                    await self.send(json.dumps({"status": "error", "message": error_text}))

                if not stdout_line and not stderr_line:
                    break  # No more output, break the loop

            # Wait for the process to complete
            await process.wait()

            # Notify frontend that decryption is complete
            await self.send(json.dumps({"status": "done", "message": "Decryption Complete."}))

        except Exception as e:
            await self.send(json.dumps({"status": "error", "message": str(e)}))
