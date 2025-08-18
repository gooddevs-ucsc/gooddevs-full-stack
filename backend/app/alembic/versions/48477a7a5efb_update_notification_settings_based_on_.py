"""update notification settings based on user roles

Revision ID: 48477a7a5efb
Revises: f0e862c435c7
Create Date: 2025-08-18 17:51:56.821910

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '48477a7a5efb'
down_revision = 'f0e862c435c7'
branch_labels = None
depends_on = None


def upgrade():
    # Update notification settings based on user roles
    # Only VOLUNTEER and REQUESTER should have notifications enabled
    # ADMIN and SPONSOR should have all notifications disabled
    
    connection = op.get_bind()
    
    # Disable all notifications for ADMIN and SPONSOR users
    connection.execute(
        sa.text("""
            UPDATE "user" 
            SET email_notifications = false, 
                sms_notifications = false, 
                push_notifications = false 
            WHERE role IN ('ADMIN', 'SPONSOR')
        """)
    )
    
    # Ensure VOLUNTEER and REQUESTER have proper default notification settings
    connection.execute(
        sa.text("""
            UPDATE "user" 
            SET email_notifications = true, 
                sms_notifications = false, 
                push_notifications = true 
            WHERE role IN ('VOLUNTEER', 'REQUESTER')
        """)
    )


def downgrade():
    # Reset all users to default notification settings
    connection = op.get_bind()
    
    connection.execute(
        sa.text("""
            UPDATE "user" 
            SET email_notifications = true, 
                sms_notifications = false, 
                push_notifications = true
        """)
    )
