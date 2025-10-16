"""empty message

Revision ID: 621ef7cc6186
Revises: 6b89e7e9e616, b8a6b6cf89e8
Create Date: 2025-10-16 20:38:24.600461

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '621ef7cc6186'
down_revision = ('6b89e7e9e616', 'b8a6b6cf89e8')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
