import sqlalchemy as sa
from alembic import op


revision = "0004_car_submodel"
down_revision = "0003_car_images_documents"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "cars",
        sa.Column("submodel", sa.String(length=120), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("cars", "submodel")
