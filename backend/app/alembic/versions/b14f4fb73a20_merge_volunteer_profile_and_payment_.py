"""Merge volunteer profile and payment status migration branches

Revision ID: b14f4fb73a20
Revises: 75fbaabc96fb, ba5572617b64
Create Date: 2025-10-20 00:07:32.756319

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'b14f4fb73a20'
down_revision = ('75fbaabc96fb', 'ba5572617b64')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
