import os
import re

def replace_classes(file_path, class_map):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Remove css import
    content = re.sub(r'import\s+[\'"]\./[^\'"]+\.css[\'"];\n?', '', content)
    
    for old_cls, new_cls in class_map.items():
        # replace className="old_cls" with className="new_cls"
        # also handle multiple classes like className={`old_cls ${...}`}
        # This is a simple replacement, might need regex for exact whole word match in className="..."
        
        # We need to replace class names only inside className="..." or className={`...`}
        # A bit tricky with regex, let's just do whole word replacements cautiously
        
        # Regex to find word boundaries
        pattern = r'(?<=className=["\'`])(.*?)(?=["\'`])'
        def replacer(match):
            classes = match.group(1).split()
            new_classes = []
            for c in classes:
                if c == old_cls:
                    new_classes.extend(new_cls.split())
                else:
                    new_classes.append(c)
            # handle template literal expressions like ${...}
            # Actually, split() might break template literals.
            # Let's do a simpler regex: replace `\b{old_cls}\b` inside the file, but it might replace variables.
            return ' '.join(new_classes)
        
        # Instead, let's just use re.sub with word boundary, but only if it's safe.
        # React classNames are usually hyphenated.
        content = re.sub(rf'\b{old_cls}\b', new_cls, content)
        
    with open(file_path, 'w') as f:
        f.write(content)

user_profile_map = {
    'user-profile-container': 'min-h-[calc(100vh-70px)] bg-gradient-to-br from-[#f3e5f5] to-[#e1bee7] p-[clamp(1rem,2vw,2rem)]',
    'profile-header-section': 'flex items-center gap-8 pb-8 border-b border-[#eee] mb-8 flex-wrap max-md:flex-col max-md:text-center',
    'profile-header': 'text-center mb-8',
    'profile-tabs': 'flex justify-center gap-4 mb-8 flex-wrap max-md:flex-col',
    'tab-btn': 'flex items-center gap-2 py-4 px-8 bg-white border-2 border-transparent rounded-xl cursor-pointer font-semibold transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]',
    'active': 'bg-gradient-to-br from-[#9C27B0] to-[#7B1FA2] text-white',
    'tab-icon': 'text-[1.2rem]',
    'tab-content': 'max-w-[900px] mx-auto',
    'profile-content': 'bg-white rounded-[20px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
    'avatar-section': 'flex flex-col items-center gap-3',
    'avatar': 'w-[100px] h-[100px] rounded-full bg-gradient-to-br from-[#9C27B0] to-[#7B1FA2] flex items-center justify-center text-white text-[2.5rem] font-bold',
    'change-avatar-btn': 'bg-[#f5f5f5] border-none py-2 px-4 rounded-[20px] text-[0.8rem] cursor-pointer transition-all duration-300 hover:bg-[#e0e0e0]',
    'profile-info': 'flex-1 max-md:text-center',
    'profile-location': 'my-1 text-[#666]',
    'profile-experience': 'my-1 text-[#666]',
    'edit-btn': 'py-3 px-6 bg-[#f5f5f5] border-2 border-transparent rounded-xl cursor-pointer font-semibold transition-all duration-300 hover:bg-[#e0e0e0]',
    'save': 'bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] text-white',
    'profile-details': 'grid grid-cols-2 gap-6 max-md:grid-cols-1',
    'detail-group': 'flex flex-col gap-2',
    'full-width': 'col-span-2 max-md:col-span-1',
    'crops-list': 'flex flex-wrap gap-2',
    'crop-badge': 'bg-[#e8f5e9] text-[#2E7D32] py-2 px-4 rounded-[20px] text-[0.9rem]',
    'add-crop-btn': 'bg-[#f5f5f5] border-2 border-dashed border-[#ccc] py-2 px-4 rounded-[20px] cursor-pointer transition-all duration-300 hover:border-[#9C27B0] hover:text-[#9C27B0]',
    'bio-text': 'm-0 text-[#555] leading-[1.6] p-3 bg-[#f8f9fa] rounded-lg',
    'stats-content': 'flex flex-col gap-8',
    'stats-grid': 'grid grid-cols-4 gap-6 max-md:grid-cols-2',
    'stat-card': 'bg-white rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
    'stat-icon': 'text-[2.5rem] block mb-3',
    'stat-number': 'block text-[2rem] font-bold text-[#9C27B0] mb-1',
    'stat-label': 'text-[#666] text-[0.9rem]',
    'achievements-section': 'bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
    'achievements-grid': 'grid grid-cols-3 gap-4 max-md:grid-cols-1',
    'achievement-card': 'p-5 rounded-xl text-center border-2 border-[#eee] relative',
    'earned': 'bg-gradient-to-br from-[rgba(156,39,176,0.1)] to-[rgba(123,31,162,0.05)] border-[#9C27B0]',
    'locked': 'opacity-60 grayscale',
    'achievement-icon': 'text-[2rem] block mb-2',
    'earned-badge': 'absolute -top-2 -right-2 bg-[#4CAF50] text-white py-1 px-2 rounded-[10px] text-[0.7rem] font-semibold',
    'activity-section': 'bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
    'activity-list': 'flex flex-col gap-4',
    'activity-item': 'flex items-center gap-4 p-4 bg-[#f8f9fa] rounded-lg',
    'activity-icon': 'text-[1.5rem]',
    'activity-details': 'flex-1 flex justify-between items-center max-md:flex-col max-md:items-start max-md:gap-1',
    'activity-action': 'text-[#333]',
    'activity-time': 'text-[#999] text-[0.85rem]',
    'settings-content': 'flex flex-col gap-8',
    'settings-section': 'bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
    'settings-grid': 'flex flex-col gap-4',
    'setting-item': 'flex justify-between items-center p-4 bg-[#f8f9fa] rounded-lg',
    'setting-info': 'flex flex-col gap-1',
    'setting-label': 'font-semibold text-[#333]',
    'setting-desc': 'text-[0.85rem] text-[#666]',
    'toggle': 'relative inline-block w-[50px] h-[28px]',
    'slider': "absolute cursor-pointer inset-0 bg-[#ccc] transition duration-400 rounded-[28px] peer-checked:bg-gradient-to-br peer-checked:from-[#9C27B0] peer-checked:to-[#7B1FA2] before:absolute before:content-[''] before:h-[20px] before:w-[20px] before:left-[4px] before:bottom-[4px] before:bg-white before:transition before:duration-400 before:rounded-full peer-checked:before:translate-x-[22px]",
    'preferences-grid': 'grid grid-cols-3 gap-4 max-md:grid-cols-1',
    'preference-item': 'flex flex-col gap-2',
    'danger-zone': 'border-2 border-[#ffebee] bg-[#fff5f5]',
    'danger-actions': 'flex gap-4 max-md:flex-col',
    'danger-btn': 'py-3 px-6 rounded-lg cursor-pointer font-semibold transition-all duration-300',
    'outline': 'bg-white border-2 border-[#f44336] text-[#f44336] hover:bg-[#ffebee]',
    'solid': 'bg-[#f44336] border-2 border-[#f44336] text-white hover:bg-[#d32f2f]',
    'save-settings-btn': 'block w-full p-4 bg-gradient-to-br from-[#9C27B0] to-[#7B1FA2] text-white border-none rounded-xl text-[1.1rem] font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(156,39,176,0.3)]'
}

