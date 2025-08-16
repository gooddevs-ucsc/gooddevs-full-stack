"""Refactor ProjectThread and Comment models and endpoints

Revision ID: 128cb453c686
Revises: 26788788c5d2
Create Date: 2025-08-12 17:28:51.418829

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '128cb453c686'
down_revision = '26788788c5d2'
branch_labels = None
depends_on = None


def upgrade():
    # ### Manually adjusted commands ###

    # WARNING: Deleting all existing comments and threads to allow for schema change.
    op.execute('DELETE FROM projectcomment')
    op.execute('DELETE FROM projectthread')

    # --- Handle ProjectThread table changes ---
    op.add_column('projectthread', sa.Column('title', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False, server_default='Untitled'))
    op.add_column('projectthread', sa.Column('body', sqlmodel.sql.sqltypes.AutoString(length=10000), nullable=False, server_default=''))
    op.add_column('projectthread', sa.Column('author_id', sa.Uuid(), nullable=True)) # Temporarily nullable
    op.create_foreign_key('fk_projectthread_author_id_user', 'projectthread', 'user', ['author_id'], ['id'])

    # --- Handle Comment table changes ---
    op.drop_table('projectcomment')
    op.create_table('comment',
        sa.Column('body', sqlmodel.sql.sqltypes.AutoString(length=10000), nullable=False),
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('author_id', sa.Uuid(), nullable=False),
        sa.Column('thread_id', sa.Uuid(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['author_id'], ['user.id'], ),
        sa.ForeignKeyConstraint(['thread_id'], ['projectthread.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Now that the table is clean, we can make author_id non-nullable
    op.alter_column('projectthread', 'author_id', nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### Manually adjusted commands ###
    
    op.drop_table('comment')
    op.create_table('projectcomment',
        sa.Column('id', sa.UUID(), autoincrement=False, nullable=False),
        sa.Column('content', sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column('project_id', sa.UUID(), autoincrement=False, nullable=False),
        sa.Column('author_id', sa.UUID(), autoincrement=False, nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), autoincrement=False, nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(['author_id'], ['user.id'], name='projectcomment_author_id_fkey'),
        sa.ForeignKeyConstraint(['project_id'], ['project.id'], name='projectcomment_project_id_fkey'),
        sa.PrimaryKeyConstraint('id', name='projectcomment_pkey')
    )

    op.drop_constraint('fk_projectthread_author_id_user', 'projectthread', type_='foreignkey')
    op.drop_column('projectthread', 'author_id')
    op.drop_column('projectthread', 'body')
    op.drop_column('projectthread', 'title')
    
    # ### end Alembic commands ###