import re
import os
import sys
import collections
import pandas as pd
import shutil

posters_hold_path ="../../ISMIR-CONF-HOLD/posters/"
posters_save_path ="../static/posters/"

paper_ID_csv = "../static/csv/Schedule - Paper (Preliminary) - Schedule - Paper (Preliminary).csv"


poster_list = []

if not os.path.isdir(posters_save_path):
    os.mkdir(posters_save_path)

for poster in os.listdir(posters_hold_path):
    poster_list.append(int(poster.split(' - ')[-1].split("_")[0]))
    # print(poster.split(' - ')[-1].split("_")[0])

    shutil.copy(posters_hold_path + poster, posters_save_path)
    os.rename(posters_save_path + poster, posters_save_path + poster.split(' - ')[-1].split("_")[0] + '.pdf')

unique_poster_list = list(set(poster_list))
print(len(poster_list), len(unique_poster_list))

with open('current_poster_ids.txt', 'w') as f:
    f.write(('\n').join(str(i) for i in unique_poster_list))

print([item for item, count in collections.Counter(poster_list).items() if count > 1])
