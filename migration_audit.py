import os
import re

directory = 'src/pages/inventory/'

issues = [
    (r':data=', 'q-table :data (should be :rows)'),
    (r'slot="body-cell-', 'legacy slot syntax'),
    (r'slot-scope=', 'legacy slot-scope syntax'),
    (r':pagination\.sync=', 'legacy pagination.sync'),
    (r'<q-search', 'legacy q-search'),
    (r'@input=', 'legacy @input on select (should be @update:model-value)'),
    (r'float-label=', 'legacy float-label'),
    (r'\| moment\(', 'legacy moment filter'),
    (r'(?<!this\.)(?<!\$)\bmoment\(', 'direct moment() call'),
    (r'v-else="', 'v-else with expression'),
    (r'\.native', 'native modifier'),
    (r'no-border', 'legacy no-border on q-list'),
    (r'<q-alert', 'legacy q-alert'),
    (r'<big', 'deprecated big tag'),
]

for filename in os.listdir(directory):
    if filename.endswith(".vue"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        found_issues = []
        for pattern, desc in issues:
            if re.search(pattern, content):
                found_issues.append(desc)

        if found_issues:
            print(f"File: {filename}")
            for issue in found_issues:
                print(f"  - {issue}")
