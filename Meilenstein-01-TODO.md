= Meilenstein 01

Organisatorisches: in den Slides zu Milestone 1



Interface
- OK Status Tabelle
- Ok Sidebar-Menu
- OK Transition zwischen Sections (App States)
- OK GET Integration zum CNC Server ( `/api/Status` )


Status Tabelle
- OK Spalten sind `Workload` , `IP` , `Auftrag (ID)` , `Stop/Start Button`
- TODO Sortierung nach Workload, IP, Auftrag und Aktiv/Inaktiv
- OK Inhalte via `http://botnet.artificial.engineering/api/Status`
- OK Automatische Aktualisierung in einem angemessenen Interval
- TODO Anpassung des Farbschemas und des Cell Paddings -> Am Schluss
- OK Transition der Zeile bei hover
- OK Laden der Daten mit `XMLHttpRequest` Version **2**, NICHT **1**
	-> kein json als responseType
- OK Start / Stop Button als Toggle ohne Funktion

Menü
- OK Fixierte Positionierung (linksbuendig)
- OK Inhalte (main) der App sind rechtsbuendig
- OK Farbanpassungen der Links bei hover und active

