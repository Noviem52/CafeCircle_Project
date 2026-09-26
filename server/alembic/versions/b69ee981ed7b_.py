"""empty message

Revision ID: b69ee981ed7b
Revises: a8e98cb54c22
Create Date: 2026-08-24 09:45:27.328912

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b69ee981ed7b'
down_revision: Union[str, Sequence[str], None] = 'a8e98cb54c22'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
