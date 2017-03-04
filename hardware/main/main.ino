#include <stdlib.h> 
#include "pitches.h"

const int RXPin    = 0;
const int TXPin    = 1; 
const int RFIDPin  = 2; // LOW -> RFID is reading
const int PiezoPin = 3;

boolean isReadingRFID = false;

void setup() {
  Serial.begin(9600);
  pinMode(RFIDPin, INPUT);
}

void loop() {
  if (digitalRead(RFIDPin) == LOW && !isReadingRFID) {
    // RFID Reading
    isReadingRFID = true;
    getRFID();
  } else if (digitalRead(RFIDPin) == HIGH && !isReadingRFID) {
    // Bluetooth Reading
    getBluetooth();
  } else {
    // Ensures that getRFID() is only called once during a LOW pin cycle
    isReadingRFID = false;
  }
}

void getRFID() {
  const int noteLength = 16;
  tone(PiezoPin, NOTE_F3, 1000 / noteLength);
  delay(1000 / noteLength * 1.30);
  tone(PiezoPin, NOTE_AS4, 1000 / noteLength);
  
  const int bytesToRead = 10; // Ignores checksum bits at the end
  char strNum[bytesToRead];
  char value = 0;

  for (int i = 0; i < bytesToRead;) {
    value = Serial.read();
    // 2 is the start bit of the stream (we do not want this!)
    if (value > -1 && value != 2) {
      strNum[i++] = value;
    }    
  }

  long int long_data = strtol(strNum, NULL, 16);
  Serial.write("Str Num Parsed: ");
  Serial.print(long_data);

  Serial.println();
}

void getBluetooth() {
  if (Serial.available()) {
    char data = Serial.read();
    if (data == '1' || data == '0') {
      Serial.print("Data: ");
      Serial.println(data);
    }
  }
}
