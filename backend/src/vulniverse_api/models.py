from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import JSON, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from .extensions import db


class VulnerabilityRecord(db.Model):
    __tablename__ = "vulnerability_record"

    id: Mapped[int] = mapped_column(primary_key=True)

    identifier: Mapped[str] = mapped_column(
        String(128),
        nullable=False,
        unique=True,
        index=True,
    )

    profile: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        default="cve-5.2.0",
    )

    document: Mapped[dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
    )

    is_draft: Mapped[bool] = mapped_column(
        nullable=False,
        default=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
