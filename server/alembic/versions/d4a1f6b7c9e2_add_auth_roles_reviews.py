"""add auth roles and reviews

Revision ID: d4a1f6b7c9e2
Revises: 5b202c3f5799
Create Date: 2026-08-27 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'd4a1f6b7c9e2'
down_revision: Union[str, Sequence[str], None] = '5b202c3f5799'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('phone', sa.String(length=30), nullable=True))
    op.add_column(
        'users',
        sa.Column('role', sa.String(length=20), nullable=False, server_default='user'),
    )

    op.add_column('cafes', sa.Column('owner_id', sa.Integer(), nullable=True))
    op.add_column('cafes', sa.Column('slug', sa.String(length=150), nullable=True))
    op.add_column('cafes', sa.Column('description', sa.Text(), nullable=True))
    op.add_column('cafes', sa.Column('cuisine', sa.String(length=100), nullable=True))
    op.add_column('cafes', sa.Column('price_range', sa.String(length=10), nullable=True))
    op.add_column('cafes', sa.Column('image_url', sa.String(length=500), nullable=True))
    op.add_column(
        'cafes',
        sa.Column('status', sa.String(length=20), nullable=False, server_default='approved'),
    )
    op.create_foreign_key(
        'fk_cafes_owner_id_users', 'cafes', 'users', ['owner_id'], ['id']
    )

    op.execute(
        "UPDATE cafes SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) "
        "|| '-' || id::text WHERE slug IS NULL"
    )
    op.alter_column('cafes', 'slug', nullable=False)
    op.create_index(op.f('ix_cafes_slug'), 'cafes', ['slug'], unique=True)

    op.alter_column('cafes', 'status', server_default='pending')

    op.create_table(
        'reviews',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('cafe_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['cafe_id'], ['cafes.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade() -> None:
    op.drop_table('reviews')
    op.drop_index(op.f('ix_cafes_slug'), table_name='cafes')
    op.drop_constraint('fk_cafes_owner_id_users', 'cafes', type_='foreignkey')
    op.drop_column('cafes', 'status')
    op.drop_column('cafes', 'image_url')
    op.drop_column('cafes', 'price_range')
    op.drop_column('cafes', 'cuisine')
    op.drop_column('cafes', 'description')
    op.drop_column('cafes', 'slug')
    op.drop_column('cafes', 'owner_id')
    op.drop_column('users', 'role')
    op.drop_column('users', 'phone')