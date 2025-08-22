from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '1964310c3093'
down_revision = '8071ff22fa97'
branch_labels = None
depends_on = None

def upgrade():
    op.drop_table('usertaskassignment')

def downgrade():
    op.create_table(
        'usertaskassignment',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('task_id', sa.UUID(), nullable=False),
        sa.Column('assigned_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )