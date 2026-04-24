import subprocess
import os

# Rutas y datos
pg_restore_path = r"C:\Program Files\PostgreSQL\18\bin\pg_restore.exe"  # Ajusta según tu instalación
backup_file = r"C:\Users\jason\Downloads\Games_20251002.backup"  # Ajusta según tu usuario
database_name = "Games"
username = "postgres"
password = "Oo1005185673"

# Establecer la contraseña como variable de entorno (PGPASSWORD)
os.environ["PGPASSWORD"] = password

# Comando de restauración
command = [
    pg_restore_path,
    "-U", username,
    "-d", database_name,
    "-v",  # verbose
    backup_file
]

# Ejecutar el comando
try:
    subprocess.run(command, check=True)
    print("Restauración completada con éxito.")
except subprocess.CalledProcessError as e:
    print("Error en la restauración:", e)
