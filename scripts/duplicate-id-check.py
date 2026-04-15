#!/usr/bin/env python3
"""
Duplicate ID Checker

Scan HTML files for duplicate 'id' attributes. Duplicate IDs break ARIA 
programmatic associations (like aria-labelledby and aria-describedby)
and are a violation of general web standards.

WCAG 4.1.1 (Level A): Parsing — Elements have unique IDs (Historical,
but remains a critical accessibility best practice).

No dependencies — stdlib only.

Usage:
    python3 duplicate-id-check.py index.html
    python3 duplicate-id-check.py --format json page.html
"""

import argparse
import json
import os
import sys
from html.parser import HTMLParser


class DuplicateIDChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = {}  # id -> list of lines
        self.issues = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        line = self.getpos()[0]
        id_val = attrs_dict.get("id")

        if id_val:
            if id_val in self.ids:
                self.ids[id_val].append(line)
            else:
                self.ids[id_val] = [line]

    def analyze(self):
        for id_val, lines in self.ids.items():
            if len(lines) > 1:
                self.issues.append({
                    "id": id_val,
                    "lines": lines,
                    "severity": "error",
                    "issue": f"Duplicate ID found: '{id_val}'",
                    "fix": f"IDs must be unique. This ID appears on lines {', '.join(map(str, lines))}."
                })


def audit_file(filepath):
    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
    checker = DuplicateIDChecker()
    checker.feed(content)
    checker.analyze()
    return checker.issues, len(checker.ids)


def main():
    parser = argparse.ArgumentParser(
        description="Check for duplicate IDs in HTML files."
    )
    parser.add_argument("files", nargs="+", help="HTML files to audit")
    parser.add_argument("--format", choices=["text", "json"], default="text")
    args = parser.parse_args()

    all_results = {}
    total_issues = 0

    for filepath in args.files:
        if not os.path.isfile(filepath):
            print(f"Warning: {filepath} not found, skipping", file=sys.stderr)
            continue
        issues, total_unique_ids = audit_file(filepath)
        all_results[filepath] = {"issues": issues, "total_unique_ids": total_unique_ids}
        total_issues += len(issues)

    if args.format == "json":
        print(json.dumps(all_results, indent=2))
    else:
        for filepath, result in all_results.items():
            issues = result["issues"]
            print(f"\n{'='*60}")
            print(f"  {filepath} — Duplicate ID Check")
            print(f"  Unique IDs: {result['total_unique_ids']}  Duplicates: {len(issues)}")
            print(f"{'='*60}")
            for issue in issues:
                icon = {"error": "ERR", "warning": "WRN"}[issue["severity"]]
                print(f"  [{icon}] {issue['issue']}")
                print(f"        {issue['fix']}")
            if not issues:
                print("  No duplicate IDs detected.")
            print()

    sys.exit(1 if total_issues > 0 else 0)


if __name__ == "__main__":
    main()
