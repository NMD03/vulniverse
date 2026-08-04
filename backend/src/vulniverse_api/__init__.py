from __future__ import annotations

from pathlib import Path
from typing import Any

from flask import Flask

from .extensions import db, migrate


def create_app(
    test_config: dict[str, Any] | None = None,
) -> Flask:
    app = Flask(
        __name__,
        instance_relative_config=True,
    )

    instance_path = Path(app.instance_path)
    instance_path.mkdir(parents=True, exist_ok=True)

    database_path = instance_path / "vulniverse.sqlite"

    app.config.from_mapping(
        SECRET_KEY="development-only-change-me",
        SQLALCHEMY_DATABASE_URI=f"sqlite:///{database_path}",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    migrate.init_app(app, db)

    # Ensure models are registered with SQLAlchemy and Alembic.
    from . import models  # noqa: F401
    from .api import api_bp

    app.register_blueprint(
        api_bp,
        url_prefix="/api/v1",
    )

    return app
