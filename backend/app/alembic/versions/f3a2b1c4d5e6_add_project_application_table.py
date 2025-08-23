"""add_project_application_table

Revision ID: f3a2b1c4d5e6
Revises: d8c9d75c8e3c
Create Date: 2025-08-20 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = 'f3a2b1c4d5e6'
down_revision = 'd8c9d75c8e3c'
branch_labels = None
depends_on = None


def upgrade():
    # Use existing enums: applicationstatus and developerrole
    op.create_table('projectapplication',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('project_id', sa.UUID(), nullable=False),
        sa.Column('volunteer_id', sa.UUID(), nullable=False),
        sa.Column('volunteer_role', sa.Enum('FRONTEND', 'BACKEND', 'FULLSTACK', 'UIUX', 'MOBILE', 'DEVOPS', 'QA', 'PM', name='developerrole'), nullable=False),
        sa.Column('cover_letter', sqlmodel.sql.sqltypes.AutoString(length=2000), nullable=True),
        sa.Column('skills', sqlmodel.sql.sqltypes.AutoString(length=1000), nullable=True),
        sa.Column('experience_years', sa.Integer(), nullable=True),
        sa.Column('portfolio_url', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.Column('linkedin_url', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.Column('github_url', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN', name='applicationstatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['project.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['volunteer_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Add constraints
    op.create_check_constraint(
        'ck_projectapplication_experience_years_ge_0',
        'projectapplication',
        'experience_years >= 0'
    )
    op.create_check_constraint(
        'ck_projectapplication_experience_years_le_50',
        'projectapplication',
        'experience_years <= 50'
    )

    # Create unique constraint to prevent duplicate applications
    op.create_unique_constraint(
        'uq_projectapplication_project_volunteer',
        'projectapplication',
        ['project_id', 'volunteer_id']
    )


def downgrade():
    # Drop table
    op.drop_table('projectapplication')
    
    # Drop enums
    sa.Enum(name='applicationstatus').drop(op.get_bind())
    sa.Enum(name='volunteerrole').drop(op.get_bind())
