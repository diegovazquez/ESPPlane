#include <Wire.h>
#include <LOLIN_I2C_MOTOR.h>

LOLIN_I2C_MOTOR motor;

void startMotor() {
    motor.changeFreq(MOTOR_CH_BOTH, 1000);    

    motor.changeStatus(MOTOR_CH_A, MOTOR_STATUS_CW);
    motor.changeStatus(MOTOR_CH_B, MOTOR_STATUS_CW);

    Serial.println("[INFO] Motor Configured");
}