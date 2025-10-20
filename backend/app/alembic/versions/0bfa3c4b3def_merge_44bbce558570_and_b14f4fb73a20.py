"""Merge 44bbce558570 and b14f4fb73a20

Revision ID: 0bfa3c4b3def
Revises: 44bbce558570, b14f4fb73a20
Create Date: 2025-10-20 08:11:59.705082

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '0bfa3c4b3def'
down_revision = ('44bbce558570', 'b14f4fb73a20')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
