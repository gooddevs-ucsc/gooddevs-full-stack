from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.api.deps import CurrentUser, SessionDep
from app.core.notification_manager import notification_manager
from app.models import NotificationsPublic, Meta
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
        # Create a queue for this specific connection
        message_queue = asyncio.Queue()
        
        # Register this connection with the notification manager
        await notification_manager.connect(current_user.id, message_queue)
        
        try:
            # Send initial connection success message
            yield f"data: {{'type': 'connected', 'user_id': '{current_user.id}'}}\n\n"
            
            # Keep connection alive and yield notifications
            while True:
                try:
                    # Wait for notification with timeout (for keepalive)
                    message = await asyncio.wait_for(message_queue.get(), timeout=30.0)
                    yield message
                except asyncio.TimeoutError:
                    # Send keepalive ping every 30 seconds
                    yield f"data: {{'type': 'keepalive'}}\n\n"
        except Exception as e:
            print(f"SSE connection error: {e}")
        finally:
            # Clean up connection
            notification_manager.disconnect(current_user.id, message_queue)
    
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
    meta = Meta(total=total, page=(skip // limit) + 1, per_page=limit)
    return NotificationsPublic(data=notifications, meta=meta)

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

@router.get("/unread", response_model=NotificationsPublic)
def get_unread_notifications(
    session: SessionDep,
    current_user: CurrentUser
):
    """
    Get all unread notifications.
    Called when user logs in or opens app.
    """
    notifications = crud.get_unread_notifications(
        session=session, 
        user_id=current_user.id
    )
    
    meta = Meta(total=len(notifications))
    
    return NotificationsPublic(
        data=notifications,
        meta=meta
    )

@router.get("/unread/count")
def get_unread_count(
    session: SessionDep,
    current_user: CurrentUser
):
    """
    Get count of unread notifications.
    For the notification bell badge.
    """
    count = crud.get_unread_notifications_count(
        session=session, 
        user_id=current_user.id
    )
    
    return {"count": count}