#!/usr/bin/env python3
"""Heuristic pre-publication scan of n8n JSON exports.

Reports suspicious field paths and categories, not underlying values.
This scanner does NOT sanitize files or guarantee that they are safe to publish.
"""
import json
import re
import sys
from pathlib import Path

SUSPICIOUS_KEY = re.compile(
    r"(^|[_-])(credential|secret|token|password|client_secret|api_key|authorization|pinData)($|[_-])",
    re.I,
)

CHECKS = {
    "private network address": re.compile(
        r"\b(?:127\.0\.0\.1|localhost|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b", re.I
    ),
    "possible email address": re.compile(r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}"),
    "Google private resource URL": re.compile(
        r"https?://(?:docs\.google\.com|drive\.google\.com)/", re.I
    ),
    "webhook endpoint": re.compile(r"(?:webhook(?:-test)?/|/rest/oauth2-credential/)", re.I),
    "authorization header or bearer token": re.compile(
        r"\b(?:Bearer\s+\S+|Authorization\s*[:=])", re.I
    ),
    "potential API key": re.compile(
        r"\b(?:sk-[A-Za-z0-9_-]{12,}|AIza[A-Za-z0-9_-]{20,})\b"
    ),
}

def inspect(value, path="$", findings=None):
    if findings is None:
        findings = []
    if isinstance(value, dict):
        for key, child in value.items():
            child_path = f"{path}.{key}"
            if SUSPICIOUS_KEY.search(str(key)):
                findings.append((child_path, "potentially sensitive field name"))
            inspect(child, child_path, findings)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            inspect(child, f"{path}[{index}]", findings)
    elif isinstance(value, str):
        for label, pattern in CHECKS.items():
            candidate = value
            if label == "possible email address":
                candidate = candidate.replace("candidate@example.com", "")
            elif label == "Google private resource URL":
                candidate = candidate.replace(
                    "https://docs.google.com/document/d/${fileId}/edit", ""
                )
            if pattern.search(candidate):
                findings.append((path, label))
    return findings

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/audit_n8n_export.py path/to/export.json")
        return 2
    total = 0
    for pathstr in sys.argv[1:]:
        path = Path(pathstr)
        try:
            document = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, json.JSONDecodeError) as exc:
            print(f"{path}: unable to read JSON ({type(exc).__name__})")
            total += 1
            continue
        findings = sorted(set(inspect(document)))
        print(f"{path}: {len(findings)} potential disclosure(s)")
        for location, category in findings:
            print(f"  - {location}: {category}")
        total += len(findings)
    if total:
        print("Manual review required; investigate all flags before publishing.")
    else:
        print("No heuristic flags. Manual review is STILL REQUIRED.")
    return 1 if total else 0

if __name__ == "__main__":
    raise SystemExit(main())
