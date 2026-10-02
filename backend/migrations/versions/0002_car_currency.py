import sqlalchemy as sa
from alembic import op


revision = "0002_car_currency"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "cars",
        sa.Column("currency", sa.String(length=3), server_default="USD", nullable=False),
    )


def downgrade() -> None:
    op.drop_column("cars", "currency")