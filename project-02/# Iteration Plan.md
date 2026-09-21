# Iteration Plan

## P01 Evaluation

The pages for my favorite wineries in each region are solid and have direct links to the actual winery websites. They look good whether viewing on an iPhone, iPad or computer. I think the database looked good but it didn't save any changes unless I went to the local CSV file and manually updated it.  The screen also looked cluttered showing our entire inventory. I think it compares well to my proposal though i have added features to it that were not on the original proposal.  I have even downloaded xcode and figured out how to make it an IOS app to make it easier for me and my wife to update it but that isn't officially part of this project.

## Changes for P02

### Fixes
I plan on cleaning up the database by only showing 5 items at a time unless you scroll through the inventory while in the box for it. I also adjusted the hover accent color to a lighter more neutral color to make it more readable.

### Improvements
I plan on cleaning the CSS file as I kept adding to it and verify I don't have redundant or unused entries.

### Additions
The additions will be having the online Supabase database, only showing 5 items at a time, and an input form for adding new wines including a button for uploading the front label of the bottle.

### Cuts
I planned on having a bottle jump out and rotate while hovering over it, but have decided that most bottles don't have a back label and the ones that do don't really add value. I like how cleanly the label jumps out now and decided that adding the new wine form would be a better addition for P02.

## Priority and Timeline

### Must complete
The online wine inventory database and the new bottle import form are must completes to make this a usable product for our wine inventory. This will take most of a weekend. Cleaning up the CSS, JS, and HTML files will take a couple hours.

### Should Complete
Add additional features such as descriptions of the wines, I would also like a summary that lists how many wines we have total split up by white/red/rose. This may take a few hours.

### If Time Allows
Creating a tasting note input form on the website which would take a couple hours.

## Updated Tools and Approach

P01 was mostly using HTML and CSS, with P02 I have added using an online database called Supabase and added an app.js file for the javascript for my online inventory and new wine input sheet.

HTML, CSS and VS Code were great for P01 but as things got more complicated with my new features it made sense to have a separate app.js page for all my scripts. As it look cluttered being on my html file. I also found Google Gemini to be helpful with how to implement some of my new features but it was not easy as they kept giving me incorrect code additions that didn't work with my project so I had to see what they were trying to do and manually add it to my code. 

I don't really think I would do too much differently starting over but maybe do the initial inventory online to begin with.