import os
import re

directory = 'src/pages/inventory/'

def fix_moment_filter(content):
    # Matches: props.row.updated_date | moment("Do MMM Y")
    # And replaces with: $moment(props.row.updated_date).format("Do MMM Y")
    # This regex is more broad to catch it even if not wrapped in {{ }} or inside an attribute
    pattern = r'([\w\.]+)\s*\|\s*moment\("(.*?)"\)'

    # We should be careful not to replace things that are already fixed.
    # But usually $moment(something).format("...") won't match this pattern.

    return re.sub(pattern, r'$moment(\1).format("\2")', content)

for filename in os.listdir(directory):
    if filename.endswith(".vue"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        new_content = fix_moment_filter(content)

        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Fixed filter in {filename}")
