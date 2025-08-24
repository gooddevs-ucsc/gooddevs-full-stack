# In app/notifications_worker.py

import json
from sqlmodel import Session, create_engine
from app.models import Notification, NotificationType
from app.core.config import settings
from app.core.redis import get_redis_client

# Set up DB connection for the worker
engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

def main():
    r = get_redis_client()
    pubsub = r.pubsub()
    pubsub.subscribe("notifications")

    print("Listening for notification events...")
    for message in pubsub.listen():
        if message["type"] == "message":
            event_data = json.loads(message["data"])
            print(f"Processing event: {event_data}")

            with Session(engine) as session:
                notification = Notification(
                    recipient_id=event_data["recipient_id"],
                    message=event_data["message"],
                    link=event_data.get("link"),
                    type=NotificationType(event_data["event_type"])
                )
                session.add(notification)
                session.commit()
                print("Notification saved to DB.")

if __name__ == "__main__":
    main()