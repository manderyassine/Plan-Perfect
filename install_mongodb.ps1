# Create directories for MongoDB
New-Item -ItemType Directory -Force -Path "C:\data\db"
New-Item -ItemType Directory -Force -Path "C:\data\log"

# Download MongoDB
$url = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.8-signed.msi"
$output = "$env:TEMP\mongodb.msi"
Invoke-WebRequest -Uri $url -OutFile $output

# Install MongoDB
Start-Process msiexec.exe -ArgumentList "/i `"$output`" /quiet" -Wait

# Create MongoDB service
New-Item -ItemType File -Force -Path "C:\data\log\mongod.log"
mongod --install --serviceName "MongoDB" --serviceDisplayName "MongoDB" --logpath "C:\data\log\mongod.log" --dbpath "C:\data\db"

# Start MongoDB service
Start-Service MongoDB
