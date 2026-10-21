#!/usr/bin/env python3
"""Heuristic audit of a JSON workflow export before publishing.

Reports field paths and categories, not secret values.
Does NOT sanitize the export or guarantee safety.
"""
import json
import re
import sys
from pathlib import Path

SENSITIVE_KEY = re.compile(
    r"(?:credential|secret|token|password|client_secret|api_key|authorization|pinData)",
    re.I,
)
CHECKS = {
    "private network address": re.compile(
        r"\b(?:127\.0\.0\.1|localhost|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b",
        re.I,
    ),
    "email address": re.compile(r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}"),
    "private Google document URL": re.compile(
        r"https?://(?:docs\.google\.com|drive\.google\.com)/", re.I
    ),
    "webhook path": re.compile(r"webhook(?:-test)?/|/rest/oauth2-credential/", re.I),
    "possible API key": re.compile(r"\b(?:sk-[A-Za-z0-9_-]{12,}|AIza[A-Za-z0-9_-]{20,})\b"),
}

def inspect(value, location="$", alerts=None):
    if alerts is None:
        alerts = []
    if isinstance(value, dict):
        for key, child in value.items():
            path = f"{location}.{key}"
            if SENSITIVE_KEY.search(str(key)):
                alerts.append((path, "potentially sensitive key"))
            inspect(child, path, alerts)
    elif isinstance(value, list):
        for i, child in enumerate(value):
            inspect(child, f"{location}[{i}]", alerts)
    elif isinstance(value, str):
        for label, pattern in CHECKS.items():
            if pattern.search(value):
                alerts.append((location, label))
    return alerts

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/audit_n8n_export.py file.json [file2.json ...]")
        return 2
    total = 0
    for filename in sys.argv[1:]:
        try:
            data = json.loads(Path(filename).read_text(encoding="utf-8"))
        except (OSError, UnicodeError, json.JSONDecodeError) as error:
            print(f"{filename}: unable to load JSON ({type(error).__name__})")
            total += 1
            continue
        alerts = sorted(set(inspect(data)))
        print(f"{filename}: {len(alerts)} potential disclosures")
        for location, category in alerts:
            print(f"  {location}: {category}")
        total += len(alerts)
    print("Manual security review is ALWAYS required before publication.")
    return 1 if total else 0

if __name__ == "__main__":
    raise SystemExit(main())
