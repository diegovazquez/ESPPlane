#include <Servo.h>

Servo servo1;  // create servo object to control a servo
Servo servo2;  // create servo object to control a servo
Servo servo3;  // create servo object to control a servo
Servo servo4;  // create servo object to control a servo

void startServo() { // Start a WebSocket server
    servo1.attach(SERVO1_PIN); // attaches the servo
    servo2.attach(SERVO2_PIN); // attaches the servo
    servo3.attach(SERVO3_PIN); // attaches the servo
    servo4.attach(SERVO4_PIN); // attaches the servo

    servo1.write(0);
    servo2.write(0); 
    servo3.write(0); 
    servo4.write(0); 

    Serial.println("[INFO] Servo Configured");
}
