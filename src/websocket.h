#include <WebSocketsServer.h>
#include <ArduinoJson.h>



StaticJsonDocument<200> msgDecoded;

WebSocketsServer webSocket(81);    // create a websocket server on port 81

const int RSSI_MAX = -50;   // define maximum strength of signal in dBm
const int RSSI_MIN = -85;  // define minimum strength of signal in dBm

// TO-DO Support multiple clients
int clientNum = 0;
int loopEnabled = 0;

long telemetryInterval = 500;
long telemetryPreviousMillis = 0;

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t lenght) { // When a WebSocket message is received
    switch (type) {
        case WStype_DISCONNECTED:             // if the websocket is disconnected
            Serial.printf("[%u] Disconnected!\n", num);
            clientNum = num;
            loopEnabled = 0;
            break;
        case WStype_CONNECTED: {              // if a new websocket connection is established
                IPAddress ip = webSocket.remoteIP(num);
                clientNum = num;
                loopEnabled = 1;
                Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
            }
            break;
        case WStype_TEXT:                     // if new text data is received
            //Serial.printf("[%u] get Text: %s\n", num, payload);
            DeserializationError error = deserializeJson(msgDecoded, payload);

            if (error) {
                Serial.print(F("deserializeJson() failed: "));
                Serial.println(error.c_str());
                //return;
                break;
            }

            // ------------------------------------------------------
            // Servos 

            if (msgDecoded.containsKey("servo1")) {
                int servo1val = msgDecoded["servo1"];
                int servo1maxValue = msgDecoded["servo1maxValue"];
                servo1val = (servo1val * servo1maxValue) / 100;
                servo1.write(servo1val);
            };

            if (msgDecoded.containsKey("servo2")) {
                int servo2val = msgDecoded["servo2"];
                int servo2maxValue = msgDecoded["servo2maxValue"];

                servo2val = (servo2val * servo2maxValue) / 100;
                servo2.write(servo2val);
            };

            if (msgDecoded.containsKey("servo1")) {
                int servo3val = msgDecoded["servo3"];
                int servo3maxValue = msgDecoded["servo3maxValue"];

                servo3val = (servo3val * servo3maxValue) / 100;
                servo3.write(servo3val);
            };

            if (msgDecoded.containsKey("servo4")) {
                int servo4val = msgDecoded["servo4"];
                int servo4maxValue = msgDecoded["servo4maxValue"];

                servo4val = (servo4val * servo4maxValue) / 100;
                servo4.write(servo4val);
            };

            if (msgDecoded.containsKey("motor1")) {
                int motor1 = msgDecoded["motor1"];
                String motor1orientation = msgDecoded["motor1orientation"];
                if ( motor1orientation = "Clockwise" ) { M1.setmotor(_CW, motor1); };
                if ( motor1orientation = "CounterClockwise" ) { M1.setmotor(_CCW, motor1); };
            };

            if (msgDecoded.containsKey("motor2")) {
                int motor2 = msgDecoded["motor2"];
                String motor2orientation = msgDecoded["motor2orientation"];
                if ( motor2orientation = "Clockwise" ) { M2.setmotor(_CW, motor2); };
                if ( motor2orientation = "CounterClockwise" ) { M2.setmotor(_CCW, motor2); };
            };
            
            // ------------------------------------------------------
            if (msgDecoded.containsKey("serial")) {
                String serial = msgDecoded["serial"];
                String response = "{\"serial\":" + serial + "}";
                webSocket.sendTXT(num, response);
            }
            Serial.printf("[%u] get Text: %s\n", num, payload);
            break;
    }
}


int dBmtoPercentage(int dBm) {
    int quality;
    if (dBm <= RSSI_MIN) {
        quality = 0;
    } else if(dBm >= RSSI_MAX) {  
        quality = 100;
    } else {
        quality = 2 * (dBm + 100);
    }
    return quality;
}

void sendTelemetry() {
    if (loopEnabled == 1){        
        // WIFI Signal 
        int wifiSignalPercentual = 0;
        int wifiSignalDb = 100;
        if ( strcmp(WIFI_MODE, "JOIN") == 0) {
            wifiSignalDb = WiFi.RSSI();
        }
        if ( strcmp(WIFI_MODE, "AP") == 0) {
            wifiSignalDb = WiFi.RSSI(clientNum);
        }
        if ( strcmp(WIFI_MODE, "OPENAP") == 0) {
            wifiSignalDb = WiFi.RSSI(clientNum);
        }
        wifiSignalPercentual = dBmtoPercentage(wifiSignalDb);
        
        // TODO - Moked
        String voltage = "3.4";
        
        // Response
        String response = "{ \"wifiSignalPercentual\":" + String(wifiSignalPercentual) + "," +
                          "  \"wifiSignalDbm\":" +  String(wifiSignalDb) + "," +
                          "  \"voltage\":" + voltage + "}";
        webSocket.sendTXT(clientNum, response);
    }
}

void startWebSocket() {                         
    webSocket.begin();                          // start the websocket server
    webSocket.onEvent(webSocketEvent);          // if there's an incomming websocket message, go to function 'webSocketEvent'
    Serial.println("[INFO] WebSocket started");
}

void loopWebSocket() {              
    // WebSocket
    webSocket.loop(); 

    // Telemetry
    unsigned long currentMillis = millis();
    if(currentMillis - telemetryPreviousMillis > telemetryInterval) {
        telemetryPreviousMillis = currentMillis;
        sendTelemetry();
    }
}           
