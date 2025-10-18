"""Merge divergent heads

Revision ID: 1393f2cefc6c
Revises: 0fd3b7bf2dd3, 7380213bbd53
Create Date: 2025-10-18 11:45:10.872763

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '1393f2cefc6c'
down_revision = ('0fd3b7bf2dd3', '7380213bbd53')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
