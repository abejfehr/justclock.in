# [JustClockIn](https://www.justclock.in/)

[![JustClockIn Demo Video](https://img.youtube.com/vi/uPW2X6yl7MQ/0.jpg)](https://www.youtube.com/watch?v=uPW2X6yl7MQ)

A comprehensive time clock management solution built at [CUHacking 2017](https://cuhacking2017.devpost.com/) in just under 24 hours.

## Inspiration

Construction companies need to track their employees' work hours and be able to reliably report off of them. Unfortunately, job sites may be in rural areas where there is no reliable network connection. This project is an attempt at solving that problem.

## What it does

Just Clock In is a time clock solution for businesses. Each employee is given a key card which they use to punch in and out for shifts at a special station, and employers can generate reports from the data and import hours into their favourite accounting software.

## How we built it

For the hardware we used an Arduino Uno with a Bluetooth module, RFID module, and a Real Time Clock. The Android app is written natively in Java and communicates with the Arduino over Bluetooth to retrieve data. The data is then forwarded over HTTP to an Express server on AWS hardware. The database is a custom, non-persistent, in-memory JSON database.

## Node Modules

- excel4node
- fluentreports

## Hardware Modules

- Arduino Uno R3
- DeadOn RTC
- HC-06 Bluetooth
- RDM630 RFID

## Templates

- landing page: https://startbootstrap.com/template-overviews/landing-page/
- admin page: https://github.com/puikinsh/gentelella

## Challenges we ran into

- Connecting to our BLE device using an iPhone 5S didn't seem to work
- Sending buffers with PDF reports and Excel spreadsheets from a NodeJS server
- Naked domain records on AWS without Elastic Beanstalk or Route53
- Allowing simultaneous serial communication from 2 modules to an Arduino
- One of our AWS accounts was suspended so we had trouble using the $100 credit
- Real Time Clock was synced with the wrong time from the desktop
- Many, many, off-by-one errors

## Accomplishments that we're proud of

The entire thing.

2 people built this in less than 24 hours, it's a pretty amazing thing and we're proud of all of it!

## What we learned

Abe: I learned that you should test libraries you plan on using before the event, to make sure they really do what you think they'll do. We had to turn around completely from a React Native app on my iOS device to doing native Android development on my partner's device.

Scott: I learned how to use the RTC. This is also one of the biggest hardware projects I've ever done, and I learned a lot along the way.

## What's next for Just Clock In

Hopefully someday a competitive product like this can exist. If an investment were offered, we'd consider making this into a polished product fit for actual sale.

## Built With

- node.js
- jade
- javascript
- css
- html
- android
- android-studio
- arduino
- java

## Try it out

[www.justclock.in](https://www.justclock.in/)
