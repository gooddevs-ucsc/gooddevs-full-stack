"""empty message

Revision ID: 404c7d59dcf3
Revises: 6ece03d315cc, bbd75779f2c8
Create Date: 2025-10-18 20:13:16.511453

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '404c7d59dcf3'
down_revision = ('6ece03d315cc', 'bbd75779f2c8')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
