#include <ESP8266WiFi.h>    
#include <ESP8266mDNS.h>

char IP[] = "xxx.xxx.xxx.xxx";

void wifiSerialPrintInfo(){
  Serial.println("[INFO] Wifi Connected");
  Serial.print("\tMAC: ");
  Serial.println(WiFi.macAddress());
  Serial.print("\tIP: ");
  Serial.println(WiFi.localIP());

  IPAddress ip = WiFi.localIP();
  ip.toString().toCharArray(IP, 16);

  Serial.print("\tSubnet: ");
  Serial.println(WiFi.subnetMask());
  Serial.print("\tGateway: ");
  Serial.println(WiFi.gatewayIP());
  Serial.print("\tDNS: ");
  Serial.println(WiFi.dnsIP());
  Serial.print("\tChannel: ");
  Serial.println(WiFi.channel());
  Serial.print("\tStatus: ");
  Serial.println(WiFi.status());
}

void wifiStartJoin(){
  int status;
  Serial.println("[INFO] Starting Wifi connection"); 
  // attempt to connect to Wifi network:
  status = WiFi.begin(WIFI_NAME, WIFI_PASS);
  status = WiFi.waitForConnectResult();
  
  if (status != WL_CONNECTED) {
    Serial.println("[INFO] Connection Failed");
    Serial.println("\t Rebooting in 5 seconds...");
    delay(5000);
    ESP.restart();
  }
  wifiSerialPrintInfo();
}

void wifiStartAp(){
  Serial.println("[INFO] Setting AP (Access Point)");
  WiFi.softAP(WIFI_NAME, WIFI_PASS);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("\tAP IP address: ");
  Serial.println(IP);

  MDNS.begin(WIFI_NAME);                        // start the multicast domain name server
  Serial.print("[INFO] mDNS responder started: http://");
  Serial.print(WIFI_NAME);
  Serial.println(".local");
}

void wifiStartOpenAp(){
  Serial.println("[INFO] Setting AP (Access Point)");
  WiFi.softAP(WIFI_NAME);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("\tAP IP address: ");
  Serial.println(IP);

  MDNS.begin(WIFI_NAME);                        // start the multicast domain name server
  Serial.print("[INFO] mDNS responder started: http://");
  Serial.print(WIFI_NAME);
  Serial.println(".local");
}


void wifiStart(){
  // Join a preconfigured wifi
  if ( strcmp(WIFI_MODE, "JOIN") == 0) {
    wifiStartJoin();
  }
  // Set a AP Password protected
  if ( strcmp(WIFI_MODE, "AP") == 0) {
    wifiStartAp();
  }
  // Set AP without a password 
  if ( strcmp(WIFI_MODE, "OPENAP") == 0) {
    wifiStartOpenAp();
  }
}
