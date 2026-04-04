import os

files_to_fix = [
    'src/store/AggregatorDeviceRecovery/actions.js',
    'src/store/AggregatorDeviceReplacement/actions.js',
    'src/store/AggregatorPodLists/actions.js',
    'src/store/AggregatorSendToRepair/actions.js',
    'src/store/AggregatorTid/actions.js',
    'src/store/Aggregatorinventorywithso/actions.js',
    'src/store/AggregatorInventoryCentral.js',
    'src/store/SAT_Dashboard/actions.js' # Already has it, but safe to check
]

# We need a more comprehensive list based on where getAggregatorId is actually used
import subprocess
output = subprocess.check_output(['grep', '-r', 'getAggregatorId', 'src/store/']).decode('utf-8')
found_files = set()
for line in output.split('\n'):
    if line and '.js' in line:
        filepath = line.split(':')[0]
        found_files.add(filepath)

import_statement = 'import { getAggregatorId } from "../../util/safeStorage";\n'
import_statement_root = 'import { getAggregatorId } from "../util/safeStorage";\n'

for filepath in found_files:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()

    if 'import { getAggregatorId }' in content:
        print(f"Skipping {filepath}, already has import.")
        continue

    print(f"Fixing {filepath}...")
    # Determine depth for relative import
    depth = filepath.count('/') - 2
    actual_import = import_statement if depth > 0 else import_statement_root

    new_content = actual_import + content
    with open(filepath, 'w') as f:
        f.write(new_content)
