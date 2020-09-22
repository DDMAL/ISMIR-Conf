import pandas as pd
import re
import sys

authors_list = []
affils_list = []
keywords_list = []
session_list = []
# with open('../pre_parse_ISMIR2020_papers.csv', 'r') as f:
orig_csv = pd.read_csv('../static/csv/pre_parse_ISMIR2020_papers.csv')
schedule_csv = pd.read_csv('../static/csv/paper_schedule.csv')

print('Min or max keywords? [mM]')
key_choice = str(input())
if key_choice not in ['m', 'M']:
    sys.exit('Chooose one of the options above')


# Rework authors, affiliations, subject areas

for index, row in orig_csv.iterrows():
    authors = []
    affils = []
    author_affil = row['Authors'].split('; ')

    session_num = schedule_csv[schedule_csv["Paper ID"] == row["Paper ID"]]["Session"].values[0]
    print(session_num)
    # print(row['Primary Subject Area'], row['Secondary Subject Areas'])
    if key_choice == 'm':
        primary_sub = [row['Primary Subject Area'].split(' -> ')[1]]
        secondary_sub = [[x.split(' -> ')[1]] for x in row['Secondary Subject Areas'].split('; ')] if not pd.isnull(row['Secondary Subject Areas']) else None
    else:
        primary_sub = row['Primary Subject Area'].split(' -> ')
        secondary_sub = [x.split(' -> ') for x in row['Secondary Subject Areas'].split('; ')] if not pd.isnull(row['Secondary Subject Areas']) else None
    secondary_sub = [term for sub in secondary_sub for term in sub] if secondary_sub else None
    # print(secondary_sub)
    keywords = primary_sub + secondary_sub if secondary_sub else primary_sub
    keywords = list(dict.fromkeys(keywords))
    # print(keywords)
    # print(keywords)
    # print(secondary_sub)
    for pair in author_affil:
        # print(pair)
        if pair[-1] == '*': # asterisk may need to be handled differently
            pair = pair[:-2]
        else:
            pair = pair[:-1]
        ps = pair.split(' (')
        # print(ps)
        authors.append(ps[0])
        affils.append(ps[1])
    authors = "|".join(authors)
    affils = "|".join(affils)
    keywords = "|".join(keywords)
    # keywords = re.sub('[;,]', '', keywords)
    # keywords = re.sub('[/]', ' ', keywords)
    authors_list.append(authors)
    affils_list.append(affils)
    keywords_list.append(keywords)
    session_list.append(session_num)
    print(keywords, '\n')
    # print(author_affil)
new_csv = pd.DataFrame(
    {"UID": orig_csv['Paper ID'],
    # "type": orig_csv['Content Type'],
    "title": orig_csv['Paper Title'],
    "abstract": orig_csv['Abstract'],
    "primary_author": orig_csv['Primary Contact Author Name'],
    "primary_email": orig_csv['Primary Contact Author Email'],
    "session": session_list,
    "authors": authors_list,
    "affiliations": affils_list,
    "keywords": keywords_list,
})
# UID   title   authors session	day	abstract	keywords
# print(orig_csv)
# print(new_csv)
new_csv.to_csv('../sitedata/papers.csv', index=False)
