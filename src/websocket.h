#include <WebSocketsServer.h>
#include <ArduinoJson.h>

StaticJsonDocument<200> msgDecoded;

WebSocketsServer webSocket(81);    // create a websocket server on port 81

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t lenght) { // When a WebSocket message is received
    switch (type) {
        case WStype_DISCONNECTED:             // if the websocket is disconnected
            Serial.printf("[%u] Disconnected!\n", num);
            break;
        case WStype_CONNECTED: {              // if a new websocket connection is established
                IPAddress ip = webSocket.remoteIP(num);
                Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
            }
            break;
        case WStype_TEXT:                     // if new text data is received
            Serial.printf("[%u] get Text: %s\n", num, payload);
            DeserializationError error = deserializeJson(msgDecoded, payload);

            if (error) {
                Serial.print(F("deserializeJson() failed: "));
                Serial.println(error.c_str());
                return;
            }
            //Serial.printf(msgDecoded)
            int servo1val = msgDecoded["servo1"];
            servo1.write(servo1val);


            break;
    }
}

void startWebSocket() {                         
    webSocket.begin();                          // start the websocket server
    webSocket.onEvent(webSocketEvent);          // if there's an incomming websocket message, go to function 'webSocketEvent'
    Serial.println("[INFO] WebSocket started");
}