@echo off
@echo Welcome to Youtube 2 Wordpress - by Ninjas.cl
FOR /F "tokens=* USEBACKQ" %%F IN (`.\vendor\InputBox.exe "Queries (separated by spaces):" "Youtube Search Queries"`) DO (
SET Queries=%%F
)

.\vendor\node ".\index.js" "%Queries%" 
pause

