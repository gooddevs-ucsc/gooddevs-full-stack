# This manages all active SSE connections
from typing import Dict, List
from uuid import UUID
import asyncio
import json

class NotificationConnectionManager:
    def __init__(self):
        # Store active connections: {user_id: [connection1, connection2, ...]}
        self.active_connections: Dict[UUID, List] = {}
    
    async def connect(self, user_id: UUID, connection):
        """Add a new connection for a user"""
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(connection)
    
    def disconnect(self, user_id: UUID, connection):
        """Remove a connection when user disconnects"""
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(connection)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
    
    async def send_notification(self, user_id: UUID, notification_data: dict):
        """Send notification to all connections for a specific user"""
        if user_id in self.active_connections:
            # Format as SSE (Server-Sent Event)
            message = f"data: {json.dumps(notification_data)}\n\n"
            
            # Send to all user's open connections (multiple tabs/devices)
            dead_connections = []
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(message)
                except Exception:
                    dead_connections.append(connection)
            
            # Clean up dead connections
            for dead in dead_connections:
                self.disconnect(user_id, dead)
                
        else:
            print(f"User {user_id} is offline, notification saved to DB")

# Global instance
notification_manager = NotificationConnectionManager()