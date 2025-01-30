# Download MongoDB Compass
$url = "https://downloads.mongodb.com/compass/mongodb-compass-1.40.4-win32-x64.exe"
$output = "$env:TEMP\mongodb-compass.exe"
Invoke-WebRequest -Uri $url -OutFile $output

# Install MongoDB Compass
Start-Process -FilePath $output -ArgumentList "/S" -Wait
