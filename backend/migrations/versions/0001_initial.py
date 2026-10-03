"""Create marketplace tables."""

from alembic import op


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    import sqlalchemy as sa

    op.create_table(
        "cars",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(80), nullable=False),
        sa.Column("model", sa.String(120)),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("type", sa.String(30), nullable=False),
        sa.Column("price", sa.Numeric(12, 2), nullable=False),
        sa.Column("cost_basis", sa.Numeric(12, 2)),
        sa.Column("sold_price", sa.Numeric(12, 2)),
        sa.Column("pending_amount", sa.Numeric(12, 2)),
        sa.Column("mileage", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("fuel", sa.String(30), nullable=False, server_default="Petrol"),
        sa.Column("transmission", sa.String(30), nullable=False, server_default="Automatic"),
        sa.Column("rating", sa.Numeric(2, 1)),
        sa.Column("location", sa.String(120), nullable=False, server_default="DriveXCars showroom"),
        sa.Column("image", sa.String(500), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("accent", sa.String(30)),
        sa.Column("status", sa.String(20), nullable=False, server_default="Available"),
        sa.Column("is_featured", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_cars_name", "cars", ["name"])
    op.create_index("ix_cars_type", "cars", ["type"])
    op.create_index("ix_cars_status", "cars", ["status"])
    op.create_index("ix_cars_is_featured", "cars", ["is_featured"])
    op.create_table(
        "test_drives",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("car_id", sa.Integer(), sa.ForeignKey("cars.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("customer_name", sa.String(120), nullable=False),
        sa.Column("customer_email", sa.String(320), nullable=False),
        sa.Column("customer_phone", sa.String(40)),
        sa.Column("preferred_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("approved_at", sa.DateTime(timezone=True)),
        sa.Column("reviewed_at", sa.DateTime(timezone=True)),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_test_drives_car_id", "test_drives", ["car_id"])
    op.create_index("ix_test_drives_customer_email", "test_drives", ["customer_email"])
    op.create_index("ix_test_drives_status", "test_drives", ["status"])
    op.create_table(
        "leads",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("phone", sa.String(40)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_leads_email", "leads", ["email"])


def downgrade() -> None:
    op.drop_table("leads")
    op.drop_table("test_drives")
    op.drop_table("cars")