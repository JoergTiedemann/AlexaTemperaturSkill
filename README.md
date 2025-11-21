# AlexaTemperaturSkill
Alexa Skill zur Temperaturabfrage vom Pumpenemonitor  
Das Ding wird vom AWS Git repo mit fetch geholt und beim Push auf Github und auf das AWS git repo gepushed  
Das AWS Repo liegt hier  
https://git-codecommit.us-east-1.amazonaws.com/v1/repos/1660317e-68f9-497b-960a-d00f1c5e5944


Der Deploymentprozess nach ändern der Lambda Funktionen und anschliessendem Commit und Sync erfolgt automatisch und braucht nicht manuell angestossen werden.
Man sieht das auch in der Developer Console wenn man auf Code geht (unter dem Deploy Button) 
Der Build des Alexa Skills muss manuell durchgeführt werden, aber das muss immer nur dann gemacht werden, wenn an den Phrasen des Interaction Models was geändert wurde. Bei Änderungen im Coder der Lambdafunktion reicht abspeichern und Commit und Sync 
Zugangsdaten zur Firebasedatenbank sind im Lambda hinterlegt und verschlüsselt

Die AWS Developer Console errreicht man unter https://developer.amazon.com/alexa/console/ask


**Hinweis:**  
Wenn eine neue Version gemacht wird, dann muss diese Version in der package.json eingetragen werden, weil die Funktion GetVersion diese ausliest und zur Ausgabe bringt.

**Hinweis:**  
Die Console für die Ausgaben in der Lambda Funktion bekommt man vom Browser der Developer Console im Codeeditor unter `CloudWatch Logs`und dort dann `Ireland` auswählen


**Hinweis:**  
Wenn ein commit und sync auf Branch ES8266FirebaseConnector auf dem master branch durchgeführt wird, dann ist das auch im AWS repo aktuell und sofort scharf
und auch im github repo AlexaTemperaturSkill im Masterbranch ist das dann aktuell und dort kann dann ein Release erstellt werden (aber nur für intere Zwecke weil released ist das Ding schon durch den Commit und Sync)
Es gubt also keinen klassischen Development Branch

**Hinweis**  
Wenn beim Push der Codeeditor im Browser offen ist kommt dort eine Fehlermeldung das mit dem Branch was nicht stimmt. In diesem Fall den Codeeditor schliessen und den Skill erneut im Browser öffen
