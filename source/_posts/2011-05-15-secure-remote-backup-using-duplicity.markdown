---
layout: post
title: "Secure Remote Backup Using Duplicity"
date: 2011-05-15 18:53
comments: true
categories: backup
---
[Duplicity](http://duplicity.nongnu.org/) is a robust, easy to use, backup and restore utility which uses [gpg](http://www.gnupg.org/) for encryption. Its flexibility allows backing up with [Amazon's S3 service](http://aws.amazon.com/s3/), a highly durable storage infrastructure designed for mission-critical data storage. In this article, I'll explain how to use Duplicity to create secure, incremental, remote backups with Amazon's S3 service.

## Duplicity in a Nutshell

Duplicity...

* is an __easy to use__ backup and restore command line utility
* __supports encryption and signing__ of archives using gpg
* is __bandwidth and space efficient__
  * uses [rsync](http://en.wikipedia.org/wiki/Rsync) to transfer only the modified parts of files, with support for binary files
* uses a __standard file format__ (gnu tar and rdiff incrementals)
* __supports multiple protocols__ including local storage, scp/ssh, ftp, rsync, and Amazon S3

See [full list of features](http://duplicity.nongnu.org/features.html) and [documentation](http://duplicity.nongnu.org/docs.html)

## Getting Started With Duplicity—Quick Guide and Examples

### Downloading and Installing Duplicity

[Duplicity](http://duplicity.nongnu.org/) has several requirements so you may want to use a package manager to install.

#### MacPorts Installation:

{% codeblock %}
sudo port install duplicity
{% endcodeblock %}

#### Ubuntu packages:

You should install the `duplicity` package along with `python-boto` for S3 support.

### Trying Out Duplicity

You can try out a simple Duplicity backup locally by running:

{% codeblock %}
duplicity <source-directory> file://<destination-directory>
{% endcodeblock %}

See [more examples](http://duplicity.nongnu.org/docs.html).

After you've succesfully created your first backup, you should see some backup statistics including the total count and file size of new or modified files.

### Creating a GPG Key For Encryption

To encrypt your backup, you will first need to create a gpg key. You can create a key for use only with Duplicity, which will protect your files from being viewed in transit or in remote storage (e.g. Amazon's servers).

Run `gpg --gen-key` in your shell.
{% codeblock %}
#~ gpg --gen-key
gpg (GnuPG) 1.4.11; Copyright (C) 2010 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
Your selection?
{% endcodeblock %}

* Choose kind of key, keysize, and expiration. I used the defaults.
* Enter a "Real Name" (e.g. Duplicity Backup), email address and comment, then `O(kay)` to continue with key generation.
* Enter a passphrase to protect your private key (this should be sufficiently long and difficult to guess). A passphrase may contain spaces.
* At this point, the key will be generated. On a remote host, you may have trouble generating enough random entropy. In this case, you might want to run some `find` commands or something to generate random data. It can take a minute or so for this step to complete.
* After key generation, note the key identifier for use with Duplicity.
  * The key identifier is an 8-digit hexadecimal number (e.g. D7E2BEC8). It's displayed on a line beginning with `pub`, after the `/`. 

### Signing Up With Amazon S3

[Amazon S3](http://aws.amazon.com/s3/) is a fast and reliable storage system which can be used along with Duplicity. It is relatively inexpensive, costing $0.10 per GB uploaded, $0.15 per GB downloaded, and $0.14 per GB-month storage. It's designed to provide 99.999999999% durability and 99.99% availability (of objects over a given year). 

[Sign up for Amazon Web Services](http://aws.amazon.com/) (AWS) and Simple Storage Service (S3). You'll need to use your S3 security credentials with Duplicity, so be sure to copy down your __Access Key ID__ and __Secret Access Key__.

### Creating a Duplicity Backup Script

You can use this bash script template to get started. Use your Amazon S3 security credentials, and the gpg passphrase and key identifier from the section above. 

{% codeblock lang:bash %}
#!/bin/bash
ulimit -n 1024 # I needed this to increase the maximum number of open files on OS X 10.5

# your Amazon S3 security credentials
export AWS_ACCESS_KEY_ID="XXXXXXXXXXXXXXXXXXXX"
export AWS_SECRET_ACCESS_KEY="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# your gpg passphrase (needed to sign files with duplicity)
export PASSPHRASE="XXXXXXXX"

# your gpg key identifier (8-digit hexadecimal number)
GPG_KEY="XXXXXXXX"

# backup source directory. if you set this to / (root), be sure to exclude /tmp, /proc, /dev, and probably /sys too
SOURCE="/Users/Example"

# destination URL (Amazon S3 bucket)
# Note: bucket need not exist but does need to be unique among all Amazon S3 users.
DEST="s3+http://your_unique_bucket_name"

duplicity \
  --verbosity 4 \ # default verbosity. use 5 to see added/changed files, 0 for silence
  --full-if-older-than 30D \ # option to create a new full backup after X days
  --encrypt-key=${GPG_KEY} \
  --sign-key=${GPG_KEY} \
  --s3-use-new-style \
  --s3-use-rrs \ # reduced redundancy storage option. use for less important backups. provides cheaper rates.
  --exclude=/Users/Example/Junk \ # exclude a path (uses shell globbing)
  --exclude=/Users/Example/Downloads \ # supports multiple exclude switches
  ${SOURCE} ${DEST}

# reset the environment variables
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset PASSPHRASE
{% endcodeblock %}

### Automating Your Duplicity Backup Script With Cron

Edit your crontab:

{% codeblock %}
crontab -e
{% endcodeblock %}

I perform a daily incremental backup early in the morning. My crontab entry looks like:
{% codeblock %}
0 6 * * * bash -l -c 'duplicity-backup'
{% endcodeblock %}

__Note:__ This would run the wrapper script daily at 6:00 AM. I use `bash -l -c <command>` to load up an environment very similar to an interactive shell session, so my PATH is set properly. The -c option tells bash a command follows. The -l option tells bash to load the entire environment. 

[More about cron](http://en.wikipedia.org/wiki/Cron).

### Creating a Duplicity Restore Script

Below is an example restore wrapper script I use. 

{% codeblock lang:bash %}
#!/bin/bash

# requires argument: relative (not absolute) path of files to restore (e.g. Documents)
if [ -z "$1" ]
then
  echo "Need restore source path argument"
  exit
fi

ulimit -n 1024 # I needed this to increase the maximum number of open files on OS X 10.5

# your Amazon S3 security credentials
export AWS_ACCESS_KEY_ID="XXXXXXXXXXXXXXXXXXXX"
export AWS_SECRET_ACCESS_KEY="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# your gpg passphrase (needed to sign files with duplicity)
export PASSPHRASE="XXXXXXXX"

# your gpg key identifier (8-digit hexadecimal number)
GPG_KEY="XXXXXXXX"

# source URL (Amazon S3 bucket holding your Duplicity backup)
SOURCE_URL="s3+http://bucket_name"

# destination directory
DEST_DIR="/Users/example/restore"

mkdir -p $DEST_DIR # create the destination directory if it doesn't exist

duplicity \
  --encrypt-key=${GPG_KEY} \
  --sign-key=${GPG_KEY} \
  --file-to-restore "$1" \
  ${SOURCE_URL} ${DEST_DIR}

# reset the environment variables
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset PASSPHRASE
{% endcodeblock %}

### Conclusion

That should get you started with creating your own secure, incremental, remote backups. Please reply if you've tried the examples above and report your success or failure. Thanks!
