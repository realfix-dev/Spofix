@echo off

:: Line for changing spofix parameters, each parameter should be separated by a space
set param=-premium -new_theme

set url='https://raw.githubusercontent.com/realfix-dev/spofix/refs/heads/main/run.ps1'
set url2='https://realfix-dev.github.io/run.ps1'
set tls=[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12;

%SYSTEMROOT%\System32\WindowsPowerShell\v1.0\powershell.exe ^
-Command %tls% $p='%param%'; """ & { $(try { iwr -useb %url% } catch { $p+= ' -m'; iwr -useb %url2% })} $p """" | iex

pause
exit /b