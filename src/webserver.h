#include <ESP8266WebServer.h>
ESP8266WebServer server(80);       // Create a webserver object that listens for HTTP request on port 80


void handleRoot() {
    server.send(200, "text/plain", "Hola mundo!");
}

void handleNotFound() { // if the requested file or page doesn't exist, return a 404 not found error
    server.send(404, "text/plain", "404: File Not Found");
}

void startWebServer(){ 
    server.onNotFound(handleNotFound);          
    server.begin();                             
    Serial.println("[INFO] WebServer started");
}