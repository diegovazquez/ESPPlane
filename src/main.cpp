#include <Arduino.h>

#include <ESP8266WiFi.h>

/* Modules */
#include "configuration.h"
#include "servo.h"
#include "wifi.h"
#include "ota.h"
#include "websocket.h"
#include "webserver.h"

void setup() {
  delay(2000);
  // Serial port
  Serial.begin(115200);
  Serial.println("[INFO] Starting");
  Serial.println("[INFO] Serial set to 115200");

  // For OTA
  WiFi.mode(WIFI_STA);

  // Wifi
  wifiStart();

  // OTA
  startOTA();

  // Servo
  startServo();

  // Websocket
  startWebSocket();

  // WebServer
  startWebServer();
}


void loop() {
  // OTA
  ArduinoOTA.handle();

  // WebSocket
  webSocket.loop(); 

  // WebServer
  server.handleClient();
}

