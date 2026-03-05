import os
import re

directories = ["src/pages/super_admin/", "src/components/super_admin/"]
issues = []

patterns = [
    (r'slot="body-cell-', "Legacy slot syntax in q-table"),
    (r'slot="title"', "Legacy slot syntax in q-tab"),
    (r'<q-tab-pane', "Legacy q-tab-pane (should be q-tab-panel inside q-tab-panels)"),
    (r'\.sync=', "Legacy .sync modifier (should be v-model:prop)"),
    (r':data=', "Legacy q-table :data (should be :rows)"),
    (r'float-label=', "Legacy float-label (should be label)"),
    (r'@select=', "Legacy @select event (should be @update:model-value)"),
    (r'@input=', "Legacy @input event (should be @update:model-value or @input)"),
    (r'\$q\.dialog\(.*\)\.then', "Legacy \$q.dialog().then (should be .onOk)"),
    (r'inverted', "Legacy inverted prop on q-select/q-input"),
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
