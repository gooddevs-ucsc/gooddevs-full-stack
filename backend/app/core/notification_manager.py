from typing import Dict, List
from uuid import UUID
import asyncio
import json

class NotificationConnectionManager:
    def __init__(self):
        # Store active connections: {user_id: [connection1, connection2, ...]}
        self.active_connections: Dict[UUID, List] = {}
    
    async def connect(self, user_id: UUID, websocket):
        """Add a new connection for a user"""
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        print(f"User {user_id} connected. Total connections: {len(self.active_connections[user_id])}")
    
    def disconnect(self, user_id: UUID, websocket):
        """Remove a connection when user disconnects"""
        if user_id in self.active_connections:
            try:
                self.active_connections[user_id].remove(websocket)
                print(f"User {user_id} disconnected. Remaining connections: {len(self.active_connections[user_id])}")
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
            except ValueError:
                pass  # Connection already removed
    
    async def send_notification(self, user_id: UUID, notification_data: dict):
        """Send notification to all connections for a specific user"""
        if user_id in self.active_connections:
            # Format as SSE (Server-Sent Event)
            message = f"data: {json.dumps(notification_data)}\n\n"
            
            print(f"Sending notification to user {user_id}: {notification_data}")
            
            # Send to all user's open connections (multiple tabs/devices)
            dead_connections = []
            for websocket in self.active_connections[user_id]:
                try:
                    await websocket.put(message)  # Put message in queue
                except Exception as e:
                    print(f"Failed to send to connection: {e}")
                    dead_connections.append(websocket)
            
            # Clean up dead connections
            for dead in dead_connections:
                self.disconnect(user_id, dead)
                
        else:
            print(f"User {user_id} is offline, notification saved to DB only")

# Global instance
notification_manager = NotificationConnectionManager()