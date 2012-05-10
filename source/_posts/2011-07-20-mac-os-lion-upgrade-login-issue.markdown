---
layout: post
title: "Mac OS Lion Upgrade — Login Issue"
date: 2011-07-20 18:54
comments: true
categories: mac
---
After upgrading my Mac OS 10.6.8 to 10.7 today, my user account didn't show up on the login screen, and attempting to login with my username and password resulted in my login screen hanging indefinitely. 

Fixing My Screwed Up OS X 10.6 Account After 10.7 Upgrade
----

Here's what I did to fix my account (in the present tense)...

* Reboot and hold apple (command) R to enter recovery mode
* Open Terminal from the Utilities menu
* Run 'resetpassword' to open the Reset Password utility
* Select your harddrive, then select the root user from the users menu
* Reset the root password, and also reset the ACL
* Reboot, then login as root
* Once logged in as root (System Administrator), you can go to System Preferences, User Accounts, and then add your old 10.6 username, choosing to reuse the existing directory. This may take a few minutes.
* Reboot once more, and you should be able to login as your old 10.6 username.

I hope this helps someone that had the same problem! Let me know if this works for you.