# The word boundary replacement approach could have issues where a class name is also a javascript keyword or variable name, e.g. "active", "save".
# Let's do something slightly safer: read the file line by line, find `className="..."` or `className={`...`}` and only replace inside them.

def safe_replace(file_path, class_map):
    with open(file_path, 'r') as f:
        content = f.read()

    # Remove css import
    content = re.sub(r'import\s+[\'"]\./[^\'"]+\.css[\'"];\n?', '', content)

    # We will use a regex to find all className attributes
    def replacer(match):
        prefix = match.group(1)
        classes_str = match.group(2)
        suffix = match.group(3)
        
        # Split the class string by spaces, quotes, backticks, curly braces, etc.
        # But wait, inside className={`...`}, there can be JS expressions.
        # The easiest is to just run a regex sub over classes_str for each class in class_map
        for old_cls, new_cls in class_map.items():
            classes_str = re.sub(rf'\b{old_cls}\b', new_cls, classes_str)
        return prefix + classes_str + suffix

    # This regex matches className="...", className={'...'}, className={`...`}
    content = re.sub(r'(className=\s*)(["\'`{].*?["\'`}])(\s|>)', replacer, content)

    # Some elements like `<h2>` in `.profile-header h1` aren't classes.
    # We need to manually add them to the JSX if they aren't targeted by className.
    
    with open(file_path, 'w') as f:
        f.write(content)

safe_replace('/Users/sohit/Desktop/Dev/projects2/Agri-advisor/frontend/src/components/pages/UserProfile.jsx', user_profile_map)
