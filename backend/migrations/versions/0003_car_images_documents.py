import sqlalchemy as sa
from alembic import op

revision = "0003_car_images_documents"
down_revision = "0002_car_currency"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Create car_images table
    op.create_table(
        "car_images",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("car_id", sa.Integer(), nullable=False),
        sa.Column("url", sa.String(length=500), nullable=False),
        sa.Column("is_primary", sa.Boolean(), server_default="0", nullable=False),
        sa.Column("display_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column("caption", sa.String(length=150), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["car_id"], ["cars.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_car_images_car_id"), "car_images", ["car_id"], unique=False)

    # 2. Create car_documents table
    op.create_table(
        "car_documents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("car_id", sa.Integer(), nullable=False),
        sa.Column("file_url", sa.String(length=500), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("file_type", sa.String(length=50), server_default="Document", nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["car_id"], ["cars.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_car_documents_car_id"), "car_documents", ["car_id"], unique=False)

    # 3. Drop rating column from cars if present
    with op.batch_alter_table("cars") as batch_op:
        batch_op.drop_column("rating")


def downgrade() -> None:
    with op.batch_alter_table("cars") as batch_op:
        batch_op.add_column(sa.Column("rating", sa.Numeric(precision=2, scale=1), nullable=True))

    op.drop_index(op.f("ix_car_documents_car_id"), table_name="car_documents")
    op.drop_table("car_documents")
    op.drop_index(op.f("ix_car_images_car_id"), table_name="car_images")
    op.drop_table("car_images")
