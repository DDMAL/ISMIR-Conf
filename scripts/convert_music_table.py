import pandas as pd
import re
import sys

authors_list = []
affils_list = []
keywords_list = []
session_list = []
# with open('../pre_parse_ISMIR2020_papers.csv', 'r') as f:
orig_csv = pd.read_csv('../static/csv/pre_parse_music.csv')

# Rework authors, affiliations, subject areas

# for index, row in orig_csv.iterrows():


new_csv = pd.DataFrame(
    {"UID": orig_csv['Submission number '],
    # "type": orig_csv['Content Type'],
    "title": orig_csv["Title of the piece"],
    "abstract": orig_csv["Abstract of the piece. This abstract is going to be displayed on the ISMIR music program page. (150-250 words)"],
    "first_name": orig_csv["Given name"],
    "last_name": orig_csv["Family name"],
    "affiliation": orig_csv["University, Corporate / Institutional affiliation(s)"],
    "bio": orig_csv["Short bio (100-200 words)"],
    "web_link": orig_csv["Link to your website (optional)"],
    "session": orig_csv["Session Number"],
    "yt_link": orig_csv["YouTube link"],
    "bb_link": orig_csv["Bilibili link"],
    "db_link": orig_csv["Dropbox link"],
    "still_image": orig_csv["Still image (for audio-only submissions). "],
    
})

print(new_csv)
new_csv.to_csv('../sitedata/music.csv', index=False)
