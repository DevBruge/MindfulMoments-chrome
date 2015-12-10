##Mindful Moments (chrome extension)

This extension reminds the user to occasionally take mindful breaks.

---

###Under Development 

####TODO
1. ~~figure out how to create a event page extension~~
2. ~~make event page alert us every x seconds~~
3. ~~add randomness to the alert~~
4. ~~add an options page to configure randomness and the message text~~
5. ~~determine best notification mechanism (alert vs. chrome notifications vs. popup vs. ding sound...etc)~~
6. ~~hook up the pieces:~~
    1. ~~make sound an option for all notification modes > MJ~~
    2. ~~hook up notifications with the options page > MJ~~
    3. ~~hook up alarm timing with the options page > MJ~~
    4. ~~choose a random message from the list of available messages > MJ~~
    5. ~~add enriched notifications > Chris~~
    6. ~~add alarm time in options and make text user friendly (notify me every x mins (+/- y mins)) > Chris~~
    7. ~~find 1 zen picture > Mei-Yan/Chris~~
    8. ~~find 1 zen sound > Rami/MJ~~
7. ~~add a "reset to defaults" button in the options page > Chris~~
8. ~~Validate options (alarm interval correct order, at least 1 message) > Chris~~
11. ~~visual appeal~~
    1. ~~CSS style options page > Chris~~
    2. ~~Chrome notification style > Chris~~
    3. ~~Alert box styling > researched and this is not worth it > leave as is~~
    4. ~~Icon > Chris~~ 
21. attach zen sound to alarm (in Gmail) > MJ
3. refactor code to put defaultOptions in a JSON file (and load it into a background.html page) > MJ
8. Load default options from JSON file on alarm create if they're NULL > MJ
3. ~~Alarm code sharing in one background page (read architecture overview) > Chris~~
3. ~~force load the options page on extension install > Chris~~
8. ~~Reschedule current alarm on options save event > Chris~~
10. clean up code > Chris/MJ
    1. remove all debug statements
    2. remove all commented out code
    3. decide preferred order of functions in JS files
    4. apply any outstanding refactoring
11. visual appeal
    1. ~~CSS style options page > Chris~~
    2. Chrome notification style
    3. Alert box styling
    4. Icon 
    4. apply any outstanding refactoring 
12. choose a software license, and add it (maybe MIT license?)
100. Publish

####TEST CASES
1. Ensure that on first load all storage it loaded with defaults
2. What is options page is loaded when alarm fires?
3. What if another alert is open when alarm fires?
4. What if another notification is open when alarm fires?
5. Notification pileups

####Features parking lot:
- don't let alerts/notifications pile up if user is not at desk
- JS namespacing
- find multiple zen picures, choose randomly
- finding multiple zen sounds, choose randomly
- update JavaScript styling of options and notifications pages
- format a better CSS style sheet (a priority when tackling different versions/themes)
- implement auto-save on the options page
- implement a way to prevent the last mindful message from repeating, even if randomly selected
- implement a nice looking options button on the chrome notification
- have multiple random images (understand size of extension download when adding images) > Chris
- figure out best practices for removing options stored in local/sync storage
    - looks like options are maintained on reload/disable and renable
    - looks like options are removed on uninstall (aka unload, if unpacked)
