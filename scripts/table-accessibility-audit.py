#!/usr/bin/env python3
"""
Table Accessibility Audit

Scan HTML tables for accessibility features: headers (<th>), scope 
attributes, and captions.

WCAG 1.3.1 (Level A): Info and Relationships — Tables must be properly
marked up so screen readers can associate data cells with their headers.

No dependencies — stdlib only.

Usage:
    python3 table-accessibility-audit.py index.html
    python3 table-accessibility-audit.py --format json page.html
"""

import argparse
import json
import os
import sys
from html.parser import HTMLParser


class TableAuditor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tables = []
        self._current_table = None
        self._in_table = False
        self.issues = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        line = self.getpos()[0]

        if tag == "table":
            self._in_table = True
            self._current_table = {
                "line": line,
                "has_caption": False,
                "has_th": False,
                "th_count": 0,
                "th_with_scope": 0,
                "rows": 0
            }
            self.tables.append(self._current_table)

        if not self._in_table:
            return

        if tag == "caption":
            self._current_table["has_caption"] = True
        
        if tag == "tr":
            self._current_table["rows"] += 1
        
        if tag == "th":
            self._current_table["has_th"] = True
            self._current_table["th_count"] += 1
            scope_val = attrs_dict.get("scope")
            if scope_val is not None:
                if scope_val in ("row", "col", "rowgroup", "colgroup"):
                    self._current_table["th_with_scope"] += 1
                else:
                    self.issues.append({
                        "line": line, "severity": "error",
                        "issue": f"Invalid scope value: \"{scope_val}\"",
                        "fix": "Use scope='col', scope='row', scope='colgroup', or scope='rowgroup'."
                    })

    def handle_endtag(self, tag):
        if tag == "table":
            self._in_table = False
            self._current_table = None

    def analyze(self):
        for table in self.tables:
            # Skip very small layout tables (though they shouldn't exist)
            if table["rows"] <= 1:
                continue

            if not table["has_th"]:
                self.issues.append({
                    "line": table["line"], "severity": "error",
                    "issue": "Table has no headers (<th>)",
                    "fix": "Use <th> elements for the first row or first column to label the data."
                })
            
            if table["has_th"] and table["th_with_scope"] < table["th_count"]:
                self.issues.append({
                    "line": table["line"], "severity": "warning",
                    "issue": f"Some table headers ({table['th_count'] - table['th_with_scope']}) lack 'scope' attribute",
                    "fix": "Add scope='col' or scope='row' to <th> elements to clarify relationships."
                })

            if not table["has_caption"]:
                self.issues.append({
                    "line": table["line"], "severity": "info",
                    "issue": "Table has no <caption>",
                    "fix": "Add a <caption> element to describe the table content for screen reader users."
                })


def audit_file(filepath):
    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
    auditor = TableAuditor()
    auditor.feed(content)
    auditor.analyze()
    return auditor.issues, len(auditor.tables)


def main():
    parser = argparse.ArgumentParser(
        description="Audit HTML tables for accessibility compliance (WCAG 1.3.1)."
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
        issues, total_tables = audit_file(filepath)
        all_results[filepath] = {"issues": issues, "total_tables": total_tables}
        total_issues += len(issues)

    if args.format == "json":
        print(json.dumps(all_results, indent=2))
    else:
        for filepath, result in all_results.items():
            issues = result["issues"]
            print(f"\n{'='*60}")
            print(f"  {filepath} — Table Accessibility Audit")
            print(f"  Total tables: {result['total_tables']}  Issues: {len(issues)}")
            print(f"{'='*60}")
            for issue in issues:
                icon = {"error": "ERR", "warning": "WRN", "info": "INF"}[issue["severity"]]
                print(f"  [{icon}] Line {issue['line']}: {issue['issue']}")
                print(f"        fix: {issue['fix']}")
            if not issues:
                print("  No table accessibility issues detected.")
            print()

    sys.exit(1 if total_issues > 0 else 0)


if __name__ == "__main__":
    main()
