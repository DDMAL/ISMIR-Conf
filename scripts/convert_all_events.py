import pandas as pd
import re
import sys
import pytz
from icalendar import vDatetime
from icalendar import Calendar, Event
from datetime import datetime

orig_csv = pd.read_csv('../static/csv/ISMIR_all_events - All_Events_Details.csv')
orig_csv = orig_csv.sort_values(by=['Event number (UTC)'])

print(orig_csv['Category'].unique())

opening_ref_a = 11 #openingA
opening_ref_b = 20 #openingB

color_dict = {
    "Tutorials": "tut",
    "All Meeting": "all", # big stuff such as keynotes, business meetings
    "Poster session": "pos",
    "Meetup": "meet",
    "WiMIR Meetup": "wimir",
    "Meetup-Special": "meet-spec",
    "Music concert": "mus",
    "Masterclass": "master",
    "Satellite": "sat",
}

# same events different times, via event number field

tutorials_list = [
    [1, 6], # tutorials
    [2, 7],
    [3, 9],
    [4, 8],
    [5, 10],
    [11, 20], # opening
    [68, 77], # business meeting
]

posters_dict = {
    "1A": 1,
    "2A": 2,
    "3A": 3,
    "4A": 4,
    "5A": 5,
    "6A": 6,
    "1B": 1,
    "2B": 2,
    "3B": 3,
    "4B": 4,
    "5B": 5,
    "6B": 6,
}

# print(orig_csv['Event number (UTC)'])
cal = Calendar()
cal.add('prodid', 'ISMIR 2020 calendar')
cal.add('version', '2.0')
cal['dtstart'] = '20201011T000000'
events_meta = {}
# cal['dtstart'] = '20050404T080000'
# cal['summary'] = 'Python meeting about calendaring'

def display(cal):
    return cal.to_ical().replace('\r\n', '\n').strip()

# make tutorials.csv

tut_csv = orig_csv.copy()[orig_csv['Category'].isin(["Tutorials", "All Meeting"])]
tut_csv['start_date_b'] = [""] * tut_csv.shape[0]
tut_csv['start_time_b'] = [""] * tut_csv.shape[0]

for p in tutorials_list:
    tut_csv.loc[tut_csv['Event number (UTC)'] == p[0], 'start_date_b'] = tut_csv.loc[tut_csv['Event number (UTC)'] == p[1], 'Date (UTC)'].values[0]
    tut_csv.loc[tut_csv['Event number (UTC)'] == p[0], 'start_time_b'] = tut_csv.loc[tut_csv['Event number (UTC)'] == p[1], 'Start time (UTC)'].values[0]
# print(tut_csv)
# for p in tutorials_list:
tut_csv = tut_csv[tut_csv['start_date_b'] != ""]
tut_csv = tut_csv.sort_values(by=['Title'])

# summary is event title
# location is the link on the calendar

for index, event in orig_csv.iterrows():
    e_cal = Event()
    e_meta = {}

    e_date = [int(x) for x in event['Date (UTC)'].split('-')]
    e_start_time = [int(x) for x in event['Start time (UTC)'].split(':')]
    e_end_time = [int(x) for x in event['End time'].split(':')]
    e_cal.add('uid', int(event['Event number (UTC)']))
    e_cal.add('dtstamp', datetime(2020,10,1,0,0,0,tzinfo=pytz.utc))
    if event['Event number (UTC)'] == opening_ref_a:
        e_cal['description'] = 'openingA'
    elif event['Event number (UTC)'] == opening_ref_b:
        e_cal['description'] = 'openingB'

    if event['Category'] == "Poster session":
        if 'LBD' not in event['Title']:
            session_num = posters_dict[event['Title'].split(" ")[-1]]
            e_cal['location'] = f'papers.html?filter=title&session={session_num}'
        else:
            # session_num = posters_dict[event['Title'].split(" ")[-1]]
            e_cal['location'] = f'lbds.html?session='

    elif event['Category'] == "Tutorials":
        e_cal['location'] = f'tutorials.html#{event["Title"][:2]}'

    elif event['Category'] == "Music concert":
        session_num = posters_dict[event['Title'].split(" ")[-1]]
        e_cal['location'] = f'music.html?session={session_num}'
    elif event['Category'] == "Meetup":
        e_cal['location'] = event['Channel URL']

    elif event['Category'] in ["All Meeting", "Meetup-Special", "WiMIR Meetup", "Masterclass"]:
        if any(e in event["Title"] for e in ['Opening', "Business"]):
            e_cal['location'] = f'day_{event["Conf day"]}.html#{color_dict[event["Category"]] + "_b"}'
        else:
            e_cal['location'] = f'day_{event["Conf day"]}.html#{color_dict[event["Category"]]}'

    elif event['Category'] == "Satellite":
        e_cal['location'] = event['Website link']
    # elif event['Category'] in ["All Meeting", "Meetup"]:
    #     e_cal['location'] = event['Channel URL']


    e_cal.add('summary', "#" + color_dict[event['Category']] + ' ' + event['Title'])
    e_cal.add('dtstart', datetime(e_date[0], e_date[1], e_date[2],
        e_start_time[0], e_start_time[1], 0, tzinfo=pytz.utc))
    if e_end_time[0] < e_start_time[0]:
        e_cal.add('dtend', datetime(e_date[0], e_date[1], e_date[2] + 1,
            e_end_time[0], e_end_time[1], 0, tzinfo=pytz.utc))
    else:
        e_cal.add('dtend', datetime(e_date[0], e_date[1], e_date[2],
            e_end_time[0], e_end_time[1], 0, tzinfo=pytz.utc))

    cal.add_component(e_cal)

new_csv = pd.DataFrame(
    {"UID": orig_csv['Event number (UTC)'],
    "title": orig_csv['Title'],
    "day": orig_csv['Conf day'],
    "start_date": orig_csv['Date (UTC)'],
    "start_time": orig_csv['Start time (UTC)'],
    "category": orig_csv['Category'],
    "description": orig_csv['Description'],
    "organiser": orig_csv['Organiser'],
    "web_link": orig_csv['Website link'],
    "slack_channel": orig_csv['Slack Channel'],
    "channel_url": orig_csv['Channel URL'],
})

new_tut_csv = pd.DataFrame({
    "UID": tut_csv['Event number (UTC)'],
    "title": [s.split(':')[0][:-1] + ': ' + s.split(':')[1] if ':' in s else s for s in tut_csv['Title']],
    "day": tut_csv['Conf day'],
    "start_date": tut_csv['Date (UTC)'],
    "start_time": tut_csv['Start time (UTC)'],
    "start_date_b": tut_csv['start_date_b'],
    "start_time_b": tut_csv['start_time_b'],
    "category": tut_csv['Category'],
    "description": tut_csv['Description'],
    "organiser": tut_csv['Organiser'],
    "web_link": tut_csv['Website link'],
    "slack_channel": tut_csv['Slack Channel'],
    "channel_url": tut_csv['Channel URL'],
})

with open('../static/calendar/ISMIR_2020.ics', 'wb') as f:
    f.write(cal.to_ical())

new_csv.to_csv('../sitedata/events.csv', index=False)
new_tut_csv.to_csv('../sitedata/tutorials_all.csv', index=False)
# print(cal)
# print(events_meta)
