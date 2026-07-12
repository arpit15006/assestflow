import os

replacements = {
    "bg-card": "bg-white",
    "bg-surface/50": "bg-zinc-50/50",
    "bg-surface": "bg-zinc-50",
    "border-border/30": "border-zinc-200/50",
    "border-border/50": "border-zinc-200",
    "border-border": "border-zinc-200",
    "text-foreground": "text-zinc-950",
    "text-muted-foreground": "text-zinc-500",
    "hover:bg-surface-hover": "hover:bg-zinc-100",
    "hover:bg-surface/40": "hover:bg-zinc-50",
    "hover:bg-surface": "hover:bg-zinc-50",
    "text-danger": "text-red-600",
    "text-success": "text-green-600",
    "text-warning": "text-amber-600",
    "bg-danger/10": "bg-red-50",
    "bg-danger/20": "bg-red-100",
    "bg-success/10": "bg-green-50",
    "bg-success/20": "bg-green-100",
    "bg-warning/10": "bg-amber-50",
    "bg-warning/20": "bg-amber-100",
    "border-danger/20": "border-red-200",
    "border-success/20": "border-green-200",
    "border-warning/20": "border-amber-200",
    "text-primary": "text-indigo-600",
    "bg-primary/10": "bg-indigo-50",
    "bg-popover": "bg-white",
    "text-popover-foreground": "text-zinc-950",
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)

for root, _, files in os.walk('src/features'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

for root, _, files in os.walk('src/shared'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

print("Replacement complete.")
