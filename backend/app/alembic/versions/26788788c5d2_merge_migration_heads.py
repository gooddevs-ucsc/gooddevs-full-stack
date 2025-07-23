"""merge migration heads

Revision ID: 26788788c5d2
Revises: 473aea1573c4, bc9333809f95
Create Date: 2025-07-21 16:29:23.092133

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '26788788c5d2'
down_revision = ('473aea1573c4', 'bc9333809f95')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
