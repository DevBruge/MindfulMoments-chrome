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
6. make primary fuctionalty
  a. make sound option for all notification modes > MJ
  b. hook up notifications with options page. First load defaults if options page isn't opened > MJ
  c. choose random message from available messages > MJ
  d. enriched notifications > Chris
  e. add time interval options page (notify me every x mins (+ or - y mins)) (make user friendly) > Chris
  f. find 1 zen picutre > Mei-Yan/Chris
  g. find 1 zen sound > Rami/MJ 

####TEST CASES
1. Ensure that on first load all storage it loaded with defaults
2. What is options page is loaded when alarm fires?
3. What if another alert is open when alarm fires?
4. What if another notification is open when alarm fires?

####Features parking lot:
- don't let alerts/notifications pile up if user is not at desk
- JS namespacing
- find multiple zen picures, choose randomly
- finding multiple zen sounds, choose randomly
- update JavaScript styling of options and notifications pages
- format a better CSS style sheet (a priority when tacling different versions/themes)
