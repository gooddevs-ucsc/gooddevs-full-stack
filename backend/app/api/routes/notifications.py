from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.api.deps import CurrentUser, SessionDep
from app.core.notification_manager import notification_manager
from app.models import NotificationsPublic
from app import crud
import uuid
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
    
@router.get("/", response_model=NotificationsPublic)
def get_notifications(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 50
):
    """Get user's notification history"""
    notifications, total = crud.get_user_notifications(
        session=session,
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )
    return NotificationsPublic(data=notifications, count=total)

@router.patch("/{notification_id}/read")
def mark_as_read(
    session: SessionDep,
    current_user: CurrentUser,
    notification_id: uuid.UUID
):
    """Mark notification as read"""
    notification = crud.mark_notification_as_read(
        session=session,
        notification_id=notification_id
    )
    if not notification or notification.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Marked as read"}

@router.post("/mark-all-read")
def mark_all_as_read(
    session: SessionDep,
    current_user: CurrentUser
):
    """Mark all notifications as read"""
    count = crud.mark_all_notifications_as_read(
        session=session,
        user_id=current_user.id
    )
    return {"message": f"Marked {count} notifications as read"}