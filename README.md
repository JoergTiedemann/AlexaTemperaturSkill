# AlexaTemperaturSkill
Alexa Skill zur Temperaturabfrage vom Pumpenemonitor  
Das Ding wird vom AWS Git repo mit fetch geholt und beim Push auf Github und auf das AWS git repo gepushed  
Das AWS Repo liegt hier  
https://git-codecommit.us-east-1.amazonaws.com/v1/repos/1660317e-68f9-497b-960a-d00f1c5e5944

Der Deploymentprozess nach ändern der Lambda Funktionen erfolgt automatisch  
Der Build des Alexa Skills muss manuell durchgeführt werden
Zugangsdaten sind im Lambda hinterlegt und verschlüsselt

**Hinweis:**  
Die Console für die Ausgaben in der Lambda Funktion bekommt man om Browder der Developer Console im Codeeditor unter `CloudWatch Logs`und dort dann `Ireland` auswählen

**Hinweis**  
Wenn beim Push der Codeeditor im Browser offen ist kommt dort eine Fehlermeldung das mit dem Branch was nicht stimmt. In diesem Fall den Codeeditor schliessen und den Skill erneut im Browser öffen
