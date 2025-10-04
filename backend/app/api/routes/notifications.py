from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from app.api.deps import CurrentUser, SessionDep
from app.core.notification_manager import notification_manager
import asyncio

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/stream")
async def notification_stream(current_user: CurrentUser):
    """
    SSE endpoint - keeps connection open and streams notifications
    """
    async def event_generator():
        # This is a generator that yields notifications as they arrive
        queue = asyncio.Queue()
        
        # Create a simple wrapper to work with our connection manager
        class Connection:
            async def send_text(self, message):
                await queue.put(message)
        
        connection = Connection()
        await notification_manager.connect(current_user.id, connection)
        
        try:
            # Send initial connection success message
            yield f"data: {{'type': 'connected'}}\n\n"
            
            # Keep connection alive and yield notifications
            while True:
                # Wait for notification with timeout (for keepalive)
                try:
                    message = await asyncio.wait_for(queue.get(), timeout=30.0)
                    yield message
                except asyncio.TimeoutError:
                    # Send keepalive ping every 30 seconds
                    yield f": keepalive\n\n"
        finally:
            notification_manager.disconnect(current_user.id, connection)
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # Disable nginx buffering
        }
    )