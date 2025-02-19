import asyncio
import subprocess
import json
import logging

logging.basicConfig(filename="ciphey_debug.log", level=logging.DEBUG)

from channels.generic.websocket import AsyncWebsocketConsumer

class CipheyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass  # No special disconnect handling required

    async def receive(self, text_data):
        data = json.loads(text_data)
        cipher_text = data.get("cipher_text", "")

        if cipher_text:
            await self.send(json.dumps({"status": "processing", "message": "Decrypting..."}))
            result = await self.run_ciphey(cipher_text)
            await self.send(json.dumps({"status": "done", "message": result}))
        else:
            await self.send(json.dumps({"status": "error", "message": "Error: No input text provided"}))

    async def run_ciphey(self, cipher_text):
        try:
            loop = asyncio.get_running_loop()
            result = await loop.run_in_executor(None, self.run_ciphey_sync, cipher_text)
            return result
        except Exception as e:
            logging.exception(f"Ciphey Exception: {str(e)}")
            return f"Exception: {str(e)}"

    def run_ciphey_sync(self, cipher_text):
        """ Runs Ciphey in a blocking subprocess to avoid async issues """
        process = subprocess.run(
            ["ciphey", "-t", cipher_text, "-q"],
            capture_output=True, text=True
        )
        stdout, stderr = process.stdout.strip(), process.stderr.strip()

        if stderr:
            logging.error(f"Ciphey STDERR: {stderr}")
            return f"Error: {stderr}"
        return stdout or "Error: No output received from Ciphey"
