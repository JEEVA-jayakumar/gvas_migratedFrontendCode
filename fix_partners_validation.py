import re

filepath = 'src/components/sat/showMarsFormComponent.vue'
with open(filepath, 'r') as f:
    content = f.read()

# Fix the validation definition for partnersArr
# It should use helpers.forEach for Vuelidate 2
# Currently it probably looks like $each.$iter: { ... } because of my previous script

# First, find the partnersArr block in validations
pattern = r'(partnersArr:\s*\{\s*required: [^,]+,\s*)\$each\.\$iter:\s*\{'
replacement = r'\1$each: helpers.forEach({'

# We also need to close the helpers.forEach( ... )
# This is tricky with regex if it's multi-line.
# Let's try a simpler approach: replace the start and then find the closing brace.

content = re.sub(pattern, replacement, content)

# Since I know the structure of partnersArr validation:
# It ends with contactEmail: { required, email, }, }, },
# Wait, I need to be careful.

# Let's look at the file content around partnersArr validation
