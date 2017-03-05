#include <stdlib.h> 
#include <time.h>
#include <SPI.h>
#include <SparkFunDS3234RTC.h>
#include "pitches.h"
#include <SoftwareSerial.h>

#define PRINT_USA_DATE

const int RXPin    = 0;
const int TXPin    = 1; 
const int PiezoPin = 3;
const int RFIDPin  = 4; // LOW -> RFID is reading

const int SS_Pin   = 10;

SoftwareSerial btSerial(7, 6); // RX emulator, TX emulator

boolean isReadingRFID = false;
const int msgLength = 10;
int bytesRead = 0;
char bytes[msgLength];

struct Employee {
  unsigned long ID;
  unsigned long unix_time;
};

const int maxPunches = 100;
int punchCursor = 0;
struct Employee punches[maxPunches];

void setup() {
  Serial.begin(9600);
  btSerial.begin(9600);
  
  pinMode(RFIDPin, INPUT);

  rtc.begin(SS_Pin);
//  rtc.autoTime();
  rtc.update();
  printTime();
}

void loop() {
  if (Serial.available()) {
    // RFID Reading
    getRFID();
  } 
  
  if (btSerial.available()) {
    Serial.println("Bluetooth data.");
    // Bluetooth Reading
    getBluetooth();
  } 
}

void getRFID() {    
  char value = 0;

  value = Serial.read();
  if (value == 2) {
    isReadingRFID = true;
  } else if (isReadingRFID && bytesRead < msgLength) {
    bytes[bytesRead++] = value;
  } else if (isReadingRFID && value == 3) {
    isReadingRFID = false;
    if (bytesRead == msgLength) {
      handleRFIDSuccess(strtol(bytes, NULL, 16));
    }
    bytesRead = 0;
  } 
}

void handleRFIDSuccess(unsigned long id) {
  Serial.print("Str Num Parsed: ");
  Serial.print(id);  
    
  Serial.print("\tTime: ");
  Serial.print(getUnixTimestamp());
    
  if (punchCursor < maxPunches) {
    punches[punchCursor].ID = id;
    punches[punchCursor].unix_time = getUnixTimestamp();
    punchCursor += 1;
  }
    
  Serial.println();
    
  const int noteLength = 16;
  tone(PiezoPin, NOTE_F3, 1000 / noteLength);
  delay(1000 / noteLength * 1.30);
  tone(PiezoPin, NOTE_AS4, 1000 / noteLength);
}

unsigned long getUnixTimestamp() {
  rtc.update();
  
  struct tm rtc_timestamp = {0};
  rtc_timestamp.tm_year = (2000 + rtc.year()) - 1900 + 30;
  rtc_timestamp.tm_mon  = rtc.month() - 1;
  rtc_timestamp.tm_mday = rtc.date();
  rtc_timestamp.tm_hour = rtc.hour();
  rtc_timestamp.tm_min  = rtc.minute();
  rtc_timestamp.tm_sec  = rtc.second();
  rtc_timestamp.tm_wday = rtc.day() - 1;
//  Serial.print("\t");
//  Serial.print("Year: "); Serial.print(rtc_timestamp.tm_year);
//  Serial.print(", Month: "); Serial.print(rtc_timestamp.tm_mon); 
//  Serial.print(", Day: "); Serial.print(rtc_timestamp.tm_mday);
//  Serial.print(", Hour: "); Serial.print(rtc_timestamp.tm_hour);
//  Serial.print(", Min: "); Serial.print(rtc_timestamp.tm_min);
//  Serial.print(", Sec: "); Serial.print(rtc_timestamp.tm_sec); Serial.print("\t");
  time_t unix_timestamp = mktime(&rtc_timestamp);

  return unix_timestamp;
}

void getBluetooth() {
  char data = btSerial.read();
  if (data == 'g') {
    const int timeLen = 11, idLen = 9;
    byte sendTime[timeLen];
    byte sendId[idLen];
    for (int i = 0; i < punchCursor; i++) {
      Serial.print("Sending...");
      Serial.print(punches[i].ID);
      Serial.print("...");
      
      btSerial.write(2);
      
      String(punches[i].ID).getBytes(sendId, idLen);
      for (int b = 0; b < idLen-1; b++) {
        btSerial.write(sendId[b]);
        Serial.print(sendId[b]); Serial.print(" ");
      }

      btSerial.write(3);

      Serial.print("\nSending..."); Serial.print(String(punches[i].unix_time)); Serial.print("...");
        
      String(punches[i].unix_time).getBytes(sendTime, timeLen);
      for (int b = 0; b < timeLen-1; b++) {
        btSerial.write(sendTime[b]);  
        Serial.print(sendTime[b]); Serial.print(" ");   
      }
    }

    // Clears punches
    punchCursor = 0;
  } else {
    Serial.print("Unknown data: "); Serial.println((int)data);
  }

  btSerial.write(4);
}

void printTime()
{
  Serial.print(String(rtc.hour()) + ":"); // Print hour
  if (rtc.minute() < 10)
    Serial.print('0'); // Print leading '0' for minute
  Serial.print(String(rtc.minute()) + ":"); // Print minute
  if (rtc.second() < 10)
    Serial.print('0'); // Print leading '0' for second
  Serial.print(String(rtc.second())); // Print second

  if (rtc.is12Hour()) // If we're in 12-hour mode
  {
    // Use rtc.pm() to read the AM/PM state of the hour
    if (rtc.pm()) Serial.print(" PM"); // Returns true if PM
    else Serial.print(" AM");
  }
  
  Serial.print(" | ");

  // Few options for printing the day, pick one:
  Serial.print(rtc.dayStr()); // Print day string
  //Serial.print(rtc.dayC()); // Print day character
  //Serial.print(rtc.day()); // Print day integer (1-7, Sun-Sat)
  Serial.print(" - ");
#ifdef PRINT_USA_DATE
  Serial.print(String(rtc.month()) + "/" +   // Print month
                 String(rtc.date()) + "/");  // Print date
#else
  Serial.print(String(rtc.date()) + "/" +    // (or) print date
                 String(rtc.month()) + "/"); // Print month
#endif
  Serial.println(String(rtc.year()));        // Print year
}
