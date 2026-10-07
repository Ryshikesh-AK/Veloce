"""Create users table and update leads relationships.

Revision ID: 0005_create_users_table
Revises: 0004_car_submodel
Create Date: 2026-10-07
"""

import sqlalchemy as sa
from alembic import op

revision = "0005_create_users_table"
down_revision = "0004_car_submodel"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Create users table
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=120), nullable=False),
        sa.Column("phone", sa.String(length=40), nullable=True),
        sa.Column("role", sa.String(length=20), server_default="customer", nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # 2. Add extended columns to leads if missing
    with op.batch_alter_table("leads") as batch_op:
        batch_op.add_column(sa.Column("user_id", sa.String(length=36), nullable=True))
        batch_op.add_column(sa.Column("car_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("action_type", sa.String(length=40), server_default="wishlist", nullable=False))
        batch_op.add_column(sa.Column("status", sa.String(length=30), server_default="Pending Call", nullable=False))
        batch_op.add_column(sa.Column("notes", sa.Text(), nullable=True))
        batch_op.add_column(sa.Column("contacted_at", sa.DateTime(timezone=True), nullable=True))
        batch_op.create_foreign_key("fk_leads_user_id_users", "users", ["user_id"], ["id"], ondelete="SET NULL")
        batch_op.create_foreign_key("fk_leads_car_id_cars", "cars", ["car_id"], ["id"], ondelete="CASCADE")


def downgrade() -> None:
    with op.batch_alter_table("leads") as batch_op:
        batch_op.drop_constraint("fk_leads_car_id_cars", type_="foreignkey")
        batch_op.drop_constraint("fk_leads_user_id_users", type_="foreignkey")
        batch_op.drop_column("contacted_at")
        batch_op.drop_column("notes")
        batch_op.drop_column("status")
        batch_op.drop_column("action_type")
        batch_op.drop_column("car_id")
        batch_op.drop_column("user_id")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
