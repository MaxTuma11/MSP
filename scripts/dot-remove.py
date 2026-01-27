def fix_spaces_before_fullstops(text):
    #replace any space directly before a full stop
    return text.replace(" .", ".")

def fix_quotes(text):
    return text.replace('"', "'")

paragraph = input("Enter your paragraph:\n")

fixed_paragrap = fix_spaces_before_fullstops(paragraph)
fixed_paragraph = fix_quotes(fixed_paragrap)

print("\nCorrected paragraph:\n")
print(fixed_paragraph)