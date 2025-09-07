"""merge heads a456bf76c802 & f3a2b1c4d5e6

Revision ID: 33dbc9054b2f
Revises: a456bf76c802, f3a2b1c4d5e6
Create Date: 2025-08-24 10:15:09.115289

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '33dbc9054b2f'
down_revision = ('a456bf76c802', 'f3a2b1c4d5e6')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
