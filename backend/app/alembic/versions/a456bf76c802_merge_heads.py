"""merge heads

Revision ID: a456bf76c802
Revises: a3fd6d6639be, d8c9d75c8e3c
Create Date: 2025-08-22 15:19:51.308894

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'a456bf76c802'
down_revision = ('a3fd6d6639be', 'd8c9d75c8e3c')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
