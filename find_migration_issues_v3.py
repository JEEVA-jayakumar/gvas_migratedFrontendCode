import os
import re

directories = ["src/pages/super_admin/", "src/components/super_admin/"]
issues = []

patterns = [
    (r'slot="body-cell-', "Legacy slot syntax in q-table"),
    (r'slot="title"', "Legacy slot syntax in q-tab"),
    (r'<q-tab-pane', "Legacy q-tab-pane"),
    (r'q-tab-panell', "Typo q-tab-panell"),
    (r'\.sync=', "Legacy .sync modifier"),
    (r'float-label=', "Legacy float-label"),
    (r'inverted', "Legacy inverted prop"),
]

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for f in files:
            if f.endswith(".vue"):
                path = os.path.join(root, f)
                with open(path, 'r') as file:
                    content = file.read()
                    for pattern, desc in patterns:
                        if re.search(pattern, content):
                            issues.append(f"{path}: {desc}")

for issue in issues:
    print(issue)
