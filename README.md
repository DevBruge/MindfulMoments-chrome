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
6. hook up the pieces:
    1. ~~make sound an option for all notification modes > MJ~~
    2. ~~hook up notifications with the options page > MJ~~
    3. load defaults if user hasn't set the options page yet (or force options page on them) > MJ
        - can force load the options page instead of first alarm
        - can refactor code to put defaultOptions are JSON file, and load it into a background.html page
    3. choose a random message from the list of available messages > MJ
    4. ~~add enriched notifications > Chris~~
    5. ~~add alarm time in options and make text user friendly (notify me every x mins (+/- y mins)) > Chris~~
    6. ~~find 1 zen picture > Mei-Yan/Chris~~
    7. find 1 zen sound > Rami/MJ 
    8. Validate options (alarm interval correct order, at least 1 message)
    9. ~~CSS style options page > Chris~~
7. add a "reset to defaults" button in the options page
8. figure out best practices for removing options stored in local/sync storage
    - looks like options are maintained on reload/disable and renable
    - looks like options are removed on uninstall (aka unload, if unpacked)
9. clean up code
    1. remove all debug statements
    2. remove all commented out code
    3. decide preferred order of functions in JS files
    4. apply any outstanding refactoring

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
