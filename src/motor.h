#include <Wire.h>
#include "WEMOS_Motor.h"

int pwm;
Motor M1(0x30,_MOTOR_A, 1000);//Motor A
Motor M2(0x30,_MOTOR_B, 1000);//Motor B


void startMotor() {
    Serial.println("[INFO] Starting motor shield configuration");

    M1.setmotor(_STOP);
    M2.setmotor(_STOP);
}