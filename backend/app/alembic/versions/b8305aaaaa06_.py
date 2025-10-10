"""empty message

Revision ID: b8305aaaaa06
Revises: 38b4d8b9d307, 48b49abe4c85
Create Date: 2025-10-05 22:11:04.809026

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'b8305aaaaa06'
down_revision = ('38b4d8b9d307', '48b49abe4c85')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
