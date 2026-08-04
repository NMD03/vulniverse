from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from jsonschema import FormatChecker
from jsonschema.protocols import Validator
from jsonschema.validators import validator_for


PROJECT_ROOT = Path(__file__).parents[4]

CVE_SCHEMA_PATH = (
    PROJECT_ROOT
    / "schemas"
    / "upstream"
    / "cve"
    / "5.2.0"
    / "CVE_Record_Format_bundled.json"
)


@lru_cache(maxsize=4)
def get_cve_validator() -> Validator:
    with CVE_SCHEMA_PATH.open(encoding="utf-8") as schema_file:
        schema = json.load(schema_file)

    validator_class = validator_for(schema)
    validator_class.check_schema(schema)

    return validator_class(
        schema,
        format_checker=FormatChecker(),
    )


def validate_record(
    record: dict[str, Any],
    profile: str,
) -> list[dict[str, Any]]:
    validator = get_cve_validator()

    validation_errors = sorted(
        validator.iter_errors(record),
        key=lambda error: list(error.absolute_path),
    )

    errors = [
        {
            "path": list(error.absolute_path),
            "schemaPath": list(error.absolute_schema_path),
            "message": error.message,
            "validator": error.validator,
        }
        for error in validation_errors
    ]

    if profile.startswith("gcve-"):
        errors.extend(validate_gcve_semantics(record))

    return errors


def validate_gcve_semantics(
    record: dict[str, Any],
) -> list[dict[str, Any]]:
    # Add GCVE-specific checks incrementally.
    return []
